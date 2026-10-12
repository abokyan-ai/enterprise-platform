# ADR-014: Closed Semantic Element Kind Baseline and Canonical Lowercase Codes

## Status

Accepted for SK-06.

## Context

ARC-01 introduced `SemanticElementKind` with nine named lowercase values followed
by `| string`. The resulting type accepted every string, provided no runtime
validation, and could not support exhaustive classification handling. Model Core
already uses the lowercase discriminators `type` and `field`.

The existing architecture describes semantic types, fields, relationships,
actions, events, capabilities, facets, naming scopes, and applications. It does
not establish a separately approved, comprehensive kind taxonomy. SK-06 must
establish a small baseline without inventing business categories or treating
candidate names in task examples as mandatory requirements.

SK-05 separately publishes a minimal `SemanticElement` consisting of `id`,
`qualifiedName`, and `contextRef`. Classification must remain independently usable
without changing that base contract or implementing concrete future definitions.

## Decision

1. **Retain the nine explicitly named bootstrap codes.** The SK-06 baseline is
   `type`, `field`, `relationship`, `action`, `event`, `capability`, `facet`,
   `namespace`, and `application`. Their meanings are documented in the Semantic
   Kernel architecture guide. This preserves every previously named code and the
   current Model Core discriminators while excluding speculative additions.
2. **Preserve lowercase interchange values.** `SemanticElementKinds.TYPE` returns
   `type`. Constant property names are not serialized codes. Parsing is exact,
   case-sensitive, and rejects whitespace without cleanup or coercion.
3. **Use a frozen literal collection and derived closed union.** Strings already
   provide immutable values, value equality, canonical JSON serialization, and
   compile-time narrowing. A class wrapper or numeric enum adds no required
   guarantee. The collection is the only authoritative declaration; membership
   values are derived from it and frozen.
4. **Publish one strict parser and a membership guard.**
   `parseSemanticElementKind(unknown)` returns an unchanged recognized string or
   throws `SemanticElementKindValidationError`, extending `SemanticKernelError`.
   Non-string inputs and unknown strings have distinct stable error codes.
   `isSemanticElementKind` uses the same membership rule. Neither path inspects
   caller coercion methods or performs I/O.
5. **Replace the existing broad type rather than add a competing taxonomy.**
   The legacy ARC-01 module re-exports the same closed type and uses the same
   guard. The package root and elements barrel expose the new implementation.
6. **Preserve SK-05 exactly.** No mandatory `kind` field, constructor change, or
   speculative kind-aware interface is added. A concrete consumer can compose
   the base with a readonly classification when its own contract requires it.
7. **Defer open extensions.** No mutable registry, plugin loader, migration,
   version selector, compiler dispatcher, runtime handler, ORM mapping, or
   authorization rule belongs to SK-06. Recognition of a category declares no
   execution capability.

## Compatibility

- All nine named lowercase codes and existing `type` / `field` consumers remain
  supported. The SK-01 through SK-05 value objects and public base contract remain
  unchanged.
- Removing `| string` deliberately tightens the public type. An external consumer
  assigning arbitrary strings must validate input at the boundary and handle
  unknown kinds. The legacy internal guard also rejects unknown kind strings.
  This is an explicit compatibility restriction, not implicit normalization or
  a silent conversion to a default kind.
- `policy`, `constraint`, `expression`, and `workflow` are future candidates,
  not recognized codes in this baseline. `customer`, `invoice`, `employee`, and
  scalar names such as `string` are not foundational categories.
- A future additive code changes the closed union and can require updates to
  exhaustive consumers. Existing code meanings must remain stable. Renaming or
  removal requires compatibility review and explicit migration planning.
- Future extension kinds require a separate, versioned ownership and collision
  contract. Arbitrary plugin strings cannot widen this built-in classification.

## Consequences

- Consumers obtain a deterministic, portable classification boundary with no
  new package dependency and no framework initialization.
- Definition categories remain separate from semantic identity, names, contexts,
  primitive value types, facets themselves, tenant isolation, and permissions.
- The baseline classifies future definition categories without creating their
  concrete models or execution support.
- Automated verification is deferred as explicitly required by the SK-06 task.
  Scenarios are recorded in the single SK-06 deferred-test archive; their
  expected outcomes are not executed test results.
