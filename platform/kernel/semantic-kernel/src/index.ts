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

// ─── Element Contract (SK-05) ────────────────────────────────────────────────
export {
  type SemanticElement,
  type CreateSemanticElementParams,
  createSemanticElement,
  isSemanticElement,
  SemanticElementValidationError,
  type SemanticElementErrorCode,
  SEMANTIC_ELEMENT_ERROR_CODES,
} from './elements/index.js';

// Legacy metadata stubs from ARC-01 (pending SK-06 kind taxonomy & SK-10 facets)
export {
  type SemanticElementKind,
  type SemanticElementMetadata,
} from './semantic-element.js';

// ─── Version Reference ────────────────────────────────────────────────────────
export {
  type VersionRef,
  parseVersion,
  formatVersion,
  compareVersions,
} from './version-ref.js';

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
export const PLATFORM_NAME = 'Model-Driven Enterprise Ecosystem Platform' as const;
