/**
 * @file index.ts
 * @module @ecosystem/model-core/facets
 *
 * Internal barrel for the TYPE-03 model facets subsystem.
 * Consumers must import from the root @ecosystem/model-core barrel.
 */

export {
  DATA_FACET_KIND,
  type DataFacetKind,
  DATA_FACET_ERROR_CODES,
  type DataFacetErrorCode,
  DataFacetValidationError,
  type DataFacet,
  type CreateDataFacetParams,
  type DataFacetJSON,
  type DataFacetParseResult,
  isDataFacet,
  createDataFacet,
  sameDataFacetOwner,
  sameExactDataFacet,
  serializeDataFacet,
  parseDataFacet,
  tryParseDataFacet,
} from './data-facet.js';
