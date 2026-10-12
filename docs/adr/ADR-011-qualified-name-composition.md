# ADR-011: Immutable QualifiedName Value Object & Final-Separator Composition

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Semantic Meta-Model Architect, Enterprise Software Architect  
> **Consulted:** AGENTS.md Constitution, ARC-01 through ARC-05, SK-01, SK-02, SK-03  

---

## Context

In the Model-Driven Enterprise Ecosystem Platform, semantic elements (types, entities, facets, actions, events) require unambiguous, canonical names within their containing naming scopes. 
- While `Namespace` (SK-02) organizes semantic scopes (e.g. `enterprise.sales`), and `SemanticElementId` (SK-01) provides opaque, durable identity (e.g. `typ_customer_123`), models require a human-readable, canonical qualified name (e.g. `enterprise.sales.Customer`) to declare, reference, and author elements.
- Without a dedicated, strictly validated `QualifiedName` value object:
  - Engineers might conflate naming with identity, causing renames to mutate durable identifiers.
  - Parsing multi-segment namespaces might introduce ambiguity if the split position between namespace and local name is unspecified.
  - Ad-hoc string splitting or concatenation would bypass namespace validation rules and allow malformed or unauthorized strings to circulate.
  - Future versioning (e.g. `@1.0.0`) or contextual resolution might be prematurely coupled into basic naming.

We require an immutable, strictly validated `QualifiedName` value object in `@ecosystem/semantic-kernel` that explicitly pairs a validated `Namespace` with a validated local element name.

---

## Decision

We establish **`QualifiedName`** in `@ecosystem/semantic-kernel` as the canonical semantic qualified naming primitive:

1. **Immutable Value Object:**
   - Implemented as a sealed class with private constructor and `Object.freeze(this)`.
   - Creation is strictly gated through `QualifiedName.parse(raw)` and `QualifiedName.fromParts(namespace, localName)`.

2. **Decomposition at Final Separator:**
   - Canonical grammar: `qualifiedName := namespace "." localName`
   - During string parsing, the string is partitioned strictly at the **final dot separator** (`raw.lastIndexOf('.')`). The prefix is validated using the existing `Namespace.parse()` contract; the suffix is validated as a local name.
   - This eliminates parsing ambiguity for multi-segment namespaces (`enterprise.sales.Customer` ──► Namespace: `enterprise.sales`, LocalName: `Customer`).

3. **Reusing the SK-02 Namespace Contract:**
   - `QualifiedName` encapsulates a real `Namespace` instance, not a raw string.
   - All namespace invariants (depth limits, segment grammar, case sensitivity, no whitespace) are enforced via `Namespace` itself without duplicating logic.

4. **Local Name Grammar & Bounds:**
   - `localName := firstCharacter subsequentCharacter*`
   - `firstCharacter := ASCII letter ([a-zA-Z])`
   - `subsequentCharacter := ASCII letter | digit | "_" ([a-zA-Z0-9_])`
   - Must not contain the dot separator (`.`).
   - Length bounded to maximum 63 characters (`LOCAL_NAME_MAX_LENGTH`).
   - Total QualifiedName length bounded to 319 characters (`255 + 1 + 63`).

5. **Value-Based Equality:**
   - Two instances compare equal if and only if their Namespace instances are equal and their local names are ordinally equal (`===`).

6. **Equivalence of Construction Paths:**
   - `QualifiedName.parse(str)` and `QualifiedName.fromParts(ns, local)` enforce identical validation rules and produce equal `QualifiedName` instances.

7. **Strict Orthogonality & Non-Goals:**
   - `QualifiedName ≠ SemanticElementId`: Renaming modifies `QualifiedName` without changing stable `SemanticElementId`.
   - `QualifiedName ≠ SemanticContextRef`: Naming is independent of semantic interpretation context (SK-04).
   - `QualifiedName ≠ SemanticVersion`: Version tags are deferred to SK-07.
   - `QualifiedName ≠ Resolver`: Syntactic validity does not prove catalog registration or element existence.

---

## Consequences

### Positive
- **Guaranteed Naming Determinism:** Unambiguous parsing and composition of hierarchical enterprise semantic element names.
- **Strict Reuse:** Zero duplication of Namespace grammar or validation logic.
- **Portability:** Pure TypeScript implementation with zero runtime dependencies.
- **Direct Serialization:** Round-trip serialization to/from canonical string primitive.

### Negative / Trade-offs
- **ASCII-Only v0 Restriction:** Local names and namespaces are restricted to ASCII characters in v0.
- **Requires Namespace:** Unqualified local names (e.g. `"Customer"`) cannot be parsed as a `QualifiedName` without an explicit namespace.
