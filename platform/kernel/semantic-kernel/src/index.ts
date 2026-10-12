/**
 * @public
 * Public API barrel for @ecosystem/semantic-kernel
 *
 * This is the ONLY entry point for consumers of this library.
 * Deep imports into src/ internals are prohibited.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero platform dependencies.
 */

// ─── Identity ─────────────────────────────────────────────────────────────────
export {
  SemanticElementId,
  type SemanticElementIdParseResult,
  SemanticElementIdValidationError,
  type SemanticElementIdErrorCode,
  SEMANTIC_ELEMENT_ID_MIN_LENGTH,
  SEMANTIC_ELEMENT_ID_MAX_LENGTH,
  SEMANTIC_ELEMENT_ID_PATTERN,
  SemanticContextRef,
  type SemanticContextRefParseResult,
  SemanticContextRefValidationError,
  type SemanticContextRefErrorCode,
  SEMANTIC_CONTEXT_REF_MIN_LENGTH,
  SEMANTIC_CONTEXT_REF_MAX_LENGTH,
  SEMANTIC_CONTEXT_REF_START_PATTERN,
  SEMANTIC_CONTEXT_REF_PATTERN,
} from './identity/index.js';

export {
  type SemanticId,
  createSemanticId,
  isSemanticId,
  SemanticKernelError,
} from './semantic-id.js';

// ─── Naming ───────────────────────────────────────────────────────────────────
export {
  Namespace,
  type NamespaceParseResult,
  NamespaceValidationError,
  type NamespaceErrorCode,
  NAMESPACE_SEPARATOR,
  NAMESPACE_MAX_LENGTH,
  NAMESPACE_MAX_SEGMENT_LENGTH,
  NAMESPACE_MAX_DEPTH,
  NAMESPACE_MIN_DEPTH,
  NAMESPACE_SEGMENT_START_PATTERN,
  NAMESPACE_SEGMENT_FULL_PATTERN,
  QualifiedName,
  type QualifiedNameParseResult,
  QualifiedNameValidationError,
  type QualifiedNameErrorCode,
  LOCAL_NAME_MAX_LENGTH,
  QUALIFIED_NAME_MAX_LENGTH,
  LOCAL_NAME_START_PATTERN,
  LOCAL_NAME_FULL_PATTERN,
} from './naming/index.js';

// ─── Element Contract & Classification (SK-05 / SK-06) ────────────────────────
export {
  type SemanticElement,
  type CreateSemanticElementParams,
  createSemanticElement,
  isSemanticElement,
  SemanticElementValidationError,
  type SemanticElementErrorCode,
  SEMANTIC_ELEMENT_ERROR_CODES,
  SemanticElementKinds,
  type SemanticElementKind,
  isSemanticElementKind,
  parseSemanticElementKind,
  SemanticElementKindValidationError,
  type SemanticElementKindErrorCode,
  SEMANTIC_ELEMENT_KIND_ERROR_CODES,
} from './elements/index.js';

// Legacy optional metadata contract from ARC-01, unchanged by SK-06.
export { type SemanticElementMetadata } from './semantic-element.js';

// ─── Version Reference ────────────────────────────────────────────────────────
export {
  SemanticVersion,
  type SemanticVersionParseResult,
  SemanticVersionValidationError,
  type SemanticVersionErrorCode,
  SEMANTIC_VERSION_ERROR_CODES,
  SEMANTIC_VERSION_MAX_LENGTH,
  SEMANTIC_VERSION_MAX_IDENTIFIER_LENGTH,
  SEMANTIC_VERSION_MAX_PRERELEASE_IDENTIFIERS,
  SEMANTIC_VERSION_MAX_BUILD_IDENTIFIERS,
  SEMANTIC_VERSION_MAX_COMPONENT,
  ElementVersionRef,
  type ElementVersionRefJSON,
  ElementVersionRefValidationError,
  type ElementVersionRefErrorCode,
  ELEMENT_VERSION_REF_ERROR_CODES,
} from './versioning/index.js';

// ARC-01 structural compatibility view; validation delegates to SemanticVersion.
export {
  type VersionRef,
  parseVersion,
  formatVersion,
  compareVersions,
} from './version-ref.js';

// ─── Semantic References (SK-08) ──────────────────────────────────────────────
export {
  // Error infrastructure
  ELEMENT_REF_ERROR_CODES,
  ElementRefValidationError,
  type ElementRefErrorCode,

  // Reference variant types
  type ElementIdRef,
  type ElementNameRef,
  type ElementRef,

  // JSON wire types
  type ElementIdRefJSON,
  type ElementNameRefJSON,
  type ElementRefJSON,

  // Factory functions
  createElementIdRef,
  createElementNameRef,

  // Equality
  equalsElementRef,

  // SK-07 conversion
  toElementVersionRef,

  // Serialization
  serializeElementRef,

  // Deserialization / parsing
  parseElementRef,

  // Type narrowing helpers
  isElementIdRef,
  isElementNameRef,

  // Diagnostic rendering (NOT canonical interchange)
  describeElementRef,
} from './references/index.js';

// ─── Primitive Type System (SK-09) ────────────────────────────────────────────
export {
  // Primitive Type taxonomy
  PrimitiveTypes,
  type PrimitiveType,
  PRIMITIVE_TYPE_ERROR_CODES,
  type PrimitiveTypeErrorCode,
  PrimitiveTypeValidationError,
  isPrimitiveType,
  parsePrimitiveType,

  // Resource bounds
  STRING_MAX_LENGTH,
  INTEGER_MAX_DIGITS,
  DECIMAL_MAX_TOTAL_DIGITS,
  DECIMAL_MAX_FRACTION_DIGITS,

  // Primitive Value error infrastructure
  PRIMITIVE_VALUE_ERROR_CODES,
  type PrimitiveValueErrorCode,
  PrimitiveValueValidationError,

  // Primitive Value type contracts
  type PrimitiveValue,
  type PrimitiveValueJSON,
  type PrimitiveValidationResult,

  // Shape validation
  validatePrimitiveValue,

  // Construction
  createPrimitiveValue,
  createIntegerValueFromSafeNumber,

  // Equality
  equalsPrimitiveValue,

  // Serialization
  serializePrimitiveValue,

  // Deserialization
  parsePrimitiveValue,

  // Type narrowing helpers
  isStringValue,
  isBooleanValue,
  isIntegerValue,
  isDecimalValue,
  isDateValue,
  isTimeValue,
  isDatetimeValue,
} from './primitives/index.js';

// ─── Facet Base Contract (SK-10) ─────────────────────────────────────────────
export {
  // Facet Key value object and grammar
  FACET_KEY_SEPARATOR,
  FACET_KEY_MIN_LENGTH,
  FACET_KEY_MAX_LENGTH,
  FACET_KEY_MAX_SEGMENT_LENGTH,
  FACET_KEY_MIN_SEGMENTS,
  FACET_KEY_MAX_SEGMENTS,
  FACET_KEY_SEGMENT_START_PATTERN,
  FACET_KEY_SEGMENT_FULL_PATTERN,
  FACET_KEY_ERROR_CODES,
  type FacetKeyErrorCode,
  FacetKeyValidationError,
  type FacetKeyParseResult,
  FacetKey,

  // Facet Base Contract and validation
  FACET_ERROR_CODES,
  type FacetErrorCode,
  FacetValidationError,
  type Facet,
  type FacetBaseParseResult,
  validateFacetBase,
  isFacet,
  parseFacetBase,
  tryParseFacetBase,
} from './facets/index.js';

// ─── Diagnostics Model (SK-11) ───────────────────────────────────────────────
export {
  // Severity
  DiagnosticSeverities,
  type DiagnosticSeverity,
  RECOGNIZED_SEVERITIES,
  DIAGNOSTIC_SEVERITY_ERROR_CODES,
  type DiagnosticSeverityErrorCode,
  DiagnosticSeverityValidationError,
  isDiagnosticSeverity,
  parseDiagnosticSeverity,

  // Code
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

  // Location
  type SourcePosition,
  DIAGNOSTIC_LOCATION_ERROR_CODES,
  type DiagnosticLocationErrorCode,
  DiagnosticLocationValidationError,
  type DiagnosticLocation,
  validateSourcePosition,
  validateDiagnosticLocation,

  // Diagnostic Contract, Factory, Validation, and Serialization
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

  // Collections and Helpers
  type DiagnosticCollection,
  createDiagnosticCollection,
  emptyDiagnosticCollection,
  hasErrors,
  hasWarnings,
  combineDiagnostics,

  // Legacy ARC-01 compatibility exports
  type DiagnosticResult,
  createDiagnosticResult,
  emptyDiagnosticResult,
} from './diagnostics/index.js';

/**
 * Platform metadata constant — read-only kernel identity.
 * This is NOT a runtime service; it is a static compile-time declaration.
 */
export const KERNEL_VERSION = '0.1.0' as const;
export const PLATFORM_NAME =
  'Model-Driven Enterprise Ecosystem Platform' as const;
