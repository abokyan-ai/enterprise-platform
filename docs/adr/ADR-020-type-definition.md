# ADR-020: Versioned, Immutable TypeDefinition in Model Core (TYPE-01)

## Status

Accepted for TYPE-01.

## Context

The Model-Driven Enterprise Ecosystem Platform distinguishes between the **Semantic Kernel** (Layer B — irreducible primitives, identity contracts, and diagnostic models) and the **Model Core** (Layer C — domain-agnostic semantic meta-model definitions).

In enterprise systems, type definitions are frequently compromised by:
1. **Coupling to Presentation/Runtime Frameworks:** Defining types as TypeScript classes, NestJS DTOs, or Angular component models, tying business semantics to transient web technologies.
2. **Coupling to Persistence/ORM:** Conflating the semantic definition of a type with a relational table schema, ORM entity decorators, or database column nullability.
3. **Mutable Identity & Conflation with Version:** Overwriting existing type definitions in place, or conversely generating a new identity every time a version is bumped, destroying cross-version lineage.
4. **Premature Structural Baggage:** Forcing untyped or loosely typed `fields: unknown[]` arrays into initial contracts before formal field, constraint, and relationship contracts exist.
5. **Runtime Bypass:** Interpreting raw, unvalidated authoring JSON directly in runtime execution engines without ahead-of-time semantic validation.

TYPE-01 introduces `TypeDefinition` as the foundational, immutable, version-aware semantic definition of an authored type within the Pure TypeScript Model Core.

## Decision

### 1. Architectural Ownership in Model Core

`TypeDefinition` belongs to Layer C (**Model Core** / `@ecosystem/model-core`), not the Semantic Kernel. The Semantic Kernel remains zero-dependency and minimal (SK-01 through SK-11). Model Core depends unidirectionally on Semantic Kernel and composes its primitives. Semantic Kernel never imports Model Core.

### 2. Composition of Authoritative Semantic Kernel Primitives

`TypeDefinition` extends `SemanticElement` (SK-05) and composes authentic Kernel value objects:
- `id: SemanticElementId` (SK-01) — Stable platform-independent identity.
- `qualifiedName: QualifiedName` (SK-03) — Canonical hierarchical naming within a namespace scope.
- `contextRef: SemanticContextRef` (SK-04) — Explicit bounded interpretation context ("Context Owns Meaning").
- `kind: typeof SemanticElementKinds.TYPE` (SK-06) — Fixed element classification (`'type'`).
- `version: SemanticVersion` (SK-07) — Exact definition version (e.g. `1.0.0`).

### 3. Fixed TYPE Classification

A `TypeDefinition` is exclusively classified as `SemanticElementKinds.TYPE` (`'type'`). It cannot be constructed with other element kinds (`ACTION`, `EVENT`, `POLICY`, etc.), nor can its classification be modified post-construction.

### 4. Exact Definition Version Requirement

Every `TypeDefinition` requires an explicit, exact `SemanticVersion` (e.g. `1.0.0`). In accordance with platform governance:
- Missing versions are rejected (no defaulting to `1.0.0` or implicit `latest`).
- Version ranges (`^1.0.0`) are forbidden at the definition level.
- Build metadata is preserved for exact equality comparison via `version.equals(other.version)`.

### 5. Stable Definition Identity Independent of Name and Version

A semantic type's `SemanticElementId` is independent of its `QualifiedName`, `Namespace`, and `SemanticVersion`. Under model evolution:
- Customer v1.0.0 and Customer v1.1.0 share the exact same `SemanticElementId`.
- Renaming `sales.Customer` to `sales.Client` retains its stable `SemanticElementId`.
- Semantic identity is never derived from JSON hashes, storage keys, or database primary keys.

### 6. Strict Runtime Immutability

Every constructed `TypeDefinition` is deeply frozen (`Object.freeze`). It exposes no setters or mutating methods. Property accessors return frozen or immutable values.

### 7. Validated Construction Boundary

Construction is mediated by `createTypeDefinition(...)` and `parseTypeDefinition(...)`. These factories enforce:
- Non-null, object-level parameters.
- Instance authenticity for all Kernel value objects (`instanceof`).
- Prevention of spoofed objects or untrusted string bags.
- Structured, predictable errors using `TypeDefinitionValidationError` with machine-readable error codes (`TYPE_DEFINITION_ERROR_CODES`).

### 8. Strict Scope Boundaries (Deferral of Fields, Relationships, and Runtime)

To prevent premature complexity and maintain clean architecture:
- **No FieldDefinition implementation:** No speculative `fields: unknown[]` arrays or cardinality rules.
- **No RelationshipDefinition implementation:** No relationship graphs, foreign keys, or navigation properties.
- **No Inheritance or Subtyping:** No `extends`, `implements`, or assignability checks in TYPE-01.
- **No Runtime Instance or Persistence Coupling:** No `InstanceId`, no database tables, no SQL mapping, no ORM decorators.
- **No Compiler Integration:** No AST lowering, IR generation, or TypeScript code emission.

## Consequences

- **Positive:** A rock-solid, strongly typed, immutable foundation for authored types in Model Core.
- **Positive:** Clear separation between stable definition identity (`SemanticElementId`) and exact revision (`SemanticVersion`).
- **Positive:** Zero framework dependencies—Pure TypeScript executing portably in Node.js, browsers, or worker threads.
- **Positive:** Unidirectional dependency: `Model Core → Semantic Kernel`. Zero circular dependencies.
- **Trade-off:** Consumer code requiring field-level schemas or relationships must wait for TYPE-02 and subsequent semantic type system milestones.
