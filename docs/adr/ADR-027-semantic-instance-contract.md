# ADR-027: Independent Immutable Semantic Instances Bound to Exact TypeDefinition Versions (TYPE-08)

## Status

Accepted for TYPE-08.

## Decision

Semantic instances belong in framework-independent Model Core and remain separate
from semantic definitions and runtime execution. Each snapshot has an independent
validated `InstanceId`, an exact `ElementVersionRef`, and immutable field entries
keyed by stable field IDs. Missing is absence, null is explicit, and present values
reuse SK-09 `PrimitiveValue`.

The contract performs no registry resolution, type compatibility, constraints,
persistence, revision management, lifecycle, or authorization. Composite and
authored-type instance values are deferred until their semantics are explicit.
