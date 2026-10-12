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

import type { SemanticId } from './semantic-id.js';
import {
  isSemanticElementKind,
  type SemanticElementKind,
} from './elements/semantic-element-kind.js';

/**
 * Retain the legacy internal type export while sharing the closed SK-06
 * classification. No second taxonomy or arbitrary-string escape hatch.
 */
export type { SemanticElementKind } from './elements/semantic-element-kind.js';

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
  return (
    typeof obj['semanticId'] === 'string' && isSemanticElementKind(obj['kind'])
  );
}
