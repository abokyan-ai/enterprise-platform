# ADR-010: Immutable Namespace Value Object & Dotted Canonical Grammar

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Semantic Meta-Model Architect, Enterprise Software Architect  
> **Consulted:** AGENTS.md Constitution, ARC-01 through ARC-05, SK-01, SK-02  

---

## Context

In a Model-Driven Enterprise Ecosystem Platform, semantic element names (types, actions, events, facets) require structured organization into logical naming scopes. Without a standardized naming scope:
- Domain models from different business units or third-party extensions risk naming collisions (e.g., `Customer` in Sales vs. `Customer` in Support).
- Developers may conflate naming scopes with tenant identifiers, security authorization domains, or physical database schemas.
- Unchecked string representations allow malformed separators, paths, escape sequences, or whitespace mutations to corrupt canonical representations.
- Ad-hoc case conversion (such as silent lowercasing or trimming) causes subtle bugs and breaks stable interchange across systems.

We require an immutable, strongly typed, strictly validated `Namespace` primitive in the Semantic Kernel (`@ecosystem/semantic-kernel`) that establishes a canonical naming scope while strictly isolating naming from identity, context, tenancy, and runtime resolution.

---

## Decision

We establish **`Namespace`** in `@ecosystem/semantic-kernel` as the canonical semantic naming scope:

1. **Immutable Value Object:**
   - Implemented as a sealed class with private constructor, `Object.freeze(this)`, and frozen segment list.
   - Parsing is strictly gated via `Namespace.parse(raw)` (throwing) and `Namespace.tryParse(raw)` (non-throwing discriminated union).

2. **Dotted-Segment Canonical Grammar (v0):**
   - Grammar: `namespace := segment ("." segment)*`
   - Segment rule: `segment := first_character subsequent_character*`
   - `first_character := ASCII letter ([a-zA-Z])`
   - `subsequent_character := ASCII letter | digit | "_" ([a-zA-Z0-9_])`
   - Strictly single dot separator (`.`). Empty segments (`.sales`, `sales.`, `sales..orders`) are rejected.
   - Resource bounds: Max length 255 chars, max segment length 63 chars, max depth 16 segments.

3. **Strict Case Sensitivity & No Trimming:**
   - Canonical spelling is preserved exactly as entered (`sales` ≠ `Sales`).
   - Leading, trailing, and embedded whitespace are strictly rejected (`NAMESPACE_WHITESPACE`). Silent trimming is prohibited.

4. **Value-Based Equality:**
   - Two instances compare equal if and only if their canonical string representations are ordinally equal (`===`). Reference equality is never used.

5. **Segment Access & Syntactic Hierarchy:**
   - Provides safe immutable snapshot of segments via `segments()`.
   - Hierarchy operations (`parent()`, `child()`, `isAncestorOf()`) operate strictly on logical segment boundaries, never on raw string prefixes.
   - Single-segment namespaces have no parent (no fictional empty root namespace).

6. **Strict Orthogonality & Non-Conflation:**
   - `Namespace ≠ SemanticElementId`: Namespaces organize names; element IDs provide durable identity.
   - `Namespace ≠ QualifiedName`: Namespaces define scope; `QualifiedName` (SK-03) will combine namespace with local name.
   - `Namespace ≠ SemanticContextRef`: Namespaces are syntactic naming scopes, not context resolution boundaries (SK-04).
   - `Namespace ≠ TenantId / OrganizationId`: Possession of a namespace does not imply tenant boundary or authorization.
   - `Namespace ≠ PackageId / Filesystem Path`: Separators are dots, not filesystem slashes or package URLs.

7. **Deferred Registration & Resolution:**
   - Syntactic validity does not imply model registration, imports, or existence. Registry and compiler lowering are strictly separated from kernel primitives.

---

## Consequences

### Positive
- **Guaranteed Consistency:** All semantic names are organized within deterministic, validated scopes.
- **Collision Resistance:** Modular enterprise domains can compose sub-namespaces (`enterprise.sales`, `enterprise.finance`) safely.
- **Universal Portability:** Pure TypeScript implementation with zero framework or platform dependencies, running identically in Node.js and browsers.
- **Deterministic Serialization:** Direct canonical string JSON serialization and seamless round-trip guarantees.

### Negative / Trade-offs
- **ASCII-Only v0 Restriction:** Non-ASCII Unicode characters are rejected in v0; future internationalization requires a formal specification evolution.
- **Explicit Boundary Handling:** Consumers cannot pass raw unvalidated strings as namespaces and must handle validation errors at entry boundaries.
