/**
 * @file authoring-element.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Authoring Element Union and Discriminators.
 *
 * Defines the top-level declaration categories permitted within an AuthoringDocument.
 * In this milestone, semantic types (kind: 'type') are the authoritative supported category.
 *
 * Architectural Invariants:
 * 1. Discriminated Union:
 *    Each declaration has an explicit `kind` discriminant.
 * 2. Strict Category Boundaries:
 *    Only supported categories are permitted. Unsupported categories (e.g. actions,
 *    events, workflows) are rejected deterministically without speculative stubbing.
 * 3. Pure TypeScript:
 *    Zero external framework dependencies. Universal portability.
 */

import {
  type AuthoringTypeDeclaration,
  type AuthoringTypeDeclarationJSON,
  isAuthoringTypeDeclaration,
} from './authoring-type.js';

/**
 * Union of all supported declaration kinds in an AuthoringDocument.
 */
export type AuthoringElementKind = 'type';

/**
 * Union of all supported authoring declarations.
 */
export type AuthoringElement = AuthoringTypeDeclaration;

/**
 * Wire-safe JSON interchange union for AuthoringElement.
 */
export type AuthoringElementJSON = AuthoringTypeDeclarationJSON;

/**
 * Type guard verifying whether a candidate value conforms to AuthoringElement.
 *
 * @param value Candidate value to test.
 * @returns True if value is a recognized AuthoringElement.
 */
export function isAuthoringElement(value: unknown): value is AuthoringElement {
  return isAuthoringTypeDeclaration(value);
}
