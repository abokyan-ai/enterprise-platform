/**
 * @file primitive-value.ts
 * @module @ecosystem/semantic-kernel/primitives
 *
 * SK-09 §C–T: Primitive Value Representations, Validation, Equality,
 * Serialization, and Deserialization.
 *
 * Canonical Value Representations
 * ────────────────────────────────
 * STRING   → JavaScript string (any length ≤ STRING_MAX_LENGTH)
 * BOOLEAN  → JavaScript boolean literal (true | false)
 * INTEGER  → Canonical decimal integer string (grammar below)
 * DECIMAL  → Canonical decimal string (grammar below)
 * DATE     → ISO 8601 calendar date "YYYY-MM-DD" with calendar validation
 * TIME     → "HH:mm:ss" with optional ".sss" milliseconds
 * DATETIME → RFC 3339 / ISO 8601 offset date-time "YYYY-MM-DDTHH:mm:ss[.sss]Z"
 *            (UTC offset required; local date-time without offset is not DATETIME)
 *
 * Platform Invariants (SK-09)
 * ───────────────────────────
 * - Missing ≠ Null ≠ Value.  null is never a valid PrimitiveValue.
 * - No implicit coercion.    "true" is not BOOLEAN; "1" is not INTEGER automatically.
 * - No business constraints. maxLength, regex, minimum, etc. belong to SK-10 Facets.
 * - No composite types.      ARRAY, MAP, RECORD, UNION are out of scope.
 * - Framework-independent.   No NestJS, Angular, Node.js-only, or DOM APIs.
 * - Deterministic.           No current-time, locale, or timezone dependence.
 *
 * Numeric Design (INTEGER)
 * ────────────────────────
 * INTEGER values are stored as canonical decimal strings to avoid JavaScript
 * Number precision limits.  The grammar is:
 *   integer := "0" | "-"? [1-9][0-9]*
 * Limits: up to INTEGER_MAX_DIGITS (38) total digits (including the sign digit
 * position but not the "-" character), matching a practical enterprise integer range.
 * Leading zeros (other than the bare "0"), "+" prefix, decimal points,
 * exponent notation, and surrounding whitespace are all rejected.
 *
 * Numeric Design (DECIMAL)
 * ────────────────────────
 * DECIMAL values are stored as canonical decimal strings preserving scale.
 * Grammar:  decimal := integer ("." digit+)?
 *           where integer follows the INTEGER grammar (without standalone "-0").
 * Trailing zeros after the decimal point are preserved (scale-aware storage).
 * Equality checks value; for scale-aware equality use equalsPrimitiveValueExact.
 * NaN, Infinity, locale commas, and exponent notation are rejected.
 *
 * Temporal Design
 * ───────────────
 * DATE:     Calendar-validated ISO date "YYYY-MM-DD".  Leap-year rule applied.
 *           No timezone — a semantic DATE has no inherent UTC offset.
 * TIME:     "HH:mm:ss" or "HH:mm:ss.sss" (millisecond precision).
 *           Ranges: 00–23 hours, 00–59 minutes, 00–59 seconds, 000–999 ms.
 * DATETIME: RFC 3339 "YYYY-MM-DDTHH:mm:ss[.sss]Z" (UTC literal) or
 *           "YYYY-MM-DDTHH:mm:ss[.sss]+HH:MM" / "-HH:MM" (explicit offset).
 *           The host timezone is never consulted.
 *
 * Pure TypeScript: zero external dependencies, browser- and Node.js-safe.
 */

import { SemanticKernelError } from '../semantic-id.js';
import {
  type PrimitiveType,
  PrimitiveTypes,
  parsePrimitiveType,
  PrimitiveTypeValidationError,
} from './primitive-type.js';

// ─── Resource bounds ──────────────────────────────────────────────────────────

/** Maximum character length for a STRING primitive value. */
export const STRING_MAX_LENGTH = 65_536;

/** Maximum number of significant decimal digits for an INTEGER string. */
export const INTEGER_MAX_DIGITS = 38;

/**
 * Maximum number of digits before and after the decimal point for DECIMAL.
 * Total digits must not exceed DECIMAL_MAX_TOTAL_DIGITS.
 */
export const DECIMAL_MAX_TOTAL_DIGITS = 38;
export const DECIMAL_MAX_FRACTION_DIGITS = 18;

// ─── Error codes ──────────────────────────────────────────────────────────────

export const PRIMITIVE_VALUE_ERROR_CODES = Object.freeze({
  INVALID_TYPE: 'PRIMITIVE_VALUE_INVALID_TYPE',
  INVALID_SHAPE: 'PRIMITIVE_VALUE_INVALID_SHAPE',
  INVALID_FORMAT: 'PRIMITIVE_VALUE_INVALID_FORMAT',
  OUT_OF_RANGE: 'PRIMITIVE_VALUE_OUT_OF_RANGE',
  PRECISION_UNSUPPORTED: 'PRIMITIVE_VALUE_PRECISION_UNSUPPORTED',
  INVALID_DATE: 'PRIMITIVE_VALUE_INVALID_DATE',
  INVALID_TIME: 'PRIMITIVE_VALUE_INVALID_TIME',
  INVALID_DATETIME: 'PRIMITIVE_VALUE_INVALID_DATETIME',
  NULL_REJECTED: 'PRIMITIVE_VALUE_NULL_REJECTED',
  UNKNOWN_TYPE: 'PRIMITIVE_VALUE_UNKNOWN_TYPE',
  MISSING_FIELD: 'PRIMITIVE_VALUE_MISSING_FIELD',
  EXTRA_FIELD: 'PRIMITIVE_VALUE_EXTRA_FIELD',
} as const);

export type PrimitiveValueErrorCode =
  (typeof PRIMITIVE_VALUE_ERROR_CODES)[keyof typeof PRIMITIVE_VALUE_ERROR_CODES];

/** Structured validation error for SK-09 primitive value failures. */
export class PrimitiveValueValidationError extends SemanticKernelError {
  public override readonly code: PrimitiveValueErrorCode;

  public constructor(code: PrimitiveValueErrorCode, message: string) {
    super(message, code);
    this.name = 'PrimitiveValueValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── PrimitiveValue discriminated union ───────────────────────────────────────

/**
 * A validated, immutable discriminated-union representation of a primitive
 * semantic value. The `type` field carries the canonical PrimitiveType code.
 *
 * Each variant's `value` uses the canonical representation chosen for
 * precision and portability:
 * - STRING/DATE/TIME/DATETIME: JavaScript string (content validated).
 * - INTEGER/DECIMAL: canonical decimal string (precision-safe).
 * - BOOLEAN: JavaScript boolean.
 *
 * Note: PrimitiveValue objects are frozen at construction.
 * Do not mutate via type assertions.
 */
export type PrimitiveValue =
  | { readonly type: 'STRING'; readonly value: string }
  | { readonly type: 'BOOLEAN'; readonly value: boolean }
  | { readonly type: 'INTEGER'; readonly value: string }
  | { readonly type: 'DECIMAL'; readonly value: string }
  | { readonly type: 'DATE'; readonly value: string }
  | { readonly type: 'TIME'; readonly value: string }
  | { readonly type: 'DATETIME'; readonly value: string };

/** Canonical wire representation for a PrimitiveValue. */
export type PrimitiveValueJSON =
  | { readonly type: 'STRING'; readonly value: string }
  | { readonly type: 'BOOLEAN'; readonly value: boolean }
  | { readonly type: 'INTEGER'; readonly value: string }
  | { readonly type: 'DECIMAL'; readonly value: string }
  | { readonly type: 'DATE'; readonly value: string }
  | { readonly type: 'TIME'; readonly value: string }
  | { readonly type: 'DATETIME'; readonly value: string };

// ─── Validation result ────────────────────────────────────────────────────────

/** Narrow validation result used by shape-only validators. */
export type PrimitiveValidationResult =
  | { readonly valid: true }
  | {
      readonly valid: false;
      readonly code: PrimitiveValueErrorCode;
      readonly message: string;
    };

// ─── Grammars (static, bounded, catastrophe-free) ────────────────────────────

// INTEGER: "0" or optional "-" followed by [1-9][0-9]* (no leading zeros)
// Anchored at both ends; no whitespace allowed; total digit count bounded separately.
const INTEGER_PATTERN = /^-?(?:0|[1-9][0-9]*)$/;

// DECIMAL: INTEGER grammar optionally followed by "." and one-or-more digits.
const DECIMAL_PATTERN = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/;

// DATE: YYYY-MM-DD (4-2-2)
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// TIME: HH:mm:ss or HH:mm:ss.sss (3-digit milliseconds)
const TIME_PATTERN = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?$/;

// DATETIME: YYYY-MM-DDTHH:mm:ss[.sss]Z or +HH:MM / -HH:MM
const DATETIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[+-]\d{2}:\d{2})$/;

// ─── Calendar helpers (portable, no Date object for validation) ───────────────

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  const table = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return table[month] ?? 0;
}

/** Validates a calendar date without using the host Date object. */
function validateCalendarDate(
  year: number,
  month: number,
  day: number,
): PrimitiveValidationResult {
  if (month < 1 || month > 12) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATE,
      message: `Month ${month} is out of range (1–12).`,
    };
  }
  const maxDay = daysInMonth(year, month);
  if (day < 1 || day > maxDay) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATE,
      message: `Day ${day} is out of range for ${year}-${String(month).padStart(2, '0')} (1–${maxDay}).`,
    };
  }
  return { valid: true };
}

// ─── Per-type shape validators ────────────────────────────────────────────────

function validateString(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message: 'STRING value must be a string primitive.',
    };
  }
  if (value.length > STRING_MAX_LENGTH) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.OUT_OF_RANGE,
      message: `STRING value must not exceed ${STRING_MAX_LENGTH} characters.`,
    };
  }
  return { valid: true };
}

function validateBoolean(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'boolean') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message:
        'BOOLEAN value must be a boolean primitive (true or false). String "true"/"false" and numeric 0/1 are not accepted.',
    };
  }
  return { valid: true };
}

function validateInteger(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message:
        'INTEGER value must be a canonical decimal string (e.g. "0", "-42", "9007199254740993").',
    };
  }
  if (!INTEGER_PATTERN.test(value)) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_FORMAT,
      message:
        'INTEGER string must match: "0" or optional "-" followed by [1-9][0-9]*. Leading zeros, "+" prefix, decimals, and exponents are rejected.',
    };
  }
  // Digit count (excluding sign character).
  const digitStr = value.startsWith('-') ? value.slice(1) : value;
  if (digitStr.length > INTEGER_MAX_DIGITS) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.OUT_OF_RANGE,
      message: `INTEGER must not exceed ${INTEGER_MAX_DIGITS} significant digits.`,
    };
  }
  return { valid: true };
}

function validateDecimal(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message:
        'DECIMAL value must be a canonical decimal string (e.g. "0", "1.25", "-42.500").',
    };
  }
  if (!DECIMAL_PATTERN.test(value)) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_FORMAT,
      message:
        'DECIMAL string must match: optional "-", integer part (no leading zeros except "0"), optional "." followed by digits. NaN, Infinity, commas, and exponents are rejected.',
    };
  }
  const abs = value.startsWith('-') ? value.slice(1) : value;
  const dotPos = abs.indexOf('.');
  const integerPart = dotPos === -1 ? abs : abs.slice(0, dotPos);
  const fractionPart = dotPos === -1 ? '' : abs.slice(dotPos + 1);
  const totalDigits = integerPart.length + fractionPart.length;
  if (totalDigits > DECIMAL_MAX_TOTAL_DIGITS) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.PRECISION_UNSUPPORTED,
      message: `DECIMAL total digit count must not exceed ${DECIMAL_MAX_TOTAL_DIGITS}.`,
    };
  }
  if (fractionPart.length > DECIMAL_MAX_FRACTION_DIGITS) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.PRECISION_UNSUPPORTED,
      message: `DECIMAL fractional digits must not exceed ${DECIMAL_MAX_FRACTION_DIGITS}.`,
    };
  }
  return { valid: true };
}

function validateDate(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message: 'DATE value must be a string in "YYYY-MM-DD" format.',
    };
  }
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_FORMAT,
      message:
        'DATE string must be in ISO 8601 "YYYY-MM-DD" format (e.g. "2026-10-12").',
    };
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  return validateCalendarDate(year, month, day);
}

function validateTime(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message:
        'TIME value must be a string in "HH:mm:ss" or "HH:mm:ss.sss" format.',
    };
  }
  const match = TIME_PATTERN.exec(value);
  if (!match) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_FORMAT,
      message:
        'TIME string must be "HH:mm:ss" or "HH:mm:ss.sss" (24-hour, 3-digit milliseconds).',
    };
  }
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const second = parseInt(match[3], 10);
  if (hour > 23) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TIME,
      message: `TIME hour ${hour} is out of range (00–23).`,
    };
  }
  if (minute > 59) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TIME,
      message: `TIME minute ${minute} is out of range (00–59).`,
    };
  }
  if (second > 59) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TIME,
      message: `TIME second ${second} is out of range (00–59).`,
    };
  }
  return { valid: true };
}

function validateDatetime(value: unknown): PrimitiveValidationResult {
  if (typeof value !== 'string') {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_TYPE,
      message:
        'DATETIME value must be a string in RFC 3339 / ISO 8601 offset format.',
    };
  }
  const match = DATETIME_PATTERN.exec(value);
  if (!match) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_FORMAT,
      message:
        'DATETIME must be "YYYY-MM-DDTHH:mm:ss[.sss]Z" or "YYYY-MM-DDTHH:mm:ss[.sss]+HH:MM". Local date-time without offset is not accepted.',
    };
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const calResult = validateCalendarDate(year, month, day);
  if (!calResult.valid) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATETIME,
      message: `DATETIME date component is invalid: ${calResult.message}`,
    };
  }
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = parseInt(match[6], 10);
  if (hour > 23) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATETIME,
      message: `DATETIME hour ${hour} is out of range (00–23).`,
    };
  }
  if (minute > 59) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATETIME,
      message: `DATETIME minute ${minute} is out of range (00–59).`,
    };
  }
  if (second > 59) {
    return {
      valid: false,
      code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATETIME,
      message: `DATETIME second ${second} is out of range (00–59).`,
    };
  }
  // Validate explicit offset if not "Z"
  const offsetStr = match[8];
  if (offsetStr !== 'Z') {
    const offsetHour = parseInt(offsetStr.slice(1, 3), 10);
    const offsetMin = parseInt(offsetStr.slice(4, 6), 10);
    if (offsetHour > 23 || offsetMin > 59) {
      return {
        valid: false,
        code: PRIMITIVE_VALUE_ERROR_CODES.INVALID_DATETIME,
        message: `DATETIME offset "${offsetStr}" is out of range (±00:00 to ±23:59).`,
      };
    }
  }
  return { valid: true };
}

// ─── Shape validation dispatcher ──────────────────────────────────────────────

/**
 * Validates whether `value` is a well-formed canonical representation for
 * `type`. This is a *shape* check only; no business constraints are applied.
 *
 * - Does not access model fields, registries, or I/O.
 * - Does not coerce `value` into a different representation.
 * - Does not use the host timezone, locale, or current time.
 */
export function validatePrimitiveValue(
  type: PrimitiveType,
  value: unknown,
): PrimitiveValidationResult {
  switch (type) {
    case PrimitiveTypes.STRING:
      return validateString(value);
    case PrimitiveTypes.BOOLEAN:
      return validateBoolean(value);
    case PrimitiveTypes.INTEGER:
      return validateInteger(value);
    case PrimitiveTypes.DECIMAL:
      return validateDecimal(value);
    case PrimitiveTypes.DATE:
      return validateDate(value);
    case PrimitiveTypes.TIME:
      return validateTime(value);
    case PrimitiveTypes.DATETIME:
      return validateDatetime(value);
    default: {
      // Exhaustiveness guard — TypeScript will flag this if a case is missing.
      const exhaustive: never = type;
      return {
        valid: false,
        code: PRIMITIVE_VALUE_ERROR_CODES.UNKNOWN_TYPE,
        message: `No validator registered for primitive type "${String(exhaustive)}".`,
      };
    }
  }
}

// ─── Construction ─────────────────────────────────────────────────────────────

/**
 * Creates a validated, frozen PrimitiveValue.
 *
 * @param type  — A canonical PrimitiveType code (string, validated at runtime).
 * @param value — The raw candidate value in the canonical representation for
 *                that type.
 *
 * @throws PrimitiveTypeValidationError  — if `type` is not a recognized code.
 * @throws PrimitiveValueValidationError — if `value` fails shape validation.
 */
export function createPrimitiveValue(
  type: PrimitiveType,
  value: unknown,
): PrimitiveValue {
  // Validate the type code first (re-uses parsePrimitiveType conventions).
  // This accepts an already-resolved PrimitiveType but re-checks at runtime
  // to catch TypeScript bypass via `as unknown`.
  try {
    parsePrimitiveType(type);
  } catch (err) {
    if (err instanceof PrimitiveTypeValidationError) {
      throw new PrimitiveValueValidationError(
        PRIMITIVE_VALUE_ERROR_CODES.UNKNOWN_TYPE,
        `createPrimitiveValue: invalid primitive type "${String(type)}".`,
      );
    }
    throw err;
  }

  const result = validatePrimitiveValue(type, value);
  if (!result.valid) {
    throw new PrimitiveValueValidationError(result.code, result.message);
  }

  // Construct and freeze. The discriminated-union structure guarantees that
  // TypeScript narrows correctly in consuming code.
  return Object.freeze({ type, value }) as PrimitiveValue;
}

// ─── Equality ─────────────────────────────────────────────────────────────────

/**
 * Structural equality for PrimitiveValue pairs.
 *
 * Two primitive values are equal when:
 * 1. Their `type` codes are identical.
 * 2. Their canonical `value` representations are identical.
 *
 * This means:
 * - `DECIMAL("1.0") ≠ DECIMAL("1.00")` — scale is preserved (see ADR-017).
 * - `INTEGER("10") ≠ DECIMAL("10.0")` — cross-type equality is never implicit.
 * - `STRING("true") ≠ BOOLEAN(true)`.
 * - `DATE("2026-10-12") ≠ STRING("2026-10-12")`.
 *
 * If scale-normalized DECIMAL equality is needed in future, a separate
 * `equalsPrimitiveValueNumeric` function should be added.
 */
export function equalsPrimitiveValue(
  a: PrimitiveValue,
  b: PrimitiveValue,
): boolean {
  if (a.type !== b.type) return false;
  // For all variants the canonical value is a string or boolean —
  // strict equality is correct for both.
  return (a.value as string | boolean) === (b.value as string | boolean);
}

// ─── Serialization ────────────────────────────────────────────────────────────

/**
 * Produces a canonical JSON-safe object for a PrimitiveValue.
 *
 * The `type` discriminant is always present.
 * The `value` is already a primitive (string or boolean), so no further
 * transformation is required.
 * No private state or class metadata is emitted.
 */
export function serializePrimitiveValue(ref: PrimitiveValue): PrimitiveValueJSON {
  // All variants have the same shape at runtime; destructuring is safe.
  return Object.freeze({ type: ref.type, value: ref.value }) as PrimitiveValueJSON;
}

// ─── Deserialization ──────────────────────────────────────────────────────────

/**
 * Parses and validates an untrusted external value into a trusted PrimitiveValue.
 *
 * Rules:
 * 1. Input must be a plain object (not null, not an array, not a class instance).
 * 2. `type` must be a recognized PrimitiveType code string.
 * 3. `value` must pass shape validation for that type.
 * 4. `null` for `value` is explicitly rejected (missing ≠ null ≠ value).
 * 5. Unknown extra fields are rejected.
 * 6. The returned value is frozen and structurally valid.
 *
 * @throws PrimitiveValueValidationError for any structural or semantic violation.
 */
export function parsePrimitiveValue(input: unknown): PrimitiveValue {
  // 1. Top-level shape check
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.INVALID_SHAPE,
      'PrimitiveValue input must be a plain object record.',
    );
  }

  const proto: unknown = Object.getPrototypeOf(input);
  if (proto !== Object.prototype && proto !== null) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.INVALID_SHAPE,
      'PrimitiveValue input must be a plain object, not a class instance.',
    );
  }

  const raw = input as Record<string, unknown>;
  const ownKeys = Object.keys(raw);

  // 5. Reject unknown fields
  for (const key of ownKeys) {
    if (key !== 'type' && key !== 'value') {
      throw new PrimitiveValueValidationError(
        PRIMITIVE_VALUE_ERROR_CODES.EXTRA_FIELD,
        `PrimitiveValue: unexpected field '${key}'. Only 'type' and 'value' are permitted.`,
      );
    }
  }

  // 2. Require 'type'
  if (!ownKeys.includes('type')) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.MISSING_FIELD,
      "PrimitiveValue: 'type' field is required.",
    );
  }
  // Require 'value'
  if (!ownKeys.includes('value')) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.MISSING_FIELD,
      "PrimitiveValue: 'value' field is required.",
    );
  }

  // 4. Null value rejection
  if (raw['value'] === null) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.NULL_REJECTED,
      'PrimitiveValue: value must be a valid canonical representation; null is not permitted (Missing ≠ Null ≠ Value).',
    );
  }

  // Validate the type code
  let type: PrimitiveType;
  try {
    type = parsePrimitiveType(raw['type']);
  } catch (err) {
    if (err instanceof PrimitiveTypeValidationError) {
      throw new PrimitiveValueValidationError(
        PRIMITIVE_VALUE_ERROR_CODES.UNKNOWN_TYPE,
        `PrimitiveValue: unrecognized or invalid primitive type code.`,
      );
    }
    throw err;
  }

  // 3. Shape validation
  return createPrimitiveValue(type, raw['value']);
}

// ─── Type narrowing helpers ────────────────────────────────────────────────────

/** Narrows a PrimitiveValue to the STRING variant. */
export function isStringValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'STRING' }> {
  return v.type === PrimitiveTypes.STRING;
}

/** Narrows a PrimitiveValue to the BOOLEAN variant. */
export function isBooleanValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'BOOLEAN' }> {
  return v.type === PrimitiveTypes.BOOLEAN;
}

/** Narrows a PrimitiveValue to the INTEGER variant. */
export function isIntegerValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'INTEGER' }> {
  return v.type === PrimitiveTypes.INTEGER;
}

/** Narrows a PrimitiveValue to the DECIMAL variant. */
export function isDecimalValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'DECIMAL' }> {
  return v.type === PrimitiveTypes.DECIMAL;
}

/** Narrows a PrimitiveValue to the DATE variant. */
export function isDateValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'DATE' }> {
  return v.type === PrimitiveTypes.DATE;
}

/** Narrows a PrimitiveValue to the TIME variant. */
export function isTimeValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'TIME' }> {
  return v.type === PrimitiveTypes.TIME;
}

/** Narrows a PrimitiveValue to the DATETIME variant. */
export function isDatetimeValue(
  v: PrimitiveValue,
): v is Extract<PrimitiveValue, { type: 'DATETIME' }> {
  return v.type === PrimitiveTypes.DATETIME;
}

/**
 * Safe integer construction helper.
 *
 * Accepts a JavaScript `number` value that satisfies `Number.isSafeInteger()`,
 * converts it to a canonical integer string, and returns a validated INTEGER
 * PrimitiveValue. Rejects unsafe floating-point or out-of-range numbers.
 *
 * For integers beyond Number.MAX_SAFE_INTEGER, pass the canonical decimal
 * string directly to `createPrimitiveValue(PrimitiveTypes.INTEGER, '...')`.
 */
export function createIntegerValueFromSafeNumber(n: number): PrimitiveValue {
  if (!Number.isSafeInteger(n)) {
    throw new PrimitiveValueValidationError(
      PRIMITIVE_VALUE_ERROR_CODES.OUT_OF_RANGE,
      `createIntegerValueFromSafeNumber: ${n} is not a safe integer. Use a canonical string for large values.`,
    );
  }
  return createPrimitiveValue(PrimitiveTypes.INTEGER, String(n));
}
