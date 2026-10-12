/**
 * @file type-definition.ts
 * @module @ecosystem/model-core
 *
 * Bridge and re-export barrel for TypeDefinition and legacy model-core types.
 * Re-exports canonical TYPE-01 contracts from `./types/index.js`.
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

export type FieldType =
  | { readonly kind: 'primitive'; readonly primitiveKind: PrimitiveKind }
  | { readonly kind: 'ref'; readonly ref: TypeRef };

export interface FieldDefinition {
  readonly semanticId: SemanticId;
  readonly kind: 'field';
  readonly fieldType: FieldType;
  readonly required?: boolean;
  readonly defaultValue?: unknown;
}

// ─── Canonical TYPE-01 TypeDefinition contracts ──────────────────────────────
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
