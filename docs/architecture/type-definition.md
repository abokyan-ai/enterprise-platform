# TypeDefinition Architecture Specification (TYPE-01)

> **Layer:** Layer C — Model Core (`@ecosystem/model-core`)  
> **Status:** Stable Baseline  
> **Governing Constitution:** [AGENTS.md](../../AGENTS.md)  
> **Architecture Decision Record:** [ADR-020](../adr/ADR-020-type-definition.md)

---

## 1. Overview and Definition

A **`TypeDefinition`** is an authored semantic definition describing a named type within a particular semantic context and at an exact semantic definition version.

It is a pure definition-level construct belonging to the **Semantic World** of the platform:

```text
Enterprise / Ecosystem Reality
            ↓
Semantic World (TypeDefinition)
            ↓
Compilation / Build World (Compiler Core / Semantic IR)
            ↓
Control Plane
            ↓
Runtime / Execution World (Mechanical Runtime / Instances)
```

`TypeDefinition` establishes the minimal, immutable, version-aware, strongly typed semantic definition of an authored type, preserving:
- **Stable Identity:** Independently identified via `SemanticElementId`.
- **Canonical Qualified Name:** Structured hierarchical naming via `QualifiedName`.
- **Explicit Interpretation Context:** Context boundary via `SemanticContextRef` ("Context Owns Meaning").
- **Fixed Classification:** Fixed element taxonomy via `SemanticElementKinds.TYPE` (`'type'`).
- **Exact Definition Version:** Exact version specification via `SemanticVersion` (e.g. `1.0.0`).

---

## 2. Architectural Ownership

`TypeDefinition` is owned exclusively by **Model Core** (`@ecosystem/model-core`), residing under `platform/model/model-core/src/types/`.

### Strict Dependency Direction
```text
Model Core (@ecosystem/model-core)
      │
      ▼ depends on
Semantic Kernel (@ecosystem/semantic-kernel)
```

- **Semantic Kernel** has **ZERO dependencies** on Model Core.
- **Model Core** imports only approved public exports from `@ecosystem/semantic-kernel`.
- **Model Core** has **ZERO dependencies** on NestJS, Angular, PrimeNG, databases, or runtime execution infrastructure.

---

## 3. Structural Contract and Relationship to SemanticElement

`TypeDefinition` extends the minimal `SemanticElement` base contract established in SK-05:

```typescript
export interface TypeDefinition extends SemanticElement {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly kind: typeof SemanticElementKinds.TYPE;
  readonly version: SemanticVersion;
  toElementVersionRef(): ElementVersionRef;
}
```

### Relationship to Semantic Kernel Primitives:
1. **`SemanticElementId` (SK-01):** Uniquely identifies the semantic element across time and mutations.
2. **`QualifiedName` (SK-03):** Encapsulates the namespace and local name (e.g. `sales.Customer`).
3. **`SemanticContextRef` (SK-04):** Binds the definition to an explicit semantic context (e.g. `sales-context`). Context owns meaning; identical names in different contexts represent distinct semantic concepts.
4. **`SemanticElementKinds.TYPE` (SK-06):** Fixed classification discriminator (`'type'`). A `TypeDefinition` cannot be constructed with or morphed into `ACTION`, `EVENT`, `POLICY`, etc.
5. **`SemanticVersion` (SK-07):** Exact SemVer specification. Missing versions are rejected (no default `1.0.0` or floating `latest`).
6. **`ElementVersionRef` (SK-07):** Convenience helper `toElementVersionRef()` derives an immutable compound reference `(id, version)` without performing registry lookups.

---

## 4. Fundamental Distinctions

| Concept | What It Is | What TypeDefinition Is NOT |
| :--- | :--- | :--- |
| **Stable Identity vs Revision** | `SemanticElementId` stays constant across versions (Customer v1.0.0 and v1.1.0 share the same ID). | `SemanticElementId` is NOT a content hash and does NOT change when version evolves. |
| **Authored Type vs PrimitiveType** | `TypeDefinition` describes a high-level domain type authored in a model. | `PrimitiveType` (SK-09) describes foundational scalar categories (`STRING`, `INT32`, etc.). |
| **Semantic Definition vs TypeScript Type** | Platform-neutral declarative definition. | NOT a TypeScript `class` or `interface` runtime constructor. |
| **Semantic Definition vs Database Table** | Abstract semantic model construct. | NOT a relational SQL table, document schema, or ORM entity. |
| **Definition vs Runtime Instance** | Design-time metadata blueprint. | NOT a stateful record of live customer data; carries NO business data. |
| **Definition vs Compiler Artifact** | Source semantic metadata. | NOT a lowered AST, Semantic IR bundle, or compiled bytecode. |

---

## 5. Validated Construction Boundary

TypeDefinition instances must be constructed through validated factory functions:

### 1. `createTypeDefinition(params)`
Accepts verified value-object instances or backward-compatible parameters:
```typescript
const customerType = createTypeDefinition({
  id: SemanticElementId.parse('typ_customer_123'),
  qualifiedName: QualifiedName.parse('sales.Customer'),
  contextRef: SemanticContextRef.parse('sales-context'),
  version: SemanticVersion.parse('1.0.0'),
});
```

### 2. `parseTypeDefinition(raw)`
Deserializes and validates untrusted external records, reconstructing constituent Kernel value objects through their respective parsers:
```typescript
const customerType = parseTypeDefinition({
  id: 'typ_customer_123',
  qualifiedName: 'sales.Customer',
  contextRef: 'sales-context',
  kind: 'type',
  version: '1.0.0',
});
```

### Validation Invariants:
- Rejects non-objects, `null`, and arrays.
- Verifies that all required fields are present and non-null (**Missing ≠ Null ≠ Value**).
- Validates authentic `instanceof` types for all Kernel value objects in `createTypeDefinition`.
- Enforces kind equals `SemanticElementKinds.TYPE`.
- Deeply freezes constructed instances via `Object.freeze`.

---

## 6. Equality Distinctions

Equality must never be ambiguous:

1. **Stable Type Identity Equality (`sameTypeIdentity(a, b)`):**
   Compares `a.id.equals(b.id)`. True if both definitions represent the same conceptual element across versions or renames.
2. **Exact Version Equality (`sameExactTypeVersion(a, b)`):**
   Compares `a.id.equals(b.id) && a.version.equals(b.version)`. True if both definitions represent the exact same element revision, including build metadata.
3. **Contextual Name Match:**
   Compares `a.contextRef.equals(b.contextRef) && a.qualifiedName.equals(b.qualifiedName)`. Does not guarantee identical IDs.

---

## 7. Serialization Boundary

`serializeTypeDefinition(typeDef)` outputs a deterministic, JSON-safe interchange object:
```json
{
  "id": "typ_customer_123",
  "qualifiedName": "sales.Customer",
  "contextRef": "sales-context",
  "kind": "type",
  "version": "1.0.0"
}
```
Serialization contains zero persistence keys, runtime hashes, or framework metadata.

---

## 8. Deferred Capabilities & Future Roadmap

In accordance with strict clean-core principles and anti-premature complexity:

- **FieldDefinition (TYPE-02):** Field definitions, types, cardinality (required/optional), nullability, and default values are deferred to TYPE-02.
- **RelationshipDefinition (TYPE-03):** Typed relationships, associations, compositions, and cross-type references are deferred to TYPE-03.
- **ConstraintDefinition:** Validation rules, invariants, and range bounds are deferred.
- **Type Inheritance & Subtyping:** Polymorphic inheritance (`extends`), interfaces (`implements`), and assignability algorithms are deferred.
- **Type Registry / Catalogs:** In-memory or distributed type resolution registries are deferred to the Model Catalog subsystem.
- **Compiler Passes:** Lowering to Semantic IR and runtime artifact generation are owned by Compiler Core.
