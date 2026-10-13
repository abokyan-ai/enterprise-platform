# ADR-023: Typed Declarative Field Constraints With Deferred Runtime Evaluation (TYPE-04)

## Status

Accepted for TYPE-04.

## Context

In model-driven enterprise platforms, defining a type's structural properties (TYPE-02 `FieldDefinition`) requires specifying value-domain restrictions—such as length bounds, numeric limits, and decimal precision/scale.

In conventional architectures, constraint systems frequently suffer from severe design flaws:
1. **Conflation with Runtime Evaluators:** Coupling declarative constraint metadata directly with execution logic (`constraint.evaluate(value)` or JavaScript predicates `(val) => val > 10`), causing security risks, lack of serializability, and framework lock-in.
2. **Coupling to Persistence/ORM Engines:** Conflating semantic field bounds with physical database constructs (SQL `CHECK` constraints, database column lengths, `VARCHAR` allocations, or ORM validation decorators).
3. **Coupling to Presentation/UI Frameworks:** Modeling constraints directly as Angular `Validators`, PrimeNG components, or reactive form schemas.
4. **Untyped Bags & Loose Options:** Using generic unstructured maps (`{ kind: string, options: Record<string, any> }`), destroying compile-time type safety.
5. **Loss of Precision:** Converting exact decimal or integer bounds to IEEE 754 floating-point numbers (`number`), leading to rounding errors and corrupted enterprise bounds.
6. **Implicit Text Length Metrics:** Equating text length to JavaScript `.length` (UTF-16 code units) rather than an explicit, portable metric (such as Unicode code points).
7. **Unchecked Contradictions:** Allowing contradictory declarations (e.g. `MIN_LENGTH(100)` and `MAX_LENGTH(50)`) to silently persist.

TYPE-04 introduces the foundational `FieldConstraint` and `FieldConstraintSet` model in Model Core (`@ecosystem/model-core`).

## Decision

### 1. Architectural Ownership in Model Core

Field Constraints belong to Layer C (**Model Core** / `@ecosystem/model-core`), located under `platform/model/model-core/src/constraints/`. Model Core depends exclusively on `@ecosystem/semantic-kernel` and contains zero framework, ORM, database, or UI dependencies.

### 2. Purely Declarative, Discriminated Union Representation

A `FieldConstraint` is a declarative, serializable specification of an allowed value domain, modeled as an immutable discriminated union:
```typescript
export type FieldConstraint =
  | MinLengthConstraint
  | MaxLengthConstraint
  | MinValueConstraint
  | MaxValueConstraint
  | PrecisionScaleConstraint;
```
- **Discriminant Taxonomy:** Uses closed `FieldConstraintKinds` (`MIN_LENGTH`, `MAX_LENGTH`, `MIN_VALUE`, `MAX_VALUE`, `PRECISION_SCALE`).
- **No Executable Callbacks:** Scripting, dynamic functions, and JavaScript predicates are strictly excluded.
- **Explicit Deferral:** `PATTERN` (pending a safe, portable regular expression grammar) and `ALLOWED_VALUES` (pending canonical typed literal set specification) are deferred from v0.

### 3. Exact Numeric Semantics Reused from SK-09

Numeric bounds in `MIN_VALUE` and `MAX_VALUE` are represented as canonical decimal strings conforming to SK-09 grammar.
- **Integer Bounds:** Compared exactly using `BigInt` without floating-point conversion.
- **Decimal Bounds:** Compared exactly using string-based digit and scale alignment without numeric conversion or rounding.

### 4. Canonical String Length Metric

Text bounds (`MIN_LENGTH`, `MAX_LENGTH`) are defined in terms of **Unicode code points** (`STRING_LENGTH_METRIC = 'UNICODE_CODE_POINT'`), ensuring surrogate-pair safety and cross-platform determinism. Bound values are bounded by `STRING_MAX_LENGTH` (65,536).

### 5. Single Attachment Authority via FieldConstraintSet

Rather than mutating the minimal `FieldDefinition` contract from TYPE-02 or inserting untyped properties:
- Constraints are associated with a target field through an immutable `FieldConstraintSet`:
  ```typescript
  export interface FieldConstraintSet {
    readonly fieldId: SemanticElementId;
    readonly ownerType: ElementVersionRef;
    readonly constraints: readonly FieldConstraint[];
    // ...
  }
  ```
- Target field is identified by stable `SemanticElementId` and the containing `TypeDefinition` snapshot `ElementVersionRef`.
- Preserves exact owner version snapshot; zero automatic latest version inference.

### 6. Local Coherence & Applicability Validation

The factories enforce:
1. **Singleton Cardinality:** At most one constraint per singleton kind per set (rejects duplicate `MIN_LENGTH`, `MAX_LENGTH`, etc.).
2. **Length Coherence:** `MIN_LENGTH.minimum <= MAX_LENGTH.maximum`.
3. **Numeric Coherence:** Same `valueType` for `MIN_VALUE` and `MAX_VALUE`, with `minimum <= maximum`.
4. **Precision/Scale Invariants:** `precision > 0`, `scale >= 0`, `scale <= precision`.
5. **Primitive-Type Applicability:**
   - Length constraints apply only to `STRING`.
   - Numeric bounds apply only to matching `INTEGER` or `DECIMAL`.
   - Precision/scale applies only to `DECIMAL`.
   - Primitive constraints on referenced authored types (`by === 'reference'`) are strictly rejected.

### 7. Deferred Runtime Evaluation & Integration Boundaries

- **No Runtime Evaluation:** Validates declarations ahead-of-time; does not evaluate actual entity records or payloads.
- **No Persistence / Database Mapping:** Zero SQL `CHECK` generation, database migrations, or table schema generation.
- **No UI Coupling:** Zero Angular form controls, validators, or PrimeNG components.
- **No Compiler Integration:** Compiler-level semantic IR lowering and code generation belong strictly to Layer:compiler.

## Consequences

- **Positive:** Mathematically sound, immutable, strongly typed field constraints in Model Core.
- **Positive:** Exact numeric precision preserved across enterprise integers and decimals.
- **Positive:** Backward compatibility: `FieldDefinition` (TYPE-02) and `DataFacet` (TYPE-03) remain untouched.
- **Positive:** Ahead-of-time rejection of contradictory bounds and incompatible field types.
- **Positive:** 100% portable Pure TypeScript without external dependencies.
- **Trade-off:** Advanced pattern matching (`PATTERN`) and enumerated sets (`ALLOWED_VALUES`) are deferred to subsequent platform milestones.
