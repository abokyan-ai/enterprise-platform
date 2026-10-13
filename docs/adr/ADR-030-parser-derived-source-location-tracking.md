# ADR-030: Parser-Derived Source Locations Separate from Semantic Identity

## Status

Accepted for MOD-03. Automated behavioral verification deferred by the task.

## Context

MOD-01 owns the authoring envelope and MOD-02 owns explicitly supplied JSON/YAML
sources. SK-11 owns `DiagnosticLocation` and `SourcePosition`, with 1-based UTF-16
columns and inclusive end coordinates. Native JSON parsing supplies values but
no structured node positions. The existing YAML dependency supplies document
nodes, ranges, and structured error positions.

The inspected base contained a missing ModelLoader implementation, broken Model
Core root/subsystem exports, a missing YAML lockfile importer, and intended public
API code misplaced inside ADR-029. These are integration prerequisites, not proof
that a previous documented loader existed. The repairs preserve the actual schema
and parser value policies while making the requested loading boundary executable.

## Decision

1. Reuse SK-11's existing location types unchanged. Keep UTF-16 half-open parser
   offsets on Model Core entries and convert nonempty endpoints to SK-11's
   inclusive end by subtracting one code unit. Preserve original text and explicit
   LF/CRLF/lone-CR conventions. Never invent an endpoint or offset-zero fallback.
2. Address source occurrences by immutable typed property/index paths with RFC
   6901 rendering. They are distinct from semantic identity and Kernel modelPath.
   A root pointer is empty; '/' denotes an empty property. Numeric property names
   remain strings, independently of numeric array indices.
3. Publish a per-document immutable metadata map. Its lookup closure captures
   only the private metadata index. No AST, raw source, coordinate buffer,
   writable Map, global registry, or source persistence is exposed.
4. Promote the existing lockfile-resolved `jsonc-parser` 3.3.1 into Model Core's
   declared dependencies for authentic JSON node/error ranges. Use strict options
   and never publish a fault-tolerant partial tree. Retain native JSON.parse as
   authoritative data acceptance/construction, justifying a second provenance-only
   pass to preserve native duplicate/property/numeric behavior. Do not implement
   a custom JSON parser or independently configured loading pipeline.
5. Preserve native JSON last-value-wins duplicate behavior. Emit bounded warnings
   at duplicate key tokens and mark the path/subtree ambiguous, with no misleading
   single-origin location. YAML's existing uniqueKeys rejection remains unchanged.
6. Reuse one existing YAML document pass for nodes and toJS values. Keep strict,
   merge-disabled, single-document policies and default alias expansion limits.
   Silence parser logging; enable no custom tag evaluators. Map alias-use spans
   without fabricating expanded child spans. Leave complex/alias-key paths and
   transformed collection children unavailable unless their structure is proven.
7. Extend ModelDocumentParser with optional parseWithLocations and ModelLoadResult
   with optional locations. Existing parse-only injection and factory calls stay
   valid. Built-in provenance failure is controlled failure; legacy optional
   absence is explicit degradation. No invalid partial AuthoringDocument succeeds.
8. Enrich existing diagnostics from their actual structured metadata. Missing
   properties can point only at verified containing objects. Existing coarse
   field/facet errors remain coarse until their owners provide finer paths; do
   not reimplement semantic validation or infer paths from exception messages.
9. Bound source length, syntax depth/nodes, rendered and aggregate pointer lengths,
   output diagnostics, and alias conversion. Use iterative tracking and a temporary
   constant-time coordinate index. Preserve architecture rules and all earlier
   test archives; add exactly one deferred Markdown specification.

## Consequences and limitations

Source mapping changes when authored text moves while stable semantic identity
remains unchanged. A source ID is opaque and optional, not a filesystem/network
request or an authorization claim. Exact maps support future processing without
constructing CanonicalModel or defining provenance propagation for that future
pipeline. Runtime revisions, tracing, compiler source maps, selection, and
resolution remain separate.

New resource limits may reject previously accepted oversized/deep documents;
these limits are documented explicitly in the architecture guide. JSON uses two
compatible bounded passes; strict grammar/native-language parity is an important
future verification item rather than an executed claim. YAML alias descendants,
transformed collections, complex keys, and errors without structured positions
have explicit absence. Raw parser values retain their untrusted mutable contract;
only wrappers and source metadata claim runtime immutability.

The mandatory archive records all scenarios as NOT_RUN — DEFERRED. Build and
TypeScript results establish static compatibility, not behavioral parser accuracy.

## References

- [Source location tracking](../architecture/source-location-tracking.md)
- [Model loader](../architecture/model-loader.md)
- [jsonc-parser 3.3.1 source](https://github.com/microsoft/node-jsonc-parser/tree/v3.3.1)
- [yaml document/node APIs](https://eemeli.org/yaml/)
