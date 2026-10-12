/**
 * @file semantic-element.ts
 * @module @ecosystem/semantic-kernel
 *
 * The minimal contract for any identifiable semantic model node.
 * SemanticElement is broader than SemanticType — it is the generalized
 * identifiable base unit of the semantic meta-model.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero framework dependencies.
 */

import { SemanticId } from './semantic-id.js';

/**
 * The kind classification of a semantic element.
 * Extensible via discriminated unions in upper layers.
 */
export type SemanticElementKind =
  | 'type'
  | 'field'
  | 'relationship'
  | 'action'
  | 'event'
  | 'capability'
  | 'facet'
  | 'namespace'
  | 'application'
  | string;

/**
 * Minimal metadata attached to every semantic element.
 * All fields are optional to keep the kernel small.
 */
export interface SemanticElementMetadata {
  readonly label?: string;
  readonly description?: string;
  readonly tags?: ReadonlyArray<string>;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

/**
 * The core contract for any identifiable node in the semantic meta-model.
 *
 * Rule (from AGENTS.md):
 * - SemanticElement is the generalized identifiable base unit.
 * - SemanticType is a specialized typing/classification element.
 * - Never use them interchangeably.
 */
export interface SemanticElement {
  /** Globally unique, platform-independent identity. */
  readonly semanticId: SemanticId;

  /** The kind of semantic element this node represents. */
  readonly kind: SemanticElementKind;

  /** Optional metadata: labels, descriptions, tags, timestamps. */
  readonly metadata?: SemanticElementMetadata;
}

/**
 * Type guard to check if a value conforms to the SemanticElement contract.
 */
export function isSemanticElement(value: unknown): value is SemanticElement {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj['semanticId'] === 'string' && typeof obj['kind'] === 'string';
}
