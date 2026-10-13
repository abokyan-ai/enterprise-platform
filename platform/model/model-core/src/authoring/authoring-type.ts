/**
 * @file authoring-type.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Authoring Type Declaration Contracts.
 *
 * Defines the structural representation of authored semantic TypeDefinitions,
 * preserving authoritative TYPE-01 identity, TYPE-02 field, TYPE-03 facet,
 * TYPE-04 constraint, and TYPE-05 reference semantics.
 *
 * Architectural Invariants:
 * 1. Authoring DTO ≠ Competing Meta-Model:
 *    AuthoringTypeDeclaration is a serialization-friendly, portable structural
 *    representation preserving authoritative Semantic Kernel and Type System contracts.
 * 2. Exact Semantic Identity Preservation:
 *    Preserves exact SemanticElementId (SK-01), QualifiedName (SK-03),
 *    SemanticContextRef (SK-04), and exact SemanticVersion (SK-07).
 * 3. No Hidden Semantic Defaults:
 *    No implicit generation of missing element IDs, no fallback namespaces,
 *    and no automatic version increments.
 * 4. Pure TypeScript:
 *    Zero external framework dependencies. Universal portability.
 */

import type { TypeDefinitionJSON } from '../types/type-definition.js';
import type { FieldDefinitionJSON } from '../types/field-definition.js';
import type { DataFacetJSON } from '../facets/data-facet.js';
import type {
  FieldConstraintJSON,
  FieldConstraintSetJSON,
} from '../constraints/index.js';
import type { TypeReferenceJSON } from '../types/type-reference.js';

/**
 * Structural contract representing an authored TypeDefinition declaration.
 *
 * Encapsulates the core type metadata (TYPE-01), optional data structure facet (TYPE-03),
 * and optional field constraint sets (TYPE-04).
 */
export interface AuthoringTypeDeclaration {
  /** Fixed declaration category discriminator */
  readonly kind: 'type';

  /** Authoritative TYPE-01 serialized TypeDefinition payload */
  readonly definition: TypeDefinitionJSON;

  /** Optional authored DataFacet (TYPE-03) */
  readonly dataFacet?: DataFacetJSON;

  /** Optional authored FieldConstraintSets (TYPE-04) */
  readonly constraints?: readonly FieldConstraintSetJSON[];
}

/**
 * Wire-safe JSON interchange shape for AuthoringTypeDeclaration.
 */
export type AuthoringTypeDeclarationJSON = AuthoringTypeDeclaration;

/**
 * Alias for AuthoringTypeDeclaration per MOD-01 contract taxonomy.
 */
export type AuthoringTypeDefinition = AuthoringTypeDeclaration;

/**
 * Alias for authored FieldDefinition representation (TYPE-02).
 */
export type AuthoringFieldDefinition = FieldDefinitionJSON;

/**
 * Alias for authored DataFacet representation (TYPE-03).
 */
export type AuthoringDataFacet = DataFacetJSON;

/**
 * Alias for authored FieldConstraint representation (TYPE-04).
 */
export type AuthoringFieldConstraint = FieldConstraintJSON;

/**
 * Alias for authored TypeReference representation (TYPE-05).
 */
export type AuthoringTypeReference = TypeReferenceJSON;

/**
 * Type guard verifying whether a candidate value conforms to AuthoringTypeDeclaration.
 *
 * @param value Candidate value to test.
 * @returns True if value is an object with kind === 'type' and a definition object.
 */
export function isAuthoringTypeDeclaration(
  value: unknown,
): value is AuthoringTypeDeclaration {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (candidate['kind'] !== 'type') {
    return false;
  }
  const def = candidate['definition'];
  if (def === null || typeof def !== 'object' || Array.isArray(def)) {
    return false;
  }
  const defRecord = def as Record<string, unknown>;
  return (
    typeof defRecord['id'] === 'string' &&
    typeof defRecord['qualifiedName'] === 'string' &&
    typeof defRecord['contextRef'] === 'string' &&
    defRecord['kind'] === 'type' &&
    typeof defRecord['version'] === 'string'
  );
}

/**
 * Type guard alias for AuthoringTypeDefinition.
 */
export const isAuthoringTypeDefinition = isAuthoringTypeDeclaration;
