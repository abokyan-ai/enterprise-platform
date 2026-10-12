# Diagnostics Model — SK-11

**Module:** `@ecosystem/semantic-kernel`  
**Layer:** B. Semantic Kernel — Pure TypeScript  
**Milestone:** SK-11 — Diagnostics Model  
**Status:** Implemented  
**ADR:** [ADR-019](../adr/ADR-019-diagnostics-model.md)

---

## 1. Executive Summary and Mission

In a Model-Driven Enterprise Ecosystem Platform, diverse components—model authoring tools,
canonical compilers, runtime engines, API gateways, CLI utilities, and UI studios—must communicate
issues, warnings, and informational observations in a deterministic, machine-readable format.

**SK-11 establishes the Diagnostics Model:**
- An immutable, structured domain data model for reporting observations without throwing exceptions.
- Stable, uppercase machine-readable `DiagnosticCode`s governed by strict grammar.
- Explicit severity classification (`ERROR`, `WARNING`, `INFO`).
- Human-readable messages with bounded length.
- Optional technology-neutral locations (semantic element coordinates and 1-based source positions).
- Safe, bounded contextual details.
- Immutable diagnostic collections with deterministic ordering and `hasErrors` semantics.
- Pure TypeScript implementation with zero external runtime or framework dependencies.

---

## 2. Core Architectural Distinctions

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Diagnostic Model Boundaries                     │
├────────────────────────────────────────────────────────────────────────┤
│ Diagnostic ≠ Exception        → Data description, not control-flow     │
│ Diagnostic ≠ Log Entry        → Domain issue, not execution telemetry  │
│ Diagnostic ≠ Validation Rule  → Reported result, not rule evaluator    │
│ Diagnostic ≠ Exit Code        → Caller decides failure policy          │
│ Diagnostic ≠ Authorization    → Does not grant or deny access rights   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Diagnostic Code Grammar and Taxonomy

A `DiagnosticCode` is an immutable value object identifying an issue category.

### Canonical Grammar
- **Format:** `segment ("_" segment)*`
- **Segment:** Starts with uppercase ASCII letter `[A-Z]`, followed by `[A-Z0-9]*`
- **Separator:** `_` (ASCII 95)
- **Bounds:** Length between 2 and 64 characters; 1 to 8 segments
- **Regex:** `^[A-Z][A-Z0-9]*(_[A-Z][A-Z0-9]*)*$`
- **Policy:** Strictly uppercase, no whitespace, no consecutive underscores

### Code Ownership Conventions
- `SK_` — Semantic Kernel (e.g. `SK_INVALID_ID`, `SK_INVALID_NAMESPACE`)
- `MODEL_` — Model Core (e.g. `MODEL_UNRESOLVED_REFERENCE`, `MODEL_MISSING_FIELD`)
- `COMPILER_` — Compiler Core (e.g. `COMPILER_TYPE_MISMATCH`)
- `RUNTIME_` — Runtime Core

---

## 4. Severity Classification

| Severity | Meaning | Consequence |
| :--- | :--- | :--- |
| **ERROR** | Condition preventing an artifact or operation from satisfying requirements. | Sets `hasErrors === true`. |
| **WARNING** | Nonblocking condition affecting quality, compatibility, or maintainability. | Sets `hasWarnings === true`. Does not set `hasErrors`. |
| **INFO** | Informational observation that is not a validation failure. | Pure informational recording. |

---

## 5. Technology-Neutral Diagnostic Location

Locations are optional and support four complementary coordinate forms:

1. **Semantic Element Location:**
   - `elementId`: Stable semantic identity (`SemanticElementId`, SK-01).
   - `qualifiedName`: Canonical qualified name (`QualifiedName`, SK-03).
   - `contextRef`: Semantic interpretation boundary (`SemanticContextRef`, SK-04).
2. **Model Path:**
   - `modelPath`: Immutable array of property segments (e.g. `['fields', 'customerCode']`).
3. **Source Coordinates (1-Based):**
   - `sourceUri`: Document identifier (URI, relative path, or logical document ID).
   - `start`: `{ line: number, column: number }` (1-based, `>= 1`).
   - `end`: Optional inclusive end coordinate (`start <= end`).
4. **Legacy Compatibility:**
   - `file`, `line`, `column`, `length` (preserved for initial ARC-01 harness compatibility).

---

## 6. Safe Contextual Details Policy

To avoid uncontrolled metadata bags while allowing structured context:
- `details` accepts bounded JSON-safe primitives (`string`, `number`, `boolean`, `null`).
- Supported collections: flat arrays of primitives (<= 32 items) and flat objects (<= 16 entries).
- Maximum string length: 256 characters.
- Strictly forbidden: Functions, symbols, BigInts, cyclic references, and deep hierarchies.

---

## 7. DiagnosticCollection and Aggregation Operations

The platform provides `DiagnosticCollection` and pure functions:

```typescript
import {
  createDiagnostic,
  createDiagnosticCollection,
  hasErrors,
  DiagnosticSeverities,
} from '@ecosystem/semantic-kernel';

const d1 = createDiagnostic({
  code: 'SK_INVALID_ID',
  severity: DiagnosticSeverities.ERROR,
  message: 'Invalid identifier syntax.',
});

const d2 = createDiagnostic({
  code: 'MODEL_DEPRECATION_WARNING',
  severity: DiagnosticSeverities.WARNING,
  message: 'Element is scheduled for deprecation.',
});

const collection = createDiagnosticCollection([d1, d2]);

console.log(collection.hasErrors);   // true
console.log(collection.hasWarnings); // true
console.log(collection.count);       // 2

// Filter by severity
const errorsOnly = collection.filterBySeverity(DiagnosticSeverities.ERROR);
console.log(errorsOnly.count);       // 1

// Concatenate collections deterministically
const combined = collection.combine([d1]);
console.log(combined.count);         // 3 (no silent deduplication)
```

---

## 8. Serialization and Deserialization

### JSON Serialization
Preserves **Missing ≠ Null ≠ Value**: optional fields are omitted when undefined, never emitted as `null`.

```json
{
  "code": "SK_INVALID_ID",
  "severity": "ERROR",
  "message": "Invalid identifier syntax.",
  "location": {
    "sourceUri": "models/sales/customer.sem",
    "start": { "line": 12, "column": 5 }
  }
}
```

### Validated Deserialization
`parseDiagnostic(json)` strictly validates structure, code grammar, severity values, message bounds,
and location coordinates before reconstructing an immutable `Diagnostic`.

---

## 9. Security, Isolation, and Clean Architecture

- **Zero Framework Coupling:** No NestJS, Angular, or PrimeNG imports.
- **Universal Portability:** No Node.js-only APIs (`fs`, `path`, `process`, `Buffer`).
- **No Uncontrolled Printing:** Kernel emits zero stdout or stderr output.
- **Bounded Error Messages:** Truncated summary strings prevent unbounded log inflation or secret leakage.
- **Zero Process Termination:** Kernel never calls `process.exit()`.
