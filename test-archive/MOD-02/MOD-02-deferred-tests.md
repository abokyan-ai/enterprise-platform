# Model Loader

## Purpose

The Model Loader converts explicitly supplied source text into a structurally valid MOD-01 AuthoringDocument using Pure TypeScript contracts and SK-11 diagnostics.

## Architectural ownership

The Model Loader lives in `platform/model/model-core` and is intentionally framework-independent. It does not access files, networks, or runtime services.

## ModelSource contract

```ts
interface ModelSource {
  readonly content: string;
  readonly format: 'json' | 'yaml';
  readonly sourceId?: string;
}
```

The caller provides the content. The loader validates the input but does not read source content from disk.

## Supported formats

- JSON
- YAML

Explicit format selection is preferred. No implicit parser fallback is provided.

## Parser behavior

- JSON parsing is performed via `JSON.parse` with controlled error reporting.
- YAML parsing uses a safe configuration with `uniqueKeys: true`, `merge: false`, and `strict: true`.
- Multiple YAML documents are rejected.
- Empty or whitespace-only content is rejected.

## Structural validation

The parser output is untrusted until it is validated against MOD-01 via `validateAuthoringDocumentStructure` and then accepted by `createAuthoringDocument`.

Important distinction:

- Parsing validates syntax.
- Structural validation validates the authoring schema.
- Semantic validation remains a future concern outside MOD-02.

## Public API

```ts
import { loadModel, type ModelSource, type ModelLoadResult } from '@ecosystem/model-core';
```

Successful calls return a `SUCCESS` result containing an `AuthoringDocument`.

Failure calls return a `FAILURE` result with diagnostics only.

## Security and resource safety

- No filesystem access.
- No network access.
- No YAML tag execution.
- No arbitrary object instantiation.
- No canonicalization.
- No registry registration.

## Known limitations

- Source-location tracking is deferred to MOD-03.
- Semantic reference resolution is deferred to later model-processing tasks.
- Canonical model creation is deferred to MOD-04.
