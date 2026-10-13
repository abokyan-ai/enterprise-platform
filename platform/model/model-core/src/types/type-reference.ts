/**
 * @file type-reference.ts
 * @module @ecosystem/model-core/types
 *
 * TYPE-05: TypeReference — Specialized TypeDefinition Reference Contract.
 *
 * Establishes a strongly typed, immutable, validated, version-aware reference
 * contract for authored semantic TypeDefinitions, reusing the existing Semantic
 * Kernel reference primitives (SK-08 ElementRef) while establishing a distinct,
 * domain-specific wrapper that encodes the target kind constraint at the type level.
 *
 * Architectural Invariants:
 * 1. TypeReference ≠ ElementRef:
 *    TypeReference is a domain-specific refinement. It wraps and reuses an
 *    authenticated ElementRef, but encodes the semantic constraint that the
 *    target MUST be a TypeDefinition (kind='type'). Generic ElementRef
 *    carries no such kind restriction.
 * 2. TypeReference ≠ TypeDefinition:
 *    A TypeReference is a link expressing *intent to resolve*. It does NOT
 *    contain the TypeDefinition payload. Resolution is strictly out of scope
 *    for this module.
 * 3. TypeReference ≠ ReferencedFieldType (TYPE-02):
 *    ReferencedFieldType is a FieldType variant for field-level declared
 *    value-type references inside FieldDefinitions. TypeReference is a
 *    standalone, reusable typed reference contract usable wherever a reference
 *    to a TypeDefinition is required across the Model Core.
 * 4. TypeReference ≠ TypeDefinition Instance or Runtime Artifact:
 *    TypeReference is a design-time authoring metadata reference, NOT a
 *    resolved type object, runtime cache entry, or database record.
 * 5. Composition over Duplication:
 *    TypeReference reuses SemanticKernelError, ElementRef (SK-08), and
 *    SemanticVersion (SK-07) from the Semantic Kernel without re-implementing
 *    validation logic already established in those primitives.
 * 6. Version-Awareness:
 *    An optional version field allows a TypeReference to express either a
 *    version-pinned reference (exact snapshot) or a version-unspecified
 *    reference (resolved to latest compatible at compile time). Missing ≠ Null ≠ Value.
 * 7. Two Targeting Variants:
 *    - By stable SemanticElementId (id-based): portable, identity-stable reference.
 *    - By QualifiedName within a SemanticContextRef (name-based): human-authored references.
 * 8. Canonical JSON Serialization:
 *    Serializes to a fully deterministic, lossless JSON wire representation.
 *    Deserialization validates structural compliance and rejects malformed input.
 * 9. Clean Architecture: layer:model depends exclusively on layer:kernel.
 *    Zero external framework dependencies (no Angular, NestJS, PrimeNG, DB ORMs).
 * 10. Pure TypeScript: Universal Node.js and browser portability.
 */

import {
  SemanticElementId,
  SemanticContextRef,
  QualifiedName,
  SemanticVersion,
  type ElementRef,
  type ElementIdRef,
  type ElementNameRef,
  type ElementRefJSON,
  createElementIdRef,
  createElementNameRef,
  isElementIdRef,
  isElementNameRef,
  equalsElementRef,
  serializeElementRef,
  parseElementRef,
  SemanticKernelError,
} from '@ecosystem/semantic-kernel';

// ─── Error Codes ───────────────────────────────────────────────────────────────

/**
 * Structured validation error codes for TypeReference construction and parsing.
 */
export const TYPE_REFERENCE_ERROR_CODES = {
  NON_OBJECT: 'TYPE_REFERENCE_NON_OBJECT',
  MISSING_DISCRIMINANT: 'TYPE_REFERENCE_MISSING_DISCRIMINANT',
  INVALID_DISCRIMINANT: 'TYPE_REFERENCE_INVALID_DISCRIMINANT',
  MISSING_ELEMENT_REF: 'TYPE_REFERENCE_MISSING_ELEMENT_REF',
  INVALID_ELEMENT_REF: 'TYPE_REFERENCE_INVALID_ELEMENT_REF',
  INVALID_ELEMENT_ID: 'TYPE_REFERENCE_INVALID_ELEMENT_ID',
  INVALID_QUALIFIED_NAME: 'TYPE_REFERENCE_INVALID_QUALIFIED_NAME',
  MISSING_CONTEXT_REF: 'TYPE_REFERENCE_MISSING_CONTEXT_REF',
  INVALID_CONTEXT_REF: 'TYPE_REFERENCE_INVALID_CONTEXT_REF',
  INVALID_VERSION: 'TYPE_REFERENCE_INVALID_VERSION',
  NULL_VERSION: 'TYPE_REFERENCE_NULL_VERSION',
  NULL_CONTEXT: 'TYPE_REFERENCE_NULL_CONTEXT',
  UNKNOWN_VARIANT: 'TYPE_REFERENCE_UNKNOWN_VARIANT',
} as const;

export type TypeReferenceErrorCode =
  (typeof TYPE_REFERENCE_ERROR_CODES)[keyof typeof TYPE_REFERENCE_ERROR_CODES];

/**
 * Dedicated structured validation error for TypeReference failures.
 * Extends the established SemanticKernelError convention.
 */
export class TypeReferenceValidationError extends SemanticKernelError {
  public override readonly code: TypeReferenceErrorCode;

  constructor(code: TypeReferenceErrorCode, message: string) {
    super(message, code);
    this.name = 'TypeReferenceValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── TypeReference Contract ────────────────────────────────────────────────────

/**
 * A TypeReference is a strongly typed, domain-specific, immutable reference
 * to an authored TypeDefinition (kind='type').
 *
 * It wraps and restricts the generic Semantic Kernel ElementRef (SK-08) to
 * the TypeDefinition domain without duplicating reference resolution logic.
 *
 * @remarks
 * Two targeting variants are supported via the discriminated `by` property
 * inherited from the wrapped `ElementRef`:
 * - `by: 'id'`   — targets a TypeDefinition by its stable SemanticElementId.
 * - `by: 'name'` — targets a TypeDefinition by QualifiedName within an explicit context.
 *
 * The optional `version` field narrows the reference:
 * - Present: exact version-pinned reference (compiler resolves only that snapshot).
 * - Absent: version-unspecified reference (compiler resolves latest compatible).
 *
 * @example
 * ```typescript
 * // Identity-based reference (version-pinned):
 * const ref = createTypeReferenceById(
 *   SemanticElementId.parse('cust-type-01'),
 *   SemanticVersion.parse('1.2.0'),
 * );
 *
 * // Name-based reference (version-unspecified):
 * const ref2 = createTypeReferenceByName(
 *   QualifiedName.parse('sales.Customer'),
 *   SemanticContextRef.parse('com.example.crm'),
 * );
 * ```
 */
export interface TypeReference {
  /**
   * The explicit discriminant. Mirrors the inner ElementRef variant.
   * - `'id'`   — identity-based reference.
   * - `'name'` — name-based reference.
   */
  readonly by: 'id' | 'name';

  /**
   * The authenticated Semantic Kernel ElementRef encoding the actual reference target.
   * Callers use `ref.by` to narrow the variant and access inner fields.
   */
  readonly ref: ElementRef;

  /**
   * Indicates this reference targets a TypeDefinition (kind='type').
   * Fixed discriminant enabling downstream narrowing in polymorphic reference unions.
   */
  readonly targetKind: 'type';
}

/**
 * Convenience narrowing: a TypeReference whose inner ref is an ElementIdRef.
 */
export interface TypeIdReference extends TypeReference {
  readonly by: 'id';
  readonly ref: ElementIdRef;
}

/**
 * Convenience narrowing: a TypeReference whose inner ref is an ElementNameRef.
 */
export interface TypeNameReference extends TypeReference {
  readonly by: 'name';
  readonly ref: ElementNameRef;
}

// ─── Creation Parameters ───────────────────────────────────────────────────────

/**
 * Input parameters for creating a TypeIdReference (by stable SemanticElementId).
 */
export interface CreateTypeIdReferenceParams {
  /** An already-validated SemanticElementId instance (SK-01). */
  readonly elementId: SemanticElementId;
  /**
   * An already-validated exact SemanticVersion (SK-07), or omitted for
   * a version-unspecified reference. Missing ≠ Null ≠ Value.
   */
  readonly version?: SemanticVersion;
}

/**
 * Input parameters for creating a TypeNameReference (by QualifiedName + context).
 */
export interface CreateTypeNameReferenceParams {
  /** An already-validated QualifiedName instance (SK-03). */
  readonly qualifiedName: QualifiedName;
  /**
   * An already-validated SemanticContextRef instance (SK-04).
   * Required for name-based references: context owns meaning.
   */
  readonly contextRef: SemanticContextRef;
  /**
   * An already-validated exact SemanticVersion (SK-07), or omitted for
   * a version-unspecified reference. Missing ≠ Null ≠ Value.
   */
  readonly version?: SemanticVersion;
}

// ─── JSON Wire Types ───────────────────────────────────────────────────────────

/**
 * JSON interchange representation for a TypeReference.
 *
 * Wraps the canonical ElementRefJSON with the `targetKind` discriminant.
 */
export interface TypeReferenceJSON {
  /** The inner element reference wire representation. */
  readonly ref: ElementRefJSON;
  /** Fixed discriminant encoding the TypeDefinition target kind. */
  readonly targetKind: 'type';
}

/**
 * Discriminated result type for non-throwing parsing of TypeReference.
 */
export type TypeReferenceParseResult =
  | { readonly ok: true; readonly value: TypeReference }
  | { readonly ok: false; readonly error: TypeReferenceValidationError };

// ─── Factory Functions ─────────────────────────────────────────────────────────

/**
 * Creates a validated, immutable TypeIdReference — targeting a TypeDefinition
 * by its stable SemanticElementId.
 *
 * @param elementId — An authenticated SemanticElementId instance (SK-01).
 * @param version   — An authenticated SemanticVersion (SK-07), or omitted for
 *                    a version-unspecified reference.
 * @throws TypeReferenceValidationError if elementId is not a valid SemanticElementId
 *   instance, or version is not a valid SemanticVersion instance (when provided).
 */
export function createTypeReferenceById(
  elementId: SemanticElementId,
  version?: SemanticVersion,
): TypeIdReference {
  if (!(elementId instanceof SemanticElementId)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_ID,
      'createTypeReferenceById requires an authenticated SemanticElementId instance.',
    );
  }
  if (version !== undefined && !(version instanceof SemanticVersion)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_VERSION,
      'createTypeReferenceById: version must be a SemanticVersion instance when provided.',
    );
  }

  const innerRef: ElementIdRef = createElementIdRef(elementId, version);

  return Object.freeze<TypeIdReference>({
    by: 'id',
    ref: innerRef,
    targetKind: 'type',
  });
}

/**
 * Creates a validated, immutable TypeNameReference — targeting a TypeDefinition
 * by QualifiedName within an explicit SemanticContextRef.
 *
 * Context is always required for name-based references: the same QualifiedName
 * may exist in different contexts and must not silently resolve to one of them.
 *
 * @param qualifiedName — An authenticated QualifiedName instance (SK-03).
 * @param contextRef    — An authenticated SemanticContextRef instance (SK-04).
 * @param version       — An authenticated SemanticVersion (SK-07), or omitted for
 *                        a version-unspecified reference.
 * @throws TypeReferenceValidationError for invalid component instances.
 */
export function createTypeReferenceByName(
  qualifiedName: QualifiedName,
  contextRef: SemanticContextRef,
  version?: SemanticVersion,
): TypeNameReference {
  if (!(qualifiedName instanceof QualifiedName)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'createTypeReferenceByName requires an authenticated QualifiedName instance.',
    );
  }
  if (!(contextRef instanceof SemanticContextRef)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.MISSING_CONTEXT_REF,
      'createTypeReferenceByName requires an authenticated SemanticContextRef instance.',
    );
  }
  if (version !== undefined && !(version instanceof SemanticVersion)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_VERSION,
      'createTypeReferenceByName: version must be a SemanticVersion instance when provided.',
    );
  }

  const innerRef: ElementNameRef = createElementNameRef(
    qualifiedName,
    contextRef,
    version,
  );

  return Object.freeze<TypeNameReference>({
    by: 'name',
    ref: innerRef,
    targetKind: 'type',
  });
}

// ─── Type Narrowing Guards ─────────────────────────────────────────────────────

/**
 * Type guard verifying a value conforms to the TypeReference contract.
 *
 * Validates:
 * - Non-null object with correct structural shape.
 * - `by` discriminant is either 'id' or 'name'.
 * - `targetKind` is exactly 'type'.
 * - `ref` is a valid ElementRef matching the declared `by` variant.
 */
export function isTypeReference(value: unknown): value is TypeReference {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (candidate['targetKind'] !== 'type') {
    return false;
  }
  const by = candidate['by'];
  if (by !== 'id' && by !== 'name') {
    return false;
  }
  const ref = candidate['ref'];
  if (ref === null || typeof ref !== 'object' || Array.isArray(ref)) {
    return false;
  }
  // Check that the inner ref has the matching `by` discriminant
  const innerRef = ref as Record<string, unknown>;
  return innerRef['by'] === by;
}

/**
 * Type guard verifying a TypeReference is identity-based (by='id').
 */
export function isTypeIdReference(value: unknown): value is TypeIdReference {
  return isTypeReference(value) && value.by === 'id';
}

/**
 * Type guard verifying a TypeReference is name-based (by='name').
 */
export function isTypeNameReference(
  value: unknown,
): value is TypeNameReference {
  return isTypeReference(value) && value.by === 'name';
}

// ─── Structural Equality ──────────────────────────────────────────────────────

/**
 * Returns true if two TypeReferences target the same type definition.
 *
 * Equality requires:
 * 1. Both `targetKind` values are 'type' (always true if both are TypeReference).
 * 2. Both `by` variants match.
 * 3. The inner `ref` ElementRef fields are structurally equal (delegates to
 *    the Semantic Kernel's `equalsElementRef`).
 *
 * Note: An id-based reference and a name-based reference are NEVER equal even
 * if they resolve to the same TypeDefinition — structural equality is not
 * resolution equality.
 */
export function equalsTypeReference(
  a: TypeReference,
  b: TypeReference,
): boolean {
  if (a.targetKind !== b.targetKind) {
    return false;
  }
  return equalsElementRef(a.ref, b.ref);
}

// ─── Serialization ─────────────────────────────────────────────────────────────

/**
 * Serializes a TypeReference to its canonical JSON wire representation.
 *
 * Delegates inner ElementRef serialization to the Semantic Kernel's
 * `serializeElementRef`. The `targetKind: 'type'` discriminant is always
 * included in the output.
 *
 * @param typeRef — A validated TypeReference instance.
 * @returns A `TypeReferenceJSON` object suitable for JSON.stringify().
 */
export function serializeTypeReference(typeRef: TypeReference): TypeReferenceJSON {
  return Object.freeze({
    ref: serializeElementRef(typeRef.ref),
    targetKind: 'type' as const,
  });
}

// ─── Deserialization / Parsing ─────────────────────────────────────────────────

/**
 * Parses and validates a raw input as a TypeReference.
 * Throws `TypeReferenceValidationError` on any structural or semantic violation.
 *
 * Validation steps:
 * 1. Input must be a non-null, non-array object.
 * 2. `targetKind` must be present and equal to 'type'.
 * 3. `ref` must be present, non-null, and parse successfully as an ElementRef.
 * 4. The outer `by` discriminant must be consistent with the inner `ref.by`.
 *
 * @param raw — Untrusted input (e.g. from JSON.parse()).
 * @returns A validated, immutable TypeReference.
 * @throws TypeReferenceValidationError on invalid input.
 */
export function parseTypeReference(raw: unknown): TypeReference {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.NON_OBJECT,
      `TypeReference must be a non-null object; received ${raw === null ? 'null' : Array.isArray(raw) ? 'array' : typeof raw}.`,
    );
  }

  const record = raw as Record<string, unknown>;

  if (!('targetKind' in record)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.MISSING_DISCRIMINANT,
      'TypeReference is missing required "targetKind" discriminant property.',
    );
  }
  if (record['targetKind'] !== 'type') {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_DISCRIMINANT,
      `TypeReference "targetKind" must be "type"; received "${String(record['targetKind'])}".`,
    );
  }

  if (!('ref' in record)) {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.MISSING_ELEMENT_REF,
      'TypeReference is missing required "ref" property.',
    );
  }
  if (record['ref'] === null || typeof record['ref'] !== 'object') {
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_REF,
      `TypeReference "ref" must be a non-null object; received ${record['ref'] === null ? 'null' : typeof record['ref']}.`,
    );
  }

  let innerRef: ElementRef;
  try {
    innerRef = parseElementRef(record['ref'] as ElementRefJSON);
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : 'Unknown error parsing inner ElementRef.';
    throw new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_REF,
      `TypeReference "ref" failed ElementRef parsing: ${msg}`,
    );
  }

  if (isElementIdRef(innerRef)) {
    return Object.freeze<TypeIdReference>({
      by: 'id',
      ref: innerRef,
      targetKind: 'type',
    });
  }

  if (isElementNameRef(innerRef)) {
    return Object.freeze<TypeNameReference>({
      by: 'name',
      ref: innerRef,
      targetKind: 'type',
    });
  }

  throw new TypeReferenceValidationError(
    TYPE_REFERENCE_ERROR_CODES.UNKNOWN_VARIANT,
    'TypeReference inner ref resolved to an unrecognized ElementRef variant.',
  );
}

/**
 * Non-throwing variant of parseTypeReference.
 * Returns a discriminated result union instead of throwing.
 *
 * @param raw — Untrusted input.
 * @returns `{ ok: true, value }` on success, `{ ok: false, error }` on failure.
 */
export function tryParseTypeReference(raw: unknown): TypeReferenceParseResult {
  try {
    const value = parseTypeReference(raw);
    return { ok: true, value };
  } catch (err) {
    if (err instanceof TypeReferenceValidationError) {
      return { ok: false, error: err };
    }
    return {
      ok: false,
      error: new TypeReferenceValidationError(
        TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_REF,
        `TypeReference parsing encountered an unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      ),
    };
  }
}

// ─── Diagnostic Rendering (Non-canonical) ─────────────────────────────────────

/**
 * Produces a human-readable, non-canonical string description of a TypeReference.
 * Intended for diagnostic output, log messages, and error reporting ONLY.
 * MUST NOT be parsed or round-tripped as canonical data.
 *
 * @example
 * ```
 * "TypeRef[id:type-id-01@1.0.0]"
 * "TypeRef[name:sales.Customer@com.example.crm@1.0.0]"
 * "TypeRef[name:sales.Customer@com.example.crm]"
 * ```
 */
export function describeTypeReference(typeRef: TypeReference): string {
  const ref = typeRef.ref;
  if (isElementIdRef(ref)) {
    const versionPart =
      ref.version !== undefined ? `@${ref.version.toString()}` : '';
    return `TypeRef[id:${ref.elementId.toString()}${versionPart}]`;
  }
  if (isElementNameRef(ref)) {
    const versionPart =
      ref.version !== undefined ? `@${ref.version.toString()}` : '';
    return `TypeRef[name:${ref.qualifiedName.toString()}@${ref.contextRef.toString()}${versionPart}]`;
  }
  return 'TypeRef[unknown]';
}
