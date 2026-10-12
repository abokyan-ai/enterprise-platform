/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel/naming
 *
 * Internal barrel export for semantic naming primitives (SK-02).
 */

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
} from './namespace.js';

export {
  QualifiedName,
  type QualifiedNameParseResult,
  QualifiedNameValidationError,
  type QualifiedNameErrorCode,
  LOCAL_NAME_MAX_LENGTH,
  QUALIFIED_NAME_MAX_LENGTH,
  LOCAL_NAME_START_PATTERN,
  LOCAL_NAME_FULL_PATTERN,
} from './qualified-name.js';
