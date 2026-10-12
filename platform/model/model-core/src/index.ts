/**
 * @public
 * Public API barrel for @ecosystem/model-core
 *
 * Consumers must import ONLY from '@ecosystem/model-core' — never from internal paths.
 *
 * Architecture: layer:model — depends only on @ecosystem/semantic-kernel.
 */

// ─── Type Definitions ─────────────────────────────────────────────────────────
export {
  type PrimitiveKind,
  type TypeRef,
  type FieldType,
  type FieldDefinition,
  type TypeDefinition,
  createTypeDefinition,
} from './type-definition.js';

// ─── Re-export kernel types needed by model consumers ─────────────────────────
// Only kernel types that model consumers legitimately need
export type { SemanticId, SemanticElement, SemanticElementMetadata } from '@ecosystem/semantic-kernel';
