/**
 * @file semantic-element-kind.ts
 * @module @ecosystem/semantic-kernel
 *
 * SK-06: Closed classification of semantic definitions.
 * Preserves the nine lowercase codes named by the ARC-01 bootstrap contract.
 * Recognition declares a category, not compiler, runtime, or storage support.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero external dependencies.
 */

import { SemanticKernelError } from '../semantic-id.js';

/**
 * The immutable SK-06 baseline. Property names are API constants; their
 * lowercase values are the canonical, case-sensitive interchange codes.
 * Business concepts and future candidate categories are not built-in kinds.
 */
export const SemanticElementKinds = Object.freeze({
  TYPE: 'type',
  FIELD: 'field',
  RELATIONSHIP: 'relationship',
  ACTION: 'action',
  EVENT: 'event',
  CAPABILITY: 'capability',
  FACET: 'facet',
  NAMESPACE: 'namespace',
  APPLICATION: 'application',
} as const);

/** A semantic definition category from the closed, platform-owned baseline. */
export type SemanticElementKind =
  (typeof SemanticElementKinds)[keyof typeof SemanticElementKinds];

// Derived from the single authoritative declaration, never registered at runtime.
const recognizedKindValues: readonly SemanticElementKind[] = Object.freeze(
  Object.values(SemanticElementKinds),
);

/** Structured failures using the existing SemanticKernelError convention. */
export const SEMANTIC_ELEMENT_KIND_ERROR_CODES = Object.freeze({
  NON_STRING: 'SEMANTIC_ELEMENT_KIND_NON_STRING',
  UNKNOWN_KIND: 'SEMANTIC_ELEMENT_KIND_UNKNOWN_KIND',
} as const);

export type SemanticElementKindErrorCode =
  (typeof SEMANTIC_ELEMENT_KIND_ERROR_CODES)[keyof typeof SEMANTIC_ELEMENT_KIND_ERROR_CODES];

/** Controlled error for inputs outside the canonical classification contract. */
export class SemanticElementKindValidationError extends SemanticKernelError {
  public override readonly code: SemanticElementKindErrorCode;

  public constructor(code: SemanticElementKindErrorCode, message: string) {
    super(message, code);
    this.name = 'SemanticElementKindValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Checks exact membership without trimming, case folding, or coercion.
 * Safe for unknown values, including objects with custom coercion methods.
 */
export function isSemanticElementKind(
  value: unknown,
): value is SemanticElementKind {
  return (
    typeof value === 'string' &&
    recognizedKindValues.some((kind) => kind === value)
  );
}

/**
 * Validates an external value and returns its unchanged canonical string.
 * Equality uses strict string equality; JSON serialization uses native strings.
 *
 * @throws SemanticElementKindValidationError for non-strings or unknown codes.
 */
export function parseSemanticElementKind(value: unknown): SemanticElementKind {
  if (typeof value !== 'string') {
    throw new SemanticElementKindValidationError(
      SEMANTIC_ELEMENT_KIND_ERROR_CODES.NON_STRING,
      'SemanticElementKind input must be a string primitive.',
    );
  }

  if (!isSemanticElementKind(value)) {
    throw new SemanticElementKindValidationError(
      SEMANTIC_ELEMENT_KIND_ERROR_CODES.UNKNOWN_KIND,
      `Unrecognized semantic element kind. Expected one of: ${recognizedKindValues.join(', ')}.`,
    );
  }

  return value;
}
