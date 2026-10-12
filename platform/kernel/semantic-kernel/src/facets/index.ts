/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel/facets
 *
 * Internal barrel for the SK-10 facets subsystem.
 * Consumers must import from the root @ecosystem/semantic-kernel barrel.
 */

// ─── Facet Key Value Object and Grammar ───
export {
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
} from './facet-key.js';

// ─── Facet Base Contract and Validation ───
export {
  FACET_ERROR_CODES,
  type FacetErrorCode,
  FacetValidationError,
  type Facet,
  type FacetBaseParseResult,
  validateFacetBase,
  isFacet,
  parseFacetBase,
  tryParseFacetBase,
} from './facet.js';
