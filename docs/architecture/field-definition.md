# FieldDefinition Architecture Specification (TYPE-02)

> **Layer:** Layer C — Model Core (`@ecosystem/model-core`)  
> **Status:** Stable Baseline  
> **Governing Constitution:** [AGENTS.md](../../AGENTS.md)  
> **Architecture Decision Record:** [ADR-021](../adr/ADR-021-field-definition.md)

---

## 1. Overview and Fundamental Definition

A **`FieldDefinition`** is an authored semantic definition describing one named field belonging to an authored type (`TypeDefinition`).

It belongs to the **Semantic World** of the platform architecture:

```text
Enterprise / Ecosystem Reality
            ↓
Semantic World (TypeDefinition & FieldDefinition)
            ↓
Compilation / Build World (Compiler Core / Semantic IR)
            ↓
Control Plane
            ↓
Runtime / Execution World (Mechanical Runtime / Field Values)
```

`FieldDefinition` establishes the minimal, immutable, version-aware, strongly typed semantic field contract:
- **Stable Field Identity:** Independently identified via `SemanticElementId` (SK-01).
- **Canonical Qualified Naming:** Hierarchical qualified name via `QualifiedName` (SK-03).
- **Explicit Interpretation Context:** Bound to an explicit semantic boundary via `SemanticContextRef` (SK-04).
- **Fixed Classification:** Fixed element taxonomy via `SemanticElementKinds.FIELD` (`'field'`, SK-06).
- **Explicit Owner Reference:** Pinned to an exact `TypeDefinition` snapshot via `ElementVersionRef` (SK-07).
- **Declared Value Type:** Strongly typed via discriminated union `FieldType` (SK-08 & SK-09).

---

## 2. Architectural Ownership & Layer Invariants

`FieldDefinition` is owned exclusively by **Model Core** (`@ecosystem/model-core`), residing under `platform/model/model-core/src/types/`.

### Dependency Flow
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

## 3. Structural Contract

`FieldDefinition` extends the `SemanticElement` base contract (SK-05):

```typescript
export interface FieldDefinition extends SemanticElement {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly kind: typeof SemanticElementKinds.FIELD;
  readonly ownerType: ElementVersionRef;
  readonly valueType: FieldType;
}
```

### Relationship to Semantic Kernel Primitives:
1. **`SemanticElementId` (SK-01):** Distinct, stable field identity. A field's identity is NOT derived from the containing type ID, column name, or field position.
2. **`QualifiedName` (SK-03):** Hierarchical qualified name (e.g. `sales.Customer.customerId`). Qualified name syntax does NOT prove ownership.
3. **`SemanticContextRef` (SK-04):** Binds the field to its semantic interpretation context ("Context Owns Meaning").
4. **`SemanticElementKinds.FIELD` (SK-06):** Canonical element kind code `'field'`.
5. **`ElementVersionRef` (SK-07):** Pins the exact containing type identity and version (e.g. `Customer @ 1.0.0`).
6. **`FieldType`:** Discriminated value-type descriptor.

---

## 4. Declared Value-Type System (`FieldType`)

The declared value type of a field is strictly separated from its element kind and modeled as a discriminated union:

```typescript
export type FieldType =
  | PrimitiveFieldType
  | ReferencedFieldType;

export interface PrimitiveFieldType {
  readonly by: 'primitive';
  readonly primitiveType: PrimitiveType;
  readonly typeRef?: never;
}

export interface ReferencedFieldType {
  readonly by: 'reference';
  readonly typeRef: ElementRef;
  readonly primitiveType?: never;
}
```

### Invariants of the Value-Type System:
- **Compile-Time Mutual Exclusion:** The `typeRef?: never` and `primitiveType?: never` constraints prevent accidental mixed shapes.
- **Primitive Variant:** Reuses SK-09 `PrimitiveType` (e.g. `STRING`, `BOOLEAN`, `INTEGER`, `DECIMAL`, `DATE`, `TIME`, `DATETIME`).
- **Referenced Variant:** Reuses SK-08 `ElementRef` targeting an authored definition (e.g. `sales.Address`).
- **Zero Local Resolution:** The reference variant declares expected value type; it does NOT resolve the referenced target or query catalogs.

---

## 5. Ownership & Versioning Policy

### Containment via Explicit Reference
Containment is established exclusively via `ownerType: ElementVersionRef`.
- **QualifiedName hierarchy does NOT prove ownership:** `sales.Customer.name` is owned by `sales.Customer @ 1.0.0` solely because `ownerType` explicitly points to it.
- **Version Continuity:** A field retains its stable `SemanticElementId` across compatible revisions of its containing type. For example:
  - Customer v1.0.0: `name` → Field ID `fld_name_01`, Owner: `typ_customer_123 @ 1.0.0`
  - Customer v1.1.0: `name` → Field ID `fld_name_01`, Owner: `typ_customer_123 @ 1.1.0`
- **No Independent Field Versioning:** Fields do not maintain a conflicting separate SemVer lifecycle from their containing type definition snapshot.

---

## 6. Validated Construction & Equality

### Construction Boundaries:
- `createPrimitiveFieldType(primitiveType)`: Verifies canonical primitive code and freezes result.
- `createReferencedFieldType(typeRef)`: Verifies authentic `ElementRef` instance and freezes result.
- `createFieldDefinition(params)`: Enforces `instanceof` authenticity on all constituent Kernel objects and deeply freezes the resulting `ImmutableFieldDefinition`.
- `parseFieldDefinition(raw)`: Reconstructs all constituent Kernel value objects from JSON interchange records through approved parsers.

### Equality Operations:
1. **Stable Identity (`sameFieldIdentity(a, b)`):** `a.id.equals(b.id)`. True if both represent the same field across versions or renames.
2. **Owner Equality (`sameFieldOwner(a, b)`):** `a.ownerType.equals(b.ownerType)`. True if both belong to the exact same containing type snapshot.
3. **Exact Field Equivalence (`sameExactFieldDefinition(a, b)`):** True if identity, owner, qualifiedName, contextRef, and valueType are all equal.

---

## 7. Fundamental Distinctions & Boundaries

| Concept | FieldDefinition Role | Prohibited In FieldDefinition |
| :--- | :--- | :--- |
| **FieldDefinition vs Runtime FieldValue** | Declares structural blueprint. | Contains NO live record values, instance state, or mutation hooks. |
| **FieldDefinition vs Database Column** | Technology-neutral semantic model. | Contains NO SQL column types, table names, or primary/foreign keys. |
| **FieldDefinition vs Angular FormControl** | Framework-independent abstraction. | Contains NO UI widgets, validators, or presentation directives. |
| **FieldType vs RelationshipDefinition** | Declares target type of a field value. | Contains NO relationship cardinalities, navigation, or cascade rules. |
| **PrimitiveType vs Business Constraints** | Declares fundamental scalar shape. | Contains NO regex rules, min/max ranges, or business logic. |

---

## 8. Deferred Capabilities & Future Roadmap

In adherence to platform clean-core principles and anti-premature complexity:
- **Field Cardinality (Optional, Required, Repeated):** Deferred to future type-system tasks.
- **Nullability Rules:** Deferred to dedicated nullability specification.
- **Default & Computed Values:** Literal defaults, default expressions, and computed fields are deferred.
- **Field Constraints:** Length, pattern, range, precision, and uniqueness validations are deferred.
- **Relationship Modeling:** Structural graph relationships belong to TYPE-03.
- **Compilation & Runtime Artifacts:** Consumed and lowered by Compiler Core, not Model Core.
