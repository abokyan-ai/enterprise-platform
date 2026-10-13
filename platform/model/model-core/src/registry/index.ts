/** Public TYPE-07 registry API. */
export {
  TYPE_REGISTRY_ERROR_CODES,
  TypeRegistryValidationError,
  createTypeRegistry,
  type TypeRegistryErrorCode,
  type CreateTypeRegistryParams,
  type TypeRegistry,
  type TypeRegistryNameLookup,
  type TypeRegistryNameVersionLookup,
} from './type-registry.js';
export {
  TypeRegistryLookupStatuses,
  createTypeRegistryLookupResult,
  type TypeRegistryLookupStatus,
  type TypeRegistryLookupResult,
  type TypeRegistryFoundResult,
  type TypeRegistryNotFoundResult,
  type TypeRegistryAmbiguousResult,
} from './type-registry-result.js';
