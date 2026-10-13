# Semantic Instance Contract (TYPE-08)

`SemanticInstance` is an immutable Model Core snapshot of business data. It is
not a `SemanticElement`, runtime entity, persistence record, or execution context.
Its independent `InstanceId` accepts 3–128 case-sensitive ASCII characters using
alphanumerics plus internal `.`, `_`, `:`, and `-`; callers allocate it explicitly.

Each instance binds only to an exact Kernel `ElementVersionRef`. The binding does
not resolve, validate, or activate its target. Fields are supplied in input order,
identified by stable `SemanticElementId`, and duplicates are rejected. Absence of
an entry means Missing; an entry is either explicit `{ state: 'null' }` or a
present `{ state: 'value', value: PrimitiveValue }`. Primitive values retain SK-09
integer, decimal, boolean, and temporal semantics without coercion.

Serialization is deterministic and validates parsing. This contract intentionally
omits authored-type/composite/repeated values, constraints, nullability,
requiredness, revisions, registries, persistence, authorization, and lifecycle.
