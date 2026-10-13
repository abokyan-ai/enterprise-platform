/** TYPE-07 lookup result contracts. */
import type { TypeDefinition } from '../types/type-definition.js';

export const TypeRegistryLookupStatuses = Object.freeze({
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  AMBIGUOUS: 'AMBIGUOUS',
} as const);

export type TypeRegistryLookupStatus =
  (typeof TypeRegistryLookupStatuses)[keyof typeof TypeRegistryLookupStatuses];

export interface TypeRegistryFoundResult {
  readonly status: typeof TypeRegistryLookupStatuses.FOUND;
  readonly definition: TypeDefinition;
  readonly candidates: readonly TypeDefinition[];
}
export interface TypeRegistryNotFoundResult {
  readonly status: typeof TypeRegistryLookupStatuses.NOT_FOUND;
  readonly candidates: readonly TypeDefinition[];
}
export interface TypeRegistryAmbiguousResult {
  readonly status: typeof TypeRegistryLookupStatuses.AMBIGUOUS;
  readonly candidates: readonly TypeDefinition[];
}
export type TypeRegistryLookupResult =
  | TypeRegistryFoundResult
  | TypeRegistryNotFoundResult
  | TypeRegistryAmbiguousResult;

/** No version-unspecified lookup selects a latest definition. */
export function createTypeRegistryLookupResult(
  candidates: readonly TypeDefinition[],
): TypeRegistryLookupResult {
  const immutableCandidates = Object.freeze([...candidates]);
  if (immutableCandidates.length === 0) {
    return Object.freeze({
      status: TypeRegistryLookupStatuses.NOT_FOUND,
      candidates: immutableCandidates,
    });
  }
  if (immutableCandidates.length === 1) {
    return Object.freeze({
      status: TypeRegistryLookupStatuses.FOUND,
      definition: immutableCandidates[0],
      candidates: immutableCandidates,
    });
  }
  return Object.freeze({
    status: TypeRegistryLookupStatuses.AMBIGUOUS,
    candidates: immutableCandidates,
  });
}
