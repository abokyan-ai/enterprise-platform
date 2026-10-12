/**
 * @file type-definition.ts
 * @module @ecosystem/model-core
 *
 * TypeDefinition — the authoring-time representation of a semantic type.
 * This is a DEFINITION (design-time metadata), not an INSTANCE (entity state).
 *
 * Architecture: layer:model — depends only on @ecosystem/semantic-kernel.
 * FORBIDDEN: NestJS, Angular, PrimeNG, Runtime, Compiler, Database, HTTP.
 */

import {
  type SemanticElement,
  type SemanticId,
  type SemanticElementMetadata,
} from '@ecosystem/semantic-kernel';

/**
 * The primitive scalar types available in the semantic type system.
 */
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

/**
 * A reference to another semantic type by its SemanticId.
 */
export interface TypeRef {
  readonly targetId: SemanticId;
  readonly isNullable?: boolean;
  readonly isList?: boolean;
}

/**
 * The type of a field: either a primitive scalar or a reference to another type.
 */
export type FieldType =
  | { readonly kind: 'primitive'; readonly primitiveKind: PrimitiveKind }
  | { readonly kind: 'ref'; readonly ref: TypeRef };

/**
 * A field definition within a TypeDefinition.
 * Fields are components of a type — composition over inheritance.
 */
export interface FieldDefinition extends SemanticElement {
  readonly kind: 'field';
  readonly fieldType: FieldType;
  readonly required?: boolean;
  readonly defaultValue?: unknown;
}

/**
 * A TypeDefinition represents an authoring-time semantic type.
 *
 * AGENTS.md Rule 6:
 * - Definition = immutable design-time metadata.
 * - Instance = stateful entity record.
 * These must remain architecturally distinct.
 */
export interface TypeDefinition extends SemanticElement {
  readonly kind: 'type';
  readonly namespace: string;
  readonly fields: ReadonlyArray<FieldDefinition>;
  readonly metadata?: SemanticElementMetadata;
}

/**
 * Creates a minimal TypeDefinition.
 * Validates that the semanticId and namespace are non-empty.
 */
export function createTypeDefinition(params: {
  semanticId: SemanticId;
  namespace: string;
  fields?: FieldDefinition[];
  metadata?: SemanticElementMetadata;
}): TypeDefinition {
  if (!params.namespace || params.namespace.trim().length === 0) {
    throw new Error('TypeDefinition namespace cannot be empty');
  }
  return {
    semanticId: params.semanticId,
    kind: 'type',
    namespace: params.namespace.trim(),
    fields: Object.freeze([...(params.fields ?? [])]),
    metadata: params.metadata,
  };
}
