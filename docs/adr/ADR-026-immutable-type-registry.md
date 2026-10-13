# ADR-026: Immutable In-Memory Type Registry With Exact Identity and Contextual Name Indexes (TYPE-07)

## Status

Accepted for TYPE-07.

## Context

Model Core needs a bounded catalog for authored `TypeDefinition` snapshots. A
database repository, global service locator, or latest-version resolver would
violate the semantic-model boundary and make lookup ambient and non-deterministic.

## Decision

`TypeRegistry` belongs to `@ecosystem/model-core`. It is created explicitly from
a supplied array and exposes an immutable snapshot only. Exact registration is
keyed by `SemanticElementId + SemanticVersion`; contextual name registration is
keyed by `SemanticContextRef + QualifiedName + SemanticVersion`. Internal maps
are private nested indexes, avoiding ambiguous composite string keys.

Exact duplicate identity/version registrations and contextual name/version
collisions are rejected before publishing the snapshot. The exact SK-07 version
value is used, rather than SemVer precedence; build metadata is therefore
preserved. Registration order defines stable enumeration order.

Version-unspecified lookups return structured `FOUND`, `NOT_FOUND`, or
`AMBIGUOUS` results. The registry never selects a latest or preferred version.
It can query an existing TYPE-05 `TypeReference`, but does not become a general
reference resolver.

## Consequences

Callers gain deterministic local catalog lookup without global state. Registry
membership does not prove semantic publication, tenant ownership, authorization,
compatibility, full TYPE-06 validity, persistence, or runtime availability.
Those concerns remain deferred to their explicit future contracts.
