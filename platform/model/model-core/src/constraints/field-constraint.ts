/**
 * @file field-constraint.ts
 * @module @ecosystem/model-core/constraints
 *
 * TYPE-04: Strongly Typed Field Constraints.
 *
 * Establishes the foundational declarative field-constraint model within Model Core.
 *
 * Architectural Invariants:
 * 1. Declarative Restriction: A FieldConstraint describes a condition that a value
 *    must satisfy. It does NOT evaluate values at runtime (no `evaluate(value)`).
 * 2. Distinct Concepts:
 *    - FieldConstraint ≠ FieldDefinition (describes restriction, not field metadata).
 *    - FieldConstraint ≠ PrimitiveType (restricts domain, does not define value category).
 *    - FieldConstraint ≠ PrimitiveValue (declares constraint bounds, not concrete data).
 *    - FieldConstraint ≠ Database Constraint (no SQL CHECK, UNIQUE, or foreign keys).
 *    - FieldConstraint ≠ Angular Validator (no UI controls or reactive forms).
 * 3. Exact Numeric Semantics:
 *    - Numeric bounds are stored as canonical decimal strings conforming to SK-09.
 *    - Zero unsafe JS Number conversions; zero floating-point rounding.
 * 4. Explicit String Metric:
 *    - String bounds measured in Unicode code points (safe across surrogate pairs).
 * 5. Strict Immutability:
 *    - Discriminated union with readonly properties, frozen at construction (`Object.freeze`).
 * 6. Clean Architecture: Layer:model depends only on Layer:kernel. Zero external dependencies.
 */

import {
  type PrimitiveType,
  PrimitiveTypes,
  STRING_MAX_LENGTH,
  DECIMAL_MAX_TOTAL_DIGITS,
  DECIMAL_MAX_FRACTION_DIGITS,
  validatePrimitiveValue,
  SemanticKernelError,
} from '@ecosystem/semantic-kernel';

import {
  FieldConstraintKinds,
  type FieldConstraintKind,
  isFieldConstraintKind,
} from './field-constraint-kind.js';

// ─── Error Codes and ValidationError ──────────────────────────────────────────

/**
 * Structured validation error codes for FieldConstraint failures.
 */
export const FIELD_CONSTRAINT_ERROR_CODES = {
  NON_OBJECT: 'FIELD_CONSTRAINT_NON_OBJECT',
  MISSING_KIND: 'FIELD_CONSTRAINT_MISSING_KIND',
  INVALID_KIND: 'FIELD_CONSTRAINT_INVALID_KIND',
  MISSING_PARAMETER: 'FIELD_CONSTRAINT_MISSING_PARAMETER',
  INVALID_PARAMETER: 'FIELD_CONSTRAINT_INVALID_PARAMETER',
  OUT_OF_RANGE: 'FIELD_CONSTRAINT_OUT_OF_RANGE',
  UNSUPPORTED_FIELD_TYPE: 'FIELD_CONSTRAINT_UNSUPPORTED_FIELD_TYPE',
  DUPLICATE_KIND: 'FIELD_CONSTRAINT_DUPLICATE_KIND',
  CONTRADICTORY_BOUNDS: 'FIELD_CONSTRAINT_CONTRADICTORY_BOUNDS',
  INVALID_ASSOCIATION: 'FIELD_CONSTRAINT_INVALID_ASSOCIATION',
  DEFERRED_CATEGORY: 'FIELD_CONSTRAINT_DEFERRED_CATEGORY',
} as const;

export type FieldConstraintErrorCode =
  (typeof FIELD_CONSTRAINT_ERROR_CODES)[keyof typeof FIELD_CONSTRAINT_ERROR_CODES];

/**
 * Dedicated structured validation error for FieldConstraint failures.
 */
export class FieldConstraintValidationError extends SemanticKernelError {
  public override readonly code: FieldConstraintErrorCode;

  constructor(code: FieldConstraintErrorCode, message: string) {
    super(message, code);
    this.name = 'FieldConstraintValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Exact Numeric Comparison Utilities ───────────────────────────────────────

/**
 * Compares two canonical INTEGER strings with exact precision using BigInt.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareExactIntegers(a: string, b: string): number {
  const bigA = BigInt(a);
  const bigB = BigInt(b);
  if (bigA < bigB) return -1;
  if (bigA > bigB) return 1;
  return 0;
}

/**
 * Compares two canonical DECIMAL strings with exact precision without floating-point conversion.
 * Preserves decimal exactness across arbitrary digits.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareExactDecimals(a: string, b: string): number {
  if (a === b) return 0;

  const aNeg = a.startsWith('-');
  const bNeg = b.startsWith('-');

  if (aNeg && !bNeg) return -1;
  if (!aNeg && bNeg) return 1;

  const aAbs = aNeg ? a.slice(1) : a;
  const bAbs = bNeg ? b.slice(1) : b;

  const dotA = aAbs.indexOf('.');
  const dotB = bAbs.indexOf('.');

  const aInt = dotA === -1 ? aAbs : aAbs.slice(0, dotA);
  const aFrac = dotA === -1 ? '' : aAbs.slice(dotA + 1);

  const bInt = dotB === -1 ? bAbs : bAbs.slice(0, dotB);
  const bFrac = dotB === -1 ? '' : bAbs.slice(dotB + 1);

  // Compare integer parts by length first, then lexicographically
  let cmp = 0;
  if (aInt.length !== bInt.length) {
    cmp = aInt.length > bInt.length ? 1 : -1;
  } else {
    cmp = aInt.localeCompare(bInt);
  }

  // If integer parts are equal, compare fractional parts padded with trailing zeros
  if (cmp === 0) {
    const maxFracLen = Math.max(aFrac.length, bFrac.length);
    const aFracPadded = aFrac.padEnd(maxFracLen, '0');
    const bFracPadded = bFrac.padEnd(maxFracLen, '0');
    cmp = aFracPadded.localeCompare(bFracPadded);
  }

  // If negative numbers, invert comparison
  return aNeg ? -cmp : cmp;
}

// ─── Strongly Typed Constraint Variants ───────────────────────────────────────

/**
 * Constraint declaring a lower bound on the length of a STRING value (in Unicode code points).
 */
export interface MinLengthConstraint {
  readonly kind: typeof FieldConstraintKinds.MIN_LENGTH;
  readonly minimum: number;
}

/**
 * Constraint declaring an upper bound on the length of a STRING value (in Unicode code points).
 */
export interface MaxLengthConstraint {
  readonly kind: typeof FieldConstraintKinds.MAX_LENGTH;
  readonly maximum: number;
}

/**
 * Constraint declaring a lower bound on a numeric value (INTEGER or DECIMAL).
 */
export interface MinValueConstraint {
  readonly kind: typeof FieldConstraintKinds.MIN_VALUE;
  readonly valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL;
  readonly minimum: string;
  readonly inclusive: boolean;
}

/**
 * Constraint declaring an upper bound on a numeric value (INTEGER or DECIMAL).
 */
export interface MaxValueConstraint {
  readonly kind: typeof FieldConstraintKinds.MAX_VALUE;
  readonly valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL;
  readonly maximum: string;
  readonly inclusive: boolean;
}

/**
 * Constraint declaring precision (total digits) and scale (fractional digits) on a DECIMAL value.
 */
export interface PrecisionScaleConstraint {
  readonly kind: typeof FieldConstraintKinds.PRECISION_SCALE;
  readonly precision: number;
  readonly scale: number;
}

/**
 * Discriminated union of all authoritative field-level constraint variants.
 */
export type FieldConstraint =
  | MinLengthConstraint
  | MaxLengthConstraint
  | MinValueConstraint
  | MaxValueConstraint
  | PrecisionScaleConstraint;

/**
 * Wire-safe JSON interchange shape for FieldConstraint variants.
 */
export type FieldConstraintJSON =
  | {
      readonly kind: typeof FieldConstraintKinds.MIN_LENGTH;
      readonly minimum: number;
    }
  | {
      readonly kind: typeof FieldConstraintKinds.MAX_LENGTH;
      readonly maximum: number;
    }
  | {
      readonly kind: typeof FieldConstraintKinds.MIN_VALUE;
      readonly valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL;
      readonly minimum: string;
      readonly inclusive: boolean;
    }
  | {
      readonly kind: typeof FieldConstraintKinds.MAX_VALUE;
      readonly valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL;
      readonly maximum: string;
      readonly inclusive: boolean;
    }
  | {
      readonly kind: typeof FieldConstraintKinds.PRECISION_SCALE;
      readonly precision: number;
      readonly scale: number;
    };

/**
 * Discriminated result type for non-throwing parsing.
 */
export type FieldConstraintParseResult =
  | { readonly ok: true; readonly value: FieldConstraint }
  | { readonly ok: false; readonly error: FieldConstraintValidationError };

// ─── Construction Factories ───────────────────────────────────────────────────

/**
 * Constructs an immutable MinLengthConstraint.
 *
 * Invariants:
 * - `minimum` must be a nonnegative safe integer.
 * - `minimum` must not exceed `STRING_MAX_LENGTH` (65,536).
 *
 * @param minimum Nonnegative safe integer Unicode code-point bound.
 * @returns Frozen MinLengthConstraint instance.
 */
export function createMinLengthConstraint(minimum: number): MinLengthConstraint {
  if (typeof minimum !== 'number' || !Number.isSafeInteger(minimum)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MIN_LENGTH bound must be a safe integer, received: ${String(minimum)}.`,
    );
  }
  if (minimum < 0) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `MIN_LENGTH bound must be nonnegative (>= 0), received: ${minimum}.`,
    );
  }
  if (minimum > STRING_MAX_LENGTH) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `MIN_LENGTH bound cannot exceed platform maximum ${STRING_MAX_LENGTH}, received: ${minimum}.`,
    );
  }

  return Object.freeze({
    kind: FieldConstraintKinds.MIN_LENGTH,
    minimum,
  });
}

/**
 * Constructs an immutable MaxLengthConstraint.
 *
 * Invariants:
 * - `maximum` must be a nonnegative safe integer.
 * - `maximum` must not exceed `STRING_MAX_LENGTH` (65,536).
 *
 * @param maximum Nonnegative safe integer Unicode code-point bound.
 * @returns Frozen MaxLengthConstraint instance.
 */
export function createMaxLengthConstraint(maximum: number): MaxLengthConstraint {
  if (typeof maximum !== 'number' || !Number.isSafeInteger(maximum)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MAX_LENGTH bound must be a safe integer, received: ${String(maximum)}.`,
    );
  }
  if (maximum < 0) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `MAX_LENGTH bound must be nonnegative (>= 0), received: ${maximum}.`,
    );
  }
  if (maximum > STRING_MAX_LENGTH) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `MAX_LENGTH bound cannot exceed platform maximum ${STRING_MAX_LENGTH}, received: ${maximum}.`,
    );
  }

  return Object.freeze({
    kind: FieldConstraintKinds.MAX_LENGTH,
    maximum,
  });
}

/**
 * Parameter interface for numeric boundary constraints.
 */
export interface NumericBoundParams {
  readonly minimum?: string;
  readonly maximum?: string;
  readonly valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL;
  readonly inclusive?: boolean;
}

/**
 * Constructs an immutable MinValueConstraint.
 *
 * Invariants:
 * - `valueType` must be 'INTEGER' or 'DECIMAL'.
 * - `minimum` must conform to the canonical string grammar for `valueType` from SK-09.
 * - `inclusive` defaults to `true`.
 *
 * @param minimum Canonical numeric string.
 * @param valueType 'INTEGER' or 'DECIMAL'.
 * @param inclusive Whether the bound is inclusive (default: true).
 * @returns Frozen MinValueConstraint instance.
 */
export function createMinValueConstraint(
  minimum: string,
  valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL,
  inclusive = true,
): MinValueConstraint {
  if (typeof minimum !== 'string') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MIN_VALUE bound must be a canonical string, received: ${typeof minimum}.`,
    );
  }
  if (valueType !== PrimitiveTypes.INTEGER && valueType !== PrimitiveTypes.DECIMAL) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MIN_VALUE valueType must be 'INTEGER' or 'DECIMAL', received: '${String(valueType)}'.`,
    );
  }
  if (typeof inclusive !== 'boolean') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MIN_VALUE inclusive flag must be a boolean, received: ${typeof inclusive}.`,
    );
  }

  const validation = validatePrimitiveValue(valueType, minimum);
  if (!validation.valid) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MIN_VALUE bound '${minimum}' is not a valid canonical ${valueType}: ${validation.message}`,
    );
  }

  return Object.freeze({
    kind: FieldConstraintKinds.MIN_VALUE,
    valueType,
    minimum,
    inclusive,
  });
}

/**
 * Constructs an immutable MaxValueConstraint.
 *
 * Invariants:
 * - `valueType` must be 'INTEGER' or 'DECIMAL'.
 * - `maximum` must conform to the canonical string grammar for `valueType` from SK-09.
 * - `inclusive` defaults to `true`.
 *
 * @param maximum Canonical numeric string.
 * @param valueType 'INTEGER' or 'DECIMAL'.
 * @param inclusive Whether the bound is inclusive (default: true).
 * @returns Frozen MaxValueConstraint instance.
 */
export function createMaxValueConstraint(
  maximum: string,
  valueType: typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL,
  inclusive = true,
): MaxValueConstraint {
  if (typeof maximum !== 'string') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MAX_VALUE bound must be a canonical string, received: ${typeof maximum}.`,
    );
  }
  if (valueType !== PrimitiveTypes.INTEGER && valueType !== PrimitiveTypes.DECIMAL) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MAX_VALUE valueType must be 'INTEGER' or 'DECIMAL', received: '${String(valueType)}'.`,
    );
  }
  if (typeof inclusive !== 'boolean') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MAX_VALUE inclusive flag must be a boolean, received: ${typeof inclusive}.`,
    );
  }

  const validation = validatePrimitiveValue(valueType, maximum);
  if (!validation.valid) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `MAX_VALUE bound '${maximum}' is not a valid canonical ${valueType}: ${validation.message}`,
    );
  }

  return Object.freeze({
    kind: FieldConstraintKinds.MAX_VALUE,
    valueType,
    maximum,
    inclusive,
  });
}

/**
 * Constructs an immutable PrecisionScaleConstraint.
 *
 * Invariants:
 * - `precision` must be a positive safe integer (1 <= precision <= DECIMAL_MAX_TOTAL_DIGITS).
 * - `scale` must be a nonnegative safe integer (0 <= scale <= DECIMAL_MAX_FRACTION_DIGITS).
 * - `scale <= precision`.
 *
 * @param precision Maximum total decimal digits (1..38).
 * @param scale Maximum fractional decimal digits (0..18, <= precision).
 * @returns Frozen PrecisionScaleConstraint instance.
 */
export function createPrecisionScaleConstraint(
  precision: number,
  scale: number,
): PrecisionScaleConstraint {
  if (typeof precision !== 'number' || !Number.isSafeInteger(precision)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `PRECISION_SCALE precision must be a safe integer, received: ${String(precision)}.`,
    );
  }
  if (typeof scale !== 'number' || !Number.isSafeInteger(scale)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `PRECISION_SCALE scale must be a safe integer, received: ${String(scale)}.`,
    );
  }
  if (precision <= 0) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `PRECISION_SCALE precision must be strictly positive (> 0), received: ${precision}.`,
    );
  }
  if (precision > DECIMAL_MAX_TOTAL_DIGITS) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `PRECISION_SCALE precision cannot exceed ${DECIMAL_MAX_TOTAL_DIGITS}, received: ${precision}.`,
    );
  }
  if (scale < 0) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `PRECISION_SCALE scale must be nonnegative (>= 0), received: ${scale}.`,
    );
  }
  if (scale > DECIMAL_MAX_FRACTION_DIGITS) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `PRECISION_SCALE scale cannot exceed ${DECIMAL_MAX_FRACTION_DIGITS}, received: ${scale}.`,
    );
  }
  if (scale > precision) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.OUT_OF_RANGE,
      `PRECISION_SCALE scale (${scale}) cannot exceed precision (${precision}).`,
    );
  }

  return Object.freeze({
    kind: FieldConstraintKinds.PRECISION_SCALE,
    precision,
    scale,
  });
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isMinLengthConstraint(value: unknown): value is MinLengthConstraint {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    obj['kind'] === FieldConstraintKinds.MIN_LENGTH &&
    typeof obj['minimum'] === 'number' &&
    Number.isSafeInteger(obj['minimum']) &&
    obj['minimum'] >= 0 &&
    obj['minimum'] <= STRING_MAX_LENGTH
  );
}

export function isMaxLengthConstraint(value: unknown): value is MaxLengthConstraint {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    obj['kind'] === FieldConstraintKinds.MAX_LENGTH &&
    typeof obj['maximum'] === 'number' &&
    Number.isSafeInteger(obj['maximum']) &&
    obj['maximum'] >= 0 &&
    obj['maximum'] <= STRING_MAX_LENGTH
  );
}

export function isMinValueConstraint(value: unknown): value is MinValueConstraint {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (obj['kind'] !== FieldConstraintKinds.MIN_VALUE) return false;
  const vt = obj['valueType'];
  if (vt !== PrimitiveTypes.INTEGER && vt !== PrimitiveTypes.DECIMAL) return false;
  if (typeof obj['minimum'] !== 'string') return false;
  if (typeof obj['inclusive'] !== 'boolean') return false;
  return validatePrimitiveValue(vt, obj['minimum']).valid;
}

export function isMaxValueConstraint(value: unknown): value is MaxValueConstraint {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (obj['kind'] !== FieldConstraintKinds.MAX_VALUE) return false;
  const vt = obj['valueType'];
  if (vt !== PrimitiveTypes.INTEGER && vt !== PrimitiveTypes.DECIMAL) return false;
  if (typeof obj['maximum'] !== 'string') return false;
  if (typeof obj['inclusive'] !== 'boolean') return false;
  return validatePrimitiveValue(vt, obj['maximum']).valid;
}

export function isPrecisionScaleConstraint(value: unknown): value is PrecisionScaleConstraint {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (obj['kind'] !== FieldConstraintKinds.PRECISION_SCALE) return false;
  const p = obj['precision'];
  const s = obj['scale'];
  return (
    typeof p === 'number' &&
    typeof s === 'number' &&
    Number.isSafeInteger(p) &&
    Number.isSafeInteger(s) &&
    p > 0 &&
    p <= DECIMAL_MAX_TOTAL_DIGITS &&
    s >= 0 &&
    s <= DECIMAL_MAX_FRACTION_DIGITS &&
    s <= p
  );
}

/**
 * Comprehensive runtime type guard for any valid FieldConstraint variant.
 */
export function isFieldConstraint(value: unknown): value is FieldConstraint {
  return (
    isMinLengthConstraint(value) ||
    isMaxLengthConstraint(value) ||
    isMinValueConstraint(value) ||
    isMaxValueConstraint(value) ||
    isPrecisionScaleConstraint(value)
  );
}

// ─── Primitive Type Applicability ─────────────────────────────────────────────

/**
 * Checks whether a given FieldConstraint can be applied to a specific PrimitiveType.
 *
 * Applicability Matrix:
 * - MIN_LENGTH:      STRING only
 * - MAX_LENGTH:      STRING only
 * - MIN_VALUE:       INTEGER (if constraint valueType='INTEGER')
 *                    DECIMAL (if constraint valueType='DECIMAL')
 * - MAX_VALUE:       INTEGER (if constraint valueType='INTEGER')
 *                    DECIMAL (if constraint valueType='DECIMAL')
 * - PRECISION_SCALE: DECIMAL only
 */
export function isConstraintApplicableToPrimitive(
  constraint: FieldConstraint,
  primitiveType: PrimitiveType,
): boolean {
  switch (constraint.kind) {
    case FieldConstraintKinds.MIN_LENGTH:
    case FieldConstraintKinds.MAX_LENGTH:
      return primitiveType === PrimitiveTypes.STRING;

    case FieldConstraintKinds.MIN_VALUE:
    case FieldConstraintKinds.MAX_VALUE:
      return primitiveType === constraint.valueType;

    case FieldConstraintKinds.PRECISION_SCALE:
      return primitiveType === PrimitiveTypes.DECIMAL;

    default:
      return false;
  }
}

/**
 * Validates constraint applicability against a PrimitiveType, throwing an explicit error on failure.
 */
export function validateConstraintApplicability(
  constraint: FieldConstraint,
  primitiveType: PrimitiveType,
): void {
  if (!isConstraintApplicableToPrimitive(constraint, primitiveType)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.UNSUPPORTED_FIELD_TYPE,
      `Constraint '${constraint.kind}' is not applicable to field primitive type '${primitiveType}'.`,
    );
  }
}

// ─── Semantic Equality ────────────────────────────────────────────────────────

/**
 * Compares two FieldConstraints for exact structural equivalence.
 */
export function equalsFieldConstraint(a: FieldConstraint, b: FieldConstraint): boolean {
  if (a === b) return true;
  if (a.kind !== b.kind) return false;

  switch (a.kind) {
    case FieldConstraintKinds.MIN_LENGTH:
      return a.minimum === (b as MinLengthConstraint).minimum;

    case FieldConstraintKinds.MAX_LENGTH:
      return a.maximum === (b as MaxLengthConstraint).maximum;

    case FieldConstraintKinds.MIN_VALUE: {
      const bMin = b as MinValueConstraint;
      return (
        a.valueType === bMin.valueType &&
        a.minimum === bMin.minimum &&
        a.inclusive === bMin.inclusive
      );
    }

    case FieldConstraintKinds.MAX_VALUE: {
      const bMax = b as MaxValueConstraint;
      return (
        a.valueType === bMax.valueType &&
        a.maximum === bMax.maximum &&
        a.inclusive === bMax.inclusive
      );
    }

    case FieldConstraintKinds.PRECISION_SCALE: {
      const bPs = b as PrecisionScaleConstraint;
      return a.precision === bPs.precision && a.scale === bPs.scale;
    }

    default:
      return false;
  }
}

// ─── Serialization and Deserialization ────────────────────────────────────────

/**
 * Serializes a FieldConstraint into a deterministic wire-safe JSON object.
 */
export function serializeFieldConstraint(constraint: FieldConstraint): FieldConstraintJSON {
  switch (constraint.kind) {
    case FieldConstraintKinds.MIN_LENGTH:
      return Object.freeze({
        kind: FieldConstraintKinds.MIN_LENGTH,
        minimum: constraint.minimum,
      });

    case FieldConstraintKinds.MAX_LENGTH:
      return Object.freeze({
        kind: FieldConstraintKinds.MAX_LENGTH,
        maximum: constraint.maximum,
      });

    case FieldConstraintKinds.MIN_VALUE:
      return Object.freeze({
        kind: FieldConstraintKinds.MIN_VALUE,
        valueType: constraint.valueType,
        minimum: constraint.minimum,
        inclusive: constraint.inclusive,
      });

    case FieldConstraintKinds.MAX_VALUE:
      return Object.freeze({
        kind: FieldConstraintKinds.MAX_VALUE,
        valueType: constraint.valueType,
        maximum: constraint.maximum,
        inclusive: constraint.inclusive,
      });

    case FieldConstraintKinds.PRECISION_SCALE:
      return Object.freeze({
        kind: FieldConstraintKinds.PRECISION_SCALE,
        precision: constraint.precision,
        scale: constraint.scale,
      });
  }
}

/**
 * Strictly parses and validates raw interchange data into an authentic FieldConstraint.
 */
export function parseFieldConstraint(raw: unknown): FieldConstraint {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.NON_OBJECT,
      'FieldConstraint deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;

  if (!('kind' in record) || typeof record['kind'] !== 'string') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.MISSING_KIND,
      'FieldConstraint JSON missing string "kind" property.',
    );
  }

  const kind = record['kind'];

  if (!isFieldConstraintKind(kind)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_KIND,
      `Unrecognized field constraint kind: '${kind}'.`,
    );
  }

  switch (kind) {
    case FieldConstraintKinds.MIN_LENGTH: {
      if (!('minimum' in record) || typeof record['minimum'] !== 'number') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MIN_LENGTH constraint requires numeric "minimum" property.',
        );
      }
      return createMinLengthConstraint(record['minimum']);
    }

    case FieldConstraintKinds.MAX_LENGTH: {
      if (!('maximum' in record) || typeof record['maximum'] !== 'number') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MAX_LENGTH constraint requires numeric "maximum" property.',
        );
      }
      return createMaxLengthConstraint(record['maximum']);
    }

    case FieldConstraintKinds.MIN_VALUE: {
      if (!('minimum' in record) || typeof record['minimum'] !== 'string') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MIN_VALUE constraint requires string "minimum" property.',
        );
      }
      if (!('valueType' in record) || typeof record['valueType'] !== 'string') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MIN_VALUE constraint requires string "valueType" property.',
        );
      }
      const inclusive = record['inclusive'] !== undefined ? Boolean(record['inclusive']) : true;
      return createMinValueConstraint(
        record['minimum'],
        record['valueType'] as typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL,
        inclusive,
      );
    }

    case FieldConstraintKinds.MAX_VALUE: {
      if (!('maximum' in record) || typeof record['maximum'] !== 'string') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MAX_VALUE constraint requires string "maximum" property.',
        );
      }
      if (!('valueType' in record) || typeof record['valueType'] !== 'string') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'MAX_VALUE constraint requires string "valueType" property.',
        );
      }
      const inclusive = record['inclusive'] !== undefined ? Boolean(record['inclusive']) : true;
      return createMaxValueConstraint(
        record['maximum'],
        record['valueType'] as typeof PrimitiveTypes.INTEGER | typeof PrimitiveTypes.DECIMAL,
        inclusive,
      );
    }

    case FieldConstraintKinds.PRECISION_SCALE: {
      if (!('precision' in record) || typeof record['precision'] !== 'number') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'PRECISION_SCALE constraint requires numeric "precision" property.',
        );
      }
      if (!('scale' in record) || typeof record['scale'] !== 'number') {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.MISSING_PARAMETER,
          'PRECISION_SCALE constraint requires numeric "scale" property.',
        );
      }
      return createPrecisionScaleConstraint(record['precision'], record['scale']);
    }
  }
}

/**
 * Non-throwing safe parsing function for untrusted external inputs.
 */
export function tryParseFieldConstraint(raw: unknown): FieldConstraintParseResult {
  try {
    return { ok: true, value: parseFieldConstraint(raw) };
  } catch (error) {
    if (error instanceof FieldConstraintValidationError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new FieldConstraintValidationError(
        FIELD_CONSTRAINT_ERROR_CODES.NON_OBJECT,
        error instanceof Error ? error.message : 'Unexpected parsing error',
      ),
    };
  }
}
