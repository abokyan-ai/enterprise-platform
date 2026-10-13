/**
 * @file data-facet.ts
 * @module @ecosystem/model-core/facets
 *
 * TYPE-03: Foundational DataFacet Contract and Implementation.
 *
 * Establishes the first concrete, strongly typed Facet contract within Model Core,
 * describing the data-bearing structure of an authored TypeDefinition through an
 * immutable, ordered collection of FieldDefinitions.
 *
 * Architectural Invariants:
 * 1. Facet Base Specialization (SK-10):
 *    - Specializes `Facet<typeof DATA_FACET_KIND>`.
 *    - Discriminant `kind` is fixed to 'core.data', conforming to FacetKey grammar.
 * 2. Distinct Concepts:
 *    - DataFacet ≠ SemanticElement: Facet has no independent SemanticElementId.
 *    - DataFacet ≠ TypeDefinition: Facet describes the data aspect; it does not replace the type definition.
 *    - DataFacet ≠ Runtime Record: Contains no runtime instance values, no mutations, no transactions.
 *    - DataFacet ≠ Persistence Schema: Zero SQL columns, table mappings, or ORM decorators.
 *    - DataFacet ≠ Presentation UI: Zero Angular form controls, PrimeNG widgets, or visual styling.
 * 3. Explicit Type Ownership (SK-07):
 *    - Explicitly bound to an exact containing TypeDefinition version snapshot via `ownerType: ElementVersionRef`.
 * 4. Local Composition Invariants:
 *    - Owner Consistency: Every FieldDefinition in the facet must share the exact same `ownerType`.
 *    - Field ID Uniqueness: No two fields may share the same `SemanticElementId`.
 *    - Field Name Uniqueness: No two fields may share the same local name within the facet.
 *    - Declaration Order Preservation: Fields preserve their authored sequence deterministically.
 *    - Defensive Copying: Inputs and outputs are strictly copied and deeply frozen (`Object.freeze`).
 * 5. Clean Architecture: Layer:model depends only on Layer:kernel. Zero external framework dependencies.
 */

import {
  type Facet,
  type ElementVersionRefJSON,
  ElementVersionRef,
  SemanticElementId,
  SemanticKernelError,
} from '@ecosystem/semantic-kernel';

import {
  type FieldDefinition,
  type FieldDefinitionJSON,
  isFieldDefinition,
  sameExactFieldDefinition,
  serializeFieldDefinition,
  parseFieldDefinition,
} from '../types/field-definition.js';

// ─── Constants and Error Codes ────────────────────────────────────────────────

/**
 * The canonical Facet discriminant identifying the DataFacet aspect category.
 * Conforms strictly to the FacetKey grammar (SK-10: 2 segments, starts with ASCII letter).
 */
export const DATA_FACET_KIND = 'core.data' as const;

export type DataFacetKind = typeof DATA_FACET_KIND;

/**
 * Structured validation error codes for DataFacet construction and validation failures.
 */
export const DATA_FACET_ERROR_CODES = {
  NON_OBJECT: 'DATA_FACET_NON_OBJECT',
  MISSING_OWNER: 'DATA_FACET_MISSING_OWNER',
  INVALID_OWNER: 'DATA_FACET_INVALID_OWNER',
  INVALID_KIND: 'DATA_FACET_INVALID_KIND',
  INVALID_FIELDS: 'DATA_FACET_INVALID_FIELDS',
  INVALID_FIELD_ELEMENT: 'DATA_FACET_INVALID_FIELD_ELEMENT',
  FIELD_OWNER_MISMATCH: 'DATA_FACET_FIELD_OWNER_MISMATCH',
  DUPLICATE_FIELD_ID: 'DATA_FACET_DUPLICATE_FIELD_ID',
  DUPLICATE_FIELD_NAME: 'DATA_FACET_DUPLICATE_FIELD_NAME',
} as const;

export type DataFacetErrorCode =
  (typeof DATA_FACET_ERROR_CODES)[keyof typeof DATA_FACET_ERROR_CODES];

/**
 * Dedicated structured validation error for DataFacet failures.
 */
export class DataFacetValidationError extends SemanticKernelError {
  public override readonly code: DataFacetErrorCode;

  constructor(code: DataFacetErrorCode, message: string) {
    super(message, code);
    this.name = 'DataFacetValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── DataFacet Contract ───────────────────────────────────────────────────────

/**
 * The foundational DataFacet contract.
 *
 * Represents an authored, immutable, version-aware facet describing the data-bearing
 * structure of an authored TypeDefinition through a collection of FieldDefinitions.
 */
export interface DataFacet extends Facet<typeof DATA_FACET_KIND> {
  /**
   * Fixed semantic facet discriminator identifying the data structure aspect category.
   * Conforms to FacetKey grammar: 'core.data'.
   */
  readonly kind: typeof DATA_FACET_KIND;

  /**
   * Exact containing TypeDefinition version snapshot ownership (SK-07).
   * Identifies the exact type version to which this data facet belongs.
   */
  readonly ownerType: ElementVersionRef;

  /**
   * Immutable, ordered list of FieldDefinitions composing this type's data structure.
   * Declaration order is strictly preserved.
   */
  readonly fields: readonly FieldDefinition[];

  /**
   * Total number of declared fields in this facet.
   */
  readonly fieldCount: number;

  /**
   * Retrieves a FieldDefinition by its SemanticElementId or string URN.
   *
   * @param id The SemanticElementId or URN string to find.
   * @returns The matching FieldDefinition, or undefined if not found.
   */
  getFieldById(id: SemanticElementId | string): FieldDefinition | undefined;

  /**
   * Retrieves a FieldDefinition by its declared local name.
   *
   * @param name The field's local name to find (e.g. 'customerId').
   * @returns The matching FieldDefinition, or undefined if not found.
   */
  getFieldByName(name: string): FieldDefinition | undefined;

  /**
   * Checks whether a field exists by either its SemanticElementId or local name.
   *
   * @param idOrName The SemanticElementId or string name/URN to check.
   * @returns True if the field exists in this facet, false otherwise.
   */
  hasField(idOrName: SemanticElementId | string): boolean;

  /**
   * Checks whether a field exists by its exact SemanticElementId.
   */
  hasFieldId(id: SemanticElementId | string): boolean;

  /**
   * Checks whether a field exists by its exact local name.
   */
  hasFieldName(name: string): boolean;

  /**
   * Convenience helper returning the owner ElementVersionRef.
   */
  toElementVersionRef(): ElementVersionRef;
}

/**
 * Input parameters for creating a validated, immutable DataFacet.
 */
export interface CreateDataFacetParams {
  /** The exact containing TypeDefinition version snapshot ownership */
  readonly ownerType: ElementVersionRef;

  /** Optional collection of FieldDefinitions belonging to this facet (default: empty) */
  readonly fields?: readonly FieldDefinition[];

  /** Optional kind parameter (if supplied, must equal 'core.data') */
  readonly kind?: typeof DATA_FACET_KIND;
}

/**
 * Wire-safe JSON interchange shape for DataFacet.
 */
export interface DataFacetJSON {
  readonly kind: typeof DATA_FACET_KIND;
  readonly ownerType: ElementVersionRefJSON;
  readonly fields: readonly FieldDefinitionJSON[];
}

/**
 * Discriminated result type for non-throwing parsing.
 */
export type DataFacetParseResult =
  | { readonly ok: true; readonly value: DataFacet }
  | { readonly ok: false; readonly error: DataFacetValidationError };

// ─── Concrete Immutable Implementation ────────────────────────────────────────

/**
 * Concrete immutable implementation of DataFacet.
 */
class ImmutableDataFacet implements DataFacet {
  public readonly kind: typeof DATA_FACET_KIND = DATA_FACET_KIND;
  public readonly ownerType: ElementVersionRef;
  public readonly fields: readonly FieldDefinition[];

  // O(1) indexed lookup tables built at construction
  private readonly _byId: Map<string, FieldDefinition>;
  private readonly _byName: Map<string, FieldDefinition>;

  constructor(
    ownerType: ElementVersionRef,
    fields: readonly FieldDefinition[],
  ) {
    this.ownerType = ownerType;
    this.fields = Object.freeze([...fields]);

    const byId = new Map<string, FieldDefinition>();
    const byName = new Map<string, FieldDefinition>();

    for (const field of this.fields) {
      byId.set(field.id.toString(), field);
      byName.set(field.qualifiedName.localName.toString(), field);
    }

    this._byId = byId;
    this._byName = byName;

    Object.freeze(this);
  }

  public get fieldCount(): number {
    return this.fields.length;
  }

  public getFieldById(id: SemanticElementId | string): FieldDefinition | undefined {
    const key = typeof id === 'string' ? id : id.toString();
    return this._byId.get(key);
  }

  public getFieldByName(name: string): FieldDefinition | undefined {
    return this._byName.get(name);
  }

  public hasField(idOrName: SemanticElementId | string): boolean {
    if (typeof idOrName === 'string') {
      return this._byName.has(idOrName) || this._byId.has(idOrName);
    }
    return this._byId.has(idOrName.toString());
  }

  public hasFieldId(id: SemanticElementId | string): boolean {
    const key = typeof id === 'string' ? id : id.toString();
    return this._byId.has(key);
  }

  public hasFieldName(name: string): boolean {
    return this._byName.has(name);
  }

  public toElementVersionRef(): ElementVersionRef {
    return this.ownerType;
  }
}

// ─── Factory and Type Guards ──────────────────────────────────────────────────

/**
 * Type guard verifying whether a candidate value conforms to the DataFacet contract.
 */
export function isDataFacet(value: unknown): value is DataFacet {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate['kind'] !== DATA_FACET_KIND) {
    return false;
  }

  if (!(candidate['ownerType'] instanceof ElementVersionRef)) {
    return false;
  }

  if (!Array.isArray(candidate['fields'])) {
    return false;
  }

  const ownerType = candidate['ownerType'] as ElementVersionRef;
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const field of candidate['fields']) {
    if (!isFieldDefinition(field)) {
      return false;
    }
    if (!field.ownerType.equals(ownerType)) {
      return false;
    }
    const idStr = field.id.toString();
    if (seenIds.has(idStr)) {
      return false;
    }
    seenIds.add(idStr);

    const nameStr = field.qualifiedName.localName.toString();
    if (seenNames.has(nameStr)) {
      return false;
    }
    seenNames.add(nameStr);
  }

  return true;
}

/**
 * Validates candidate parameters and constructs an immutable DataFacet.
 *
 * Invariants Enforced:
 * 1. Owner Authenticity: `ownerType` must be an authentic `ElementVersionRef` instance.
 * 2. Kind Discriminant: If supplied, `kind` must equal 'core.data'.
 * 3. Field Collection Structure: `fields` must be an array (if provided).
 * 4. Field Authenticity: Every item in `fields` must be an authentic `FieldDefinition`.
 * 5. Owner Consistency: Every field's `ownerType` must be structurally equal to the facet's `ownerType`.
 * 6. Field ID Uniqueness: No two fields may share the same `SemanticElementId`.
 * 7. Field Name Uniqueness: No two fields may share the same local name.
 * 8. Declaration Order Preservation: Authored sequence is preserved as declared.
 * 9. Defensive Copying & Deep Immutability: Deeply frozen instance with zero caller mutation vectors.
 *
 * @param params Parameters containing authentic owner reference and optional field definitions.
 * @returns Frozen, validated DataFacet instance.
 * @throws DataFacetValidationError on any contract violation.
 */
export function createDataFacet(params: CreateDataFacetParams): DataFacet {
  if (params === null || typeof params !== 'object') {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.NON_OBJECT,
      'DataFacet creation requires a non-null parameters object.',
    );
  }

  // 1. Validate ownerType
  if (!('ownerType' in params) || params.ownerType === undefined || params.ownerType === null) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.MISSING_OWNER,
      'DataFacet requires an ownerType property identifying its containing TypeDefinition version snapshot.',
    );
  }
  if (!(params.ownerType instanceof ElementVersionRef)) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.INVALID_OWNER,
      'DataFacet ownerType must be an authentic ElementVersionRef instance.',
    );
  }

  const ownerType = params.ownerType;

  // 2. Validate kind (if supplied)
  if ('kind' in params && params.kind !== undefined) {
    if (params.kind !== DATA_FACET_KIND) {
      throw new DataFacetValidationError(
        DATA_FACET_ERROR_CODES.INVALID_KIND,
        `DataFacet kind must be '${DATA_FACET_KIND}', received: '${String(params.kind)}'.`,
      );
    }
  }

  // 3. Validate fields collection
  const rawFields = params.fields;
  let fieldList: readonly FieldDefinition[];

  if (rawFields === undefined) {
    fieldList = [];
  } else if (!Array.isArray(rawFields)) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.INVALID_FIELDS,
      `DataFacet fields property must be an array, received: ${typeof rawFields}.`,
    );
  } else {
    const validatedFields: FieldDefinition[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    for (let i = 0; i < rawFields.length; i++) {
      const field = rawFields[i];

      // 4. Authenticity check
      if (!isFieldDefinition(field)) {
        throw new DataFacetValidationError(
          DATA_FACET_ERROR_CODES.INVALID_FIELD_ELEMENT,
          `DataFacet field at index ${i} is not an authentic FieldDefinition instance.`,
        );
      }

      // 5. Owner consistency invariant
      if (!field.ownerType.equals(ownerType)) {
        throw new DataFacetValidationError(
          DATA_FACET_ERROR_CODES.FIELD_OWNER_MISMATCH,
          `DataFacet field '${field.qualifiedName.toString()}' (index ${i}) ownerType (${field.ownerType.toString()}) does not match DataFacet ownerType (${ownerType.toString()}).`,
        );
      }

      // 6. Field ID uniqueness invariant
      const idStr = field.id.toString();
      if (seenIds.has(idStr)) {
        throw new DataFacetValidationError(
          DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_ID,
          `DataFacet duplicate field id '${idStr}' encountered at index ${i}.`,
        );
      }
      seenIds.add(idStr);

      // 7. Field Name uniqueness invariant
      const nameStr = field.qualifiedName.localName.toString();
      if (seenNames.has(nameStr)) {
        throw new DataFacetValidationError(
          DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_NAME,
          `DataFacet duplicate field name '${nameStr}' encountered at index ${i}.`,
        );
      }
      seenNames.add(nameStr);

      validatedFields.push(field);
    }

    fieldList = validatedFields;
  }

  return new ImmutableDataFacet(ownerType, fieldList);
}

// ─── Semantic Equality Utilities ──────────────────────────────────────────────

/**
 * Compares two DataFacets for containing type ownership equality.
 * Verifies that both facets target the exact same TypeDefinition version snapshot.
 */
export function sameDataFacetOwner(a: DataFacet, b: DataFacet): boolean {
  if (a === b) {
    return true;
  }
  return a.ownerType.equals(b.ownerType);
}

/**
 * Compares two DataFacets for exact structural and semantic equivalence.
 * Verifies identical ownerType, identical fieldCount, and identical FieldDefinitions
 * in identical declaration order.
 */
export function sameExactDataFacet(a: DataFacet, b: DataFacet): boolean {
  if (a === b) {
    return true;
  }
  if (!sameDataFacetOwner(a, b)) {
    return false;
  }
  if (a.fieldCount !== b.fieldCount) {
    return false;
  }
  for (let i = 0; i < a.fields.length; i++) {
    const fieldA = a.fields[i];
    const fieldB = b.fields[i];
    if (fieldA === undefined || fieldB === undefined || !sameExactFieldDefinition(fieldA, fieldB)) {
      return false;
    }
  }
  return true;
}

// ─── Serialization and Deserialization ────────────────────────────────────────

/**
 * Serializes a DataFacet into a deterministic, wire-safe JSON interchange object.
 */
export function serializeDataFacet(facet: DataFacet): DataFacetJSON {
  return Object.freeze({
    kind: DATA_FACET_KIND,
    ownerType: facet.ownerType.toJSON(),
    fields: Object.freeze(facet.fields.map(serializeFieldDefinition)),
  });
}

/**
 * Strictly parses and deserializes raw interchange data into an authentic DataFacet.
 * Reconstructs all constituent Kernel and Model value objects through their approved parsers.
 */
export function parseDataFacet(raw: unknown): DataFacet {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.NON_OBJECT,
      'DataFacet deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;

  // 1. Validate kind
  if (!('kind' in record) || record['kind'] !== DATA_FACET_KIND) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.INVALID_KIND,
      `DataFacet JSON kind must be '${DATA_FACET_KIND}', received: '${String(record['kind'])}'.`,
    );
  }

  // 2. Parse ownerType
  if (!('ownerType' in record) || record['ownerType'] === undefined || record['ownerType'] === null) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.MISSING_OWNER,
      'Raw DataFacet JSON missing ownerType property.',
    );
  }
  let ownerType: ElementVersionRef;
  try {
    ownerType = ElementVersionRef.fromJSON(record['ownerType']);
  } catch (err) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.INVALID_OWNER,
      `Failed to parse DataFacet ownerType: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 3. Parse fields
  if (!('fields' in record) || !Array.isArray(record['fields'])) {
    throw new DataFacetValidationError(
      DATA_FACET_ERROR_CODES.INVALID_FIELDS,
      'Raw DataFacet JSON fields property must be an array.',
    );
  }

  const parsedFields: FieldDefinition[] = [];
  const rawFields = record['fields'] as readonly unknown[];

  for (let i = 0; i < rawFields.length; i++) {
    const rawField = rawFields[i];
    try {
      const field = parseFieldDefinition(rawField);
      parsedFields.push(field);
    } catch (err) {
      throw new DataFacetValidationError(
        DATA_FACET_ERROR_CODES.INVALID_FIELD_ELEMENT,
        `Failed to parse field at index ${i}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return createDataFacet({
    ownerType,
    fields: parsedFields,
  });
}

/**
 * Non-throwing safe parsing function for untrusted external inputs.
 */
export function tryParseDataFacet(raw: unknown): DataFacetParseResult {
  try {
    return { ok: true, value: parseDataFacet(raw) };
  } catch (error) {
    if (error instanceof DataFacetValidationError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new DataFacetValidationError(
        DATA_FACET_ERROR_CODES.NON_OBJECT,
        error instanceof Error ? error.message : 'Unexpected parsing error',
      ),
    };
  }
}
