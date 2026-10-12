# SK-03 — Deferred Test Specification

Task: SK-03 — QualifiedName

Layer: B. Semantic Kernel

Technology: Pure TypeScript

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:
- ARC-01
- ARC-02
- ARC-03
- ARC-04
- ARC-05
- SK-01
- SK-02

---

## 1. Executive Summary & Deferral Rationale

In strict accordance with the mandatory testing policy for **SK-03 — QualifiedName**, no automated test files (`*.spec.ts`, `*.test.ts`) were created or modified, and no automated test runners (`vitest`, `pnpm test`, `nx test`) were executed.

All required verification scenarios across all 23 categories (A through W) are formally recorded in this specification archive. These test scenarios define the precise behavioral, validation, grammar, decomposition, equality, immutability, component access, serialization, and architectural boundary requirements that will be executed when automated test execution is scheduled.

---

## 2. Test Execution Metrics Dashboard

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Defined Test Scenarios** | 92 | 92 | Complete |
| **Automated Test Files Created** | 0 | 0 | Invariant Preserved |
| **Test Suites Executed** | 0 | 0 | Deferred |
| **Passed Automated Tests** | 0 | 0 | N/A |
| **Failed Automated Tests** | 0 | 0 | N/A |
| **Overall Execution Status** | — | — | `NOT_RUN — DEFERRED` |

---

## 3. Catalog of Deferred Verification Scenarios (Categories A through W)

### A. Valid Parsing
- **SK-03-T001:** Simple qualified name parsing (`QualifiedName.parse("sales.Customer")`).
  - Objective: Verify parsing of single-segment namespace with valid local name.
  - Component: `QualifiedName.parse`
  - Prerequisites: SK-02 Namespace
  - Input: `"sales.Customer"`
  - Expected Result: Valid `QualifiedName` with namespace `"sales"` and localName `"Customer"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: `qn.namespace.toString() === "sales"` and `qn.localName === "Customer"`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T002:** Multi-segment nested namespace parsing (`QualifiedName.parse("enterprise.sales.Customer")`).
  - Objective: Verify parsing splits at final dot, preserving multi-segment namespace.
  - Component: `QualifiedName.parse`
  - Prerequisites: SK-02 Namespace
  - Input: `"enterprise.sales.Customer"`
  - Expected Result: Valid `QualifiedName` with namespace `"enterprise.sales"` and localName `"Customer"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: `qn.namespace.depth() === 2` and `qn.localName === "Customer"`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T003:** Minimum local-name length (`QualifiedName.parse("sales.C")`).
  - Objective: Verify single-character local name is accepted.
  - Component: `QualifiedName.parse`
  - Prerequisites: None
  - Input: `"sales.C"`
  - Expected Result: Valid `QualifiedName` instance.
  - Expected Diagnostics: None
  - Acceptance Criteria: `qn.localName === "C"`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T004:** Maximum local-name length (63 characters).
  - Objective: Verify local name of exact maximum length 63 characters is accepted.
  - Component: `QualifiedName.parse`
  - Prerequisites: None
  - Input: `"sales." + "C" + "a".repeat(62)` (63 chars local name)
  - Expected Result: Valid `QualifiedName` instance.
  - Expected Diagnostics: None
  - Acceptance Criteria: Local name length is 63, parsed successfully.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T005:** Local name containing digits and underscores (`QualifiedName.parse("sales.Order_123")`).
  - Objective: Verify subsequent characters in local name accept digits and underscores.
  - Component: `QualifiedName.parse`
  - Prerequisites: None
  - Input: `"sales.Order_123"`
  - Expected Result: Valid `QualifiedName` instance.
  - Expected Diagnostics: None
  - Acceptance Criteria: `qn.localName === "Order_123"`.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### B. Invalid Input Types
- **SK-03-T006:** Reject undefined input.
  - Objective: Verify non-string rejection.
  - Component: `QualifiedName.parse`
  - Input: `undefined`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T007:** Reject null input.
  - Objective: Verify null rejection.
  - Component: `QualifiedName.parse`
  - Input: `null`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T008:** Reject number input.
  - Objective: Verify numeric input rejection without type coercion.
  - Component: `QualifiedName.parse`
  - Input: `42`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: No coercion.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T009:** Reject boolean input.
  - Objective: Verify boolean rejection.
  - Component: `QualifiedName.parse`
  - Input: `true`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T010:** Reject array input.
  - Objective: Verify array input rejection.
  - Component: `QualifiedName.parse`
  - Input: `["sales", "Customer"]`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T011:** Reject object input.
  - Objective: Verify object input rejection without calling arbitrary `toString()`.
  - Component: `QualifiedName.parse`
  - Input: `{ namespace: "sales", localName: "Customer" }`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T012:** Reject symbol input.
  - Objective: Verify symbol rejection.
  - Component: `QualifiedName.parse`
  - Input: `Symbol("sales.Customer")`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T013:** Reject bigint input.
  - Objective: Verify bigint rejection.
  - Component: `QualifiedName.parse`
  - Input: `BigInt(100)`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T014:** Reject function input.
  - Objective: Verify function rejection.
  - Component: `QualifiedName.parse`
  - Input: `() => "sales.Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_NON_STRING`.
  - Acceptance Criteria: Function not invoked.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### C. Missing Components
- **SK-03-T015:** Reject unqualified single segment (`"Customer"`).
  - Objective: Verify rejection when namespace is omitted.
  - Component: `QualifiedName.parse`
  - Input: `"Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_MISSING_NAMESPACE`.
  - Acceptance Criteria: No implicit root namespace assumed.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T016:** Reject empty namespace prefix (`".Customer"`).
  - Objective: Verify rejection of leading dot.
  - Component: `QualifiedName.parse`
  - Input: `".Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_EMPTY_NAMESPACE`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T017:** Reject missing local name (`"sales."`).
  - Objective: Verify rejection of trailing dot.
  - Component: `QualifiedName.parse`
  - Input: `"sales."`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_EMPTY_LOCAL_NAME`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T018:** Reject empty string (`""`).
  - Objective: Verify rejection of empty string.
  - Component: `QualifiedName.parse`
  - Input: `""`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_EMPTY`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### D. Invalid Separators
- **SK-03-T019:** Reject repeated dots (`"sales..Customer"`).
  - Objective: Verify rejection of consecutive dots.
  - Component: `QualifiedName.parse`
  - Input: `"sales..Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_NAMESPACE`.
  - Acceptance Criteria: No collapsing of dots.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T020:** Reject forward slash separator (`"sales/Customer"`).
  - Objective: Verify rejection of path slash.
  - Component: `QualifiedName.parse`
  - Input: `"sales/Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_MISSING_NAMESPACE`.
  - Acceptance Criteria: Path separators rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T021:** Reject backslash separator (`"sales\\Customer"`).
  - Objective: Verify rejection of backslash.
  - Component: `QualifiedName.parse`
  - Input: `"sales\\Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_MISSING_NAMESPACE`.
  - Acceptance Criteria: Backslashes rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T022:** Reject colon separator (`"sales:Customer"`).
  - Objective: Verify rejection of colon separator.
  - Component: `QualifiedName.parse`
  - Input: `"sales:Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_MISSING_NAMESPACE`.
  - Acceptance Criteria: Colons rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### E. Local Name Grammar
- **SK-03-T023:** Reject local name starting with digit (`"sales.123Customer"`).
  - Objective: Verify first character of local name must be ASCII letter.
  - Component: `QualifiedName.parse`
  - Input: `"sales.123Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_START`.
  - Acceptance Criteria: Digit start rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T024:** Reject local name starting with underscore (`"sales._Customer"`).
  - Objective: Verify local name cannot start with underscore.
  - Component: `QualifiedName.parse`
  - Input: `"sales._Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_START`.
  - Acceptance Criteria: Underscore start rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T025:** Reject local name containing hyphen (`"sales.Customer-Details"`).
  - Objective: Verify kebab-case is rejected in local name.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer-Details"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Hyphen rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T026:** Reject local name containing whitespace (`"sales.Customer Details"`).
  - Objective: Verify whitespace in local name is rejected.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer Details"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_WHITESPACE`.
  - Acceptance Criteria: Space rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T027:** Reject overlong local name (> 63 chars).
  - Objective: Verify local name length limit of 63 characters.
  - Component: `QualifiedName.parse`
  - Input: `"sales." + "C" + "a".repeat(63)` (64 chars)
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_LOCAL_NAME_TOO_LONG`.
  - Acceptance Criteria: Bounded local name enforced.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### F. Namespace Integration
- **SK-03-T028:** Reuses SK-02 Namespace validation rules.
  - Objective: Verify that invalid namespace portion fails via Namespace error.
  - Component: `QualifiedName.parse`
  - Input: `"123sales.Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_NAMESPACE`.
  - Acceptance Criteria: Namespace grammar strictly preserved.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T029:** Reuses SK-02 depth limits in Namespace portion.
  - Objective: Verify namespace exceeding 16 segments is rejected.
  - Component: `QualifiedName.parse`
  - Input: `"a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.Customer"` (17 ns segments)
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_NAMESPACE`.
  - Acceptance Criteria: Depth limit preserved.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### G. Construction Equivalence
- **SK-03-T030:** Equivalence between `parse()` and `fromParts()`.
  - Objective: Verify `parse()` and `fromParts()` produce equal `QualifiedName` values.
  - Component: `QualifiedName.fromParts`
  - Input: `QualifiedName.parse("enterprise.sales.Customer")` vs `QualifiedName.fromParts(Namespace.parse("enterprise.sales"), "Customer")`
  - Expected Result: `parsed.equals(composed) === true`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Full behavioral and value equality.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T031:** `fromParts()` rejects invalid local name.
  - Objective: Verify `fromParts()` enforces identical local name grammar.
  - Component: `QualifiedName.fromParts`
  - Input: `QualifiedName.fromParts(Namespace.parse("sales"), "123Customer")`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_START`.
  - Acceptance Criteria: Invariants identical to `parse()`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T032:** `fromParts()` rejects non-Namespace argument.
  - Objective: Verify type safety of Namespace parameter.
  - Component: `QualifiedName.fromParts`
  - Input: `QualifiedName.fromParts("sales" as any, "Customer")`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_PARTS`.
  - Acceptance Criteria: Requires genuine Namespace instance.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T033:** `fromParts()` rejects local name containing dot separator.
  - Objective: Verify local name cannot contain dot in `fromParts()`.
  - Component: `QualifiedName.fromParts`
  - Input: `QualifiedName.fromParts(Namespace.parse("sales"), "Customer.Address")`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Local name is strictly one segment.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### H. Component Access
- **SK-03-T034:** Namespace getter returns genuine Namespace value object.
  - Objective: Verify `qn.namespace` returns typed `Namespace` instance.
  - Component: `QualifiedName.namespace`
  - Input: `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: `qn.namespace instanceof Namespace === true` and `qn.namespace.toString() === "enterprise.sales"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Real value object returned.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T035:** LocalName getter returns exact local name.
  - Objective: Verify `qn.localName` returns string `"Customer"`.
  - Component: `QualifiedName.localName`
  - Input: `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: `"Customer"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Matches exact local name.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T036:** No internal mutable component exposure.
  - Objective: Verify instance state cannot be mutated through accessors.
  - Component: `QualifiedName`
  - Input: Mutation attempt on `qn`
  - Expected Result: Throws in strict mode; state unmodified.
  - Expected Diagnostics: None
  - Acceptance Criteria: Immutability preserved.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### I. Equality
- **SK-03-T037:** Value equality for identical qualified names.
  - Objective: Verify two independent instances compare equal.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("sales.Customer")`
  - Expected Result: `true`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `true`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T038:** Inequality when local names differ.
  - Objective: Verify unequal local names compare unequal.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("sales.Employee")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `false`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T039:** Inequality when namespaces differ.
  - Objective: Verify unequal namespaces compare unequal.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `false`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T040:** Case-sensitive inequality on local name.
  - Objective: Verify case distinction on local name.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("sales.customer")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: `Customer` ≠ `customer`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T041:** Case-sensitive inequality on namespace.
  - Objective: Verify case distinction on namespace portion.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("Sales.Customer")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: `sales` ≠ `Sales`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T042:** Incompatible operand types return false safely.
  - Objective: Verify `equals` returns false for null/undefined/non-QualifiedName.
  - Component: `QualifiedName.equals`
  - Input: `qn.equals("sales.Customer")` and `qn.equals(null)`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Safe return without throwing.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### J. Immutability
- **SK-03-T043:** Instance sealed at construction.
  - Objective: Verify `Object.isFrozen(qn)` is true.
  - Component: `QualifiedName`
  - Input: `Object.isFrozen(QualifiedName.parse("sales.Customer"))`
  - Expected Result: `true`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Instance is frozen.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T044:** No public setters exist.
  - Objective: Verify absence of setters on `QualifiedName`.
  - Component: `QualifiedName`
  - Input: Prototype inspection
  - Expected Result: No setter descriptors found.
  - Expected Diagnostics: None
  - Acceptance Criteria: Read-only accessors only.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### K. Canonical String
- **SK-03-T045:** Canonical `toString()` output.
  - Objective: Verify `toString()` returns `${namespace}.${localName}`.
  - Component: `QualifiedName.toString`
  - Input: `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: `"enterprise.sales.Customer"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Exact canonical string returned.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T046:** Canonical `valueOf()` matches `toString()`.
  - Objective: Verify primitive coercion returns canonical string.
  - Component: `QualifiedName.valueOf`
  - Input: `QualifiedName.parse("sales.Customer").valueOf()`
  - Expected Result: `"sales.Customer"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Equivalent to `toString()`.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### L. JSON Serialization
- **SK-03-T047:** `toJSON()` serializes to canonical string primitive.
  - Objective: Verify JSON serialization returns primitive string.
  - Component: `QualifiedName.toJSON`
  - Input: `JSON.stringify(QualifiedName.parse("sales.Customer"))`
  - Expected Result: `"\"sales.Customer\""`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Direct canonical string.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T048:** Serialization round-trip equivalence.
  - Objective: Verify round-trip parse equivalence.
  - Component: `QualifiedName.parse` & `QualifiedName.toJSON`
  - Input: `QualifiedName.parse(JSON.parse(JSON.stringify(qn)))`
  - Expected Result: `reconstructed.equals(qn) === true`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Value equality preserved.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### M. Length and Resources
- **SK-03-T049:** Overlong qualified name rejection (> 319 chars).
  - Objective: Verify overall length bound of 319 characters.
  - Component: `QualifiedName.parse`
  - Input: 320-character string
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_TOO_LONG`.
  - Acceptance Criteria: Bounded input processing.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T050:** Combined length check in `fromParts()`.
  - Objective: Verify `fromParts()` rejects if combined length exceeds 319 chars.
  - Component: `QualifiedName.fromParts`
  - Input: Max namespace + max local name exceeding bound
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_TOO_LONG`.
  - Acceptance Criteria: Boundary verified.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### N. Semantic Identity Separation
- **SK-03-T051:** Orthogonality from `SemanticElementId`.
  - Objective: Verify `QualifiedName` and `SemanticElementId` are independent types.
  - Component: Architecture Invariant
  - Input: `QualifiedName.parse("sales.Customer")` vs `SemanticElementId.parse("typ_customer_123")`
  - Expected Result: Different types, unequal, zero shared state.
  - Expected Diagnostics: None
  - Acceptance Criteria: Types cannot be conflated.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T052:** Element rename does not alter `SemanticElementId`.
  - Objective: Verify rename from `sales.Customer` to `sales.Client` leaves identity intact.
  - Component: Architecture Invariant
  - Input: Conceptual rename scenario
  - Expected Result: Durable identity `typ_customer_123` unchanged.
  - Expected Diagnostics: None
  - Acceptance Criteria: Identity invariant preserved.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T053:** No identity generation from qualified name.
  - Objective: Verify no hashing or ID generation exists in `QualifiedName`.
  - Component: `QualifiedName`
  - Input: Code inspection
  - Expected Result: No ID generation method exists.
  - Expected Diagnostics: None
  - Acceptance Criteria: Zero coupling.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### O. Semantic Context Separation
- **SK-03-T054:** Context-neutral naming.
  - Objective: Verify same `QualifiedName` can exist across multiple contexts.
  - Component: Architecture Invariant
  - Input: Context A vs Context B referencing `sales.Customer`
  - Expected Result: `QualifiedName` contains zero context metadata.
  - Expected Diagnostics: None
  - Acceptance Criteria: Pure naming value object.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T055:** No tenant identity inference.
  - Objective: Verify `QualifiedName` does not encode or infer `TenantId`.
  - Component: Architecture Invariant
  - Input: `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: No tenant field or authorization scope.
  - Expected Diagnostics: None
  - Acceptance Criteria: Zero tenancy coupling.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### P. Version Separation
- **SK-03-T056:** Reject version suffix in `QualifiedName`.
  - Objective: Verify `@1.0.0` suffix is rejected in v0 grammar.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer@1.0.0"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Version references deferred to SK-07.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T057:** No version resolution or selector logic.
  - Objective: Verify `QualifiedName` does not select latest version.
  - Component: Architecture Invariant
  - Input: Code inspection
  - Expected Result: No version resolution logic exists.
  - Expected Diagnostics: None
  - Acceptance Criteria: Deferred to SK-07.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### Q. Resolution Boundary
- **SK-03-T058:** Syntactic validity without registry existence.
  - Objective: Verify parsing succeeds without checking a model registry.
  - Component: `QualifiedName.parse`
  - Input: `"unregistered.domain.CustomType"`
  - Expected Result: Parses successfully as pure syntax.
  - Expected Diagnostics: None
  - Acceptance Criteria: No registry lookup performed.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T059:** No alias or import resolution.
  - Objective: Verify `QualifiedName` does not resolve aliases.
  - Component: `QualifiedName.parse`
  - Input: Code inspection
  - Expected Result: Zero alias expansion or package import logic.
  - Expected Diagnostics: None
  - Acceptance Criteria: Pure naming primitive.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### R. Framework Independence
- **SK-03-T060:** Zero framework dependencies.
  - Objective: Verify absence of NestJS, Angular, or PrimeNG imports.
  - Component: `platform/kernel/semantic-kernel/src/naming/qualified-name.ts`
  - Input: AST inspection of imports
  - Expected Result: Zero framework imports.
  - Expected Diagnostics: None
  - Acceptance Criteria: Pure TypeScript.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T061:** Universal browser and Node.js portability.
  - Objective: Verify absence of `node:*` modules.
  - Component: AST inspection
  - Input: Search for `node:fs`, `node:path`, `node:crypto`
  - Expected Result: Zero matches.
  - Expected Diagnostics: None
  - Acceptance Criteria: Universal runtime compatibility.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### S. Public API
- **SK-03-T062:** Public barrel export availability.
  - Objective: Verify `QualifiedName` is exported from root barrel.
  - Component: `@ecosystem/semantic-kernel`
  - Input: `import { QualifiedName } from '@ecosystem/semantic-kernel'`
  - Expected Result: Successfully resolves symbol.
  - Expected Diagnostics: None
  - Acceptance Criteria: Exported without deep import.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T063:** TypeScript `.d.ts` declaration generation.
  - Objective: Verify clean declaration generation.
  - Component: Build output
  - Input: `tsc -p platform/kernel/semantic-kernel/tsconfig.lib.json`
  - Expected Result: Clean output declarations.
  - Expected Diagnostics: None
  - Acceptance Criteria: Declaration compatibility verified.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### T. Security & Bounds
- **SK-03-T064:** Path traversal syntax rejected.
  - Objective: Verify rejection of `../sales.Customer`.
  - Component: `QualifiedName.parse`
  - Input: `"../sales.Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_NAMESPACE`.
  - Acceptance Criteria: Traversal injection impossible.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T065:** Script-like input rejected.
  - Objective: Verify rejection of script tags in qualified name.
  - Component: `QualifiedName.parse`
  - Input: `"sales.<script>"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_START`.
  - Acceptance Criteria: Malicious inputs rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T066:** SQL/Command injection characters rejected.
  - Objective: Verify rejection of semicolons and quotes.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer;delete"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Injections rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### U. Determinism
- **SK-03-T067:** Deterministic parsing outcomes.
  - Objective: Verify identical parse output on repeated runs.
  - Component: `QualifiedName.parse`
  - Input: Repeated parsing of `"enterprise.sales.Customer"`
  - Expected Result: Pure functional determinism.
  - Expected Diagnostics: None
  - Acceptance Criteria: Zero random or temporal state.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T068:** Locale-independent validation.
  - Objective: Verify ASCII validation does not change under differing locales.
  - Component: `QualifiedName.parse`
  - Input: Evaluation under varied locale environments
  - Expected Result: Exact same outcomes.
  - Expected Diagnostics: None
  - Acceptance Criteria: ASCII regex independence.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### V. Mini Sales Scenarios
- **SK-03-T069:** Mini Sales Customer (`sales.Customer`).
  - Objective: Mini Sales reference model entity naming.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer"`
  - Expected Result: Valid `QualifiedName`, namespace `sales`, localName `Customer`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Constructed successfully.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T070:** Mini Sales Employee (`sales.Employee`).
  - Objective: Mini Sales reference model entity naming.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Employee"`
  - Expected Result: Valid `QualifiedName`, namespace `sales`, localName `Employee`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Distinct from `sales.Customer`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T071:** Mini Sales Nested Customer (`enterprise.sales.Customer`).
  - Objective: Mini Sales nested enterprise customer naming.
  - Component: `QualifiedName.parse`
  - Input: `"enterprise.sales.Customer"`
  - Expected Result: Valid `QualifiedName`, namespace `enterprise.sales`, localName `Customer`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Split at final dot verified.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T072:** Mini Sales Rename (`sales.Client`).
  - Objective: Mini Sales rename without identity mutation.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Client"`
  - Expected Result: Valid `QualifiedName`, independent of `SemanticElementId`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Separate naming value.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T073:** Mini Sales Double Dot Rejection (`sales..Customer`).
  - Objective: Mini Sales invalid path rejection.
  - Component: `QualifiedName.parse`
  - Input: `"sales..Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_NAMESPACE`.
  - Acceptance Criteria: Double dot rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T074:** Mini Sales Version Suffix Rejection (`sales.Customer@1.0.0`).
  - Objective: Mini Sales version suffix rejection.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer@1.0.0"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Version suffix rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### W. Architectural Boundaries
- **SK-03-T075:** No SK-04 `SemanticContextRef` implementation in SK-03.
  - Objective: Verify SK-04 is not implemented prematurely.
  - Component: Scope Control
  - Input: Codebase symbol search
  - Expected Result: No `SemanticContextRef` class in kernel.
  - Expected Diagnostics: None
  - Acceptance Criteria: Boundary respected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T076:** No QualifiedName Registry or Resolver.
  - Objective: Verify no registry or dynamic resolver is introduced.
  - Component: Scope Control
  - Input: Codebase symbol search
  - Expected Result: No registry or resolver classes exist.
  - Expected Diagnostics: None
  - Acceptance Criteria: Boundary respected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T077:** No Compiler or Runtime execution links.
  - Objective: Verify no runtime artifact generation or compiler passes exist.
  - Component: Scope Control
  - Input: Codebase inspection
  - Expected Result: Kernel remains purely declarative.
  - Expected Diagnostics: None
  - Acceptance Criteria: Boundary respected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T078:** No REST endpoints or CLI commands added.
  - Objective: Verify zero application or CLI layer modifications.
  - Component: Scope Control
  - Input: Inspection of `apps/` and `tools/`
  - Expected Result: No new endpoints or commands introduced.
  - Expected Diagnostics: None
  - Acceptance Criteria: Boundary respected.
  - Execution Status: `NOT_RUN — DEFERRED`

---

### Extended Edge & Non-Throwing Invariants
- **SK-03-T079:** `tryParse()` returns `{ ok: true, value: qn }` on valid input.
  - Objective: Verify non-throwing API on success.
  - Component: `QualifiedName.tryParse`
  - Input: `"sales.Customer"`
  - Expected Result: `{ ok: true, value: qn }`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Discriminated union success.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T080:** `tryParse()` returns `{ ok: false, error: err }` on invalid input.
  - Objective: Verify non-throwing API on error.
  - Component: `QualifiedName.tryParse`
  - Input: `"invalid"`
  - Expected Result: `{ ok: false, error: QualifiedNameValidationError }`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_MISSING_NAMESPACE`.
  - Acceptance Criteria: Discriminated union failure.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T081:** `isValid()` returns `true` for valid qualified name.
  - Objective: Verify type guard on valid string.
  - Component: `QualifiedName.isValid`
  - Input: `"sales.Customer"`
  - Expected Result: `true`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `true`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T082:** `isValid()` returns `false` for invalid qualified name.
  - Objective: Verify type guard on invalid string.
  - Component: `QualifiedName.isValid`
  - Input: `"Customer"`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `false`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T083:** `tryFromParts()` returns `{ ok: true, value: qn }` on valid parts.
  - Objective: Verify non-throwing composition on success.
  - Component: `QualifiedName.tryFromParts`
  - Input: `(Namespace.parse("sales"), "Customer")`
  - Expected Result: `{ ok: true, value: qn }`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Discriminated union success.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T084:** `tryFromParts()` returns `{ ok: false, error: err }` on invalid parts.
  - Objective: Verify non-throwing composition on failure.
  - Component: `QualifiedName.tryFromParts`
  - Input: `(Namespace.parse("sales"), "123Customer")`
  - Expected Result: `{ ok: false, error: QualifiedNameValidationError }`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_START`.
  - Acceptance Criteria: Discriminated union failure.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T085:** Rejection of leading whitespace (`" sales.Customer"`).
  - Objective: Verify no silent trimming on leading whitespace.
  - Component: `QualifiedName.parse`
  - Input: `" sales.Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_WHITESPACE`.
  - Acceptance Criteria: No silent trimming.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T086:** Rejection of trailing whitespace (`"sales.Customer "`).
  - Objective: Verify no silent trimming on trailing whitespace.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Customer "`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_WHITESPACE`.
  - Acceptance Criteria: No silent trimming.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T087:** Rejection of interior whitespace (`"sales. Customer"`).
  - Objective: Verify rejection of space after dot separator.
  - Component: `QualifiedName.parse`
  - Input: `"sales. Customer"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_WHITESPACE`.
  - Acceptance Criteria: Controlled rejection.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T088:** Non-ASCII Unicode characters rejected in local name.
  - Objective: Verify ASCII-only constraint in v0 grammar.
  - Component: `QualifiedName.parse`
  - Input: `"sales.Clientèle"`
  - Expected Result: Throws `QualifiedNameValidationError`.
  - Expected Diagnostics: Error code `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER`.
  - Acceptance Criteria: Non-ASCII characters rejected.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T089:** Multi-level namespace preserves all parent segments.
  - Objective: Verify depth 3 namespace preserves all 3 segments upon split.
  - Component: `QualifiedName.parse`
  - Input: `"finance.accounts.payable.Invoice"`
  - Expected Result: Namespace segments `["finance", "accounts", "payable"]`, localName `"Invoice"`.
  - Expected Diagnostics: None
  - Acceptance Criteria: `qn.namespace.segments()` length is 3.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T090:** Qualified name equals does not match prefix of longer local name.
  - Objective: Verify exact string boundary matching.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("sales.Customer")` vs `QualifiedName.parse("sales.CustomerOrder")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `false`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T091:** Qualified name equals does not match different casing in multi-segment namespace.
  - Objective: Verify case sensitivity across multi-segment namespace.
  - Component: `QualifiedName.equals`
  - Input: `QualifiedName.parse("Enterprise.Sales.Customer")` vs `QualifiedName.parse("enterprise.sales.Customer")`
  - Expected Result: `false`.
  - Expected Diagnostics: None
  - Acceptance Criteria: Evaluates to `false`.
  - Execution Status: `NOT_RUN — DEFERRED`

- **SK-03-T092:** Error summary truncates overlong inputs safely without leakage.
  - Objective: Verify `invalidInputSummary` caps length at 32 characters.
  - Component: `QualifiedNameValidationError`
  - Input: 200-character invalid string
  - Expected Result: Summary ends with `"..."` and length is at most 35.
  - Expected Diagnostics: Bounded summary.
  - Acceptance Criteria: No memory or security leakage in diagnostics.
  - Execution Status: `NOT_RUN — DEFERRED`
