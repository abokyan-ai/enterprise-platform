# DataFacet v0 Architecture — TYPE-03

**Module:** `@ecosystem/model-core`  
**Layer:** C. Semantic Type System — Pure TypeScript Model Core  
**Milestone:** TYPE-03 — DataFacet v0  
**Status:** Implemented  
**ADR:** [ADR-022](../adr/ADR-022-data-facet.md)

---

## 1. Executive Summary and Purpose

In a model-driven enterprise architecture, business entities and data structures must be described with mathematical precision, decoupled from physical databases, runtime object state, and UI presentation frameworks.

While **TYPE-01 (`TypeDefinition`)** establishes the identity and context boundary of an authored type, and **TYPE-02 (`FieldDefinition`)** defines individual authored field specifications, **TYPE-03 (`DataFacet v0`)** provides the structural composition bridge:
- It specializes the foundational Kernel **Facet base contract (SK-10)** under the canonical aspect key `'core.data'`.
- It binds to an exact containing `TypeDefinition` snapshot via **`ElementVersionRef` (SK-07)**.
- It aggregates an ordered, immutable collection of `FieldDefinition` instances while enforcing ahead-of-time local composition invariants (owner consistency, field ID uniqueness, field name uniqueness).
- It provides O(1) indexed lookup APIs by both field identity and local name without mutating or re-ordering the authored sequence.

---

## 2. Architectural Boundaries and Invariants

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TypeDefinition (TYPE-01)                        │
│          id: SemanticElementId | version: SemanticVersion              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ pinned by ElementVersionRef
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          DataFacet (TYPE-03)                           │
│   kind: 'core.data' | ownerType: ElementVersionRef                     │
├────────────────────────────────────────────────────────────────────────┤
│   fields: readonly FieldDefinition[] (Preserving Declaration Order)    │
│   ├── Field 0: customerId (id, ownerType, PrimitiveFieldType: STRING)   │
│   ├── Field 1: email      (id, ownerType, PrimitiveFieldType: STRING)   │
│   └── Field 2: status     (id, ownerType, PrimitiveFieldType: STRING)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Non-Negotiable Invariants:

1. **Composition over Inheritance:** `TypeDefinition` does not inherit or bake in storage layout or fields. Data-bearing structure is attached as an orthogonal `Facet`.
2. **Facet ≠ SemanticElement:** A `DataFacet` is an aspect descriptor; it does NOT possess an independent `SemanticElementId`. Its identity is established by its containing type and its `'core.data'` aspect key.
3. **Definition ≠ Instance ≠ Execution:** `DataFacet` holds structural metadata only. It contains NO runtime field values, transaction state, or database connection handles.
4. **Owner Consistency:** Every `FieldDefinition` contained in `DataFacet.fields` must have its `ownerType` match the facet's `ownerType` exactly.
5. **Field ID Uniqueness:** No two fields within a `DataFacet` may share the same `SemanticElementId`.
6. **Field Name Uniqueness:** No two fields within a `DataFacet` may share the same local name (`field.qualifiedName.localName`).
7. **Declaration Order Preservation:** The sequence in which fields are authored is preserved deterministically.
8. **Defensive Copying & Deep Immutability:** All input arrays and output collections are defensively copied and frozen via `Object.freeze`.
9. **Layer Purity:** Pure TypeScript in `@ecosystem/model-core`, depending strictly on `@ecosystem/semantic-kernel`. Zero external framework dependencies.

---

## 3. Facet Base Specialization (SK-10)

`DataFacet` extends `Facet<typeof DATA_FACET_KIND>`:

```typescript
export const DATA_FACET_KIND = 'core.data' as const;
export type DataFacetKind = typeof DATA_FACET_KIND;

export interface DataFacet extends Facet<typeof DATA_FACET_KIND> {
  readonly kind: typeof DATA_FACET_KIND;
  readonly ownerType: ElementVersionRef;
  readonly fields: readonly FieldDefinition[];
  readonly fieldCount: number;
  // ...
}
```

### Grammar Compliance
The facet discriminant `'core.data'` strictly conforms to the canonical `FacetKey` grammar:
- Contains exactly 2 segments (`core` and `data`), separated by `.`.
- Starts with an ASCII letter `[a-zA-Z]`.
- Length (9 characters) is well within the 3 to 256 character boundary.

---

## 4. Explicit Type Ownership via ElementVersionRef

Every `DataFacet` must be explicitly owned by an exact `(elementId, version)` snapshot of a `TypeDefinition`:

```typescript
const customerTypeRef = ElementVersionRef.fromParts(
  SemanticElementId.parse('ecosystem.crm.Customer'),
  SemanticVersion.parse('1.0.0'),
);

const dataFacet = createDataFacet({
  ownerType: customerTypeRef,
  fields: [customerIdField, customerNameField],
});
```

- **Snapshot Pinning:** If `Customer` evolves from `1.0.0` to `2.0.0`, fields and facets declared for `1.0.0` remain immutable and pinned to that snapshot.
- **Strict Validation:** The factory rejects missing or invalid owner references with `DATA_FACET_ERROR_CODES.MISSING_OWNER` or `DATA_FACET_ERROR_CODES.INVALID_OWNER`.

---

## 5. Local Composition Invariants

### A. Owner Consistency
A `DataFacet` cannot contain fields belonging to another type or another version snapshot:
```typescript
if (!field.ownerType.equals(facetOwnerType)) {
  throw new DataFacetValidationError(
    DATA_FACET_ERROR_CODES.FIELD_OWNER_MISMATCH,
    `DataFacet field '${field.qualifiedName.toString()}' ownerType does not match DataFacet ownerType.`,
  );
}
```

### B. Field ID Uniqueness
Every field must possess a unique `SemanticElementId` within the facet:
```typescript
if (seenIds.has(field.id.toString())) {
  throw new DataFacetValidationError(
    DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_ID,
    `DataFacet duplicate field id '${field.id.toString()}' encountered.`,
  );
}
```

### C. Field Name Uniqueness
Within the scope of the containing type, field local names must be unambiguous:
```typescript
if (seenNames.has(field.qualifiedName.localName.toString())) {
  throw new DataFacetValidationError(
    DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_NAME,
    `DataFacet duplicate field name '${field.qualifiedName.localName.toString()}' encountered.`,
  );
}
```

### D. Declaration Order Preservation
Fields are stored and iterated in the exact sequence in which they were declared. This ensures deterministic compilation and schema generation.

---

## 6. Lookup and Inspection APIs

`DataFacet` provides both linear ordered access and O(1) indexed lookups:

| Method / Property | Return Type | Description |
| :--- | :--- | :--- |
| `fields` | `readonly FieldDefinition[]` | Frozen array of all fields in declaration order |
| `fieldCount` | `number` | Total number of declared fields |
| `getFieldById(id)` | `FieldDefinition \| undefined` | O(1) lookup by `SemanticElementId` or URN string |
| `getFieldByName(name)` | `FieldDefinition \| undefined` | O(1) lookup by local name string |
| `hasField(idOrName)` | `boolean` | Checks existence by ID or local name |
| `hasFieldId(id)` | `boolean` | Checks existence by exact `SemanticElementId` |
| `hasFieldName(name)` | `boolean` | Checks existence by exact local name |
| `toElementVersionRef()` | `ElementVersionRef` | Returns the owner `ElementVersionRef` |

---

## 7. Semantic Equality Utilities

Platform consumers can test equivalence without relying on JavaScript object reference equality:

- **`sameDataFacetOwner(a, b)`**: Verifies whether two facets target the exact same `(elementId, version)` snapshot.
- **`sameExactDataFacet(a, b)`**: Verifies full structural and semantic equivalence:
  1. Identical owner snapshot (`sameDataFacetOwner`).
  2. Identical field count (`a.fieldCount === b.fieldCount`).
  3. Identical `FieldDefinition` instances at every index in declaration order (`sameExactFieldDefinition(a.fields[i], b.fields[i])`).

---

## 8. Serialization and Wire Interchange

`DataFacet` provides deterministic JSON interchange support:

```typescript
export interface DataFacetJSON {
  readonly kind: typeof DATA_FACET_KIND;
  readonly ownerType: ElementVersionRefJSON;
  readonly fields: readonly FieldDefinitionJSON[];
}

// Serialize
const json = serializeDataFacet(dataFacet);

// Parse with strict validation
const restored = parseDataFacet(json);

// Non-throwing parse
const result = tryParseDataFacet(untrustedInput);
if (result.ok) {
  // result.value is authentic DataFacet
} else {
  // result.error is DataFacetValidationError
}
```

---

## 9. Strict Scope Boundaries & Deferred Capabilities

To adhere to clean-core architecture and prevent premature complexity:
- **No Runtime Field Values:** Definition metadata contains zero instance data (`FieldValue`).
- **No Persistence / Database Mapping:** Zero SQL columns, table mappings, or ORM decorators.
- **No Presentation / UI Coupling:** Zero Angular form controls, PrimeNG widgets, or visual styling hints.
- **No Relationship Modeling:** Authored type references represent field value-types; structural relationships are deferred.
- **No Compiler Dispatch:** Compilation to IR and runtime execution artifacts is strictly isolated to Layer:compiler.

---

## 10. Architectural Conformance Checklist

| Requirement | Implementation | Status |
| :--- | :--- | :--- |
| Facet Base Specialization (SK-10) | Extends `Facet<'core.data'>` with FacetKey grammar | Verified |
| Explicit Owner Pinning (SK-07) | Bound to `ElementVersionRef` | Verified |
| Composition of FieldDefinitions (TYPE-02) | Holds ordered `readonly FieldDefinition[]` | Verified |
| Owner Consistency Invariant | Rejects mismatched `field.ownerType` | Verified |
| Field ID Uniqueness Invariant | Rejects duplicate `SemanticElementId` | Verified |
| Field Name Uniqueness Invariant | Rejects duplicate local name | Verified |
| Declaration Order Preservation | Preserves authored array sequence | Verified |
| Immutability & Defensive Copying | `Object.freeze` on instance and fields | Verified |
| O(1) Indexed Lookup | `getFieldById` and `getFieldByName` maps | Verified |
| Serialization Roundtrip | `serializeDataFacet`, `parseDataFacet` | Verified |
| Zero External Dependencies | Pure TypeScript in `@ecosystem/model-core` | Verified |
