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

// ─── Diagnostics ──────────────────────────────────────────────────────────────
export {
  type DiagnosticSeverity,
  type DiagnosticLocation,
  type Diagnostic,
  type DiagnosticResult,
  createDiagnosticResult,
  emptyDiagnosticResult,
} from './diagnostics.js';

/**
 * Platform metadata constant — read-only kernel identity.
 * This is NOT a runtime service; it is a static compile-time declaration.
 */
export const KERNEL_VERSION = '0.1.0' as const;
export const PLATFORM_NAME =
  'Model-Driven Enterprise Ecosystem Platform' as const;
