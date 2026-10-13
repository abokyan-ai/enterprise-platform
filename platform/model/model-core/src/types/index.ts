/**
 * @file index.ts
 * @module @ecosystem/model-core/types
 *
 * Internal barrel for the TYPE-01 and TYPE-02 model types subsystem.
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

export {
  FIELD_DEFINITION_ERROR_CODES,
  type FieldDefinitionErrorCode,
  FieldDefinitionValidationError,
  type PrimitiveFieldType,
  type ReferencedFieldType,
  type FieldType,
  type FieldTypeJSON,
  createPrimitiveFieldType,
  createReferencedFieldType,
  isPrimitiveFieldType,
  isReferencedFieldType,
  isFieldType,
  equalsFieldType,
  serializeFieldType,
  parseFieldType,
  type FieldDefinition,
  type CreateFieldDefinitionParams,
  type LegacyCreateFieldDefinitionParams,
  type FieldDefinitionJSON,
  type FieldDefinitionParseResult,
  isFieldDefinition,
  createFieldDefinition,
  sameFieldIdentity,
  sameFieldOwner,
  sameExactFieldDefinition,
  serializeFieldDefinition,
  parseFieldDefinition,
  tryParseFieldDefinition,
} from './field-definition.js';

export {
  TYPE_REFERENCE_ERROR_CODES,
  type TypeReferenceErrorCode,
  TypeReferenceValidationError,
  type TypeReference,
  type TypeIdReference,
  type TypeNameReference,
  type CreateTypeIdReferenceParams,
  type CreateTypeNameReferenceParams,
  type TypeReferenceJSON,
  type TypeReferenceParseResult,
  isTypeReference,
  isTypeIdReference,
  isTypeNameReference,
  createTypeReferenceById,
  createTypeReferenceByName,
  equalsTypeReference,
  serializeTypeReference,
  parseTypeReference,
  tryParseTypeReference,
  describeTypeReference,
} from './type-reference.js';
