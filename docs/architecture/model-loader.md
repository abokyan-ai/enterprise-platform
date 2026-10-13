# MOD-02 — Pure Format-Aware Model Loader

`@ecosystem/model-core` loads explicitly supplied `ModelLoadRequest.source` data.
The caller supplies `content`, an explicit JSON/YAML format, and an optional opaque
`sourceId`. Format selection uses `normalizeModelSourceFormat`; YAML/yml spelling
is supported. The loader performs no filesystem or network acquisition.

`ModelLoader`, the stateless default `modelLoader`, and `loadModel(request)` use
syntax parsers followed by the existing MOD-01 structural validator/factory.
`SUCCESS` contains only a validated AuthoringDocument; `FAILURE` contains controlled
SK-11 diagnostics. Neither result performs registry resolution, canonicalization,
compilation, semantic identity generation, or runtime execution.

The class accepts optional `{ json, yaml }` parser overrides implementing the
existing `parse(content): unknown` contract. Built-in JSON keeps native JSON.parse
value/duplicate semantics, and built-in YAML keeps the existing yaml document
options and single-document policy. Parser failures do not leak exception text.

MOD-03 adds optional `parseWithLocations`, optional result `locations`, source
provenance and verified diagnostic enrichment. Existing parse-only implementations
and load-result factory calls remain valid. Built-in resource limits and mapping
integrity failures are explicit controlled failures. See the
[source tracking guide](source-location-tracking.md) for exact coordinates,
duplicates, aliases, limits, metadata ownership, and known diagnostic limitations.

Repository finding: the MOD-02 base exported a missing `model-loader.ts` and had
misplaced public barrel code. MOD-03 repairs those integration prerequisites;
this document describes the actual resulting implementation, not an unverified
historical loader.

Automated verification remains deferred by the current task. No MOD-04 capability
is implemented.
