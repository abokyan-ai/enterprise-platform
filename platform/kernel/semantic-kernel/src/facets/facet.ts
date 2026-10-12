/**
 * @file facet.ts
 * @module @ecosystem/semantic-kernel/facets
 *
 * SK-10: Facet Base Contract.
 *
 * Establishes the minimal, immutable, strongly typed, and framework-independent
 * base contract for semantic facets. A Facet expresses one explicitly identified
 * orthogonal aspect of a definition through composition rather than universal
 * base-class expansion or untyped metadata bags.
 *
 * Architectural Invariants:
 * 1. Composition over Inheritance: Semantic definitions compose orthogonal facets.
 * 2. Minimal Base Contract: The base contract carries only the immutable discriminant (`kind`).
 * 3. Type-Safe Specialization: Specific facets extend `Facet<TKind>` with strongly typed fields.
 * 4. Missing ≠ Null ≠ Value: Absence of a facet means the aspect is undeclared. No default facets.
 * 5. Distinct Concepts:
 *    - Facet ≠ SemanticElement (no independent identity, no SemanticElementId).
 *    - Facet ≠ SemanticElementKind (aspect category, not element definition type).
 *    - Facet ≠ PrimitiveType (aspect categorization, not scalar value type).
 *    - Facet ≠ ElementRef (does not automatically resolve model references).
 * 6. Pure Semantic Data:
 *    - No execution engine (`facet.execute()` is forbidden).
 *    - No runtime evaluation (no policy/rule execution in Kernel).
 *    - No compiler dispatch (does not generate IR or runtime artifacts).
 *    - No persistence mapping (no database/ORM decorators).
 *    - No presentation coupling (no Angular/PrimeNG dependencies).
 *    - No authorization inference (facet keys never grant access privileges).
 * 7. Pure TypeScript: Universal browser and Node.js portability, zero external dependencies.
 */

import { SemanticKernelError } from '../semantic-id.js';
import { FacetKey, FacetKeyValidationError } from './facet-key.js';

/**
 * Structured validation error codes for Facet failures.
 */
export const FACET_ERROR_CODES = {
  NON_OBJECT: 'FACET_NON_OBJECT',
  MISSING_DISCRIMINANT: 'FACET_MISSING_DISCRIMINANT',
  INVALID_DISCRIMINANT: 'FACET_INVALID_DISCRIMINANT',
} as const;

export type FacetErrorCode =
  (typeof FACET_ERROR_CODES)[keyof typeof FACET_ERROR_CODES];

/**
 * Dedicated structured validation error for Facet failures.
 */
export class FacetValidationError extends SemanticKernelError {
  public override readonly code: FacetErrorCode;
  public readonly causeError?: FacetKeyValidationError;

  constructor(
    code: FacetErrorCode,
    message: string,
    causeError?: FacetKeyValidationError,
  ) {
    super(message, code);
    this.name = 'FacetValidationError';
    this.code = code;
    this.causeError = causeError;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * The foundational base contract for any semantic facet recognized by the platform.
 *
 * Minimal by design: contains only the explicit, immutable discriminant (`kind`).
 * Specialized concrete facets extend this contract by specifying their literal
 * kind and declaring their own strongly typed properties.
 *
 * @typeParam TKind - The string literal category identifying the facet (conforming to FacetKey grammar).
 *
 * @example
 * ```typescript
 * // Type-safe specialization pattern:
 * export interface DocumentationFacet extends Facet<'core.documentation'> {
 *   readonly text: string;
 * }
 *
 * export interface RequiredFacet extends Facet<'validation.required'> {
 *   readonly message?: string;
 * }
 * ```
 */
export interface Facet<TKind extends string = string> {
  /**
   * The explicit, stable semantic facet discriminator identifying the aspect category.
   * Conforms to the canonical FacetKey grammar (e.g., 'core.documentation', 'validation.required').
   */
  readonly kind: TKind;
}

/**
 * Discriminated result type for non-throwing base facet parsing.
 */
export type FacetBaseParseResult =
  | { readonly ok: true; readonly value: Facet }
  | { readonly ok: false; readonly error: FacetValidationError };

/**
 * Validates the base structural contract of a candidate Facet object.
 *
 * Checks:
 * 1. Value must be a non-null object (and not an array).
 * 2. Object must possess an explicit 'kind' string property.
 * 3. The 'kind' string must conform strictly to the FacetKey grammar.
 *
 * Note: Validating the base contract confirms structural compliance with the
 * platform facet baseline; it does NOT validate concrete specialized payload fields.
 *
 * @param value - Untrusted candidate input.
 * @returns `null` if valid, or a `FacetValidationError` if invalid.
 */
export function validateFacetBase(value: unknown): FacetValidationError | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return new FacetValidationError(
      FACET_ERROR_CODES.NON_OBJECT,
      `Facet must be a non-null object, received ${value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}.`,
    );
  }

  const record = value as Record<string, unknown>;

  if (!('kind' in record)) {
    return new FacetValidationError(
      FACET_ERROR_CODES.MISSING_DISCRIMINANT,
      'Facet object is missing required "kind" discriminant property.',
    );
  }

  const kindVal = record['kind'];

  if (typeof kindVal !== 'string') {
    return new FacetValidationError(
      FACET_ERROR_CODES.INVALID_DISCRIMINANT,
      `Facet "kind" property must be a string, received ${typeof kindVal}.`,
    );
  }

  const keyResult = FacetKey.tryParse(kindVal);
  if (!keyResult.ok) {
    return new FacetValidationError(
      FACET_ERROR_CODES.INVALID_DISCRIMINANT,
      `Facet "kind" property "${kindVal}" is not a valid FacetKey: ${keyResult.error.message}`,
      keyResult.error,
    );
  }

  return null;
}

/**
 * Strict type guard verifying whether a value satisfies the base Facet contract.
 *
 * Rejects arbitrary objects, unkeyed payloads, non-string discriminants,
 * and strings that violate the FacetKey grammar.
 */
export function isFacet(value: unknown): value is Facet {
  return validateFacetBase(value) === null;
}

/**
 * Strictly parses and validates a raw input as conforming to the base Facet contract.
 * Throws `FacetValidationError` if validation fails.
 */
export function parseFacetBase(raw: unknown): Facet {
  const error = validateFacetBase(raw);
  if (error) {
    throw error;
  }

  const record = raw as Record<string, unknown>;
  return Object.freeze({
    kind: record['kind'] as string,
  });
}

/**
 * Non-throwing parse method returning a typed discriminated union.
 */
export function tryParseFacetBase(raw: unknown): FacetBaseParseResult {
  const error = validateFacetBase(raw);
  if (error) {
    return { ok: false, error };
  }

  const record = raw as Record<string, unknown>;
  return {
    ok: true,
    value: Object.freeze({
      kind: record['kind'] as string,
    }),
  };
}
