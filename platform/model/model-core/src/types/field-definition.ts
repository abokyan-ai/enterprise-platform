/**
 * @file field-definition.ts
 * @module @ecosystem/model-core
 *
 * TYPE-02: Foundational FieldDefinition contract and FieldType system.
 *
 * Represents an authored semantic field definition belonging to an authored type.
 *
 * Architectural Invariants:
 * 1. Definition ≠ Instance ≠ Runtime:
 *    - A FieldDefinition is immutable metadata describing semantic structure.
 *    - It contains NO runtime field values (FieldValue), NO instance state, NO transaction context.
 * 2. Composition of Semantic Kernel Primitives:
 *    - SemanticElementId (SK-01) — Stable field identity, independent of containing type identity.
 *    - QualifiedName (SK-03) — Canonical hierarchical naming within a namespace scope (e.g. sales.Customer.name).
 *    - SemanticContextRef (SK-04) — Explicit interpretation boundary ("Context Owns Meaning").
 *    - SemanticElementKinds.FIELD (SK-06) — Fixed element classification ('field').
 *    - ElementVersionRef (SK-07) — Explicit containing TypeDefinition version snapshot ownership.
 *    - PrimitiveType (SK-09) & ElementRef (SK-08) — Declared value-type system.
 * 3. Identity vs Owner Version:
 *    - Stable field identity persists across compatible revisions of its containing type.
 *    - The owner reference pins the exact definition snapshot in which the field is declared.
 * 4. Value Type Declaration (FieldType):
 *    - Discriminated union strictly separating primitive types from authored type references.
 *    - Mutually exclusive variants prevent invalid mixed states.
 * 5. Strict Scope Boundaries:
 *    - Zero runtime storage, validation, or default expression evaluation.
 *    - Zero persistence mapping (no SQL columns, tables, or ORM decorators).
 *    - Zero UI mapping (no Angular FormControls, PrimeNG widgets, or display order).
 *    - Clean Architecture: layer:model depends only on layer:kernel. Zero external framework dependencies.
 */

import {
  type SemanticElement,
  SemanticElementId,
  QualifiedName,
  SemanticContextRef,
  SemanticElementKinds,
  type SemanticElementKind,
  SemanticVersion,
  ElementVersionRef,
  type ElementVersionRefJSON,
  type ElementRef,
  type ElementRefJSON,
  isElementIdRef,
  isElementNameRef,
  equalsElementRef,
  serializeElementRef,
  parseElementRef,
  type PrimitiveType,
  PrimitiveTypes,
  isPrimitiveType,
  parsePrimitiveType,
  SemanticKernelError,
  type SemanticId,
} from '@ecosystem/semantic-kernel';

// ─── Error Codes and ValidationError ──────────────────────────────────────────

/**
 * Structured validation error codes for FieldDefinition and FieldType failures.
 */
export const FIELD_DEFINITION_ERROR_CODES = {
  NON_OBJECT: 'FIELD_DEFINITION_NON_OBJECT',
  MISSING_ID: 'FIELD_DEFINITION_MISSING_ID',
  INVALID_ID: 'FIELD_DEFINITION_INVALID_ID',
  MISSING_QUALIFIED_NAME: 'FIELD_DEFINITION_MISSING_QUALIFIED_NAME',
  INVALID_QUALIFIED_NAME: 'FIELD_DEFINITION_INVALID_QUALIFIED_NAME',
  MISSING_CONTEXT_REF: 'FIELD_DEFINITION_MISSING_CONTEXT_REF',
  INVALID_CONTEXT_REF: 'FIELD_DEFINITION_INVALID_CONTEXT_REF',
  INVALID_KIND: 'FIELD_DEFINITION_INVALID_KIND',
  MISSING_OWNER: 'FIELD_DEFINITION_MISSING_OWNER',
  INVALID_OWNER: 'FIELD_DEFINITION_INVALID_OWNER',
  MISSING_VALUE_TYPE: 'FIELD_DEFINITION_MISSING_VALUE_TYPE',
  INVALID_VALUE_TYPE: 'FIELD_DEFINITION_INVALID_VALUE_TYPE',
  FIELD_TYPE_UNKNOWN_VARIANT: 'FIELD_TYPE_UNKNOWN_VARIANT',
  FIELD_TYPE_CONFLICTING_VARIANTS: 'FIELD_TYPE_CONFLICTING_VARIANTS',
  FIELD_TYPE_MISSING_PRIMITIVE: 'FIELD_TYPE_MISSING_PRIMITIVE',
  FIELD_TYPE_INVALID_PRIMITIVE: 'FIELD_TYPE_INVALID_PRIMITIVE',
  FIELD_TYPE_MISSING_REFERENCE: 'FIELD_TYPE_MISSING_REFERENCE',
  FIELD_TYPE_INVALID_REFERENCE: 'FIELD_TYPE_INVALID_REFERENCE',
} as const;

export type FieldDefinitionErrorCode =
  (typeof FIELD_DEFINITION_ERROR_CODES)[keyof typeof FIELD_DEFINITION_ERROR_CODES];

/**
 * Dedicated error class for FieldDefinition and FieldType validation failures.
 */
export class FieldDefinitionValidationError extends SemanticKernelError {
  public override readonly code: FieldDefinitionErrorCode;

  constructor(code: FieldDefinitionErrorCode, message: string) {
    super(message, code);
    this.name = 'FieldDefinitionValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── FieldType Contract and Discriminators ────────────────────────────────────

/**
 * Primitive value-type descriptor holding an authentic PrimitiveType code (SK-09).
 */
export interface PrimitiveFieldType {
  readonly by: 'primitive';
  readonly primitiveType: PrimitiveType;
  readonly typeRef?: never;
}

/**
 * Referenced value-type descriptor holding an authentic ElementRef (SK-08).
 */
export interface ReferencedFieldType {
  readonly by: 'reference';
  readonly typeRef: ElementRef;
  readonly primitiveType?: never;
}

/**
 * Discriminated union of all supported declared field value types.
 *
 * ```text
 * FieldType
 *   ├── PrimitiveFieldType   (by: 'primitive', primitiveType: PrimitiveType)
 *   └── ReferencedFieldType  (by: 'reference', typeRef: ElementRef)
 * ```
 *
 * Mutually exclusive discriminators prevent mixed or ambiguous type states.
 */
export type FieldType = PrimitiveFieldType | ReferencedFieldType;

/**
 * Wire-safe JSON interchange shape for FieldType.
 */
export type FieldTypeJSON =
  | {
      readonly by: 'primitive';
      readonly primitiveType: string;
    }
  | {
      readonly by: 'reference';
      readonly typeRef: ElementRefJSON;
    };

/**
 * Creates an immutable PrimitiveFieldType descriptor from an authentic PrimitiveType code.
 *
 * @param primitiveType The canonical PrimitiveType code.
 * @returns Frozen PrimitiveFieldType instance.
 * @throws FieldDefinitionValidationError if code is not a recognized PrimitiveType.
 */
export function createPrimitiveFieldType(
  primitiveType: PrimitiveType,
): PrimitiveFieldType {
  if (!isPrimitiveType(primitiveType)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_INVALID_PRIMITIVE,
      `Invalid primitive type: '${String(primitiveType)}'. Must be one of PrimitiveTypes.`,
    );
  }

  return Object.freeze({
    by: 'primitive',
    primitiveType,
  });
}

/**
 * Creates an immutable ReferencedFieldType descriptor from an authentic ElementRef.
 *
 * @param typeRef Authentic ElementRef targeting an authored semantic definition.
 * @returns Frozen ReferencedFieldType instance.
 * @throws FieldDefinitionValidationError if typeRef is not an authentic ElementRef.
 */
export function createReferencedFieldType(
  typeRef: ElementRef,
): ReferencedFieldType {
  if (
    typeRef === null ||
    typeof typeRef !== 'object' ||
    (!isElementIdRef(typeRef) && !isElementNameRef(typeRef))
  ) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_INVALID_REFERENCE,
      'createReferencedFieldType requires an authentic ElementRef (ElementIdRef or ElementNameRef).',
    );
  }

  return Object.freeze({
    by: 'reference',
    typeRef,
  });
}

/**
 * Type guard verifying whether candidate is a valid PrimitiveFieldType.
 */
export function isPrimitiveFieldType(
  value: unknown,
): value is PrimitiveFieldType {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    obj['by'] === 'primitive' &&
    isPrimitiveType(obj['primitiveType']) &&
    obj['typeRef'] === undefined
  );
}

/**
 * Type guard verifying whether candidate is a valid ReferencedFieldType.
 */
export function isReferencedFieldType(
  value: unknown,
): value is ReferencedFieldType {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const obj = value as Record<string, unknown>;
  if (obj['by'] !== 'reference' || obj['primitiveType'] !== undefined) {
    return false;
  }
  const ref = obj['typeRef'] as ElementRef | undefined;
  return ref !== undefined && (isElementIdRef(ref) || isElementNameRef(ref));
}

/**
 * Type guard verifying whether candidate conforms to the FieldType discriminated union.
 */
export function isFieldType(value: unknown): value is FieldType {
  return isPrimitiveFieldType(value) || isReferencedFieldType(value);
}

/**
 * Compares two FieldTypes for semantic equality.
 */
export function equalsFieldType(a: FieldType, b: FieldType): boolean {
  if (a === b) {
    return true;
  }
  if (a.by !== b.by) {
    return false;
  }
  if (a.by === 'primitive' && b.by === 'primitive') {
    return a.primitiveType === b.primitiveType;
  }
  if (a.by === 'reference' && b.by === 'reference') {
    return equalsElementRef(a.typeRef, b.typeRef);
  }
  return false;
}

/**
 * Serializes a FieldType into wire-safe JSON.
 */
export function serializeFieldType(fieldType: FieldType): FieldTypeJSON {
  if (fieldType.by === 'primitive') {
    return Object.freeze({
      by: 'primitive',
      primitiveType: fieldType.primitiveType,
    });
  }
  return Object.freeze({
    by: 'reference',
    typeRef: serializeElementRef(fieldType.typeRef),
  });
}

/**
 * Strictly parses raw data into an authentic FieldType descriptor.
 */
export function parseFieldType(raw: unknown): FieldType {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_VALUE_TYPE,
      'FieldType deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;
  const by = record['by'];

  if (by === 'primitive') {
    if ('typeRef' in record && record['typeRef'] !== undefined) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_CONFLICTING_VARIANTS,
        'Primitive FieldType cannot contain typeRef.',
      );
    }
    const primitiveCode = record['primitiveType'];
    if (typeof primitiveCode !== 'string' || !isPrimitiveType(primitiveCode)) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_INVALID_PRIMITIVE,
        `Invalid primitiveType in FieldType JSON: '${String(primitiveCode)}'.`,
      );
    }
    return createPrimitiveFieldType(parsePrimitiveType(primitiveCode));
  }

  if (by === 'reference') {
    if ('primitiveType' in record && record['primitiveType'] !== undefined) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_CONFLICTING_VARIANTS,
        'Referenced FieldType cannot contain primitiveType.',
      );
    }
    const rawRef = record['typeRef'];
    if (rawRef === undefined || rawRef === null) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_MISSING_REFERENCE,
        'Referenced FieldType requires a typeRef record.',
      );
    }
    const parsedRef = parseElementRef(rawRef);
    return createReferencedFieldType(parsedRef);
  }

  throw new FieldDefinitionValidationError(
    FIELD_DEFINITION_ERROR_CODES.FIELD_TYPE_UNKNOWN_VARIANT,
    `FieldType variant 'by' must be 'primitive' or 'reference', received: '${String(by)}'.`,
  );
}

// ─── FieldDefinition Contract ─────────────────────────────────────────────────

/**
 * The canonical semantic definition contract for an authored field.
 *
 * Extends SemanticElement (SK-05) and binds to an explicit containing type (SK-07).
 */
export interface FieldDefinition extends SemanticElement {
  /**
   * Stable semantic identity of this field (SK-01).
   * Invariant: distinct from ownerType's elementId.
   */
  readonly id: SemanticElementId;

  /**
   * Canonical hierarchical qualified name (SK-03).
   * E.g. sales.Customer.customerId
   */
  readonly qualifiedName: QualifiedName;

  /**
   * Explicit semantic interpretation context boundary (SK-04).
   * Context owns meaning; fields with identical names in different contexts are distinct.
   */
  readonly contextRef: SemanticContextRef;

  /**
   * Fixed element taxonomy classification from SK-06.
   * Invariant: always equals SemanticElementKinds.FIELD ('field').
   */
  readonly kind: typeof SemanticElementKinds.FIELD;

  /**
   * Exact containing TypeDefinition version snapshot ownership (SK-07).
   * Identifies the exact type version where this field is declared.
   */
  readonly ownerType: ElementVersionRef;

  /**
   * Declared value-type descriptor (primitive or authored type reference).
   */
  readonly valueType: FieldType;
}

/**
 * Parameters for constructing a FieldDefinition with authentic value objects.
 */
export interface CreateFieldDefinitionParams {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly ownerType: ElementVersionRef;
  readonly valueType: FieldType;
  readonly kind?: typeof SemanticElementKinds.FIELD;
}

/**
 * Legacy parameters supported for backward compatibility with ARC-01 test harness.
 */
export interface LegacyCreateFieldDefinitionParams {
  readonly semanticId?: unknown;
  readonly kind?: 'field';
  readonly name?: string;
  readonly fieldType?: unknown;
  readonly required?: boolean;
  readonly defaultValue?: unknown;
  readonly id?: SemanticElementId;
  readonly qualifiedName?: QualifiedName;
  readonly contextRef?: SemanticContextRef;
  readonly ownerType?: ElementVersionRef;
  readonly valueType?: FieldType;
}

/**
 * Wire-safe JSON interchange shape for FieldDefinition.
 */
export interface FieldDefinitionJSON {
  readonly id: string;
  readonly qualifiedName: string;
  readonly contextRef: string;
  readonly kind: 'field';
  readonly ownerType: ElementVersionRefJSON;
  readonly valueType: FieldTypeJSON;
}

/**
 * Discriminated result type for non-throwing parsing.
 */
export type FieldDefinitionParseResult =
  | { readonly ok: true; readonly value: FieldDefinition }
  | { readonly ok: false; readonly error: FieldDefinitionValidationError };

// ─── Concrete Immutable Implementation ────────────────────────────────────────

/**
 * Concrete immutable implementation of FieldDefinition.
 */
class ImmutableFieldDefinition implements FieldDefinition {
  public readonly id: SemanticElementId;
  public readonly qualifiedName: QualifiedName;
  public readonly contextRef: SemanticContextRef;
  public readonly kind: typeof SemanticElementKinds.FIELD = SemanticElementKinds.FIELD;
  public readonly ownerType: ElementVersionRef;
  public readonly valueType: FieldType;

  // Legacy compatibility fields
  private readonly _legacyRequired?: boolean;
  private readonly _legacyDefaultValue?: unknown;

  constructor(
    id: SemanticElementId,
    qualifiedName: QualifiedName,
    contextRef: SemanticContextRef,
    ownerType: ElementVersionRef,
    valueType: FieldType,
    legacyRequired?: boolean,
    legacyDefaultValue?: unknown,
  ) {
    this.id = id;
    this.qualifiedName = qualifiedName;
    this.contextRef = contextRef;
    this.ownerType = ownerType;
    this.valueType = valueType;
    this._legacyRequired = legacyRequired;
    this._legacyDefaultValue = legacyDefaultValue;
    Object.freeze(this);
  }

  // Legacy convenience accessors
  public get semanticId(): string {
    return this.id.toString();
  }

  public get name(): string {
    return this.qualifiedName.localName.toString();
  }

  public get fieldType(): unknown {
    return this.valueType;
  }

  public get required(): boolean | undefined {
    return this._legacyRequired;
  }

  public get defaultValue(): unknown {
    return this._legacyDefaultValue;
  }
}

// ─── Factory and Type Guards ──────────────────────────────────────────────────

/**
 * Type guard verifying whether a candidate value conforms to the FieldDefinition contract
 * with authentic Semantic Kernel value objects.
 */
export function isFieldDefinition(value: unknown): value is FieldDefinition {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate['id'] instanceof SemanticElementId &&
    candidate['qualifiedName'] instanceof QualifiedName &&
    candidate['contextRef'] instanceof SemanticContextRef &&
    candidate['kind'] === SemanticElementKinds.FIELD &&
    candidate['ownerType'] instanceof ElementVersionRef &&
    isFieldType(candidate['valueType'])
  );
}

/**
 * Validates candidate parameters and constructs an immutable FieldDefinition.
 *
 * Guarantees:
 * 1. Runtime authenticity verification for all constituent Kernel value objects.
 * 2. Fixed element classification: 'field'.
 * 3. Exact containing TypeDefinition version snapshot ownership.
 * 4. Strictly validated declared value-type contract.
 * 5. Immutable object creation with zero external side effects.
 * 6. Full backward compatibility with ARC-01 legacy calling conventions.
 *
 * @param params Parameters containing authentic value objects.
 * @returns Immutable FieldDefinition instance.
 * @throws FieldDefinitionValidationError on contract violation.
 */
export function createFieldDefinition(
  params: CreateFieldDefinitionParams | LegacyCreateFieldDefinitionParams,
): FieldDefinition {
  if (params === null || typeof params !== 'object') {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.NON_OBJECT,
      'FieldDefinition creation requires a non-null parameters object.',
    );
  }

  const raw = params as unknown as Record<string, unknown>;

  // ─── Legacy ARC-01 Compatibility Branch ────────────────────────────────────
  if ('semanticId' in raw && !('id' in raw)) {
    const rawSemId = String(raw['semanticId']);
    const colonIndex = rawSemId.indexOf(':');
    const localPart = colonIndex !== -1 ? rawSemId.slice(colonIndex + 1) : rawSemId;
    const dotIndex = localPart.lastIndexOf('.');
    const fieldName =
      raw['name'] !== undefined && typeof raw['name'] === 'string'
        ? raw['name']
        : dotIndex !== -1
          ? localPart.slice(dotIndex + 1)
          : localPart;

    const typeName = dotIndex !== -1 ? localPart.slice(0, dotIndex) : 'SyntheticType';

    const id = SemanticElementId.parse(
      colonIndex !== -1
        ? rawSemId.replace(':', '.')
        : `ecosystem.fields.${rawSemId}`,
    );

    const qualifiedName = QualifiedName.parse(
      colonIndex !== -1
        ? `${rawSemId.slice(0, colonIndex)}.${typeName}.${fieldName}`
        : `ecosystem.fields.${typeName}.${fieldName}`,
    );

    const contextRef = SemanticContextRef.parse('default-context');

    const ownerId = SemanticElementId.parse(
      colonIndex !== -1
        ? `${rawSemId.slice(0, colonIndex)}.${typeName}`
        : `ecosystem.types.${typeName}`,
    );
    const ownerVersion = SemanticVersion.parse('1.0.0');
    const ownerType = ElementVersionRef.fromParts(ownerId, ownerVersion);

    // Resolve legacy fieldType to canonical FieldType if possible
    let valueType: FieldType;
    const legacyFt = raw['fieldType'] as Record<string, unknown> | undefined;
    if (legacyFt && legacyFt['kind'] === 'primitive' && typeof legacyFt['primitiveKind'] === 'string') {
      const pKind = (legacyFt['primitiveKind'] as string).toUpperCase();
      const matched = isPrimitiveType(pKind) ? (pKind as PrimitiveType) : PrimitiveTypes.STRING;
      valueType = createPrimitiveFieldType(matched);
    } else {
      valueType = createPrimitiveFieldType(PrimitiveTypes.STRING);
    }

    return new ImmutableFieldDefinition(
      id,
      qualifiedName,
      contextRef,
      ownerType,
      valueType,
      raw['required'] as boolean | undefined,
      raw['defaultValue'],
    );
  }

  // ─── Canonical TYPE-02 Path ────────────────────────────────────────────────

  // 1. Validate id
  if (!('id' in raw) || raw['id'] === undefined || raw['id'] === null) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_ID,
      'FieldDefinition requires a valid id property.',
    );
  }
  if (!(raw['id'] instanceof SemanticElementId)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_ID,
      'FieldDefinition id must be an authentic SemanticElementId instance.',
    );
  }

  // 2. Validate qualifiedName
  if (
    !('qualifiedName' in raw) ||
    raw['qualifiedName'] === undefined ||
    raw['qualifiedName'] === null
  ) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_QUALIFIED_NAME,
      'FieldDefinition requires a valid qualifiedName property.',
    );
  }
  if (!(raw['qualifiedName'] instanceof QualifiedName)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'FieldDefinition qualifiedName must be an authentic QualifiedName instance.',
    );
  }

  // 3. Validate contextRef
  if (
    !('contextRef' in raw) ||
    raw['contextRef'] === undefined ||
    raw['contextRef'] === null
  ) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_CONTEXT_REF,
      'FieldDefinition requires a valid contextRef property.',
    );
  }
  if (!(raw['contextRef'] instanceof SemanticContextRef)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_CONTEXT_REF,
      'FieldDefinition contextRef must be an authentic SemanticContextRef instance.',
    );
  }

  // 4. Validate kind
  if ('kind' in raw && raw['kind'] !== undefined) {
    if (raw['kind'] !== SemanticElementKinds.FIELD) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.INVALID_KIND,
        `FieldDefinition kind must be '${SemanticElementKinds.FIELD}', received: '${String(raw['kind'])}'.`,
      );
    }
  }

  // 5. Validate ownerType
  if (!('ownerType' in raw) || raw['ownerType'] === undefined || raw['ownerType'] === null) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_OWNER,
      'FieldDefinition requires an ownerType property identifying its containing type.',
    );
  }
  if (!(raw['ownerType'] instanceof ElementVersionRef)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_OWNER,
      'FieldDefinition ownerType must be an authentic ElementVersionRef instance.',
    );
  }

  // 6. Validate valueType
  if (!('valueType' in raw) || raw['valueType'] === undefined || raw['valueType'] === null) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_VALUE_TYPE,
      'FieldDefinition requires a valueType property.',
    );
  }
  if (!isFieldType(raw['valueType'])) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_VALUE_TYPE,
      'FieldDefinition valueType must be an authentic FieldType descriptor (PrimitiveFieldType or ReferencedFieldType).',
    );
  }

  return new ImmutableFieldDefinition(
    raw['id'],
    raw['qualifiedName'],
    raw['contextRef'],
    raw['ownerType'],
    raw['valueType'],
  );
}

// ─── Semantic Equality Utilities ──────────────────────────────────────────────

/**
 * Compares two FieldDefinitions for stable field identity equality.
 * Two fields share identity if their SemanticElementId instances are equal.
 */
export function sameFieldIdentity(a: FieldDefinition, b: FieldDefinition): boolean {
  if (a === b) {
    return true;
  }
  return a.id.equals(b.id);
}

/**
 * Compares two FieldDefinitions for containing type ownership equality.
 * Compares exact ownerType (ElementVersionRef) equality.
 */
export function sameFieldOwner(a: FieldDefinition, b: FieldDefinition): boolean {
  if (a === b) {
    return true;
  }
  return a.ownerType.equals(b.ownerType);
}

/**
 * Compares two FieldDefinitions for exact structural equivalence.
 * Verifies identical id, ownerType, qualifiedName, contextRef, and valueType.
 */
export function sameExactFieldDefinition(
  a: FieldDefinition,
  b: FieldDefinition,
): boolean {
  if (a === b) {
    return true;
  }
  return (
    sameFieldIdentity(a, b) &&
    sameFieldOwner(a, b) &&
    a.qualifiedName.equals(b.qualifiedName) &&
    a.contextRef.equals(b.contextRef) &&
    equalsFieldType(a.valueType, b.valueType)
  );
}

// ─── Serialization and Deserialization ────────────────────────────────────────

/**
 * Serializes a FieldDefinition into a deterministic JSON-safe interchange object.
 */
export function serializeFieldDefinition(
  fieldDef: FieldDefinition,
): FieldDefinitionJSON {
  return Object.freeze({
    id: fieldDef.id.toString(),
    qualifiedName: fieldDef.qualifiedName.toString(),
    contextRef: fieldDef.contextRef.toString(),
    kind: SemanticElementKinds.FIELD,
    ownerType: fieldDef.ownerType.toJSON(),
    valueType: serializeFieldType(fieldDef.valueType),
  });
}

/**
 * Strictly parses and deserializes raw interchange data into an authentic FieldDefinition.
 * Reconstructs all constituent Kernel value objects through their approved parsers.
 */
export function parseFieldDefinition(raw: unknown): FieldDefinition {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.NON_OBJECT,
      'FieldDefinition deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;

  // 1. Parse id
  if (!('id' in record) || typeof record['id'] !== 'string') {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_ID,
      'Raw FieldDefinition JSON missing string id property.',
    );
  }
  let id: SemanticElementId;
  try {
    id = SemanticElementId.parse(record['id']);
  } catch (err) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_ID,
      `Failed to parse FieldDefinition id: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 2. Parse qualifiedName
  if (!('qualifiedName' in record) || typeof record['qualifiedName'] !== 'string') {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_QUALIFIED_NAME,
      'Raw FieldDefinition JSON missing string qualifiedName property.',
    );
  }
  let qualifiedName: QualifiedName;
  try {
    qualifiedName = QualifiedName.parse(record['qualifiedName']);
  } catch (err) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_QUALIFIED_NAME,
      `Failed to parse FieldDefinition qualifiedName: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 3. Parse contextRef
  if (!('contextRef' in record) || typeof record['contextRef'] !== 'string') {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_CONTEXT_REF,
      'Raw FieldDefinition JSON missing string contextRef property.',
    );
  }
  let contextRef: SemanticContextRef;
  try {
    contextRef = SemanticContextRef.parse(record['contextRef']);
  } catch (err) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_CONTEXT_REF,
      `Failed to parse FieldDefinition contextRef: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 4. Validate kind
  if ('kind' in record && record['kind'] !== undefined) {
    if (record['kind'] !== SemanticElementKinds.FIELD) {
      throw new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.INVALID_KIND,
        `FieldDefinition JSON kind must be '${SemanticElementKinds.FIELD}', received: '${String(record['kind'])}'.`,
      );
    }
  }

  // 5. Parse ownerType
  if (!('ownerType' in record) || record['ownerType'] === undefined || record['ownerType'] === null) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_OWNER,
      'Raw FieldDefinition JSON missing ownerType property.',
    );
  }
  let ownerType: ElementVersionRef;
  try {
    ownerType = ElementVersionRef.fromJSON(record['ownerType']);
  } catch (err) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.INVALID_OWNER,
      `Failed to parse FieldDefinition ownerType: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 6. Parse valueType
  if (!('valueType' in record) || record['valueType'] === undefined || record['valueType'] === null) {
    throw new FieldDefinitionValidationError(
      FIELD_DEFINITION_ERROR_CODES.MISSING_VALUE_TYPE,
      'Raw FieldDefinition JSON missing valueType property.',
    );
  }
  const valueType = parseFieldType(record['valueType']);

  return new ImmutableFieldDefinition(
    id,
    qualifiedName,
    contextRef,
    ownerType,
    valueType,
  );
}

/**
 * Non-throwing safe parsing function for untrusted external inputs.
 */
export function tryParseFieldDefinition(raw: unknown): FieldDefinitionParseResult {
  try {
    return { ok: true, value: parseFieldDefinition(raw) };
  } catch (error) {
    if (error instanceof FieldDefinitionValidationError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new FieldDefinitionValidationError(
        FIELD_DEFINITION_ERROR_CODES.NON_OBJECT,
        error instanceof Error ? error.message : 'Unexpected parsing error',
      ),
    };
  }
}
