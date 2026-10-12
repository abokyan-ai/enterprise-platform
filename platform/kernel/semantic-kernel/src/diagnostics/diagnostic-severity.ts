/**
 * @file diagnostic-severity.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * SK-11: DiagnosticSeverity classification.
 *
 * Establishes an explicit, finite, immutable classification of diagnostic severities:
 * - ERROR: An identified condition that prevents an operation or artifact from satisfying declared requirements.
 * - WARNING: A nonblocking condition that may affect quality, maintainability, or compatibility.
 * - INFO: An informational observation that is not a validation failure.
 *
 * Architectural Invariants:
 * 1. Severity Is Not an Exit Code: Does not terminate processes or map to process.exit().
 * 2. Severity Is Not Authorization: Security issues do not automatically translate to HTTP 403 or denial.
 * 3. Severity Is Not Logging: Severities do not automatically map to log levels or trigger console outputs.
 * 4. No Automatic Severity Promotion: WARNING is never automatically promoted to ERROR in the Kernel.
 * 5. Pure TypeScript: Universal browser and Node.js portability.
 */

import { SemanticKernelError } from '../semantic-id.js';

/**
 * Immutable canonical severity constants.
 */
export const DiagnosticSeverities = Object.freeze({
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
} as const);

/**
 * Canonical DiagnosticSeverity union type.
 */
export type DiagnosticSeverity =
  (typeof DiagnosticSeverities)[keyof typeof DiagnosticSeverities];

/**
 * All recognized canonical severity codes.
 */
export const RECOGNIZED_SEVERITIES: readonly DiagnosticSeverity[] =
  Object.freeze([
    DiagnosticSeverities.ERROR,
    DiagnosticSeverities.WARNING,
    DiagnosticSeverities.INFO,
  ]);

/**
 * Structured error codes for severity validation failures.
 */
export const DIAGNOSTIC_SEVERITY_ERROR_CODES = {
  NON_STRING: 'DIAGNOSTIC_SEVERITY_NON_STRING',
  UNKNOWN_SEVERITY: 'DIAGNOSTIC_SEVERITY_UNKNOWN',
} as const;

export type DiagnosticSeverityErrorCode =
  (typeof DIAGNOSTIC_SEVERITY_ERROR_CODES)[keyof typeof DIAGNOSTIC_SEVERITY_ERROR_CODES];

/**
 * Dedicated error class for diagnostic severity validation failures.
 */
export class DiagnosticSeverityValidationError extends SemanticKernelError {
  public override readonly code: DiagnosticSeverityErrorCode;
  public readonly invalidInputSummary: string;

  constructor(
    code: DiagnosticSeverityErrorCode,
    message: string,
    rawInput?: unknown,
  ) {
    super(message, code);
    this.name = 'DiagnosticSeverityValidationError';
    this.code = code;

    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Type guard verifying whether an untrusted value is a valid DiagnosticSeverity.
 */
export function isDiagnosticSeverity(value: unknown): value is DiagnosticSeverity {
  return (
    typeof value === 'string' &&
    (RECOGNIZED_SEVERITIES as readonly string[]).includes(value)
  );
}

/**
 * Strictly parses raw input into a canonical DiagnosticSeverity.
 * Throws DiagnosticSeverityValidationError if input is invalid.
 * Note: Does not perform silent trimming or case normalization.
 */
export function parseDiagnosticSeverity(raw: unknown): DiagnosticSeverity {
  if (typeof raw !== 'string') {
    throw new DiagnosticSeverityValidationError(
      DIAGNOSTIC_SEVERITY_ERROR_CODES.NON_STRING,
      `DiagnosticSeverity must be a string, received ${typeof raw}.`,
      raw,
    );
  }

  if (!isDiagnosticSeverity(raw)) {
    throw new DiagnosticSeverityValidationError(
      DIAGNOSTIC_SEVERITY_ERROR_CODES.UNKNOWN_SEVERITY,
      `Unknown DiagnosticSeverity "${raw}". Accepted values are: ${RECOGNIZED_SEVERITIES.join(', ')}.`,
      raw,
    );
  }

  return raw;
}
