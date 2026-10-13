# ADR-029: Pure Format-Aware Model Loader with Explicit Source Boundaries and MOD-01 Structural Validation

- Status: Accepted
- Date: 2026-10-13

## Context

The semantic core needs a deterministic boundary that transforms explicitly supplied source text into a structurally valid MOD-01 AuthoringDocument without introducing filesystem access, network access, runtime execution, or framework coupling.

The project structure separates:

- Semantic Core
- Mechanical Runtime
- Framework Adapters

The Model Loader belongs squarely in the semantic core. It consumes source text provided by callers, not ambient workspace state.

## Decision

We will implement a pure TypeScript ModelLoader in @ecosystem/model-core with the following characteristics:

1. Source acquisition is external to the loader.
2. Supported source formats are explicit: JSON and YAML.
3. Format selection is deterministic and caller-driven.
4. Parsing produces untrusted structured data.
5. MOD-01 validation is mandatory before a document is accepted.
6. Diagnostics are emitted through SK-11 contracts.
7. TypeRegistry and runtime compilation are intentionally excluded.
8. Canonicalization and source-location tracking remain separate future concerns.

## Rationale

This keeps the Model Core framework-independent while preserving semantic purity. It mirrors the clean boundary already established by the semantic kernel and the authoring schema. It also prevents accidental coupling to filesystem, NestJS, Angular, database, or compiler runtime.

## Consequences

### Positive

- Deterministic parsing and validation.
- Safe handling of untrusted source text.
- Reuse of existing AuthoringDocument and SK-11 diagnostics contracts.
- Clear boundary for future MOD-03 and MOD-04 work.

### Negative

- The loader does not discover files.
- The loader does not resolve references.
- The loader does not canonicalize or compile.
- YAML duplicate-key enforcement depends on the selected safe parser configuration.

## Scope

This ADR is limited to MOD-02 and does not create MOD-03 or MOD-04 capabilities.
