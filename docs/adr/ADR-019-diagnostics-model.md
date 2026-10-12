# ADR-019: Structured, Immutable Diagnostics as a Framework-Independent Kernel Contract (SK-11)

## Status

Accepted for SK-11.

## Context

Across the Model-Driven Enterprise Ecosystem Platform, diverse components—model parsers,
semantic validators, compilation passes, runtime adapters, API gateways, CLI utilities,
and UI studio components—must report domain observations, warnings, and errors.

In many systems, diagnostics are conflated with:
1. **Programming Exceptions:** Throwing `Error` instances for routine domain feedback, leading to
   abrupt control-flow termination and inability to collect multiple issues in a single pass.
2. **Operational Logging:** Emitting unstructured strings via `console.log()` or logging frameworks,
   preventing programmatic inspection, localization, or automated remediation.
3. **Application Frameworks:** Coupling error models directly to HTTP status codes, NestJS filters,
   or Angular/PrimeNG UI components.

SK-11 establishes a foundational, framework-independent Diagnostics Model inside the Pure TypeScript
Semantic Kernel.

## Decision

### 1. Diagnostics Are Data, Not Exceptions

A Diagnostic is an immutable value describing an observed condition. It does not dictate execution flow
or force process termination. Operations collect and return diagnostics as pure data rather than relying
on exception-throwing side effects.

### 2. Stable Diagnostic Codes via Canonical Grammar

Every diagnostic possesses a stable, machine-readable `DiagnosticCode` (e.g. `SK_INVALID_ID`,
`MODEL_UNRESOLVED_REFERENCE`). Diagnostic codes are:
- Governed by canonical uppercase grammar: `^[A-Z][A-Z0-9]*(_[A-Z][A-Z0-9]*)*$`.
- Strictly bounded: 2 to 64 characters, 1 to 8 segments.
- Independent of human-readable message prose or localization.
- Never fabricated from stack traces or exception messages.

### 3. Explicit Severity Classification

The platform defines a finite, closed classification:
- `ERROR`: Condition preventing an artifact or operation from satisfying requirements.
- `WARNING`: Nonblocking condition affecting quality, compatibility, or maintainability.
- `INFO`: Informational observation.

Severities are never automatically promoted (e.g. WARNING to ERROR) by the Kernel; higher-level
tools or callers govern policy.

### 4. Optional Semantic and Source Location

A Diagnostic may identify where an issue occurred using technology-neutral coordinates:
- **Semantic Location:** `elementId` (SK-01), `qualifiedName` (SK-03), `contextRef` (SK-04), and `modelPath`.
- **Source Coordinates:** `sourceUri`, `start`, and `end` with explicit 1-based line and column semantics.

Locations are optional. In accordance with platform principles, **Missing ≠ Null ≠ Value**: when a location
is absent, the field is omitted rather than populated with placeholder strings or `null`.

### 5. Safe Contextual Details

To support structured diagnostics without turning into untyped metadata bags:
- `details` accepts only bounded JSON-safe primitives (string, number, boolean, null) and flat arrays/objects.
- Functions, symbols, BigInts, and cyclic objects are strictly rejected.
- String lengths and entry counts are strictly bounded.

### 6. Immutable Diagnostic Collection

The platform provides `DiagnosticCollection` and pure functions (`hasErrors`, `hasWarnings`,
`combineDiagnostics`):
- Internal arrays are frozen (`Object.freeze`).
- Concatenation preserves insertion order without silent deduplication.
- `hasErrors` returns true if and only if at least one diagnostic has `ERROR` severity.
- Preserves full backward compatibility with the initial ARC-01 `DiagnosticResult` contract.

### 7. Clean Architecture & Framework Independence

The Diagnostics Model:
- Contains zero dependencies on NestJS, Angular, PrimeNG, or database libraries.
- Uses no Node.js-only APIs (`fs`, `path`, `process`).
- Performs no stdout/stderr printing, logging, or process exits.

## Consequences

- **Positive:** Standardized, machine-readable issue reporting across all layers of the platform.
- **Positive:** Multi-issue accumulation during compilation and authoring passes.
- **Positive:** Deterministic serialization and deserialization for IPC and REST interchange.
- **Positive:** Zero breaking changes to existing SK-01 through SK-10 contracts.
- **Trade-off:** Callers wishing to treat diagnostics as errors must explicitly inspect `hasErrors`
  rather than relying on automated exception throwing.
