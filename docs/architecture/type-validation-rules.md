# Type Validation Rules — Architecture & Technical Specification

> **Task Reference:** TYPE-06 — Type Validation Rules  
> **Layer:** C. Semantic Type System  
> **Status:** Implemented  
> **Package:** `@ecosystem/model-core`  
> **Dependencies:** `@ecosystem/semantic-kernel`  

---

## 1. Executive Summary & Purpose

The **Type Validation Rules** engine establishes a deterministic, composable, strongly typed capability within the Pure TypeScript Model Core to inspect authored semantic `TypeDefinition` instances and their explicitly available supporting declarations (`DataFacet`, `FieldDefinition`, `FieldConstraintSet`, `TypeReference`).

The engine identifies locally provable semantic inconsistencies, owner mismatches, contradictory constraints, and unassociated declarations, returning structured, immutable **SK-11 Diagnostics** without:
- Performing external type registry lookups or network calls.
- Attempting target reference resolution.
- Validating runtime business entity instances or records.
- Interacting with databases, ORMs, or storage layers.
- Executing compiler passes, IR lowering, or code generation.
- Mutating any authored definitions or performing automatic repairs.

---

## 2. Architectural Boundaries & Level Separation

To prevent premature coupling and maintain the Clean-Core architectural constitution, platform validation is strictly separated into three distinct levels:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Level A: Construction & Primitive Invariants (SK-01..11, TYPE-01..05) │
│ - SemanticElementId grammar, SemanticVersion SemVer syntax            │
│ - QualifiedName dot-notation, Single constraint parameter limits       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ consumes validated primitives
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Level B: Local Semantic Definition Validation (TYPE-06)                 │
│ - TypeDefinition classification kind checks                            │
│ - DataFacet owner element ID and exact version matching                │
│ - FieldDefinition owner element ID and version matching                │
│ - Local field ID and QualifiedName uniqueness                          │
│ - Value-type descriptor structure and reference context boundaries     │
│ - Constraint set owner matching and local field association            │
│ - Constraint applicability against primitive types & non-reference rule │
│ - Constraint set internal coherence (contradictory bounds, singletons) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ yields structured Diagnostics
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Level C: Global / Model-Wide Resolution (Deferred — Future Tasks)      │
│ - External type registry resolution                                    │
│ - Cross-package dependency cycle detection                             │
│ - Type compatibility and subtyping assignability                       │
│ - Compiler IR lowering and runtime execution                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Critical Architectural Distinctions
- **Definition Validation ≠ Runtime Instance Validation:** TYPE-06 validates authoring metadata describing schema structure. It never inspects customer records, invoice totals, or runtime JSON payloads.
- **Local Validation ≠ Reference Resolution:** An authored `TypeReference` is structurally validated for required syntax and explicit context reference. If the target type is absent from the local input, TYPE-06 does **NOT** report `TYPE_NOT_FOUND` because no registry resolution was attempted.
- **Empty Diagnostics ≠ Universal Correctness:** An empty diagnostic collection certifies only that the executed local rules found no violations in the supplied input. It does not certify that the definition is globally unique across all packages or compilable.

---

## 3. Public API Contract

The validation subsystem exposes a single authoritative entry point and narrow input/result contracts from `@ecosystem/model-core`:

```typescript
import {
  validateTypeDefinition,
  type TypeValidationInput,
  type TypeValidationResult,
  type TypeValidationCoverage,
  TYPE_VALIDATION_DIAGNOSTIC_CODES,
  STANDARD_TYPE_VALIDATION_RULES,
} from '@ecosystem/model-core';
```

### 3.1 Input Contract (`TypeValidationInput`)

```typescript
export interface TypeValidationInput {
  /** The authored TypeDefinition under validation (required) */
  readonly typeDefinition: TypeDefinition;

  /** Optional DataFacet declaring the type's structural fields */
  readonly dataFacet?: DataFacet;

  /** Optional FieldConstraintSets declaring field-level restrictions */
  readonly fieldConstraints?: readonly FieldConstraintSet[];
}
```

- **Trusted Input Boundary:** Untrusted objects passed to `validateTypeDefinition` are validated by `validateTypeValidationInput`, ensuring all components conform to authentic Model Core contracts.
- **Missing ≠ Null ≠ Value:** Optional declarations are `undefined`, never coerced to `null` or fake defaults.

### 3.2 Result Contract (`TypeValidationResult`)

```typescript
export interface TypeValidationResult {
  /** Ordered list of structured SK-11 Diagnostics */
  readonly diagnostics: readonly Diagnostic[];

  /** True if at least one Diagnostic has ERROR severity */
  readonly hasErrors: boolean;

  /** True if at least one Diagnostic has WARNING severity */
  readonly hasWarnings: boolean;

  /** Total count of ERROR diagnostics */
  readonly errorCount: number;

  /** Total count of WARNING diagnostics */
  readonly warningCount: number;

  /** Total count of INFO diagnostics */
  readonly infoCount: number;

  /** Total count of all diagnostics */
  readonly totalDiagnosticCount: number;

  /** Audit metrics detailing executed vs skipped check categories */
  readonly coverage: TypeValidationCoverage;

  /** Convenience flag: evaluates to `!hasErrors` */
  readonly isValid: boolean;
}
```

---

## 4. Rule Inventory & Deterministic Execution Pipeline

Rules execute in a strictly documented, deterministic sequential pipeline:

```text
[Input]
   │
   ├─► 1. TypeClassificationRule
   ├─► 2. DataFacetOwnerRule
   ├─► 3. FieldOwnerRule
   ├─► 4. FieldUniquenessRule
   ├─► 5. FieldTypeRule
   ├─► 6. ConstraintAssociationRule
   ├─► 7. ConstraintApplicabilityRule
   └─► 8. ConstraintCoherenceRule
   │
   ▼
[Frozen TypeValidationResult]
```

| Order | Rule ID | Diagnostic Codes | Severity | Invariant Checked |
|---|---|---|---|---|
| 1 | `RULE-TYPE-CLASSIFICATION` | `TYPE_VALIDATION_KIND_MISMATCH` | `ERROR` | Verifies `typeDefinition.kind === SemanticElementKinds.TYPE` ('type'). |
| 2 | `RULE-DATA-FACET-OWNER` | `DATA_FACET_OWNER_ID_MISMATCH`, `DATA_FACET_OWNER_VERSION_MISMATCH` | `ERROR` | Verifies `dataFacet.ownerType` matches `typeDefinition` in both `elementId` and exact SemVer `version`. |
| 3 | `RULE-FIELD-OWNER` | `FIELD_OWNER_ID_MISMATCH`, `FIELD_OWNER_VERSION_MISMATCH` | `ERROR` | Verifies every field in `dataFacet.fields` belongs to the exact containing `typeDefinition` snapshot. |
| 4 | `RULE-FIELD-UNIQUENESS` | `DUPLICATE_FIELD_ID`, `DUPLICATE_FIELD_NAME` | `ERROR` | Detects duplicate `SemanticElementId`s and duplicate case-sensitive `QualifiedName`s across fields. |
| 5 | `RULE-FIELD-TYPE-DECLARATION` | `FIELD_TYPE_INVALID`, `REFERENCE_CONTEXT_MISSING` | `ERROR` | Verifies primitive descriptor validity and ensures named `ElementRef`s contain explicit `contextRef`. |
| 6 | `RULE-CONSTRAINT-ASSOCIATION` | `CONSTRAINT_OWNER_MISMATCH`, `CONSTRAINT_UNASSOCIATED_FIELD` | `ERROR` | Verifies constraint owner matches type snapshot and associates with an existing local field in `dataFacet`. |
| 7 | `RULE-CONSTRAINT-APPLICABILITY` | `CONSTRAINT_INAPPLICABLE` | `ERROR` | Verifies constraints match field primitive type; rejects primitive constraints on referenced types. |
| 8 | `RULE-CONSTRAINT-COHERENCE` | `CONSTRAINT_DUPLICATE_KIND`, `CONSTRAINT_CONTRADICTORY_BOUNDS` | `ERROR` | Detects duplicate singleton constraint kinds and contradictory bounds (min > max). |

---

## 5. Diagnostic Model Integration (SK-11)

All diagnostics are created using `createDiagnostic` from `@ecosystem/semantic-kernel` and strictly conform to SK-11 standards:

1. **Canonical DiagnosticCode Grammar:**
   - Format: `segment ("_" segment)*`
   - Characters: Uppercase ASCII `[A-Z0-9]`
   - Segment count: 1 to 8 segments
   - Length: 2 to 64 characters
   - Example: `TYPE_VALIDATION_DATA_FACET_OWNER_VERSION_MISMATCH` (49 characters, 7 segments).
2. **Explicit Severity:**
   - `DiagnosticSeverities.ERROR` for all locally provable rule violations.
   - `DiagnosticSeverities.WARNING` for non-blocking observations.
   - `DiagnosticSeverities.INFO` for informational notices.
3. **Structured Location (`DiagnosticLocation`):**
   - Attached to the violating element's `elementId`, `qualifiedName`, `contextRef`, and `modelPath`.
   - Never fabricates fake file coordinates or line numbers.
4. **Safe Contextual Details (`DiagnosticDetails`):**
   - Bounded JSON-safe details dictionary holding expected vs actual values.
   - Zero sensitive runtime objects, secrets, or function references.

---

## 6. Mini Sales Reference Scenarios

### Scenario 1: Valid Customer TypeDefinition
```typescript
const customerType = createTypeDefinition({
  id: SemanticElementId.parse('sales-customer-type'),
  qualifiedName: QualifiedName.parse('sales.Customer'),
  contextRef: SemanticContextRef.parse('sales.crm'),
  version: SemanticVersion.parse('1.0.0'),
});

const customerDataFacet = createDataFacet({
  ownerType: customerType.toElementVersionRef(),
  fields: [
    createFieldDefinition({
      id: SemanticElementId.parse('field-customer-id'),
      qualifiedName: QualifiedName.parse('sales.Customer.customerId'),
      contextRef: SemanticContextRef.parse('sales.crm'),
      ownerType: customerType.toElementVersionRef(),
      valueType: createPrimitiveFieldType(PrimitiveTypes.STRING),
    }),
    createFieldDefinition({
      id: SemanticElementId.parse('field-customer-name'),
      qualifiedName: QualifiedName.parse('sales.Customer.name'),
      contextRef: SemanticContextRef.parse('sales.crm'),
      ownerType: customerType.toElementVersionRef(),
      valueType: createPrimitiveFieldType(PrimitiveTypes.STRING),
    }),
  ],
});

const result = validateTypeDefinition({
  typeDefinition: customerType,
  dataFacet: customerDataFacet,
});

// Result:
// result.hasErrors === false
// result.isValid === true
// result.diagnostics.length === 0
```

### Scenario 2: DataFacet Owner Mismatch (Invoice Facet on Customer Type)
```typescript
const result = validateTypeDefinition({
  typeDefinition: customerType,
  dataFacet: invoiceDataFacet, // owner = sales.Invoice @ 1.0.0
});

// Result:
// result.hasErrors === true
// result.diagnostics[0].code === 'TYPE_VALIDATION_DATA_FACET_OWNER_ID_MISMATCH'
```

### Scenario 3: Inapplicable Constraint (STRING with MIN_VALUE)
```typescript
const invalidConstraints = createFieldConstraintSet({
  fieldId: customerNameField.id,
  ownerType: customerType.toElementVersionRef(),
  constraints: [createMinValueConstraint('INTEGER', '100')],
});

const result = validateTypeDefinition({
  typeDefinition: customerType,
  dataFacet: customerDataFacet,
  fieldConstraints: [invalidConstraints],
});

// Result:
// result.hasErrors === true
// result.diagnostics[0].code === 'TYPE_VALIDATION_CONSTRAINT_INAPPLICABLE'
```

---

## 7. Deferred Capabilities & Non-Goals

The following capabilities are explicitly deferred to future architectural milestones:
- **TypeRegistry & TypeResolver:** Global name and URN lookups across model packages.
- **Assignability & Subtyping:** Structural or nominal type compatibility checks.
- **Cross-Field Expression Rules:** Evaluators for business conditions spanning multiple fields (e.g., `startDate < endDate`).
- **Runtime Instance Validation:** Evaluating constraints against live customer records.
- **Persistence Mapping:** Generating SQL schemas, CHECK constraints, or ORM annotations.
- **UI Adapters:** Generating Angular Reactive Forms or PrimeNG components.
