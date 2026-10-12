# ADR-015: Bounded Exact Semantic Versions and Identity-plus-Version References

## Status

Accepted for SK-07.

## Context

The Kernel already exposes the ARC-01 structural `VersionRef` and three helper
functions. Its original parser admitted leading zeroes and malformed identifier
lists, converted numeric components without a precision bound, and compared only
major/minor/patch. A second independent parser would create competing versioning
semantics.

SK-01 established stable opaque identity; SK-05 intentionally keeps version out
of the minimal element base contract. SK-07 requires validated exact definition
versions and references while keeping identity, naming, context, classification,
resolution, publication, compatibility, and runtime revisions separate.

## Decision

1. **Use exact SemVer 2.0.0 syntax with documented platform bounds.** Adopt
   `MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]`, with no coercion, trimming, prefix
   removal, partial versions, selectors, ranges, or implicit defaults. The
   [SemVer 2.0.0 specification](https://semver.org/spec/v2.0.0.html) is the grammar
   and precedence reference. Platform limits constrain otherwise valid syntax.
2. **Retain safe number components.** Major/minor/patch range from zero through
   `Number.MAX_SAFE_INTEGER` (`9007199254740991`). Canonical decimal text is checked
   against that bound before conversion. Numeric prerelease identifiers remain
   strings; comparing their lengths and then their digit text avoids precision
   loss even beyond the core-component numeric bound.
3. **Bound parsing work.** Full input length is at most 256 characters; each
   prerelease/build identifier is at most 64; each identifier list contains at
   most 16 items. Input length is checked before scanning or splitting. Delimiter
   decomposition and small anchored token patterns avoid a large nested parser.
   No input is truncated or normalized into validity.
4. **Publish an immutable SemanticVersion value object.** Private construction,
   frozen component arrays, and a frozen instance preserve canonical spelling,
   including identifier case and build metadata. `parse`, `tryParse`, and `isValid`
   follow existing Kernel validation conventions. Errors extend the existing
   `SemanticKernelError` with fixed diagnostics and no raw input interpolation.
5. **Separate exact equality from precedence.** `equals` includes the complete
   canonical representation, including build metadata. `comparePrecedence`
   returns only `-1`, `0`, or `1` and implements core and prerelease ordering while
   excluding build metadata. Equal precedence is not exact version identity.
6. **Compose ElementVersionRef from actual Kernel value objects.** `fromParts`
   requires a `SemanticElementId` and `SemanticVersion`, following the existing
   `instanceof` convention. No identity is regenerated and no version is selected.
   The reference and both component values are immutable.
7. **Use structured wire data.** The canonical record contains exactly
   `elementId` and `version`, both serialized strings. `fromJSON` accepts decoded
   plain records with those two own enumerable data fields, including null-
   prototype records. Extra fields, inherited fields, accessors, and class or
   array containers fail shape validation. Each value is parsed by its owning
   Kernel primitive. Reference equality requires both stable ID equality and
   exact version equality. No textual reference delimiter or URI scheme is added.
8. **Refine the existing helpers.** `VersionRef` retains its public structural
   fields. `parseVersion`, `formatVersion`, and `compareVersions` delegate to
   SemanticVersion; there is one authoritative SemVer parser and precedence
   implementation. Formatting validates numeric and optional text components
   before rendering them. A parsed legacy view is frozen.
9. **Keep resolution and evolution outside this task.** No registry, existence
   check, latest selection, range solver, compatibility analyzer, bumping,
   publication, migration, deployment, instance revision, or storage revision is
   introduced. SK-01 through SK-06 contracts remain unchanged.

## Compatibility and Limits

- Valid existing `VersionRef` fields and helper signatures remain available.
  Earlier loosely accepted strings now fail strict validation. Unsafe numeric
  components and empty or malformed optional metadata are rejected explicitly.
- `compareVersions` now honors prerelease precedence and returns a normalized
  sign rather than numeric component subtraction. Its documented signed-number
  contract remains supported; consumers must not treat the return value as a
  version distance or exact equality including metadata.
- Full SemVer syntax permits values exceeding the platform limits. SK-07
  deliberately rejects those values; it does not claim unbounded SemVer support.
- Exact reference decoding is intentionally closed to additional fields.
  Changing the wire shape, numeric policy, or resource limits requires explicit
  compatibility review. Typed component construction uses the Kernel's existing
  same-realm class-instance checks.
- Syntactic validity proves neither referenced-definition existence nor caller
  authority. A valid ID string remains opaque even when its spelling resembles
  a qualified name. Future resolution and selectors require distinct contracts.
- Version syntax alone does not establish model compatibility. Build identifiers
  are retained as version text without being interpreted as deployment or
  artifact metadata.

## Verification Policy

The SK-07 task explicitly defers automated tests and ad hoc parsing experiments.
One Markdown archive records future verification scenarios as
`NOT_RUN — DEFERRED`. Permitted typechecking, non-test builds, formatting, and
static source inspection are reported separately. No deferred expected result is
presented as an executed behavioral test.
