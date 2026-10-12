/**
 * @file diagnostic.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * SK-11: Diagnostic Contract, Factory, Validation, and Serialization.
 *
 * A Diagnostic is an immutable structured description of an identified problem,
 * warning, or observation produced by a platform component.
 *
 * Architectural Invariants:
 * 1. Diagnostic ≠ Exception: Diagnostics are structured data, not control-flow signals.
 * 2. Diagnostic ≠ Log Entry: Diagnostics describe stable domain conditions, not execution traces.
 * 3. Diagnostic ≠ Validation Rule: Diagnostics describe results; they do not execute validations.
 * 4. Missing ≠ Null ≠ Value: Omitted optional fields are absent, never normalized to null.
 * 5. Deterministic Serialization: Round-trip JSON interchange without runtime or private state leakage.
 * 6. Immutability: All instances and collections are deeply sealed and frozen.
 */

import { SemanticKernelError } from '../semantic-id.js';
import {
  DiagnosticSeverity,
  isDiagnosticSeverity,
  parseDiagnosticSeverity,
} from './diagnostic-severity.js';
import {
  DiagnosticCode,
  DiagnosticCodeValidationError,
} from './diagnostic-code.js';
import {
  DiagnosticLocation,
  validateDiagnosticLocation,
  DiagnosticLocationValidationError,
} from './diagnostic-location.js';

export const DIAGNOSTIC_MESSAGE_MIN_LENGTH = 1;
export const DIAGNOSTIC_MESSAGE_MAX_LENGTH = 2048;
export const DIAGNOSTIC_DETAILS_MAX_ENTRIES = 16;
export const DIAGNOSTIC_DETAILS_MAX_STRING_LENGTH = 256;

/**
 * Permitted primitive types within safe contextual details.
 */
export type DiagnosticDetailPrimitive = string | number | boolean | null;

/**
 * Permitted safe contextual details value type.
 */
export type DiagnosticDetailValue =
  | DiagnosticDetailPrimitive
  | readonly DiagnosticDetailPrimitive[]
  | { readonly [key: string]: DiagnosticDetailPrimitive };

/**
 * Safe, bounded, JSON-serializable contextual details dictionary.
 */
export type DiagnosticDetails = Readonly<Record<string, DiagnosticDetailValue>>;

/**
 * Structured validation error codes for Diagnostic failures.
 */
export const DIAGNOSTIC_ERROR_CODES = {
  NON_OBJECT: 'DIAGNOSTIC_NON_OBJECT',
  MISSING_CODE: 'DIAGNOSTIC_MISSING_CODE',
  INVALID_CODE: 'DIAGNOSTIC_INVALID_CODE',
  MISSING_SEVERITY: 'DIAGNOSTIC_MISSING_SEVERITY',
  INVALID_SEVERITY: 'DIAGNOSTIC_INVALID_SEVERITY',
  MISSING_MESSAGE: 'DIAGNOSTIC_MISSING_MESSAGE',
  MESSAGE_NON_STRING: 'DIAGNOSTIC_MESSAGE_NON_STRING',
  MESSAGE_EMPTY: 'DIAGNOSTIC_MESSAGE_EMPTY',
  MESSAGE_TOO_LONG: 'DIAGNOSTIC_MESSAGE_TOO_LONG',
  INVALID_LOCATION: 'DIAGNOSTIC_INVALID_LOCATION',
  INVALID_DETAILS: 'DIAGNOSTIC_INVALID_DETAILS',
} as const;

export type DiagnosticErrorCode =
  (typeof DIAGNOSTIC_ERROR_CODES)[keyof typeof DIAGNOSTIC_ERROR_CODES];

/**
 * Dedicated error class for diagnostic validation failures.
 */
export class DiagnosticValidationError extends SemanticKernelError {
  public override readonly code: DiagnosticErrorCode;
  public readonly causeError?: SemanticKernelError;

  constructor(
    code: DiagnosticErrorCode,
    message: string,
    causeError?: SemanticKernelError,
  ) {
    super(message, code);
    this.name = 'DiagnosticValidationError';
    this.code = code;
    this.causeError = causeError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Fundamental immutable Diagnostic contract.
 */
export interface Diagnostic {
  /** Stable machine-readable code */
  readonly code: string;

  /** Explicit severity classification */
  readonly severity: DiagnosticSeverity;

  /** Human-readable message */
  readonly message: string;

  /** Optional semantic or source location */
  readonly location?: DiagnosticLocation;

  /** Optional bounded, safe contextual details */
  readonly details?: DiagnosticDetails;

  /** Optional legacy source identifier (for backward compatibility) */
  readonly source?: string;
}

/**
 * Parameters for creating a validated Diagnostic instance.
 */
export interface CreateDiagnosticParams {
  readonly code: DiagnosticCode | string;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly location?: DiagnosticLocation;
  readonly details?: DiagnosticDetails;
  readonly source?: string;
}

/**
 * JSON interchange representation of a Diagnostic.
 */
export interface DiagnosticJSON {
  readonly code: string;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly location?: Record<string, unknown>;
  readonly details?: Record<string, unknown>;
  readonly source?: string;
}

/**
 * Validates a candidate contextual details dictionary.
 */
export function validateDiagnosticDetails(
  details: unknown,
): DiagnosticValidationError | null {
  if (details === null || typeof details !== 'object' || Array.isArray(details)) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
      'Diagnostic details must be a non-null object.',
    );
  }

  const entries = Object.entries(details as Record<string, unknown>);

  if (entries.length > DIAGNOSTIC_DETAILS_MAX_ENTRIES) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
      `Diagnostic details exceeds maximum entries limit of ${DIAGNOSTIC_DETAILS_MAX_ENTRIES}, received ${entries.length}.`,
    );
  }

  for (const [key, value] of entries) {
    if (typeof key !== 'string' || key.length === 0 || key.length > 64) {
      return new DiagnosticValidationError(
        DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
        `Invalid diagnostic details key "${key}": key must be between 1 and 64 characters.`,
      );
    }

    if (value === null || typeof value === 'boolean') {
      continue;
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return new DiagnosticValidationError(
          DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
          `Diagnostic detail "${key}" has non-finite number value.`,
        );
      }
      continue;
    }

    if (typeof value === 'string') {
      if (value.length > DIAGNOSTIC_DETAILS_MAX_STRING_LENGTH) {
        return new DiagnosticValidationError(
          DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
          `Diagnostic detail "${key}" exceeds string length limit of ${DIAGNOSTIC_DETAILS_MAX_STRING_LENGTH} characters.`,
        );
      }
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 32) {
        return new DiagnosticValidationError(
          DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
          `Diagnostic detail array "${key}" exceeds maximum array length of 32.`,
        );
      }
      for (const item of value) {
        if (
          item !== null &&
          typeof item !== 'string' &&
          typeof item !== 'number' &&
          typeof item !== 'boolean'
        ) {
          return new DiagnosticValidationError(
            DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
            `Diagnostic detail array "${key}" contains unsupported non-primitive element.`,
          );
        }
      }
      continue;
    }

    if (typeof value === 'object') {
      const subEntries = Object.entries(value);
      if (subEntries.length > 16) {
        return new DiagnosticValidationError(
          DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
          `Diagnostic detail sub-object "${key}" exceeds maximum limit of 16 entries.`,
        );
      }
      for (const [subKey, subVal] of subEntries) {
        if (
          subVal !== null &&
          typeof subVal !== 'string' &&
          typeof subVal !== 'number' &&
          typeof subVal !== 'boolean'
        ) {
          return new DiagnosticValidationError(
            DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
            `Diagnostic detail sub-object "${key}.${subKey}" contains non-primitive value. Nested hierarchies beyond depth 1 are forbidden.`,
          );
        }
      }
      continue;
    }

    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_DETAILS,
      `Diagnostic detail "${key}" has unsupported type ${typeof value}. Functions, symbols, and class instances are forbidden.`,
    );
  }

  return null;
}

/**
 * Validates message string against bounds and non-emptiness.
 */
export function validateDiagnosticMessage(
  message: unknown,
): DiagnosticValidationError | null {
  if (typeof message !== 'string') {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MESSAGE_NON_STRING,
      `Diagnostic message must be a string primitive, received ${typeof message}.`,
    );
  }

  if (message.length === 0 || message.trim().length === 0) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MESSAGE_EMPTY,
      'Diagnostic message cannot be empty or whitespace-only.',
    );
  }

  if (message.length > DIAGNOSTIC_MESSAGE_MAX_LENGTH) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MESSAGE_TOO_LONG,
      `Diagnostic message exceeds maximum length of ${DIAGNOSTIC_MESSAGE_MAX_LENGTH} characters, received ${message.length}.`,
    );
  }

  return null;
}

/**
 * Validates a candidate raw Diagnostic object.
 * Returns null if structurally valid, or a DiagnosticValidationError.
 */
export function validateDiagnostic(
  candidate: unknown,
): DiagnosticValidationError | null {
  if (
    candidate === null ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.NON_OBJECT,
      'Diagnostic must be a non-null object.',
    );
  }

  const record = candidate as Record<string, unknown>;

  if (!('code' in record) || record['code'] === undefined) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MISSING_CODE,
      'Diagnostic is missing required "code" property.',
    );
  }

  const rawCode = record['code'];
  const codeStr =
    rawCode instanceof DiagnosticCode ? rawCode.value : rawCode;

  if (typeof codeStr !== 'string') {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_CODE,
      `Diagnostic "code" must be a string or DiagnosticCode, received ${typeof rawCode}.`,
    );
  }

  const codeParseResult = DiagnosticCode.tryParse(codeStr);
  if (!codeParseResult.ok) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_CODE,
      `Diagnostic "code" "${codeStr}" violates canonical grammar: ${codeParseResult.error.message}`,
      codeParseResult.error,
    );
  }

  if (!('severity' in record) || record['severity'] === undefined) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MISSING_SEVERITY,
      'Diagnostic is missing required "severity" property.',
    );
  }

  if (!isDiagnosticSeverity(record['severity'])) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.INVALID_SEVERITY,
      `Diagnostic "severity" "${record['severity']}" is invalid. Must be one of: ERROR, WARNING, INFO.`,
    );
  }

  if (!('message' in record) || record['message'] === undefined) {
    return new DiagnosticValidationError(
      DIAGNOSTIC_ERROR_CODES.MISSING_MESSAGE,
      'Diagnostic is missing required "message" property.',
    );
  }

  const msgErr = validateDiagnosticMessage(record['message']);
  if (msgErr) {
    return msgErr;
  }

  if ('location' in record && record['location'] !== undefined) {
    const locErr = validateDiagnosticLocation(record['location']);
    if (locErr) {
      return new DiagnosticValidationError(
        DIAGNOSTIC_ERROR_CODES.INVALID_LOCATION,
        `Diagnostic location is invalid: ${locErr.message}`,
        locErr,
      );
    }
  }

  if ('details' in record && record['details'] !== undefined) {
    const detErr = validateDiagnosticDetails(record['details']);
    if (detErr) {
      return detErr;
    }
  }

  return null;
}

/**
 * Type guard verifying whether an untrusted value conforms to the Diagnostic contract.
 */
export function isDiagnostic(value: unknown): value is Diagnostic {
  return validateDiagnostic(value) === null;
}

/**
 * Creates an immutable, strictly validated Diagnostic instance.
 * Throws DiagnosticValidationError if any property violates the contract.
 */
export function createDiagnostic(params: CreateDiagnosticParams): Diagnostic {
  const validationError = validateDiagnostic(params);
  if (validationError) {
    throw validationError;
  }

  const codeValue =
    params.code instanceof DiagnosticCode ? params.code.value : params.code;

  const result: Diagnostic = {
    code: codeValue,
    severity: params.severity,
    message: params.message,
    ...(params.location !== undefined ? { location: Object.freeze({ ...params.location }) } : {}),
    ...(params.details !== undefined ? { details: Object.freeze({ ...params.details }) } : {}),
    ...(params.source !== undefined ? { source: params.source } : {}),
  };

  return Object.freeze(result);
}

/**
 * Serializes a Diagnostic into a clean, JSON-safe interchange object.
 * Strictly preserves Missing ≠ Null ≠ Value (omits undefined optional fields).
 */
export function serializeDiagnostic(diagnostic: Diagnostic): DiagnosticJSON {
  const json: Record<string, unknown> = {
    code: diagnostic.code,
    severity: diagnostic.severity,
    message: diagnostic.message,
  };

  if (diagnostic.location !== undefined) {
    json['location'] = { ...diagnostic.location };
  }

  if (diagnostic.details !== undefined) {
    json['details'] = { ...diagnostic.details };
  }

  if (diagnostic.source !== undefined) {
    json['source'] = diagnostic.source;
  }

  return Object.freeze(json) as unknown as DiagnosticJSON;
}

/**
 * Discriminated result type for non-throwing diagnostic parsing.
 */
export type DiagnosticParseResult =
  | { readonly ok: true; readonly value: Diagnostic }
  | { readonly ok: false; readonly error: DiagnosticValidationError };

/**
 * Strictly parses and deserializes an untrusted raw input into a validated Diagnostic.
 * Throws DiagnosticValidationError if input violates the contract.
 */
export function parseDiagnostic(raw: unknown): Diagnostic {
  const error = validateDiagnostic(raw);
  if (error) {
    throw error;
  }

  const record = raw as Record<string, unknown>;
  const codeVal =
    record['code'] instanceof DiagnosticCode
      ? (record['code'] as DiagnosticCode).value
      : (record['code'] as string);

  return createDiagnostic({
    code: codeVal,
    severity: parseDiagnosticSeverity(record['severity']),
    message: record['message'] as string,
    location: record['location'] as DiagnosticLocation | undefined,
    details: record['details'] as DiagnosticDetails | undefined,
    source: record['source'] as string | undefined,
  });
}

/**
 * Non-throwing parse method returning a typed discriminated union.
 */
export function tryParseDiagnostic(raw: unknown): DiagnosticParseResult {
  const error = validateDiagnostic(raw);
  if (error) {
    return { ok: false, error };
  }

  try {
    const diagnostic = parseDiagnostic(raw);
    return { ok: true, value: diagnostic };
  } catch (err) {
    if (err instanceof DiagnosticValidationError) {
      return { ok: false, error: err };
    }
    return {
      ok: false,
      error: new DiagnosticValidationError(
        DIAGNOSTIC_ERROR_CODES.NON_OBJECT,
        err instanceof Error ? err.message : String(err),
      ),
    };
  }
}
