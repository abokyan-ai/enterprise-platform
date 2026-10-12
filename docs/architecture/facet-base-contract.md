# Facet Base Contract — SK-10

**Module:** `@ecosystem/semantic-kernel`  
**Layer:** B. Semantic Kernel — Pure TypeScript  
**Milestone:** SK-10 — Facet Base Contract  
**Status:** Implemented  
**ADR:** [ADR-018](../adr/ADR-018-facet-base-contract.md)

---

## 1. Executive Summary and Purpose

In a model-driven enterprise platform, semantic definitions (such as types, fields, actions, and events) frequently need to express orthogonal concerns—documentation, UI layout hints, data validation rules, localization metadata, auditing directives, and persistence requirements.

Historically, systems solve this either by:
1. **Expanding base definitions:** Adding countless optional attributes to a central `SemanticElement` base class.
2. **Untyped property bags:** Adding an arbitrary `metadata: Record<string, any>` dictionary.

Both approaches lead to fragility, lack of compile-time safety, unpredictable compilation, and hidden side effects.

**SK-10 establishes the Facet Base Contract:**
- A minimal, immutable, framework-independent contract based on **composition over inheritance**.
- Strong generic typing where specialized facets extend `Facet<TKind>` with aspect-specific properties.
- An explicit, validated `FacetKey` value object governing the facet aspect category.
- Absolute rejection of untyped metadata escape hatches.
- Complete isolation from execution, compilation, persistence, and presentation runtimes.

---

## 2. Architectural Boundaries and Core Invariants

The platform maintains strict conceptual boundaries:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Semantic Definition                             │
│       (Identity, Canonical Qualified Naming, Interpretation Context)   │
├────────────────────────────────────────────────────────────────────────┤
│                           Semantic Facets                              │
│         (Orthogonal, explicitly declared aspects of the definition)    │
│  ├── core.documentation     → Explanatory text & doc annotations       │
│  ├── validation.required    → Declared constraint aspect               │
│  └── presentation.displayName → User-facing display hint               │
└────────────────────────────────────────────────────────────────────────┘
```

### Non-Negotiable Distinctions

| Concept A | Concept B | Architectural Distinction |
| :--- | :--- | :--- |
| **Facet** | **SemanticElement** | A facet is an orthogonal aspect of a definition; it is NOT an addressable semantic element. It has no `SemanticElementId`. |
| **FacetKey** | **SemanticElementKind** | `SemanticElementKind` (SK-06) classifies a definition (`TYPE`, `FIELD`). `FacetKey` identifies an aspect category (`core.documentation`). |
| **FacetKey** | **QualifiedName** | `QualifiedName` (SK-03) identifies an element within a namespace. `FacetKey` identifies an aspect taxonomy and undergoes no namespace lookup. |
| **Facet** | **PrimitiveType** | `PrimitiveType` (SK-09) classifies scalar values. Facets enrich semantic definitions. |
| **Facet** | **ElementRef** | `ElementRef` (SK-08) denotes reference intent to another definition. Facets do not resolve references. |
| **Facet Absent** | **Facet with Null** | Missing facet = undeclared aspect. No automatic null or default facets. |

---

## 3. The Facet Base Contract API

### The Base Interface

The base interface carries only the immutable discriminant `kind`:

```typescript
export interface Facet<TKind extends string = string> {
  readonly kind: TKind;
}
```

- Minimal by design: zero speculative payload fields.
- Discriminant `kind` must satisfy the canonical `FacetKey` grammar.
- Readonly structural invariant.

### Type-Safe Specialization Pattern

Specialized concrete facets extend `Facet` with their own strongly typed, immutable properties:

```typescript
// Example: Documentation Facet
export interface DocumentationFacet extends Facet<'core.documentation'> {
  readonly text: string;
}

// Example: Required Validation Facet
export interface RequiredValidationFacet extends Facet<'validation.required'> {
  readonly message?: string;
}

// Discriminated Union pattern across facets
export type CustomerFacet = DocumentationFacet | RequiredValidationFacet;

function handleFacet(facet: CustomerFacet): void {
  switch (facet.kind) {
    case 'core.documentation':
      // TypeScript automatically narrows to DocumentationFacet
      console.log(facet.text);
      break;
    case 'validation.required':
      // TypeScript automatically narrows to RequiredValidationFacet
      console.log(facet.message);
      break;
  }
}
```

---

## 4. FacetKey Value Object and Grammar

The `FacetKey` value object provides strict, deterministic validation and canonical representation for facet category identifiers.

### Canonical Grammar Specifications

- **Separator:** `.` (ASCII 46)
- **Minimum Length:** 3 characters
- **Maximum Length:** 256 characters
- **Minimum Segments:** 2 segments (`scope.aspect`)
- **Maximum Segments:** 8 segments
- **Maximum Segment Length:** 64 characters
- **Segment Grammar:** Starts with ASCII letter `[a-zA-Z]`, followed by `[a-zA-Z0-9_-]`
- **Case Policy:** Case-sensitive. Preserves exact casing (e.g., `presentation.displayName`). No silent lowercasing.
- **Whitespace Policy:** Strictly forbidden. Leading, trailing, or interior whitespace is immediately rejected (no silent trimming).

### FacetKey API Overview

```typescript
import { FacetKey } from '@ecosystem/semantic-kernel';

// Throwing parser
const key = FacetKey.parse('core.documentation');

// Non-throwing parser
const result = FacetKey.tryParse('validation.required');
if (result.ok) {
  console.log(result.value.value);     // 'validation.required'
  console.log(result.value.scope);     // 'validation'
  console.log(result.value.localName); // 'required'
  console.log(result.value.segments);  // ['validation', 'required']
}

// Type guard
if (FacetKey.isValid('presentation.displayName')) {
  // Conforms to grammar
}

// Value equality
key.equals(FacetKey.parse('core.documentation')); // true
```

---

## 5. Structural Validation vs. Semantic Interpretation

The Semantic Kernel enforces **Structural Validation**:
- Does the input satisfy the object shape?
- Is the `kind` property present and a string?
- Does the `kind` string satisfy the `FacetKey` grammar?

```typescript
import { validateFacetBase, isFacet } from '@ecosystem/semantic-kernel';

isFacet({ kind: 'core.documentation' }); // true
isFacet({ kind: 'invalid key' });         // false
isFacet({ missingKind: true });           // false
isFacet(null);                            // false
```

### What SK-10 Explicitly Does NOT Validate

- Does NOT validate specialized payload content (e.g. `text` property of a documentation facet).
- Does NOT validate whether a facet is semantically applicable to a particular `SemanticElementKind`.
- Does NOT perform runtime enforcement or compilation passes.

---

## 6. Composition with SemanticElement

SK-05 established the minimal `SemanticElement` base contract:

```typescript
export interface SemanticElement {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
}
```

In accordance with architectural principles:
- `SemanticElement` remains **unaltered**; zero breaking changes are introduced.
- Future specialized model definitions compose facets alongside element properties.
- No imperative mutation methods (e.g. `attachFacet()`) are added. Definitions remain immutable.

---

## 7. Deferred Responsibilities and Prohibited Machinery

To protect Clean Architecture and prevent premature complexity, the following are strictly excluded:

1. **No Universal Facet Registry:** No global `FacetRegistry`, no package scanners, no dynamic plugin loading.
2. **No Automatic Inheritance:** Facets do not automatically cascade from namespaces or parent definitions.
3. **No Automatic Override Resolution:** No implicit merge engines or conflict resolvers.
4. **No Universal Cardinality Enforcement:** Cardinality (singleton vs. repeatable) is governed by specialized future facet contracts.
5. **No Execution Engine:** Facets are declarative metadata. No `facet.execute()` or `facet.evaluate()` methods.
6. **No Compiler Dispatch:** No Semantic IR lowering or runtime artifact compilation.
7. **No Persistence Mapping:** No ORM annotations, SQL column mappings, or physical schema generation.
8. **No Presentation Coupling:** Zero Angular or PrimeNG imports.
9. **No Authorization Inference:** Facet keys (e.g. `security.restricted`) do not grant or deny runtime permissions.

---

## 8. Reference Scenario: Mini Sales

Consider a sales domain modeling `sales.Customer`:

```text
SemanticElement:
  id: urn:ecosystem:element:sales:customer
  qualifiedName: sales.Customer
  contextRef: urn:ecosystem:context:sales-default

Orthogonal Facets (Future Composition):
  ├── Facet { kind: 'core.documentation', text: 'Enterprise customer entity' }
  ├── Facet { kind: 'presentation.displayName', label: 'Customer Account' }
  └── Facet { kind: 'audit.tracked', retentionDays: 365 }
```

In this architecture:
- Each facet has a distinct, explicit `kind`.
- The core element remains clean, immutable, and minimal.
- Downstream compilers and presentation adapters interpret recognized facets without polluting the semantic kernel.
