# ADR-016: Discriminated Semantic Element References (SK-08)

## Status

Accepted for SK-08.

## Context

The Semantic Kernel established stable identity (SK-01), qualified naming
(SK-02/03), interpretation boundaries (SK-04), base element contracts (SK-05),
classification (SK-06), and exact version values (SK-07). Model declarations,
capability dependencies, and future resolution pipelines all need a way to
express *which* semantic element they target — without performing the actual
lookup, authorization, or compilation that produces a resolved element.

Before SK-08, no standard reference type existed. Consumers would either
pass raw strings (no invariants) or embed the full element value (embedding
the referent rather than a reference to it). Both approaches invite
contradictory, ambiguous, or unsafe reference states.

## Decision

### 1. Use a discriminated union with exactly two variants.

```
ElementRef
  ├── ElementIdRef   — targets by stable SemanticElementId (SK-01)
  └── ElementNameRef — targets by QualifiedName within an explicit SemanticContextRef
```

The `by` field is the literal-string discriminant. TypeScript narrows `ref`
to the correct variant inside every `if (ref.by === 'id')` or `switch` block
without runtime cost. There is no third variant for mixed or unresolved targets.

### 2. Named references require an explicit SemanticContextRef.

The same `QualifiedName` can appear in different semantic contexts and carry
different definitions. Silently selecting a default context would violate
"Context Owns Meaning" (architecture principle 3) and produce a reference that
is neither portable nor deterministic. No ambient context lookup, current-tenant
inference, or namespace-derived default is implemented.

### 3. Identity references do not require a SemanticContextRef.

A `SemanticElementId` already encodes stable, platform-independent identity
(SK-01). A resolver consuming the reference may require context for policy or
interpretation, but that is a resolution-time concern, not a reference-time
invariant. Attaching a mandatory context to ID-based references would confuse
target identity with resolution environment.

### 4. The version field is optional and unambiguous.

An explicit `SemanticVersion` (SK-07) expresses an exact version requirement.
Omission means version-unspecified — not latest, not stable, not active.
`null` is rejected: `missing ≠ null ≠ value`. Version ranges, selectors, and
implicit defaults are explicitly out of scope.

### 5. ElementVersionRef (SK-07) is not replaced or redefined.

When an `ElementIdRef` carries an exact version, its target intent is
structurally equivalent to an `ElementVersionRef`. The `toElementVersionRef`
conversion function produces one from the ID-based ref only when both
`elementId` and `version` are present. Named references cannot convert without
resolution; no ID is fabricated.

### 6. A JSON discriminant is preferred over an ambiguous string grammar.

A single reference string such as `sales.Customer@1.0.0` would require a
formal, unambiguous grammar that coordinates namespace separators (`.`),
context separators, version separators (`@` or `#`), and future reference
modes. Such a grammar is a separate design decision and could conflict with
existing primitives. Structured JSON with an explicit `by` discriminant is
unambiguous, extensible, and consistent with SK-07's wire representation.

### 7. Mixed target fields are rejected at parse time.

A JSON object containing both `elementId` and `qualifiedName` is an
ambiguous reference. Even if one field "should" take precedence, silently
ignoring the other conceals a bug and could enable intent-manipulation
attacks on reference strings. The parser rejects such objects explicitly
with `ELEMENT_REF_CONFLICTING_TARGET`.

### 8. Unknown fields in deserialized input are rejected.

An unknown field like `"resolve": true` could silently change downstream
interpretation. The strict field-allowlist policy prevents unknown fields
from masquerading as resolution instructions or authorization hints.

### 9. Resolution, authorization, and registry lookup are excluded.

SK-08 produces a validated reference value. Finding, loading, authorizing,
or compiling the referenced element requires additional state (a registry,
a policy engine, a compiler context) that the Semantic Kernel must not
import. A future resolver will accept `ElementRef` as its input contract and
return a resolved result through a separate SK-N contract.

### 10. The reference contract is framework-independent.

`ElementRef` and all factory/parser/serializer functions import only Kernel
primitives. There are no NestJS, Angular, PrimeNG, ORM, or Node.js-core
dependencies. The module is safe for use in browser environments.

## Consequences

- Every consumer that needs to express a semantic element reference has a
  single, typed, validated API rather than ad-hoc nullable fields.
- Future resolvers receive a reliable, exhaustive input contract.
- Named-reference context errors become compile-time or early-parse errors
  rather than silent runtime mismatches.
- ElementVersionRef (SK-07) remains the authoritative identity-plus-version
  pairing; SK-08 provides a conversion path without duplication.
- Wire format compatibility for `ElementRef` JSON is established at SK-08
  and must be evolved through future ADRs if the schema changes.
- Automated behavioral verification is deferred (see SK-08 deferred test
  archive). Static typechecking passes.

## Known Limitations

- `QualifiedName.parse` is called with `rawQualifiedName` during JSON
  deserialization. If the upstream `QualifiedName` grammar changes, the
  parse path is automatically aligned through SK-03 reuse.
- No `toString()` round-trip grammar is defined for `ElementRef`. Diagnostic
  `describeElementRef` output is not parseable.
- A tolerant-reader policy (ignoring unknown fields) was considered but
  rejected for this foundational contract. Future higher-level authoring layers
  may relax this for evolution.
