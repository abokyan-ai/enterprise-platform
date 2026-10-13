/**
 * @file field-constraint-kind.ts
 * @module @ecosystem/model-core/constraints
 *
 * TYPE-04: Canonical Field Constraint Kinds.
 *
 * Establishes the authoritative, closed taxonomy of supported declarative
 * field-level constraint categories.
 *
 * Architectural Invariants:
 * 1. FieldConstraintKind ≠ SemanticElementKind (SK-06): Classifies a restriction, NOT an element.
 * 2. FieldConstraintKind ≠ PrimitiveType (SK-09): Classifies a constraint, NOT a scalar value type.
 * 3. FieldConstraintKind ≠ FacetKey (SK-10): Categorizes a field constraint, NOT an element facet.
 * 4. Closed Baseline: Only mathematically sound, locally provable constraint categories are included.
 *    - PATTERN: Explicitly deferred pending safe, portable pattern grammar.
 *    - ALLOWED_VALUES: Explicitly deferred pending canonical typed literal set specification.
 *    - Relational, cross-field, unique, foreign-key, and executable rules are strictly excluded.
 * 5. String Literal Discriminants: Uses UPPER_SNAKE_CASE string literals (no numeric enums).
 */

/**
 * Authoritative taxonomy of implemented field constraint kinds in v0.
 */
export const FieldConstraintKinds = Object.freeze({
  MIN_LENGTH: 'MIN_LENGTH',
  MAX_LENGTH: 'MAX_LENGTH',
  MIN_VALUE: 'MIN_VALUE',
  MAX_VALUE: 'MAX_VALUE',
  PRECISION_SCALE: 'PRECISION_SCALE',
} as const);

/**
 * Union of all canonical field constraint kinds.
 */
export type FieldConstraintKind =
  (typeof FieldConstraintKinds)[keyof typeof FieldConstraintKinds];

/**
 * Pre-computed set of recognized constraint kinds for O(1) membership checks.
 */
const RECOGNIZED_CONSTRAINT_KINDS: ReadonlySet<string> = new Set<string>(
  Object.values(FieldConstraintKinds),
);

/**
 * Runtime type guard verifying whether an untrusted value is a recognized FieldConstraintKind.
 */
export function isFieldConstraintKind(value: unknown): value is FieldConstraintKind {
  return typeof value === 'string' && RECOGNIZED_CONSTRAINT_KINDS.has(value);
}

/**
 * Canonical text counting metric enforced for string length constraints.
 * Unicode code-point counting ensures portable, surrogate-pair-safe semantics.
 */
export const STRING_LENGTH_METRIC = 'UNICODE_CODE_POINT' as const;
export type StringLengthMetric = typeof STRING_LENGTH_METRIC;
