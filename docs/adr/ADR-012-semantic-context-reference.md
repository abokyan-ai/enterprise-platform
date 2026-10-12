# ADR-012: Immutable SemanticContextRef Value Object & Context Boundary Contract

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Semantic Meta-Model Architect, Enterprise Software Architect  
> **Consulted:** AGENTS.md Constitution, ARC-01 through ARC-05, SK-01, SK-02, SK-03, SK-04  

---

## Context

In the Model-Driven Enterprise Ecosystem Platform, semantic models, names, and references cannot be interpreted in an absolute, global vacuum. In accordance with the foundational architectural axiom:
> **"Context Owns Meaning"**

The exact same qualified element name (e.g. `sales.Customer`) may signify different domain entities or representations across distinct semantic contexts (e.g. `sales-context` vs. `partner-context`).

Without a formal, immutable, opaque `SemanticContextRef` primitive:
- Developers and adapters might conflate interpretation context with technical tenancy (`TenantId`), legal organization (`OrganizationId`), or infrastructure deployment environments (`staging`, `production`).
- Ambient, process-global, or thread-local contexts (`AsyncLocalStorage`, global singletons) could introduce non-deterministic side effects and context-leakage vulnerabilities.
- Naming scopes (`Namespace`) might be mistakenly treated as context boundaries.
- Possessing or referencing a context might be erroneously interpreted as possessing authorization permissions.

We require an immutable, opaque, strongly typed, strictly validated `SemanticContextRef` value object in `@ecosystem/semantic-kernel` that explicitly identifies a semantic interpretation boundary.

---

## Decision

We establish **`SemanticContextRef`** in `@ecosystem/semantic-kernel` as the canonical semantic context reference primitive:

1. **Immutable Value Object:**
   - Implemented as a sealed class with private constructor, runtime `Object.freeze(this)`, and private `#canonicalValue`.
   - Construction is strictly gated through `SemanticContextRef.parse(raw)` and `SemanticContextRef.tryParse(raw)`.

2. **Opaque Identifier Grammar:**
   - Grammar:
     ```text
     contextRef := firstCharacter subsequentCharacter*
     firstCharacter      := ASCII letter ([a-zA-Z])
     subsequentCharacter := ASCII letter | digit | "_" | "-" ([a-zA-Z0-9_-])
     ```
   - Bounds: Minimum 1 character, maximum 128 characters.
   - Punctuation such as dots (`.`), slashes (`/`), colons (`:`), and version suffixes (`@1.0.0`) are forbidden.

3. **Strict Case Sensitivity & No Trimming:**
   - Canonical spelling is preserved exactly as entered (`sales-context` ≠ `Sales-context`).
   - Whitespace is strictly rejected (`SEMANTIC_CONTEXT_REF_WHITESPACE`); no silent trimming is permitted.

4. **Cross-Type Identity Safety:**
   - `SemanticContextRef` never compares equal to `SemanticElementId`, `Namespace`, or `QualifiedName`, even if textual strings coincide. `equals()` explicitly verifies `other instanceof SemanticContextRef`.

5. **No Ambient or Default Context:**
   - There is no ambient global context (no `SemanticContextRef.current()`), no mutable singleton, and no default fallback (`default`, `system`).
   - Context references must be passed explicitly across system ports.

6. **Strict Orthogonality & Non-Goals:**
   - `SemanticContextRef ≠ SemanticElementId`: Context identifies interpretation boundary; Element ID identifies durable element identity.
   - `SemanticContextRef ≠ TenantId / OrganizationId`: Context is a semantic boundary, not an infrastructure tenant or corporate entity.
   - `SemanticContextRef ≠ Authorization Scope`: Syntactic reference validity grants zero permissions.
   - `SemanticContextRef ≠ Registry / Resolver`: SK-04 implements only the reference value object; context definitions, registries, and dynamic resolvers are explicitly deferred.

---

## Consequences

### Positive
- **Deterministic Semantic Scoping:** Explicit semantic interpretation boundaries protect models against name collisions across ecosystem boundaries.
- **Strict Decoupling:** Context identity remains completely orthogonal to infrastructure, storage, and authorization concerns.
- **Portability:** Pure TypeScript implementation with zero external framework dependencies running identically in Node.js, browsers, and web workers.
- **Safe Serialization:** Direct round-trip JSON and string serialization guarantees.

### Negative / Trade-offs
- **ASCII-Only v0 Restriction:** Context identifiers are restricted to ASCII alphanumeric, underscore, and hyphen characters in v0.
- **Explicit Context Parameterization:** Because ambient contexts are forbidden, every context-dependent API must explicitly declare and receive a `SemanticContextRef`.
