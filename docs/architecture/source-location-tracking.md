# MOD-03 — Source Location Tracking

Status: Implemented, automated verification deferred.

## Ownership and actual repository findings

Source tracking belongs to `@ecosystem/model-core`, in
`platform/model/model-core/src/authoring/source-location/`, integrated with the
existing `authoring/loader/` contracts. Model Core depends on the public Semantic
Kernel API and browser-compatible JSON/YAML libraries. It imports no framework,
filesystem, network, compiler, runtime, or persistence implementation.

SK-11's actual location contracts are `DiagnosticLocation` and `SourcePosition`;
there is no separately exported `SourceLocation` or `SemanticPath` primitive.
They remain authoritative and unchanged. `DiagnosticLocation.end` is **inclusive**,
and lines/columns begin at 1. Its `modelPath` is not repurposed as a source pointer.

MOD-01 owns `schemaVersion` and `declarations`. Each supported declaration contains
`kind`, a `definition` with identity/name/context/version, optional `dataFacet`,
and optional `constraints`. Field locations therefore occur under paths such as
`/declarations/0/dataFacet/fields/1/valueType`; conceptual examples using top-level
`fields`, `name`, or `version` are not the actual authoring schema.

At the inspected base commit `6775c0ff49588143674fc0df005e65e8555c9e03`, MOD-02
exported `ModelLoader` but its implementation file was absent; the Model Core root
barrel also contained authoring-relative imports at the wrong directory, and the
authoring barrel did not export the loader. The intended root API text was
misplaced in ADR-029. This change restores the root/subsystem exports and supplies
the missing orchestration through the existing MOD-01 validators and factories.
It does not change the authoring schema, supported semantic kinds, or Kernel
identity rules. Baseline typechecking failed before these repairs.

## Identity and structural paths

`ModelSource.sourceId?: string` remains an optional opaque caller-supplied identity.
No ID is generated, normalized, interpreted as a path/URL, fetched, or associated
with a tenant. A supplied ID is copied to `locations.sourceId` and
`DiagnosticLocation.sourceUri`; an omitted ID leaves coordinates document-local.
The loader verifies that supplied parser metadata belongs to the same source ID.

`SourcePath.fromSegments(['declarations', 0, 'definition', 'version'])` preserves
string properties versus numeric array indices. Segments are copied and frozen;
indices must be nonnegative safe integers (negative zero is rejected). Case is
preserved. `child`, `parent`, and `equals` operate on these typed segments.

String/JSON rendering uses RFC 6901 escaping: `~` becomes `~0`, `/` becomes `~1`.
The root is `''`; `'/'` addresses an empty property name. A string pointer is
interpreted against the actual parsed container; `/0` does not itself encode
whether its token names a property or an array index. Typed lookups additionally
check segment kinds. No path-query language, filesystem path parser, or semantic
identity encoding is introduced. Invalid pointer escapes fail explicitly.

## Map and ranges

A `SourceLocationMap` exposes frozen `entries`, frozen `ambiguousPaths`, optional
`sourceId`, and exact `get(SourcePath | string)` lookup. Entries contain a frozen
path, frozen SK-11 location/positions, and `startOffset`/`endOffset`. No writable
Map, AST, source text, coordinate buffer, or mutation method is published. The
lookup closure captures only a private metadata index, not its parser collector.
There is no global location registry or multi-document merge.

Offsets are zero-based **UTF-16 code units in the original JavaScript string**.
Entry offset ranges are half-open `[startOffset, endOffset)`. A nonempty range's
last included code unit, `endOffset - 1`, supplies SK-11's inclusive end coordinate.
An authentic zero-length parser span has equal offsets and a start position only;
it is not an invented end. A start-only error location remains start-only.

LF and lone CR advance one line; CRLF advances one line after both code units.
Columns count UTF-16 units, including both units of a surrogate pair. No newline,
Unicode, whitespace, or encoding normalization occurs. EOF is a valid point.
A parser error with a valid start but unavailable/out-of-bounds end keeps only
that start; an invalid start yields no location. Invalid mapping ranges are an
integrity failure, not a silently clamped range.

A bounded temporary coordinate table is built in one scan; endpoint conversion
is constant-time. Tree walks and source-order entry construction are iterative.
With the fixed path/depth budgets, work is linear in source size plus syntax
nodes. Exact published lookup uses a private hash index. Parser trees and
coordinate buffers are released after metadata extraction.

## JSON integration and duplicates

`JsonModelParser.parseWithLocations` uses the already lockfile-resolved
`jsonc-parser` 3.3.1, now declared directly by Model Core. Its scanner bounds
nesting/token work; its `parseTree` supplies authentic node offsets/lengths and
structured error offsets. Comments, trailing commas, and empty content are
explicitly disabled for provenance parsing. Fault-tolerant trees are never
published as valid maps.

The existing native `JSON.parse` remains the authoritative data parser. A second
**provenance-only** parser pass is deliberate: replacing native value construction
would risk differences in duplicate keys, object prototypes, numeric values, or
accepted syntax. Native rejection always fails loading; if native data is accepted
but provenance cannot be verified, loading fails with
`MODEL_LOADER_LOCATION_ERROR`. There is no independent loader configuration or
comment-enabled JSON mode. This compatibility choice and deferred verification
are recorded in ADR-030.

Native duplicate-property behavior remains **last value wins**. Each duplicate
key produces a bounded `MODEL_SOURCE_DUPLICATE_KEY` warning at the actual duplicate
key token. Its structural path and all descendants are excluded from the single-
origin map and recorded in `ambiguousPaths`; even identical duplicate values are
ambiguous. Other verified paths remain available. No duplicate silently overwrites
a published location, and duplicates are not newly rejected at syntax level.

## YAML integration and limitations

`YamlModelParser.parseWithLocations` reuses `yaml`'s existing `parseAllDocuments`
pass, then its same document's `toJS`. Existing options remain: `uniqueKeys: true`,
`merge: false`, `strict: true`, `prettyErrors: true`, and exactly one document.
`maxAliasCount: 100` makes the library's existing default explicit. Parser logging
is silenced so failures or complex keys do not emit source snippets. No custom tag
constructors, reviver, or unsafe evaluation is enabled. Existing schema/directive
and unresolved-tag fallback semantics are not replaced by stricter new tag rules.

Parsed node `range[0]`/`range[1]` supplies start/value-end, excluding the node's
trailing comment range. Scalar, mapping, sequence, block scalar, and alias-use
nodes receive their actual available spans. Mapping keys that are primitive
scalars use the library's object-key conversion (including null -> empty string).
Collection keys and alias keys have no guessed structural property mapping.
Tagged nonstandard collections retain their own range, but their transformed
children are not mapped as ordinary properties/indices. Any collision after key
conversion is marked ambiguous rather than overwritten.

Aliases receive the span of **their source use**, not their anchor target.
Expanded alias descendants have no distinct source occurrence and are absent
from that path's map. The anchor's independently authored subtree remains mapped
where structurally addressable. The tracker never follows alias targets or builds
a cyclic location structure. Alias conversion failures without structured parser
positions remain unlocated. Existing safe tag/alias acceptance is preserved.

YAML syntax errors, including duplicate keys, use structured `error.pos`.
Multi-document rejection uses the second document's actual content range when
available. No map or invalid document is published for syntax failure.

## Diagnostics and load results

Existing `ModelDocumentParser.parse(content): unknown` implementations remain
valid. Its optional `parseWithLocations(content, sourceId)` extension returns a
frozen result wrapper with untrusted `value`, optional `locations`, and optional
diagnostics. Built-in parsers use one coherent implementation for both entry
points. Raw structured values retain the existing mutable/untrusted parsing
contract; the wrapper and published location metadata are immutable.

`ModelLoadResult` preserves `SUCCESS`/`FAILURE` and adds optional `locations`.
Existing success/failure factory parameters remain valid, with an optional final
metadata parameter. A successful document still comes only from MOD-01's
`parseAuthoringDocument`. A structural failure may carry its verified map; a
syntax failure carries only authentic diagnostic positions. Parse-only injected
parsers degrade explicitly to no map and no fabricated coordinates.

Location enrichment uses MOD-01's existing diagnostic codes and structured
`details.property`/`details.index`, or its typed factory error `field` and
`declarationIndex`. It never parses message prose or searches source text.

| Diagnostic                            | Verified target                                         |
| ------------------------------------- | ------------------------------------------------------- |
| Invalid root                          | Parsed root value                                       |
| Unsupported schema version            | `/schemaVersion` value                                  |
| Invalid root property/collection      | Actual property value                                   |
| Unsupported declaration kind          | Declaration's `/kind` value                             |
| Invalid declaration object            | Actual declaration value                                |
| Invalid definition                    | Definition value, when the validator identifies it      |
| Missing required property             | Actual containing object                                |
| Factory-only facet/constraint failure | Facet/constraint collection reported by the typed error |
| Unknown/ambiguous/unavailable path    | No source position                                      |

The current validators do not report exact nested field/constraint error paths.
Their failures may therefore have a verified facet or collection span rather than
a particular field property. Precise field/type/constraint **lookup** is supported;
new semantic validation rules or guessed nested diagnostic paths are not added.
Existing authoring diagnostic messages/details are preserved when they can be
constructed; new parser/loader failures use fixed text without exception snippets.

## Resource bounds and failure policy

| Resource                                                  | Bound                                                    |
| --------------------------------------------------------- | -------------------------------------------------------- |
| Source length                                             | 2,000,000 UTF-16 units, checked before trimming/scanning |
| JSON container depth                                      | 128                                                      |
| YAML walk depth                                           | 128, root depth zero                                     |
| SourcePath depth                                          | 128 segments                                             |
| JSON value nodes / YAML walked nodes / map entry attempts | 100,000                                                  |
| JSON scanner tokens, including trivia                     | 400,000                                                  |
| One rendered source pointer                               | 4,096 UTF-16 units                                       |
| Aggregate attempted map pointer lengths                   | 8,000,000 UTF-16 units                                   |
| YAML alias expansion                                      | Existing library limit of 100                            |
| Duplicate JSON warnings                                   | At most 128                                              |
| Published load diagnostics                                | At most 256; an error is retained on failure             |

The old source/parser code had no explicit source/depth/node budgets. These new
bounded-input policies are deliberate compatibility constraints. Excess input
fails with a controlled resource diagnostic; it is never truncated into a valid
document. Source mapping is mandatory for built-in parser operations; integrity
failure does not masquerade as absent optional metadata. A legacy parse-only
injected parser explicitly supplies no provenance. No unsupported language or
semantic migration capability is introduced.

## Public usage and Mini Sales

```typescript
import { loadModel, SourcePath } from '@ecosystem/model-core';

const result = loadModel({
  source: { sourceId: 'mini-sales', format: 'json', content: sourceText },
});
if (result.status === 'SUCCESS') {
  const declaration = result.locations?.get('/declarations/0');
  const fieldType = result.locations?.get(
    SourcePath.fromSegments([
      'declarations',
      0,
      'dataFacet',
      'fields',
      1,
      'valueType',
    ]),
  );
}
```

A minimal Customer declaration in the actual schema:

```yaml
schemaVersion: '1.0.0'
declarations:
  - kind: type
    definition:
      id: sales-customer
      qualifiedName: sales.Customer
      contextRef: sales
      kind: type
      version: '1.0.0'
    dataFacet:
      kind: core.data
      ownerType: { elementId: sales-customer, version: '1.0.0' }
      fields:
        - id: customer-name
          qualifiedName: sales.Customer.name
          contextRef: sales
          kind: field
          ownerType: { elementId: sales-customer, version: '1.0.0' }
          valueType: { by: primitive, primitiveType: STRING }
```

Product and SalesOrder use the same declaration envelope with their own explicit
IDs/names. Repeated fields in separate declarations keep separate structural
paths. An unsupported root schema version locates its actual value. A missing
`definition` locates its containing declaration, not an invented property. A bad
nested field is rejected by the existing factory, with its reported facet span;
it is never silently corrected. JSON and YAML coordinates reflect their actual
text and are not normalized to match.

## Scope and verification

Locations remain separate from stable semantic IDs, QualifiedName, context,
versions, TypeRegistry, canonicalization, and runtime provenance. There is no
CanonicalModel, resolver, compiler map, source repository, editor, tracing,
authorization inference, or MOD-04 implementation.

Automated tests and parser behavior experiments are explicitly deferred. Exactly
one archive, `test-archive/MOD-03/MOD-03-deferred-tests.md`, documents future
verification. Build/typecheck, formatting, and static architecture/source review
are reported separately; deferred expected outcomes are not execution evidence.

Implementation provenance: Codex; task MOD-03; 2026-10-13; base commit recorded
above; change rationale in ADR-030 and the pull-request completion report.
