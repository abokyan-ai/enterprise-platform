/**
 * @file index.ts
 * @module @ecosystem/model-core
 *
 * Public API barrel for @ecosystem/model-core.
 * Consumers must import ONLY from '@ecosystem/model-core' — never from internal paths.
 *
 * Architecture: layer:model — depends only on @ecosystem/semantic-kernel.
 */

// ─── TYPE-01: Foundational TypeDefinition Contract ───────────────────────────
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
} from './types/index.js';

// ─── TYPE-02: Foundational FieldDefinition & FieldType Contracts ──────────────
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
} from './types/index.js';

// ─── Legacy Model Core Types (ARC-01 compatibility) ──────────────────────────
export {
  type PrimitiveKind,
  type TypeRef,
  type LegacyFieldType,
  type LegacyFieldDefinition,
} from './type-definition.js';

// ─── Re-export kernel types needed by model consumers ─────────────────────────
export type {
  SemanticId,
  SemanticElement,
  SemanticElementMetadata,
  SemanticElementId,
  QualifiedName,
  SemanticContextRef,
  SemanticVersion,
  ElementVersionRef,
  ElementRef,
  PrimitiveType,
} from '@ecosystem/semantic-kernel';
