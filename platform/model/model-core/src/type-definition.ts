/**
 * @file type-definition.ts
 * @module @ecosystem/model-core
 *
 * Bridge and re-export barrel for TypeDefinition, FieldDefinition, and legacy model-core types.
 * Re-exports canonical TYPE-01 and TYPE-02 contracts from `./types/index.js`.
 */

import { type SemanticId } from '@ecosystem/semantic-kernel';

// ─── Legacy ARC-01 types preserved for test harness backward compatibility ───
export type PrimitiveKind =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'decimal'
  | 'integer'
  | 'uuid'
  | 'blob'
  | 'json';

export interface TypeRef {
  readonly targetId: SemanticId;
  readonly isNullable?: boolean;
  readonly isList?: boolean;
}

export type LegacyFieldType =
  | { readonly kind: 'primitive'; readonly primitiveKind: PrimitiveKind }
  | { readonly kind: 'ref'; readonly ref: TypeRef };

export interface LegacyFieldDefinition {
  readonly semanticId: SemanticId;
  readonly kind: 'field';
  readonly name?: string;
  readonly fieldType: LegacyFieldType;
  readonly required?: boolean;
  readonly defaultValue?: unknown;
}

// ─── Canonical TYPE-01 and TYPE-02 contracts ──────────────────────────────────
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
