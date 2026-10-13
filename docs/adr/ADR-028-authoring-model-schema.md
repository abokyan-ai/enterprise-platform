# ADR-028: Versioned Authoring Model Schema as a Pure Structural Boundary Separate from Authoritative Semantic Definitions and Canonical Models

## Status

Accepted (Mandatory Platform Architecture Record — MOD-01).

## Context

The Model-Driven Enterprise Ecosystem Platform requires a clear, standardized, machine-readable format for authoring semantic model documents. In previous enterprise frameworks, model authoring formats often conflate authoring document structure with either:
1. The authoritative semantic meta-model itself (causing duplication and conflicting definitions of identity, types, and fields).
2. The runtime execution engine or persistence schema (leaking database types, UI widgets, and implementation artifacts into business declarations).
3. The model compilation pipeline (attempting JIT compilation or on-the-fly reference resolution during document reading).

To preserve the platform's non-negotiable Clean-Core architecture and maintain the strict 4-stage pipeline:
```text
[ Authoring Model ] ──► [ Canonical Model ] ──► [ Semantic IR ] ──► [ Runtime Artifacts ]
```
we must define an explicit, deterministic, strongly typed Authoring Model Schema that represents authored semantic declarations while maintaining strict architectural boundaries.

## Decision

1. **Ownership within Pure TypeScript Model Core:**
   The Authoring Model Schema is implemented directly inside `@ecosystem/model-core` without framework dependencies (no NestJS, Angular, PrimeNG, ORM, or Node.js-only APIs).

2. **Structural Envelope Distinct from Authoritative Definitions:**
   `AuthoringDocument` serves as an immutable, portable structural envelope. It preserves authentic Semantic Kernel primitives (`SemanticElementId`, `QualifiedName`, `SemanticContextRef`, `SemanticVersion`) and Type System contracts (`TypeDefinition`, `FieldDefinition`, `DataFacet`, `FieldConstraint`, `TypeReference`), but does NOT redefine them.

3. **Schema Version Distinct from Semantic Version:**
   The `AuthoringSchemaVersion` (initial version: `'1.0.0'`) defines format interpretation rules for the authoring document itself. It is distinct from the semantic version of any contained `TypeDefinition`, distinct from platform build versions, and distinct from compiler versions.

4. **Strict Unknown Property Policy & Rejection of Silent Evolution:**
   Undeclared root or declaration properties are strictly rejected. No silent format migration, version negotiation, or ambient defaulting is permitted.

5. **Separation of Structural Validation from Semantic Validation:**
   Structural validation checks document shape, required fields, discriminants, and duplicate exact identity/version collisions. Full semantic validation (cross-type references, facet applicability, type consistency) remains decoupled and deferred to downstream compilation stages.

6. **Definite Deferral of Loading, Normalization, and Compilation:**
   File system reading, YAML parsing, source location tracking (MOD-03), reference resolution, and Canonical Model construction (MOD-04) are strictly excluded from MOD-01.

7. **No Automatic Registration or Execution:**
   Authored documents are not registries and do not mutate the `TypeRegistry` (TYPE-07), nor do they create or evaluate runtime `SemanticInstance` records (TYPE-08).

## Consequences

### Positive
- **Determinism:** The authoring format is fully predictable, serialization-friendly, and portable across browser, desktop, CLI, and server runtimes.
- **Integrity:** Business semantics cannot be silently mutated, defaulted, or invented during authoring ingestion.
- **Zero Lock-In:** Pure TypeScript schema ensures zero coupling to presentation or backend frameworks.
- **Traceability:** Exact SemVer, stable IDs, and contextual interpretation boundaries are preserved end-to-end.

### Negative / Trade-offs
- Authors must provide explicit identities, versions, and qualified names without relying on implicit global conventions or ambient defaults.
- Tooling must implement subsequent loading (MOD-02) and canonicalization (MOD-04) stages to resolve cross-document references.

## Compliance with Architectural Invariants

- **Principle 3 (Context owns meaning):** Preserves `SemanticContextRef` on all type definitions and references.
- **Principle 6 (Definition, Instance, Execution):** Strictly maintains boundary between authored definition and runtime instance/execution.
- **Principle 7 (Semantic identity independence):** Preserves platform-independent `SemanticElementId`.
- **Principle 11 & 12 (Compile what can be compiled & Runtime consumes resolved artifacts):** The authoring schema produces portable source documents for ahead-of-time compilation, never raw execution.
- **Principle 20 (Kernel stability):** Does not pollute Semantic Kernel; lives in Model Core.
