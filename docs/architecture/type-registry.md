# Type Registry (TYPE-07)

`@ecosystem/model-core` owns the Type Registry: an explicitly constructed,
in-memory, immutable catalog of trusted `TypeDefinition` snapshots. A registry
scope is owned by its caller; it is neither a tenant, a global singleton, nor a
publication or authorization boundary.

## Construction and integrity

`createTypeRegistry({ definitions })` accepts a required array. An empty array
creates a valid empty snapshot; missing, null, non-array, or non-`TypeDefinition`
entries are rejected. Construction is atomic: no partially built catalog escapes.

The registry rejects two distinct kinds of collision:

- Same `SemanticElementId` and exact `SemanticVersion`.
- Same `SemanticContextRef`, `QualifiedName`, and exact `SemanticVersion`.

The registry preserves the Kernel's exact `SemanticVersion.equals` behavior, so
versions that have equal precedence but different build metadata remain distinct.
Multiple versions of one identity and renames between versions are valid. The
same name/version in different semantic contexts is valid.

## Queries

- `getByExactVersion(ElementVersionRef)` returns the exact registered snapshot
  or `undefined`; it never falls back to another version.
- `getByName({ contextRef, qualifiedName, version })` has the same exact-only
  behavior for the contextual name index.
- `list()` and `listVersions(id)` return frozen copies in original registration
  order.
- `findByName({ contextRef, qualifiedName })` and `findByTypeReference(ref)`
  return `FOUND`, `NOT_FOUND`, or `AMBIGUOUS`. A version-unspecified reference
  never means latest: zero candidates is `NOT_FOUND`, one is `FOUND`, and more
  than one is `AMBIGUOUS` with frozen candidates in registration order.

The TypeReference helper is intentionally narrow: it resolves only a supplied
TYPE-05 typed reference against this one snapshot. It is not a general semantic
resolver and performs no alias, namespace-import, version-range, or cross-context
resolution.

## Explicit boundaries

Registration verifies trusted TYPE-01 construction invariants and catalog-key
integrity only. It does not invoke TYPE-06 local validation because a bare
`TypeDefinition` does not provide its DataFacet or constraints. It performs no
persistence, discovery, policy, tenant inference, compiler lowering, runtime
activation, compatibility analysis, or automatic version selection.
