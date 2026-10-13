# ADR-029: Pure Format-Aware Model Loader

## Status

Existing MOD-02 decision, documentation repaired during MOD-03.

## Context and repository finding

MOD-02 introduces explicit ModelSource/ModelLoadRequest, a syntax parser contract,
JSON and YAML implementations, and success/failure result factories. The inspected
base's barrel exported a ModelLoader whose implementation was missing; Model Core's
root barrel had incorrect authoring-relative paths. This ADR file contained the
intended TypeScript root API instead of an architectural decision. MOD-03 moves
that API back to the root, wires subsystem exports, and supplies the missing loader.
Historical completeness is not inferred from those misplaced exports.

## Decision

Keep the loading boundary in Pure TypeScript Model Core. Sources are caller-owned
strings with explicit format and optional opaque identity. Native JSON value
semantics and the existing yaml parser options remain authoritative. Syntax values
are untrusted until the existing MOD-01 validator/factory accepts them. Loading
returns typed SUCCESS or FAILURE with SK-11 diagnostics and never acquires files,
resolves semantic references, constructs canonical models, compiles, or executes.

Use a parser port for explicitly supplied implementations. Source provenance is
an optional extension at this boundary, specified separately in ADR-030. Resource
and parser failures remain controlled; no invalid partial document is published.

## Related decisions

- [MOD-01 authoring schema](ADR-028-authoring-model-schema.md)
- [MOD-03 parser-derived locations](ADR-030-parser-derived-source-location-tracking.md)
- [Actual loader API and behavior](../architecture/model-loader.md)
