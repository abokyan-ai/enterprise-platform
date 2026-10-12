# ADR-009: Immutable SemanticElementId Value Object & Canonical Grammar

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Software Architect, Semantic Meta-Model Architect  
> **Consulted:** AGENTS.md Constitution, ARC-01 through ARC-05, SK-01  

---

## Context

In an enterprise-grade Model-Driven platform, semantic model elements undergo continuous evolution:
- Elements are renamed (e.g. from `sales.Customer` to `sales.Client`).
- Elements evolve across semantic versions (`1.0.0` ──► `1.1.0`).
- Elements are compiled into intermediate representations and persisted across heterogeneous databases.

If element identity is derived from display names, namespaces, database primary keys, or compiler hashes, renaming or moving an element breaks referential integrity, cross-element references, and historical audit logs.

Furthermore, naive string typing (`string`) in TypeScript allows arbitrary strings, numbers, or unvalidated user inputs to be passed as identifiers, introducing silent bugs and injection risks.

We require an immutable, opaque, strongly typed semantic identity primitive with strict validation, value equality, and universal runtime portability.

---

## Decision

We establish **`SemanticElementId`** in `@ecosystem/semantic-kernel` as the foundational identity primitive:

1. **Immutable Value Object:**
   - Implemented as an immutable class with private construction and `Object.freeze(this)`.
   - Construction is possible only through explicit validation gates: `SemanticElementId.parse(raw)` and `SemanticElementId.tryParse(raw)`.

2. **Bounded Canonical Grammar:**
   - Length bounded between 3 and 128 characters.
   - Character set: `[a-zA-Z0-9._:-]`, starting and ending with an alphanumeric character (`^[a-zA-Z0-9][a-zA-Z0-9._:-]{1,126}[a-zA-Z0-9]$`).
   - Supports canonical UUIDs, prefixed opaque IDs (`typ_customer_123`), and URNs.

3. **Strict No-Whitespace Policy:**
   - Leading, trailing, and embedded whitespace are strictly rejected with `SEMANTIC_ELEMENT_ID_WHITESPACE`. No silent trimming is permitted to prevent ambiguous identity alterations.

4. **Value-Based Equality:**
   - Equality (`equals()`) evaluates canonical ordinal string equality (`===`). Reference equality or label comparison is never used.

5. **Separation of Validation from Generation:**
   - Validation is pure and deterministic. Randomness (`Math.random()`), clock access (`Date.now()`), and central allocator dependencies are excluded from the kernel value object.

6. **Strict Orthogonality:**
   - `SemanticElementId` is independent of `QualifiedName` (SK-03), `Namespace` (SK-02), `SemanticVersion` (SK-07), `SemanticContextRef` (SK-04), and database primary keys.

---

## Consequences

### Positive
- **Guaranteed Referential Stability:** Renaming an element or bumping its semantic version never changes its durable `SemanticElementId`.
- **Compile-Time & Runtime Safety:** Invalid identities cannot exist in memory.
- **Universal Portability:** Pure TypeScript implementation runs identically in Node.js, browsers, and web workers with zero framework dependencies.
- **Serialization Determinism:** Serializes directly to canonical string primitive for JSON and HTTP interchange.

### Negative / Trade-offs
- Creating a `SemanticElementId` incurs object allocation overhead compared to raw unchecked primitive strings.
- Applications must explicitly call `parse()` when receiving unvalidated external inputs.
