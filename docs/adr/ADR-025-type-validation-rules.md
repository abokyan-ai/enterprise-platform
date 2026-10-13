# ADR-025: Deterministic Local Type Validation Rules With Structured Diagnostics (TYPE-06)

## Status

Accepted for TYPE-06.

## Context

As the Model Core establishes authored definition models (`TypeDefinition`, `FieldDefinition`, `DataFacet`, `FieldConstraintSet`, and `TypeReference`), the platform requires a deterministic capability to validate the semantic consistency of authored type definitions.

Without an authoritative validation subsystem:
1. Models might contain contradictory declarations (e.g. `MIN_LENGTH > MAX_LENGTH` or `STRING + MIN_VALUE`).
2. DataFacets or FieldDefinitions might belong to mismatched type definitions or versions.
3. Errors would either be deferred to runtime execution (violating the Clean-Core predictability principle) or thrown as unhandled exceptions that destroy batch authoring feedback.
4. Validation might mistakenly attempt global reference resolution, coupling authoring tools to global registries and runtime services.

## Decision

### 1. Architectural Placement in Model Core
`TypeValidationRules` belongs exclusively to Layer C (**Model Core** / `@ecosystem/model-core`), located under `platform/model/model-core/src/validation/`.
- Depends solely on `@ecosystem/semantic-kernel` and internal Model Core contracts.
- Zero dependencies on NestJS, Angular, PrimeNG, databases, ORMs, or compiler internals.

### 2. Structured Diagnostics (SK-11) Over Exceptions
Instead of throwing JavaScript exceptions or returning untyped strings, validation produces an immutable collection of structured **SK-11 Diagnostics**:
- Canonical machine-readable codes conforming to SK-11 DiagnosticCode grammar (e.g., `TYPE_VALIDATION_DATA_FACET_OWNER_ID_MISMATCH`).
- Explicit severities (`DiagnosticSeverities.ERROR`, `WARNING`, `INFO`).
- Precise semantic locations (`elementId`, `qualifiedName`, `contextRef`, `modelPath`).
- Safe, bounded contextual details.

### 3. Separation of Local Validation (Level B) from Global Resolution (Level C)
Validation in TYPE-06 inspects only explicitly supplied declarations:
- Validates local relationships: TypeDefinition ↔ DataFacet ↔ FieldDefinition ↔ FieldConstraintSet.
- Evaluates declarative applicability and internal bound coherence.
- Does **NOT** query external registries or attempt target type resolution.
- An absent external type target is **NOT** an error in TYPE-06; target resolution is deferred to Level C compiler/resolver tasks.

### 4. Pure Function & Deterministic Pipeline
The validation engine is implemented as a pure function:
```typescript
validateTypeDefinition(input: TypeValidationInput, options?: ValidateTypeDefinitionOptions): TypeValidationResult
```
- Deterministic: Identical input always yields identical, identically ordered diagnostics.
- Side-Effect-Free: Inputs are never mutated; no automatic repairs or inferred defaults.
- Bounded: Finite iterations over supplied arrays with $O(N)$ lookup maps for duplicate checks.

### 5. Explicit Coverage Reporting
To prevent misleading claims of universal correctness:
- The result includes a `TypeValidationCoverage` audit report listing executed and skipped categories.
- `hasErrors = false` indicates only that the executed local rules detected no violations in the supplied declarations. It does not certify global model validity or runtime compilability.

## Consequences

### Positive
- **Deterministic Predictability:** Authors receive immediate, structured feedback on semantic definition inconsistencies.
- **Clean Architectural Isolation:** Semantic definitions remain decoupled from runtime databases, UI presentation frameworks, and compiler lowering passes.
- **Composable Rule Suite:** Pure rule functions can be executed collectively or selectively without stateful side effects.
- **Immutability Guaranteed:** All results and diagnostics are frozen with `Object.freeze`.

### Negative / Trade-offs
- **Resolution Deferred:** Authoring tools cannot verify whether a referenced type name exists across other packages without a future resolver pass.
- **No Cross-Field Predicates:** Business rules requiring cross-field expression evaluations (e.g. `startDate < endDate`) are outside the scope of declarative type validation.
