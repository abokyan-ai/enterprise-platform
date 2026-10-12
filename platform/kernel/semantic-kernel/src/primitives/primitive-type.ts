/**
 * @file primitive-type.ts
 * @module @ecosystem/semantic-kernel/primitives
 *
 * SK-09 §A–B: Authoritative Primitive Type Taxonomy.
 *
 * Establishes the closed, canonical set of foundational semantic value
 * categories. Each code identifies *what kind* of value a primitive
 * represents — not a field definition, not a SemanticElementKind, not a
 * runtime data type, and not a database column type.
 *
 * Architectural Invariants:
 * - PrimitiveType ≠ SemanticElementKind.  'TYPE' classifies a semantic
 *   definition; 'STRING' identifies a foundational value category.
 * - PrimitiveType ≠ TypeDefinition.  Primitives are built-in; authored
 *   TypeDefinitions are future semantic model artifacts.
 * - PrimitiveType ≠ RuntimeValidation.  These codes carry no constraints.
 * - Closed taxonomy: runtime-extensible type registries are not provided.
 * - Pure TypeScript: zero external dependencies, browser- and Node-safe.
 */

import { SemanticKernelError } from '../semantic-id.js';

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

/**
 * Canonical, frozen map of all built-in primitive type codes.
 *
 * Codes are UPPER_SNAKE_CASE string literals used as discriminants in the
 * PrimitiveValue union and as interchange type identifiers.
 *
 * Future candidates (BINARY, UUID, DURATION, INSTANT, LOCAL_DATETIME) are
 * intentionally excluded until their semantics are fully established.
 * See ADR-017.
 */
export const PrimitiveTypes = Object.freeze({
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  INTEGER: 'INTEGER',
  DECIMAL: 'DECIMAL',
  DATE: 'DATE',
  TIME: 'TIME',
  DATETIME: 'DATETIME',
} as const);

/**
 * Union of all canonical built-in primitive type codes.
 * Derives exclusively from PrimitiveTypes; do not extend with arbitrary strings.
 */
export type PrimitiveType =
  (typeof PrimitiveTypes)[keyof typeof PrimitiveTypes];

// Pre-computed membership set for O(1) runtime membership checks.
const RECOGNIZED_PRIMITIVE_TYPES: ReadonlySet<string> = new Set<string>(
  Object.values(PrimitiveTypes),
);

// ─── Error infrastructure ─────────────────────────────────────────────────────

export const PRIMITIVE_TYPE_ERROR_CODES = Object.freeze({
  NON_STRING: 'PRIMITIVE_TYPE_NON_STRING',
  EMPTY: 'PRIMITIVE_TYPE_EMPTY',
  WHITESPACE: 'PRIMITIVE_TYPE_WHITESPACE',
  UNKNOWN: 'PRIMITIVE_TYPE_UNKNOWN',
} as const);

export type PrimitiveTypeErrorCode =
  (typeof PRIMITIVE_TYPE_ERROR_CODES)[keyof typeof PRIMITIVE_TYPE_ERROR_CODES];

/**
 * Structured validation error for primitive type code failures.
 * Extends the established SemanticKernelError convention.
 */
export class PrimitiveTypeValidationError extends SemanticKernelError {
  public override readonly code: PrimitiveTypeErrorCode;

  public constructor(code: PrimitiveTypeErrorCode, message: string) {
    super(message, code);
    this.name = 'PrimitiveTypeValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Validation helpers ───────────────────────────────────────────────────────

/**
 * Runtime type guard: returns true iff `value` is one of the recognized
 * canonical PrimitiveType codes (exact case, no trimming, no coercion).
 */
export function isPrimitiveType(value: unknown): value is PrimitiveType {
  return typeof value === 'string' && RECOGNIZED_PRIMITIVE_TYPES.has(value);
}

/**
 * Validates and returns the canonical primitive type code.
 *
 * Rules (all strictly enforced, no silent normalization):
 * - Input must be a string primitive.
 * - Input must not be empty.
 * - Input must not contain whitespace.
 * - Input must be an exact member of the recognized taxonomy.
 *
 * @throws PrimitiveTypeValidationError on any violation.
 */
export function parsePrimitiveType(value: unknown): PrimitiveType {
  if (typeof value !== 'string') {
    throw new PrimitiveTypeValidationError(
      PRIMITIVE_TYPE_ERROR_CODES.NON_STRING,
      'PrimitiveType code must be a string primitive.',
    );
  }
  if (value.length === 0) {
    throw new PrimitiveTypeValidationError(
      PRIMITIVE_TYPE_ERROR_CODES.EMPTY,
      'PrimitiveType code must not be empty.',
    );
  }
  if (/\s/.test(value)) {
    throw new PrimitiveTypeValidationError(
      PRIMITIVE_TYPE_ERROR_CODES.WHITESPACE,
      'PrimitiveType code must not contain whitespace.',
    );
  }
  if (!RECOGNIZED_PRIMITIVE_TYPES.has(value)) {
    throw new PrimitiveTypeValidationError(
      PRIMITIVE_TYPE_ERROR_CODES.UNKNOWN,
      `Unrecognized primitive type code. Expected one of: ${[...RECOGNIZED_PRIMITIVE_TYPES].join(', ')}.`,
    );
  }
  return value as PrimitiveType;
}
