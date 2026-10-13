# Field Constraints Architecture — TYPE-04

**Module:** `@ecosystem/model-core`  
**Layer:** C. Semantic Type System — Pure TypeScript Model Core  
**Milestone:** TYPE-04 — Field Constraints  
**Status:** Implemented  
**ADR:** [ADR-023](../adr/ADR-023-field-constraints.md)

---

## 1. Executive Summary and Purpose

In a model-driven enterprise platform, semantic fields declared on types must be governed by declarative constraints defining the boundaries of valid data values.

While **TYPE-02 (`FieldDefinition`)** defines individual field identity and declared value types, and **TYPE-03 (`DataFacet v0`)** provides structural containment under an authored type snapshot, **TYPE-04 (`Field Constraints`)** establishes the declarative restriction contract:
- It defines an extensible, strongly typed discriminated union of field-level constraints.
- It reuses exact numeric representations from **SK-09** to eliminate floating-point rounding errors.
- It enforces **Unicode code-point** counting for string length bounds.
- It provides a single, unambiguous attachment authority through **`FieldConstraintSet`**, associating constraints with a field without mutating existing `FieldDefinition` or `DataFacet` contracts.
- It validates parameter bounds, singleton cardinality, cross-constraint coherence, and primitive-type applicability ahead-of-time.
- It strictly isolates metadata declarations from runtime evaluation, database generation, compiler passes, and UI frameworks.

---

## 2. Architectural Boundaries and Invariants

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TypeDefinition (TYPE-01)                        │
│          id: SemanticElementId | version: SemanticVersion              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ contains via DataFacet
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FieldDefinition (TYPE-02)                       │
│      id: SemanticElementId | ownerType: ElementVersionRef              │
│      valueType: PrimitiveFieldType (e.g. STRING, DECIMAL, INTEGER)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ associated via
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FieldConstraintSet (TYPE-04)                       │
│   fieldId: SemanticElementId | ownerType: ElementVersionRef            │
├────────────────────────────────────────────────────────────────────────┤
│   constraints: readonly FieldConstraint[]                              │
│   ├── MIN_LENGTH(2)                                                    │
│   ├── MAX_LENGTH(120)                                                  │
│   ├── MIN_VALUE(0.00, DECIMAL)                                         │
│   ├── MAX_VALUE(100000.00, DECIMAL)                                    │
│   └── PRECISION_SCALE(18, 2)                                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Non-Negotiable Invariants:

1. **Declarative Restriction:** A FieldConstraint describes a condition that a value must satisfy. It contains NO runtime evaluation logic, NO instance records, and NO database execution handles.
2. **Distinct Concepts:**
   - `FieldConstraint ≠ FieldDefinition` (restriction vs structural definition).
   - `FieldConstraint ≠ PrimitiveType` (restriction vs value category).
   - `FieldConstraint ≠ PrimitiveValue` (bound declaration vs concrete value).
   - `FieldConstraint ≠ Database Constraint` (semantic rule vs SQL table constraint).
   - `FieldConstraint ≠ Angular Validator` (semantic rule vs UI form control validator).
3. **Exact Numeric Representation:** All numeric bounds are stored as canonical decimal strings conforming to SK-09. Zero unsafe JS `Number` conversions; zero floating-point rounding.
4. **Unicode Code-Point Text Metric:** String bounds are measured in Unicode code points, ensuring surrogate-pair safety.
5. **Singleton Cardinality:** At most one constraint per singleton kind per set (rejects duplicate `MIN_LENGTH`, `MAX_LENGTH`, `MIN_VALUE`, `MAX_VALUE`, `PRECISION_SCALE`).
6. **Local Coherence:** Rejects contradictory declarations (`MIN_LENGTH > MAX_LENGTH` or `MIN_VALUE > MAX_VALUE`).
7. **Applicability Enforcement:** Validates compatibility between constraint kinds and field primitive types ahead-of-time. Rejects primitive constraints on referenced authored types (`by === 'reference'`).
8. **Clean Architecture:** Pure TypeScript in `@ecosystem/model-core` depending only on `@ecosystem/semantic-kernel`. Zero external framework dependencies.

---

## 3. Field Constraint Taxonomy

Constraint kinds use uppercase string literals:

| Kind | Parameters | Target Primitive | Semantic Meaning |
| :--- | :--- | :--- | :--- |
| `MIN_LENGTH` | `minimum: number` | `STRING` | Minimum Unicode code points required |
| `MAX_LENGTH` | `maximum: number` | `STRING` | Maximum Unicode code points permitted |
| `MIN_VALUE` | `minimum: string`, `valueType: 'INTEGER' \| 'DECIMAL'`, `inclusive: boolean` | `INTEGER` or `DECIMAL` | Lower numeric bound |
| `MAX_VALUE` | `maximum: string`, `valueType: 'INTEGER' \| 'DECIMAL'`, `inclusive: boolean` | `INTEGER` or `DECIMAL` | Upper numeric bound |
| `PRECISION_SCALE` | `precision: number`, `scale: number` | `DECIMAL` | Maximum total and fractional digits |

---

## 4. Strongly Typed Constraint Variants

Each constraint variant is an immutable, strongly typed interface:

```typescript
export interface MinLengthConstraint {
  readonly kind: 'MIN_LENGTH';
  readonly minimum: number;
}

export interface MaxLengthConstraint {
  readonly kind: 'MAX_LENGTH';
  readonly maximum: number;
}

export interface MinValueConstraint {
  readonly kind: 'MIN_VALUE';
  readonly valueType: 'INTEGER' | 'DECIMAL';
  readonly minimum: string;
  readonly inclusive: boolean;
}

export interface MaxValueConstraint {
  readonly kind: 'MAX_VALUE';
  readonly valueType: 'INTEGER' | 'DECIMAL';
  readonly maximum: string;
  readonly inclusive: boolean;
}

export interface PrecisionScaleConstraint {
  readonly kind: 'PRECISION_SCALE';
  readonly precision: number;
  readonly scale: number;
}

export type FieldConstraint =
  | MinLengthConstraint
  | MaxLengthConstraint
  | MinValueConstraint
  | MaxValueConstraint
  | PrecisionScaleConstraint;
```

---

## 5. String Length and Numeric Semantics

### String Length Metric
- Metric: `STRING_LENGTH_METRIC = 'UNICODE_CODE_POINT'`.
- Measured in Unicode code points rather than UTF-16 code units (`str.length`).
- Upper bound: constrained by `STRING_MAX_LENGTH` (65,536).
- Minimum bound: nonnegative safe integer (`>= 0`).

### Exact Numeric Comparison
- **`INTEGER`:** Evaluated using `BigInt` comparison. Handles numbers up to 38 digits without precision loss.
- **`DECIMAL`:** Evaluated using custom string-based integer-part and fractional-part scale alignment (`compareExactDecimals`). Completely exact; no floating-point conversion; no rounding.

### Decimal Precision and Scale Invariants
- `precision > 0` and `precision <= 38` (`DECIMAL_MAX_TOTAL_DIGITS`).
- `scale >= 0` and `scale <= 18` (`DECIMAL_MAX_FRACTION_DIGITS`).
- `scale <= precision`.

---

## 6. Field Association via FieldConstraintSet

Constraints are bound to fields through an immutable `FieldConstraintSet`:

```typescript
export interface FieldConstraintSet {
  readonly fieldId: SemanticElementId;
  readonly ownerType: ElementVersionRef;
  readonly constraints: readonly FieldConstraint[];
  readonly count: number;
  hasConstraint(kind: FieldConstraintKind): boolean;
  getConstraint<T extends FieldConstraint = FieldConstraint>(kind: FieldConstraintKind): T | undefined;
}
```

### Construction via Field Aware Factory:
```typescript
const constraintSet = createFieldConstraintSetForField(
  customerNameField,
  [
    createMinLengthConstraint(2),
    createMaxLengthConstraint(120),
  ],
);
```

### Invariants Enforced on Association:
1. **Target Field Authenticity:** Must be an authentic `FieldDefinition`.
2. **Owner Pinning:** Pinned to `field.ownerType` (exact TypeDefinition version snapshot).
3. **Primitive Type Compatibility:** Rejects incompatible constraints (e.g. `MIN_VALUE` on `STRING`).
4. **Referenced Type Isolation:** Rejects primitive constraints if `field.valueType.by === 'reference'`.
5. **Cross-Constraint Coherence:** Rejects `MIN_LENGTH > MAX_LENGTH` and `MIN_VALUE > MAX_VALUE`.
6. **Singleton Cardinality:** Rejects duplicate constraint kinds.

---

## 7. Applicability Matrix

| Constraint Kind | STRING | INTEGER | DECIMAL | BOOLEAN | DATE / TIME | Referenced Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MIN_LENGTH` | **Supported** | Rejected | Rejected | Rejected | Rejected | Rejected |
| `MAX_LENGTH` | **Supported** | Rejected | Rejected | Rejected | Rejected | Rejected |
| `MIN_VALUE (INTEGER)` | Rejected | **Supported** | Rejected | Rejected | Rejected | Rejected |
| `MIN_VALUE (DECIMAL)` | Rejected | Rejected | **Supported** | Rejected | Rejected | Rejected |
| `MAX_VALUE (INTEGER)` | Rejected | **Supported** | Rejected | Rejected | Rejected | Rejected |
| `MAX_VALUE (DECIMAL)` | Rejected | Rejected | **Supported** | Rejected | Rejected | Rejected |
| `PRECISION_SCALE` | Rejected | Rejected | **Supported** | Rejected | Rejected | Rejected |

---

## 8. Deliberately Deferred Categories

To maintain clean-core boundaries and avoid premature complexity:
- **`PATTERN`:** Deferred in v0 pending an explicit, safe, catastrophe-free pattern grammar.
- **`ALLOWED_VALUES`:** Deferred in v0 pending canonical typed literal set specification.
- **`UNIQUE` / `FOREIGN_KEY` / `EXISTS_IN`:** Relational and storage constraints belong to future platform milestones.
- **`CROSS_FIELD` / `EXPRESSION` / `SCRIPT`:** Multi-field dependencies and expression trees are excluded from local field constraints.
- **`Runtime Evaluation`:** Validates declarations ahead-of-time; runtime evaluation belongs to execution layers.
- **`Persistence Schemas`:** Zero SQL `CHECK` generation, table columns, or ORM decorators.
- **`UI Integration`:** Zero Angular validators or PrimeNG components.

---

## 9. Serialization and Wire Interchange

Field constraints and sets support deterministic JSON interchange:

```typescript
// Serialize
const json = serializeFieldConstraintSet(constraintSet);

// Parse with validation
const restored = parseFieldConstraintSet(json);

// Non-throwing parse
const result = tryParseFieldConstraintSet(untrustedData);
if (result.ok) {
  // result.value is authentic FieldConstraintSet
} else {
  // result.error is FieldConstraintValidationError
}
```

---

## 10. Architectural Conformance Checklist

| Requirement | Implementation | Status |
| :--- | :--- | :--- |
| Declarative Constraint Model | Discriminated union of typed variants | Verified |
| SK-09 Numeric Reuse | Exact canonical decimal strings for numeric bounds | Verified |
| Unicode Code-Point Length Metric | `STRING_LENGTH_METRIC = 'UNICODE_CODE_POINT'` | Verified |
| Decimal Precision/Scale Invariants | `precision <= 38`, `scale <= 18`, `scale <= precision` | Verified |
| Deferred Categories Documented | `PATTERN` & `ALLOWED_VALUES` safely deferred | Verified |
| Single Attachment Model | Immutable `FieldConstraintSet` pinned by ID & ownerType | Verified |
| Singleton Cardinality | Rejects duplicate constraint kinds | Verified |
| Local Contradiction Checks | Rejects `min > max` length and numeric bounds | Verified |
| Primitive Applicability Checking | Enforced locally via `validateConstraintApplicability` | Verified |
| Zero Runtime/DB/UI Coupling | Pure TypeScript in `@ecosystem/model-core` | Verified |
