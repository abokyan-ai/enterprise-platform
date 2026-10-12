# ADR-018: Typed Semantic Facets Through Composition (SK-10)

## Status

Accepted for SK-10.

## Context

The Semantic Kernel established stable identity (SK-01), namespace scopes (SK-02),
qualified naming (SK-03), semantic interpretation boundaries (SK-04), minimal element
contracts (SK-05), closed element classification (SK-06), exact semantic versioning (SK-07),
semantic references (SK-08), and foundational primitive scalar types (SK-09).

Enterprise definitions require the ability to express diverse orthogonal semantic concerns—such
as documentation, validation constraints, UI presentation hints, localization, and audit requirements.
Without a structured contract, platforms typically succumb to one of two architectural antipatterns:
1. **Universal Base-Class Inflation:** Adding dozens of optional fields to the core `SemanticElement`
   contract for every prospective concern.
2. **Untyped Metadata Bags:** Introducing `metadata: Record<string, unknown>` or `metadata: Record<string, any>`,
   erasing compile-time type safety, breaking deterministic compilation, and enabling uncontrolled side effects.

SK-10 addresses this by establishing the foundational base contract for semantic facets.

## Decision

### 1. Composition over Universal Base-Class Expansion

The core `SemanticElement` base contract established in SK-05 remains minimal, immutable, and stable.
Facets are composed alongside semantic definitions rather than baked into a monolithic class hierarchy.
No breaking changes or mandatory collections are imposed on existing SK-05 consumers.

### 2. Minimal Base Contract with Stable Discriminant

The base contract is intentionally minimal:

```typescript
export interface Facet<TKind extends string = string> {
  readonly kind: TKind;
}
```

The base contract carries only the immutable discriminant (`kind`). It does not declare speculative
payload fields or a universal `value: unknown` property. Specialized facets extend `Facet<TKind>` with
their own strongly typed properties.

### 3. Rejection of Universal Metadata Bags

Unrestricted dictionary escape hatches (such as `metadata: Record<string, unknown>`) and `any` types
are strictly prohibited. Every facet aspect must be explicitly identified, typed, and declared.

### 4. Explicit Facet Classification via FacetKey

Each facet is classified by a validated `FacetKey` value object. The facet key identifies the aspect
category (e.g. `core.documentation`, `validation.required`, `presentation.displayName`), answering:
*Which semantic aspect does this Facet represent?*

### 5. Facet Key Grammar and Bounds

Facet keys follow a canonical, dot-separated grammar:
- **Separator:** `.`
- **Depth:** 2 to 8 segments (at least one category scope and one aspect name).
- **Segment Length:** 1 to 64 characters.
- **Segment Grammar:** Starts with ASCII letter `[a-zA-Z]`, followed by `[a-zA-Z0-9_-]`.
- **Total Length:** 3 to 256 characters.
- **Case Policy:** Case-sensitive; exact spelling preserved.
- **Whitespace Policy:** Strictly forbidden; no silent trimming.

### 6. Strict Architectural Distinctions

The design strictly maintains non-negotiable boundaries:
- **Facet ≠ SemanticElement:** A facet is an orthogonal aspect of a definition, NOT an independently
  addressable semantic element. Facets do not receive `SemanticElementId`.
- **FacetKey ≠ SemanticElementKind:** `SemanticElementKind` (SK-06) classifies a semantic definition
  (`TYPE`, `FIELD`, `ACTION`, etc.). `FacetKey` identifies an aspect category (`core.documentation`).
- **FacetKey ≠ QualifiedName:** `QualifiedName` (SK-03) identifies a semantic element within a `Namespace`.
  `FacetKey` is an aspect taxonomy identifier and undergoes no namespace resolution or context lookup.
- **FacetKey ≠ PrimitiveType:** Primitive types (SK-09) represent scalar value categories (`STRING`, `INTEGER`).
  Facets represent definition aspects.

### 7. Missing ≠ Null ≠ Value

The absence of a facet signifies that the semantic aspect is not declared. The platform does NOT
automatically synthesize default facets or conflate absent facets with null payloads.

### 8. Deferral of Registry, Inheritance, Execution, and Adapters

SK-10 deliberately excludes:
- Global `FacetRegistry` or plugin loaders.
- Automatic facet inheritance or cascading across models.
- Facet conflict resolvers or merge engines.
- Execution methods (`facet.execute()`, `facet.evaluate()`).
- Compiler dispatching and Semantic IR generation.
- Runtime state evaluation.
- Persistence and ORM mappings.
- Presentation coupling (Angular, PrimeNG).

### 9. Pure TypeScript & Universal Portability

The entire implementation resides in the Semantic Kernel (`@ecosystem/semantic-kernel`), has zero external
dependencies, does not use Node.js-only APIs (`fs`, `path`, `process`, `Buffer`), and runs identically in
browser, Node.js, and worker environments.

## Consequences

- **Positive:** Type-safe, composable semantic aspects with zero runtime overhead or framework coupling.
- **Positive:** Full compile-time union narrowing via the `kind` discriminant for specialized facets.
- **Positive:** Zero breaking changes to earlier semantic kernel milestones (SK-01 through SK-09).
- **Trade-off:** Concrete specialized facet payloads (e.g., `DocumentationFacet`, `RequiredFacet`) must be
  modeled in subsequent tasks or domain layers rather than provided out-of-the-box in the kernel baseline.
