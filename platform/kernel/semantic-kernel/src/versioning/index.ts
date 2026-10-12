/** Internal barrel; consumers use the approved @ecosystem/semantic-kernel root. */
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
} from './semantic-version.js';

export {
  ElementVersionRef,
  type ElementVersionRefJSON,
  ElementVersionRefValidationError,
  type ElementVersionRefErrorCode,
  ELEMENT_VERSION_REF_ERROR_CODES,
} from './element-version-ref.js';
