# ADR-017: Foundational Primitive Type System (SK-09)

## Status

Accepted for SK-09.

## Context

The Semantic Kernel established stable identity (SK-01), qualified naming
(SK-02/03), interpretation boundaries (SK-04), base element contracts (SK-05),
element classification (SK-06), exact version values (SK-07), and semantic
reference intent (SK-08). Future semantic definitions, model authoring, compiler
type checking, and runtime adapters all require a common vocabulary for the
foundational categories of scalar values.

Before SK-09, no authoritative primitive type taxonomy existed in the Kernel.
Consumers would either embed ad-hoc type strings or rely on JavaScript native
types — both of which lack canonical interchange semantics and precision
guarantees.

## Decision

### 1. Compact seven-member taxonomy.

The baseline set is:

```
STRING  BOOLEAN  INTEGER  DECIMAL  DATE  TIME  DATETIME
```

This covers the vast majority of enterprise scalar semantics without mirroring
SQL's dozens of storage types or JavaScript's runtime types. Future additions
(BINARY, UUID, DURATION, INSTANT, LOCAL_DATETIME) require separate review,
clear semantic motivation, and a complete contract before inclusion.

### 2. PrimitiveType is a closed literal union derived from a frozen object.

```typescript
const PrimitiveTypes = Object.freeze({ STRING: 'STRING', … } as const);
type PrimitiveType = (typeof PrimitiveTypes)[keyof typeof PrimitiveTypes];
```

This gives compile-time narrowing without runtime-extensible registries.
Unknown codes are rejected by `parsePrimitiveType` using exact membership.

### 3. Primitive types are distinct from SemanticElementKind.

`SemanticElementKind.TYPE` classifies a semantic *definition* (a designed type
artifact). `PrimitiveTypes.STRING` identifies a *value category*. Collapsing
them would prevent the future authored `TypeDefinition` for `sales.CustomerCode`
(which is a TYPE kind and uses STRING as its underlying primitive) from having
an independent identity.

### 4. Primitive types do not automatically become SemanticElements.

Built-in primitive codes are not individually addressable semantic elements.
They carry no SemanticElementId, QualifiedName, SemanticContextRef, or
SemanticVersion. Fabricating those would create unnecessary identity contracts
for things that are intentionally kernel-internal constants.

### 5. INTEGER uses a canonical decimal string, not JavaScript Number.

JavaScript `Number` can represent integers exactly only up to
`Number.MAX_SAFE_INTEGER` (2⁵³ − 1). Enterprise use cases (invoice sequences,
large ledger IDs, quantities with high precision) routinely exceed this range.
A canonical decimal string with a bounded digit count (38 significant digits)
avoids precision loss at the Kernel boundary. `Number.isSafeInteger()` is
still used in the convenience helper `createIntegerValueFromSafeNumber`.

### 6. DECIMAL preserves scale as-is (representation equality, not numeric equality).

`DECIMAL("1.0")` and `DECIMAL("1.00")` store different canonical strings.
`equalsPrimitiveValue` uses string equality — they compare unequal. This
preserves declared scale (relevant for financial amounts, measurement
tolerances, and audit trails). If numeric equality is needed, a future
`equalsPrimitiveValueNumeric` can normalize before comparison. Ambiguity
is documented rather than silently resolved.

### 7. DATE does not carry a timezone.

A semantic DATE is a calendar date. Converting `2026-10-12` into a UTC
instant requires knowledge of a timezone or business rule that does not
belong to the primitive. Validation uses a pure calendar algorithm without
consulting the host's Date object, ensuring determinism across environments.

### 8. DATETIME requires an explicit offset; local date-time is rejected.

A DATETIME without an offset is ambiguous: `2026-10-12T14:30:00` could be
14:30 in any timezone. The canonical DATETIME grammar requires either the
literal `Z` (UTC) or an explicit numeric offset (`±HH:MM`). Local date-time
semantics can be addressed by a future dedicated primitive (LOCAL_DATETIME)
once its use cases are established.

### 9. Missing ≠ Null ≠ Value is enforced at the parsing boundary.

`parsePrimitiveValue` explicitly rejects `null` for the `value` field.
Optionality and nullability are field-definition concerns (future SK-10
Facets), not primitive value type concerns. The Kernel primitive cannot
decide whether an absent value is allowed in a specific model context.

### 10. No implicit coercion.

String `"true"` is not BOOLEAN. Number `1` is not INTEGER. An empty string
is not missing. These rules prevent silent data corruption when values cross
semantic boundaries (e.g., from a JSON API into a compiled runtime). Adapters
may implement explicit conversion under defined policies.

### 11. Serialization uses a structured type-plus-value envelope.

A bare JSON string such as `"123"` cannot distinguish STRING from INTEGER from
DECIMAL from DATE. The canonical wire format is `{ "type": "INTEGER", "value": "123" }`.
This is not a universal storage requirement; adapters may use more compact forms
with type information conveyed through schema context.

### 12. Resource bounds prevent unbounded work.

STRING values are bounded at 65,536 characters. INTEGER is bounded at 38
significant decimal digits. DECIMAL is bounded at 38 total digits and 18
fractional digits. All regular expressions are anchored and sized for bounded
inputs. These limits are architectural defaults; they may be relaxed in future
Kernel versions through explicit constraint facets.

## Consequences

- Every consumer that needs primitive type discrimination has a single,
  validated vocabulary rather than ad-hoc strings.
- INTEGER and DECIMAL precision decisions are made once at the Kernel
  boundary rather than per adapter.
- DECIMAL scale-equality ambiguity is explicitly documented; consumers
  that need numeric equality can implement it outside the Kernel.
- DATETIME requires explicit offsets; legacy local-time data requires
  migration or a future LOCAL_DATETIME primitive.
- Field nullability, constraints, composite types, and runtime validation
  remain deferred to SK-10 (Facet) and subsequent milestones.
- Automated behavioral verification is deferred (see SK-09 deferred test
  archive). Static typechecking and build pass cleanly.
