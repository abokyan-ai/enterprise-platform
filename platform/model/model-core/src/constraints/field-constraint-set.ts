/**
 * @file field-constraint-set.ts
 * @module @ecosystem/model-core/constraints
 *
 * TYPE-04: Immutable FieldConstraintSet and Field-Association Factory.
 *
 * Establishes the authoritative association between an authored FieldDefinition
 * (pinned by stable SemanticElementId and containing TypeDefinition ElementVersionRef)
 * and an immutable collection of declarative FieldConstraints.
 *
 * Architectural Invariants:
 * 1. Single Attachment Authority:
 *    - Constraints associate with a FieldDefinition via an explicit `FieldConstraintSet`.
 *    - The existing `FieldDefinition` (TYPE-02) and `DataFacet` (TYPE-03) contracts remain
 *      pure, minimal, and backward-compatible without breaking mutations.
 * 2. Stable Field Identity & Owner Pinning (SK-01, SK-07):
 *    - Identifies target field by `fieldId: SemanticElementId` and `ownerType: ElementVersionRef`.
 *    - Preserves exact owner version snapshot; zero automatic latest version inference.
 * 3. Local Consistency Invariants:
 *    - Singleton Cardinality: At most one constraint per singleton kind (MIN_LENGTH, MAX_LENGTH, etc.).
 *    - Contradiction Detection: Rejects MIN_LENGTH > MAX_LENGTH and MIN_VALUE > MAX_VALUE.
 *    - Applicability Validation: Verifies compatibility with field's primitive type.
 *    - Non-Resolution of References: Primitive constraints strictly rejected on referenced types.
 * 4. Immutability & Defensive Copying:
 *    - Caller collections are copied and frozen (`Object.freeze`).
 *    - Instance is deeply frozen.
 * 5. Clean Architecture: Layer:model depends only on Layer:kernel. Zero external dependencies.
 */

import {
  SemanticElementId,
  ElementVersionRef,
  type ElementVersionRefJSON,
} from '@ecosystem/semantic-kernel';

import {
  type FieldDefinition,
  isFieldDefinition,
} from '../types/field-definition.js';

import {
  type FieldConstraintKind,
  FieldConstraintKinds,
} from './field-constraint-kind.js';

import {
  type FieldConstraint,
  type FieldConstraintJSON,
  type MinLengthConstraint,
  type MaxLengthConstraint,
  type MinValueConstraint,
  type MaxValueConstraint,
  type PrecisionScaleConstraint,
  FIELD_CONSTRAINT_ERROR_CODES,
  FieldConstraintValidationError,
  isFieldConstraint,
  validateConstraintApplicability,
  equalsFieldConstraint,
  compareExactIntegers,
  compareExactDecimals,
  serializeFieldConstraint,
  parseFieldConstraint,
} from './field-constraint.js';

// ─── FieldConstraintSet Contract ──────────────────────────────────────────────

/**
 * An immutable, version-aware collection of declarative FieldConstraints associated
 * with a specific FieldDefinition snapshot.
 */
export interface FieldConstraintSet {
  /** The stable semantic identity of the constrained FieldDefinition (SK-01) */
  readonly fieldId: SemanticElementId;

  /** The exact containing TypeDefinition version snapshot ownership (SK-07) */
  readonly ownerType: ElementVersionRef;

  /** Ordered, frozen collection of declared constraints */
  readonly constraints: readonly FieldConstraint[];

  /** Total number of constraints in this set */
  readonly count: number;

  /** Checks whether a constraint of the given kind exists in this set */
  hasConstraint(kind: FieldConstraintKind): boolean;

  /** Retrieves a constraint by its kind, or undefined if not present */
  getConstraint<T extends FieldConstraint = FieldConstraint>(kind: FieldConstraintKind): T | undefined;

  /** Convenience helper returning owner ElementVersionRef */
  toElementVersionRef(): ElementVersionRef;
}

/**
 * Input parameters for creating a FieldConstraintSet.
 */
export interface CreateFieldConstraintSetParams {
  readonly fieldId: SemanticElementId;
  readonly ownerType: ElementVersionRef;
  readonly constraints?: readonly FieldConstraint[];
}

/**
 * Wire-safe JSON interchange shape for FieldConstraintSet.
 */
export interface FieldConstraintSetJSON {
  readonly fieldId: string;
  readonly ownerType: ElementVersionRefJSON;
  readonly constraints: readonly FieldConstraintJSON[];
}

/**
 * Discriminated result type for non-throwing parsing.
 */
export type FieldConstraintSetParseResult =
  | { readonly ok: true; readonly value: FieldConstraintSet }
  | { readonly ok: false; readonly error: FieldConstraintValidationError };

// ─── Concrete Immutable Implementation ────────────────────────────────────────

class ImmutableFieldConstraintSet implements FieldConstraintSet {
  public readonly fieldId: SemanticElementId;
  public readonly ownerType: ElementVersionRef;
  public readonly constraints: readonly FieldConstraint[];

  private readonly _byKind: Map<FieldConstraintKind, FieldConstraint>;

  constructor(
    fieldId: SemanticElementId,
    ownerType: ElementVersionRef,
    constraints: readonly FieldConstraint[],
  ) {
    this.fieldId = fieldId;
    this.ownerType = ownerType;
    this.constraints = Object.freeze([...constraints]);

    const byKind = new Map<FieldConstraintKind, FieldConstraint>();
    for (const constraint of this.constraints) {
      byKind.set(constraint.kind, constraint);
    }
    this._byKind = byKind;

    Object.freeze(this);
  }

  public get count(): number {
    return this.constraints.length;
  }

  public hasConstraint(kind: FieldConstraintKind): boolean {
    return this._byKind.has(kind);
  }

  public getConstraint<T extends FieldConstraint = FieldConstraint>(
    kind: FieldConstraintKind,
  ): T | undefined {
    return this._byKind.get(kind) as T | undefined;
  }

  public toElementVersionRef(): ElementVersionRef {
    return this.ownerType;
  }
}

// ─── Validation and Factory Functions ─────────────────────────────────────────

/**
 * Constructs an immutable FieldConstraintSet from explicit field identity and owner references.
 *
 * Invariants Enforced:
 * 1. `fieldId` must be an authentic SemanticElementId instance.
 * 2. `ownerType` must be an authentic ElementVersionRef instance.
 * 3. Every constraint must be an authentic FieldConstraint.
 * 4. Singleton Cardinality: Rejects duplicate constraints of the same kind.
 * 5. Length Coherence: Rejects MIN_LENGTH > MAX_LENGTH.
 * 6. Numeric Coherence: Rejects mismatched numeric types and MIN_VALUE > MAX_VALUE.
 * 7. Declaration order is preserved.
 * 8. Defensive copying guarantees deep immutability.
 *
 * @param params Construction parameters.
 * @returns Frozen, validated FieldConstraintSet instance.
 */
export function createFieldConstraintSet(
  params: CreateFieldConstraintSetParams,
): FieldConstraintSet {
  if (params === null || typeof params !== 'object') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.NON_OBJECT,
      'FieldConstraintSet creation requires a non-null parameters object.',
    );
  }

  // 1. Validate fieldId
  if (!('fieldId' in params) || params.fieldId === undefined || params.fieldId === null) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'FieldConstraintSet requires a fieldId property.',
    );
  }
  if (!(params.fieldId instanceof SemanticElementId)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'FieldConstraintSet fieldId must be an authentic SemanticElementId instance.',
    );
  }

  // 2. Validate ownerType
  if (!('ownerType' in params) || params.ownerType === undefined || params.ownerType === null) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'FieldConstraintSet requires an ownerType property.',
    );
  }
  if (!(params.ownerType instanceof ElementVersionRef)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'FieldConstraintSet ownerType must be an authentic ElementVersionRef instance.',
    );
  }

  // 3. Validate constraints array
  const rawConstraints = params.constraints;
  let validatedList: readonly FieldConstraint[];

  if (rawConstraints === undefined) {
    validatedList = [];
  } else if (!Array.isArray(rawConstraints)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      `FieldConstraintSet constraints property must be an array, received: ${typeof rawConstraints}.`,
    );
  } else {
    const list: FieldConstraint[] = [];
    const seenKinds = new Set<FieldConstraintKind>();

    let minLengthConstraint: MinLengthConstraint | undefined;
    let maxLengthConstraint: MaxLengthConstraint | undefined;
    let minValueConstraint: MinValueConstraint | undefined;
    let maxValueConstraint: MaxValueConstraint | undefined;

    for (let i = 0; i < rawConstraints.length; i++) {
      const c = rawConstraints[i];

      if (!isFieldConstraint(c)) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
          `Constraint at index ${i} is not an authentic FieldConstraint instance.`,
        );
      }

      // Singleton cardinality check
      if (seenKinds.has(c.kind)) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.DUPLICATE_KIND,
          `Duplicate field constraint kind '${c.kind}' encountered in constraint set.`,
        );
      }
      seenKinds.add(c.kind);

      if (c.kind === FieldConstraintKinds.MIN_LENGTH) {
        minLengthConstraint = c;
      } else if (c.kind === FieldConstraintKinds.MAX_LENGTH) {
        maxLengthConstraint = c;
      } else if (c.kind === FieldConstraintKinds.MIN_VALUE) {
        minValueConstraint = c;
      } else if (c.kind === FieldConstraintKinds.MAX_VALUE) {
        maxValueConstraint = c;
      }

      list.push(c);
    }

    // Cross-constraint coherence check: Length bounds
    if (minLengthConstraint && maxLengthConstraint) {
      if (minLengthConstraint.minimum > maxLengthConstraint.maximum) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.CONTRADICTORY_BOUNDS,
          `Contradictory length bounds: MIN_LENGTH (${minLengthConstraint.minimum}) exceeds MAX_LENGTH (${maxLengthConstraint.maximum}).`,
        );
      }
    }

    // Cross-constraint coherence check: Numeric bounds
    if (minValueConstraint && maxValueConstraint) {
      if (minValueConstraint.valueType !== maxValueConstraint.valueType) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.CONTRADICTORY_BOUNDS,
          `Numeric bounds valueType mismatch: MIN_VALUE is '${minValueConstraint.valueType}' while MAX_VALUE is '${maxValueConstraint.valueType}'.`,
        );
      }

      let cmp: number;
      if (minValueConstraint.valueType === 'INTEGER') {
        cmp = compareExactIntegers(minValueConstraint.minimum, maxValueConstraint.maximum);
      } else {
        cmp = compareExactDecimals(minValueConstraint.minimum, maxValueConstraint.maximum);
      }

      if (cmp > 0) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.CONTRADICTORY_BOUNDS,
          `Contradictory numeric bounds: MIN_VALUE (${minValueConstraint.minimum}) exceeds MAX_VALUE (${maxValueConstraint.maximum}).`,
        );
      }

      if (cmp === 0 && (!minValueConstraint.inclusive || !maxValueConstraint.inclusive)) {
        throw new FieldConstraintValidationError(
          FIELD_CONSTRAINT_ERROR_CODES.CONTRADICTORY_BOUNDS,
          `Contradictory numeric bounds: MIN_VALUE (${minValueConstraint.minimum}) equals MAX_VALUE (${maxValueConstraint.maximum}) with exclusive bound.`,
        );
      }
    }

    validatedList = list;
  }

  return new ImmutableFieldConstraintSet(params.fieldId, params.ownerType, validatedList);
}

/**
 * Constructs a FieldConstraintSet for an authentic FieldDefinition, verifying
 * primitive-type applicability ahead-of-time.
 *
 * Invariants Enforced:
 * 1. `field` must be an authentic FieldDefinition (TYPE-02).
 * 2. If `field.valueType` is a referenced authored type (`by === 'reference'`),
 *    primitive constraints are rejected (no unverified cross-type assumptions).
 * 3. Every constraint must be applicable to `field.valueType.primitiveType`.
 * 4. Extracts `fieldId: field.id` and `ownerType: field.ownerType`.
 * 5. Enforces local set coherence via `createFieldConstraintSet`.
 *
 * @param field Authentic FieldDefinition instance.
 * @param constraints Optional collection of FieldConstraints.
 * @returns Frozen, validated FieldConstraintSet instance.
 */
export function createFieldConstraintSetForField(
  field: FieldDefinition,
  constraints?: readonly FieldConstraint[],
): FieldConstraintSet {
  if (!isFieldDefinition(field)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'createFieldConstraintSetForField requires an authentic FieldDefinition instance.',
    );
  }

  if (constraints !== undefined && constraints.length > 0) {
    if (field.valueType.by === 'reference') {
      throw new FieldConstraintValidationError(
        FIELD_CONSTRAINT_ERROR_CODES.UNSUPPORTED_FIELD_TYPE,
        `Field '${field.qualifiedName.toString()}' has a referenced type; primitive field constraints cannot be applied to referenced authored types.`,
      );
    }

    const primitiveType = field.valueType.primitiveType;
    for (const constraint of constraints) {
      if (isFieldConstraint(constraint)) {
        validateConstraintApplicability(constraint, primitiveType);
      }
    }
  }

  return createFieldConstraintSet({
    fieldId: field.id,
    ownerType: field.ownerType,
    constraints,
  });
}

// ─── Type Guard and Equality ──────────────────────────────────────────────────

/**
 * Type guard verifying whether a candidate value conforms to the FieldConstraintSet contract.
 */
export function isFieldConstraintSet(value: unknown): value is FieldConstraintSet {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;

  if (!(obj['fieldId'] instanceof SemanticElementId)) return false;
  if (!(obj['ownerType'] instanceof ElementVersionRef)) return false;
  if (!Array.isArray(obj['constraints'])) return false;

  const constraints = obj['constraints'] as readonly unknown[];
  const seenKinds = new Set<FieldConstraintKind>();

  for (const c of constraints) {
    if (!isFieldConstraint(c)) return false;
    if (seenKinds.has(c.kind)) return false;
    seenKinds.add(c.kind);
  }

  return true;
}

/**
 * Compares two FieldConstraintSets for structural and semantic equivalence.
 * Verifies identical fieldId, identical ownerType, identical count, and identical
 * constraints in identical order.
 */
export function sameFieldConstraintSet(
  a: FieldConstraintSet,
  b: FieldConstraintSet,
): boolean {
  if (a === b) return true;
  if (!a.fieldId.equals(b.fieldId)) return false;
  if (!a.ownerType.equals(b.ownerType)) return false;
  if (a.count !== b.count) return false;

  for (let i = 0; i < a.constraints.length; i++) {
    const cA = a.constraints[i];
    const cB = b.constraints[i];
    if (cA === undefined || cB === undefined || !equalsFieldConstraint(cA, cB)) {
      return false;
    }
  }

  return true;
}

// ─── Serialization and Deserialization ────────────────────────────────────────

/**
 * Serializes a FieldConstraintSet into a deterministic wire-safe JSON object.
 */
export function serializeFieldConstraintSet(set: FieldConstraintSet): FieldConstraintSetJSON {
  return Object.freeze({
    fieldId: set.fieldId.toString(),
    ownerType: set.ownerType.toJSON(),
    constraints: Object.freeze(set.constraints.map(serializeFieldConstraint)),
  });
}

/**
 * Strictly parses and deserializes raw interchange data into an authentic FieldConstraintSet.
 */
export function parseFieldConstraintSet(raw: unknown): FieldConstraintSet {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.NON_OBJECT,
      'FieldConstraintSet deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;

  // 1. Parse fieldId
  if (!('fieldId' in record) || typeof record['fieldId'] !== 'string') {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'Raw FieldConstraintSet JSON missing string fieldId property.',
    );
  }
  let fieldId: SemanticElementId;
  try {
    fieldId = SemanticElementId.parse(record['fieldId']);
  } catch (err) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      `Failed to parse fieldId: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 2. Parse ownerType
  if (!('ownerType' in record) || record['ownerType'] === undefined || record['ownerType'] === null) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      'Raw FieldConstraintSet JSON missing ownerType property.',
    );
  }
  let ownerType: ElementVersionRef;
  try {
    ownerType = ElementVersionRef.fromJSON(record['ownerType']);
  } catch (err) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_ASSOCIATION,
      `Failed to parse ownerType: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 3. Parse constraints
  if (!('constraints' in record) || !Array.isArray(record['constraints'])) {
    throw new FieldConstraintValidationError(
      FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
      'Raw FieldConstraintSet JSON constraints property must be an array.',
    );
  }

  const parsedConstraints: FieldConstraint[] = [];
  const rawList = record['constraints'] as readonly unknown[];

  for (let i = 0; i < rawList.length; i++) {
    try {
      const c = parseFieldConstraint(rawList[i]);
      parsedConstraints.push(c);
    } catch (err) {
      throw new FieldConstraintValidationError(
        FIELD_CONSTRAINT_ERROR_CODES.INVALID_PARAMETER,
        `Failed to parse constraint at index ${i}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return createFieldConstraintSet({
    fieldId,
    ownerType,
    constraints: parsedConstraints,
  });
}

/**
 * Non-throwing safe parsing function for untrusted external inputs.
 */
export function tryParseFieldConstraintSet(raw: unknown): FieldConstraintSetParseResult {
  try {
    return { ok: true, value: parseFieldConstraintSet(raw) };
  } catch (error) {
    if (error instanceof FieldConstraintValidationError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new FieldConstraintValidationError(
        FIELD_CONSTRAINT_ERROR_CODES.NON_OBJECT,
        error instanceof Error ? error.message : 'Unexpected parsing error',
      ),
    };
  }
}
