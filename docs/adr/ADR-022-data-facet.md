# ADR-022: Immutable DataFacet With Explicit Type Ownership and Local Composition Invariants (TYPE-03)

## Status

Accepted for TYPE-03.

## Context

In model-driven enterprise platforms, defining a type's identity and metadata (TYPE-01) is strictly distinct from declaring its data-bearing structure. In conventional architectures, data fields are frequently coupled to the base type through problematic patterns:
1. **Base-Class Bloat:** Polluting the foundational `SemanticElement` or `TypeDefinition` contract with fields arrays, persistence metadata, and storage layout details.
2. **Untyped Metadata Escape Hatches:** Shunting field definitions into unstructured dictionaries (`metadata: Record<string, any>`), eliminating compile-time type safety.
3. **Conflation with Runtime Values:** Storing mutable instance state (`recordValues`, `currentValue`) directly inside structural definitions.
4. **Coupling to Persistence/ORM:** Conflating semantic data structure with SQL schemas, database tables, or primary key constraints.
5. **Coupling to Presentation/UI Frameworks:** Modeling data structures directly as UI forms, Angular FormGroups, or PrimeNG table layouts.
6. **Lack of Owner Consistency Guarantees:** Permitting a container to hold fields declared for a different type or different version snapshot.
7. **Unchecked Duplication:** Allowing duplicate field IDs or ambiguous duplicate field names within the same type scope.

TYPE-03 introduces `DataFacet v0` within Model Core (`@ecosystem/model-core`), specializing the Kernel Facet base contract (SK-10) to express the data-bearing aspect of an authored `TypeDefinition` through an immutable, ordered collection of `FieldDefinition` instances (TYPE-02).

## Decision

### 1. Architectural Ownership in Model Core

`DataFacet` belongs to Layer C (**Model Core** / `@ecosystem/model-core`), located at `platform/model/model-core/src/facets/data-facet.ts`. Model Core depends exclusively on `@ecosystem/semantic-kernel` and contains zero framework, ORM, database, or UI dependencies.

### 2. Specialization of the Facet Base Contract (SK-10)

`DataFacet` extends the generic Kernel contract `Facet<typeof DATA_FACET_KIND>`:
```typescript
export const DATA_FACET_KIND = 'core.data' as const;

export interface DataFacet extends Facet<typeof DATA_FACET_KIND> {
  readonly kind: typeof DATA_FACET_KIND;
  readonly ownerType: ElementVersionRef;
  readonly fields: readonly FieldDefinition[];
  // ...
}
```
- **Grammar Compliance:** The discriminant `'core.data'` satisfies the canonical `FacetKey` grammar (2 segments, starts with ASCII letter).
- **Discriminator Exclusivity:** The `kind` property is immutable and non-extensible.

### 3. Explicit Type Ownership via ElementVersionRef (SK-07)

Every `DataFacet` is bound to its containing `TypeDefinition` via `ownerType: ElementVersionRef`.
- **Version Snapshot Pinning:** The owner reference pins the exact `(elementId, version)` snapshot of the containing `TypeDefinition`.
- **Identity Independence:** The facet has no independent `SemanticElementId`; its identity is derived from its owner and its aspect category (`core.data`).

### 4. Local Composition Invariants

The `createDataFacet` factory enforces rigorous local composition invariants ahead-of-time:
1. **Owner Consistency:** Every `field.ownerType` in `fields` must equal `facet.ownerType` (`field.ownerType.equals(ownerType)`). A mismatch throws `DATA_FACET_ERROR_CODES.FIELD_OWNER_MISMATCH`.
2. **Field ID Uniqueness:** No two fields may share the same `SemanticElementId`. Duplicates throw `DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_ID`.
3. **Field Name Uniqueness:** No two fields may share the same local name (`field.qualifiedName.localName`). Duplicates throw `DATA_FACET_ERROR_CODES.DUPLICATE_FIELD_NAME`.
4. **Declaration Order Preservation:** The authored field sequence is preserved deterministically in `facet.fields`.
5. **Defensive Copying & Deep Immutability:** Caller-supplied arrays are defensively cloned (`[...fields]`) and frozen (`Object.freeze`). Concrete instances are frozen with `Object.freeze(this)`.

### 5. Efficient Lookup and Inspection APIs

`DataFacet` exposes indexed, O(1) lookup methods backed by immutable internal lookup tables:
- `getFieldById(id: SemanticElementId | string): FieldDefinition | undefined`
- `getFieldByName(name: string): FieldDefinition | undefined`
- `hasField(idOrName: SemanticElementId | string): boolean`
- `hasFieldId(id: SemanticElementId | string): boolean`
- `hasFieldName(name: string): boolean`
- `readonly fieldCount: number`
- `toElementVersionRef(): ElementVersionRef`

### 6. Semantic Equality Utilities

Platform consumers can test equivalence without reference identity assumptions:
- `sameDataFacetOwner(a, b)`: Tests identical owner snapshot (`a.ownerType.equals(b.ownerType)`).
- `sameExactDataFacet(a, b)`: Tests identical owner, identical fieldCount, and identical FieldDefinitions in identical order via `sameExactFieldDefinition`.

### 7. Serialization and Wire Interchange

- `DataFacetJSON`: Wire-safe interchange format with `kind`, `ownerType` (`ElementVersionRefJSON`), and `fields` (`FieldDefinitionJSON[]`).
- `serializeDataFacet(facet)`: Produces frozen `DataFacetJSON`.
- `parseDataFacet(raw)`: Reconstructs all constituent Kernel and Model value objects via validated parsers.
- `tryParseDataFacet(raw)`: Non-throwing parse returning a typed discriminated union (`DataFacetParseResult`).

### 8. Strict Scope Boundaries & Deferred Capabilities

To maintain clean-core boundaries:
- **No Runtime Field Values:** Definition metadata contains zero instance data (`FieldValue`).
- **No Persistence / Database Mapping:** Zero SQL columns, table mappings, or ORM decorators.
- **No Presentation / UI Coupling:** Zero Angular form controls, PrimeNG widgets, or visual styling hints.
- **No Relationship Modeling:** Relationships are deferred to future milestones.
- **No Compiler Dispatch:** Compilation to IR and runtime artifacts remains in Layer:compiler.

## Consequences

- **Positive:** Composition over inheritance: `TypeDefinition` remains pure, while data structure is modeled as an orthogonal, strongly typed facet.
- **Positive:** Mathematical soundness: Guaranteed owner consistency, field ID uniqueness, and field name uniqueness at construction time.
- **Positive:** O(1) field lookup by both ID and name without compromising declaration order.
- **Positive:** 100% portable Pure TypeScript without external runtime or framework dependencies.
- **Trade-off:** Consumers must manage `TypeDefinition` and `DataFacet` association explicitly or via higher-level compilation units.
