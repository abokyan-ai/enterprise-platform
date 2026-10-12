# ADR-013: Minimal SemanticElement Base Contract & Composition-Based Modeling

## Status
Accepted

## Context
The Model-Driven Enterprise Ecosystem Platform requires a foundational base contract representing any identifiable node within the semantic meta-model. Previously in bootstrap stages (ARC-01), temporary placeholders contained ad-hoc properties (`semanticId` as raw string, `kind` as string union, `metadata` bag with timestamps). 

As the platform advances through foundational Semantic Kernel primitives:
- SK-01 established `SemanticElementId` (strongly typed URN).
- SK-02 established `Namespace` (canonical naming scope).
- SK-03 established `QualifiedName` (canonical semantic naming).
- SK-04 established `SemanticContextRef` (interpretation boundary).

We need to establish the `SemanticElement` base contract by composing these primitives while adhering strictly to:
1. "Definitions ≠ Instances ≠ Execution" (Rule 6).
2. "Prefer composition over inheritance" (Rule 4).
3. "The Meta-Model Kernel must remain small and stable" (Rule 20).
4. "Context owns meaning" (Rule 3).

## Decision
1. **Contract as Pure TypeScript Interface**: `SemanticElement` is defined as a readonly TypeScript interface, not a concrete base class. Domain models, types, and actions compose or specialize this interface without being forced to extend an abstract superclass.
2. **Composition of Irreducible Primitives**:
   - `id: SemanticElementId` — Stable semantic identity.
   - `qualifiedName: QualifiedName` — Canonical naming within a namespace.
   - `contextRef: SemanticContextRef` — Semantic interpretation boundary.
3. **Strict Minimalism & Non-Goals**:
   - `kind` is strictly deferred to SK-06 (`SemanticElementKind`).
   - `version` is strictly deferred to SK-07 (`SemanticVersion`).
   - `facets` is strictly deferred to SK-10 (`Facet`).
   - Dynamic metadata bags (`Record<string, unknown>`), timestamps (`createdAt`), and database keys are excluded.
4. **Controlled Runtime Validation**:
   - `createSemanticElement()` validates authentic constituent value object instances (`instanceof`) and returns a shallow-frozen (`Object.freeze`) immutable record.
   - `isSemanticElement()` provides an authentic prototype type guard.

## Consequences
- **Positive**:
  - The Semantic Kernel remains zero-dependency and minimal.
  - No deep inheritance tree is imposed on future semantic definitions.
  - Elements have unambiguous stable identities decoupled from display names, versions, or physical storage.
- **Negative / Trade-offs**:
  - Semantic elements cannot be validated for completeness until higher-level models (SK-06, SK-10, Model Core) are composed.
  - Interface-level immutability in TypeScript is compile-time; runtime immutability is guaranteed only when constructed via `createSemanticElement()`.
