/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * Internal barrel for the SK-11 diagnostics subsystem.
 * Consumers must import from the root @ecosystem/semantic-kernel barrel.
 */

// ─── Severity ───
export {
  DiagnosticSeverities,
  type DiagnosticSeverity,
  RECOGNIZED_SEVERITIES,
  DIAGNOSTIC_SEVERITY_ERROR_CODES,
  type DiagnosticSeverityErrorCode,
  DiagnosticSeverityValidationError,
  isDiagnosticSeverity,
  parseDiagnosticSeverity,
} from './diagnostic-severity.js';

// ─── Code ───
export {
  DIAGNOSTIC_CODE_SEPARATOR,
  DIAGNOSTIC_CODE_MIN_LENGTH,
  DIAGNOSTIC_CODE_MAX_LENGTH,
  DIAGNOSTIC_CODE_MAX_SEGMENTS,
  DIAGNOSTIC_CODE_PATTERN,
  DIAGNOSTIC_CODE_ERROR_CODES,
  type DiagnosticCodeErrorCode,
  DiagnosticCodeValidationError,
  type DiagnosticCodeParseResult,
  DiagnosticCode,
} from './diagnostic-code.js';

// ─── Location ───
export {
  type SourcePosition,
  DIAGNOSTIC_LOCATION_ERROR_CODES,
  type DiagnosticLocationErrorCode,
  DiagnosticLocationValidationError,
  type DiagnosticLocation,
  validateSourcePosition,
  validateDiagnosticLocation,
} from './diagnostic-location.js';

// ─── Diagnostic Contract, Factory, Validation, and Serialization ───
export {
  DIAGNOSTIC_MESSAGE_MIN_LENGTH,
  DIAGNOSTIC_MESSAGE_MAX_LENGTH,
  DIAGNOSTIC_DETAILS_MAX_ENTRIES,
  DIAGNOSTIC_DETAILS_MAX_STRING_LENGTH,
  type DiagnosticDetailPrimitive,
  type DiagnosticDetailValue,
  type DiagnosticDetails,
  DIAGNOSTIC_ERROR_CODES,
  type DiagnosticErrorCode,
  DiagnosticValidationError,
  type Diagnostic,
  type CreateDiagnosticParams,
  type DiagnosticJSON,
  type DiagnosticParseResult,
  validateDiagnosticDetails,
  validateDiagnosticMessage,
  validateDiagnostic,
  isDiagnostic,
  createDiagnostic,
  serializeDiagnostic,
  parseDiagnostic,
  tryParseDiagnostic,
} from './diagnostic.js';

// ─── Collections and Helpers ───
export {
  type DiagnosticCollection,
  createDiagnosticCollection,
  emptyDiagnosticCollection,
  hasErrors,
  hasWarnings,
  combineDiagnostics,
  type DiagnosticResult,
  createDiagnosticResult,
  emptyDiagnosticResult,
} from './diagnostic-collection.js';
