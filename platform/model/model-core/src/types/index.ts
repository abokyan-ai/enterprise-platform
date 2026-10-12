/**
 * @file index.ts
 * @module @ecosystem/model-core/types
 *
 * Internal barrel for the TYPE-01 TypeDefinition subsystem.
 * Consumers must import from the root @ecosystem/model-core barrel.
 */

export {
  TYPE_DEFINITION_ERROR_CODES,
  type TypeDefinitionErrorCode,
  TypeDefinitionValidationError,
  type TypeDefinition,
  type CreateTypeDefinitionParams,
  type LegacyCreateTypeDefinitionParams,
  type TypeDefinitionJSON,
  type TypeDefinitionParseResult,
  isTypeDefinition,
  createTypeDefinition,
  sameTypeIdentity,
  sameExactTypeVersion,
  serializeTypeDefinition,
  parseTypeDefinition,
  tryParseTypeDefinition,
} from './type-definition.js';
