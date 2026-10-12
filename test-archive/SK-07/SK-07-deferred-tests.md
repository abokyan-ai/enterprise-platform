# SK-07 — Deferred Test Specification

Task: SK-07 — Semantic Version Reference

Layer: B. Semantic Kernel

Technology: Pure TypeScript

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:

- ARC-01 through ARC-05
- SK-01 through SK-06

## Deferral and Actual Contract

This document specifies future verification only. It contains no executable
Vitest code or evidence that expected behavior was tested. No automated tests or
ad hoc parsing experiments were created or executed for SK-07. Permitted static
compilation, formatting, and source inspection are reported separately.

The implementation uses exact SemVer syntax with safe integer core components,
256-character full versions, 64-character identifiers, and up to 16 identifiers
per prerelease/build list. Exact equality includes build metadata; precedence
does not. References use exactly two canonical wire fields and perform no
resolution, selection, compatibility analysis, or runtime operation.

## Scenario Inventory

| Metric                | Actual             |
| --------------------- | ------------------ |
| Documented scenarios  | 211                |
| Required categories   | 26 (A through Z)   |
| New runnable tests    | 0                  |
| Tests executed        | 0                  |
| Every scenario status | NOT_RUN — DEFERRED |

| Category | Scope                               | Scenarios |
| -------- | ----------------------------------- | --------- |
| A        | Core Version Parsing                | 9         |
| B        | Invalid Input Types                 | 10        |
| C        | Invalid Grammar                     | 12        |
| D        | Prerelease                          | 12        |
| E        | Build Metadata                      | 9         |
| F        | Numeric Safety                      | 8         |
| G        | Version Equality                    | 7         |
| H        | Precedence Comparison               | 13        |
| I        | Canonical Serialization             | 6         |
| J        | JSON Round-Trip                     | 6         |
| K        | Immutability                        | 6         |
| L        | Exact Version Versus Selector       | 9         |
| M        | ElementVersionRef Construction      | 8         |
| N        | ElementVersionRef Equality          | 7         |
| O        | ElementVersionRef Serialization     | 13        |
| P        | Semantic Identity Separation        | 6         |
| Q        | QualifiedName Separation            | 5         |
| R        | Context Separation                  | 6         |
| S        | SemanticElement Integration         | 4         |
| T        | SemanticElementKind Integration     | 4         |
| U        | Compatibility Boundary              | 5         |
| V        | Runtime and Persistence Isolation   | 7         |
| W        | Framework Independence              | 6         |
| X        | Public API and Legacy Compatibility | 12        |
| Y        | Security and Determinism            | 13        |
| Z        | Mini Sales                          | 8         |

## A. Core Version Parsing

### SK-07-T001 — Accept 0.0.0

- **Test ID:** SK-07-T001
- **Scenario:** Accept 0.0.0.
- **Objective:** Verify accept 0.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply the exact string `0.0.0`.
- **Expected Result:** An immutable version with matching numeric components and unchanged canonical text is returned.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T002 — Accept 1.0.0

- **Test ID:** SK-07-T002
- **Scenario:** Accept 1.0.0.
- **Objective:** Verify accept 1.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply the exact string `1.0.0`.
- **Expected Result:** An immutable version with matching numeric components and unchanged canonical text is returned.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T003 — Accept 1.2.3

- **Test ID:** SK-07-T003
- **Scenario:** Accept 1.2.3.
- **Objective:** Verify accept 1.2.3 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply the exact string `1.2.3`.
- **Expected Result:** An immutable version with matching numeric components and unchanged canonical text is returned.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T004 — Accept 10.20.30

- **Test ID:** SK-07-T004
- **Scenario:** Accept 10.20.30.
- **Objective:** Verify accept 10.20.30 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply the exact string `10.20.30`.
- **Expected Result:** An immutable version with matching numeric components and unchanged canonical text is returned.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T005 — Missing components

- **Test ID:** SK-07-T005
- **Scenario:** Missing components.
- **Objective:** Verify missing components against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 1 and 1.2 separately.
- **Expected Result:** Both strings are rejected; no minor or patch defaults are supplied.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T006 — Extra component

- **Test ID:** SK-07-T006
- **Scenario:** Extra component.
- **Objective:** Verify extra component against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.2.3.4`.
- **Expected Result:** The fourth component is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T007 — Reject core leading zeroes in 01.0.0

- **Test ID:** SK-07-T007
- **Scenario:** Reject core leading zeroes in 01.0.0.
- **Objective:** Verify reject core leading zeroes in 01.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `01.0.0`.
- **Expected Result:** The noncanonical core component is rejected without normalization.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T008 — Reject core leading zeroes in 1.02.0

- **Test ID:** SK-07-T008
- **Scenario:** Reject core leading zeroes in 1.02.0.
- **Objective:** Verify reject core leading zeroes in 1.02.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.02.0`.
- **Expected Result:** The noncanonical core component is rejected without normalization.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T009 — Reject core leading zeroes in 1.0.003

- **Test ID:** SK-07-T009
- **Scenario:** Reject core leading zeroes in 1.0.003.
- **Objective:** Verify reject core leading zeroes in 1.0.003 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.003`.
- **Expected Result:** The noncanonical core component is rejected without normalization.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## B. Invalid Input Types

### SK-07-T010 — Reject undefined

- **Test ID:** SK-07-T010
- **Scenario:** Reject undefined.
- **Objective:** Verify reject undefined against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type undefined.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T011 — Reject null

- **Test ID:** SK-07-T011
- **Scenario:** Reject null.
- **Objective:** Verify reject null against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type null.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T012 — Reject number

- **Test ID:** SK-07-T012
- **Scenario:** Reject number.
- **Objective:** Verify reject number against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type number.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T013 — Reject boolean

- **Test ID:** SK-07-T013
- **Scenario:** Reject boolean.
- **Objective:** Verify reject boolean against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type boolean.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T014 — Reject array

- **Test ID:** SK-07-T014
- **Scenario:** Reject array.
- **Objective:** Verify reject array against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type array.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T015 — Reject object

- **Test ID:** SK-07-T015
- **Scenario:** Reject object.
- **Objective:** Verify reject object against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type object.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T016 — Reject symbol

- **Test ID:** SK-07-T016
- **Scenario:** Reject symbol.
- **Objective:** Verify reject symbol against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type symbol.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T017 — Reject bigint

- **Test ID:** SK-07-T017
- **Scenario:** Reject bigint.
- **Objective:** Verify reject bigint against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type bigint.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T018 — Reject function

- **Test ID:** SK-07-T018
- **Scenario:** Reject function.
- **Objective:** Verify reject function against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type function.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T019 — Reject boxed String

- **Test ID:** SK-07-T019
- **Scenario:** Reject boxed String.
- **Objective:** Verify reject boxed String against the documented contract.
- **Component:** SemanticVersion validation APIs.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a value of type boxed String.
- **Expected Result:** parse throws a controlled error; tryParse returns ok false; isValid returns false. No string coercion is performed.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## C. Invalid Grammar

### SK-07-T020 — Empty input

- **Test ID:** SK-07-T020
- **Scenario:** Empty input.
- **Objective:** Verify empty input against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply an empty string.
- **Expected Result:** Empty text is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_EMPTY`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T021 — Surrounding whitespace

- **Test ID:** SK-07-T021
- **Scenario:** Surrounding whitespace.
- **Objective:** Verify surrounding whitespace against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply leading and trailing space variants of 1.2.3.
- **Expected Result:** Whitespace is rejected without trimming.
- **Expected Diagnostics:** `SEMANTIC_VERSION_WHITESPACE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T022 — Newline and tab

- **Test ID:** SK-07-T022
- **Scenario:** Newline and tab.
- **Objective:** Verify newline and tab against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Insert newline or tab characters around or inside a version.
- **Expected Result:** All whitespace variants are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_WHITESPACE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T023 — Leading v prefix

- **Test ID:** SK-07-T023
- **Scenario:** Leading v prefix.
- **Objective:** Verify leading v prefix against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `v1.2.3`.
- **Expected Result:** The prefix is not stripped.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T024 — Missing patch

- **Test ID:** SK-07-T024
- **Scenario:** Missing patch.
- **Objective:** Verify missing patch against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.2`.
- **Expected Result:** A missing patch is not filled in.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T025 — Excess components

- **Test ID:** SK-07-T025
- **Scenario:** Excess components.
- **Objective:** Verify excess components against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.2.3.4.5`.
- **Expected Result:** The core component count is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T026 — Core leading zeroes

- **Test ID:** SK-07-T026
- **Scenario:** Core leading zeroes.
- **Objective:** Verify core leading zeroes against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 00.1.2 and 1.00.2 separately.
- **Expected Result:** Malformed zero spelling is not normalized.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T027 — Negative major

- **Test ID:** SK-07-T027
- **Scenario:** Negative major.
- **Objective:** Verify negative major against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `-1.0.0`.
- **Expected Result:** The malformed core is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T028 — Negative minor

- **Test ID:** SK-07-T028
- **Scenario:** Negative minor.
- **Objective:** Verify negative minor against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.-2.0`.
- **Expected Result:** The malformed core is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T029 — Negative patch

- **Test ID:** SK-07-T029
- **Scenario:** Negative patch.
- **Objective:** Verify negative patch against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.2.-3`.
- **Expected Result:** The empty core patch before the hyphen is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T030 — Unsupported separators

- **Test ID:** SK-07-T030
- **Scenario:** Unsupported separators.
- **Objective:** Verify unsupported separators against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 1/2/3, 1:2:3, and full-width-dot variants separately.
- **Expected Result:** Only exact ASCII dot separators are accepted.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T031 — Non-ASCII digits

- **Test ID:** SK-07-T031
- **Scenario:** Non-ASCII digits.
- **Objective:** Verify non-ASCII digits against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Replace a core digit with a visually similar non-ASCII digit.
- **Expected Result:** Core numeric grammar remains ASCII-only.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## D. Prerelease

### SK-07-T032 — Accept prerelease alpha

- **Test ID:** SK-07-T032
- **Scenario:** Accept prerelease alpha.
- **Objective:** Verify accept prerelease alpha against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-alpha`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T033 — Accept prerelease beta

- **Test ID:** SK-07-T033
- **Scenario:** Accept prerelease beta.
- **Objective:** Verify accept prerelease beta against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-beta`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T034 — Accept prerelease rc.1

- **Test ID:** SK-07-T034
- **Scenario:** Accept prerelease rc.1.
- **Objective:** Verify accept prerelease rc.1 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-rc.1`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T035 — Accept prerelease 0

- **Test ID:** SK-07-T035
- **Scenario:** Accept prerelease 0.
- **Objective:** Verify accept prerelease 0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-0`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T036 — Accept prerelease alpha.1

- **Test ID:** SK-07-T036
- **Scenario:** Accept prerelease alpha.1.
- **Objective:** Verify accept prerelease alpha.1 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-alpha.1`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T037 — Accept prerelease x-y-z.--

- **Test ID:** SK-07-T037
- **Scenario:** Accept prerelease x-y-z.--.
- **Objective:** Verify accept prerelease x-y-z.-- against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-x-y-z.--`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T038 — Accept prerelease 001alpha

- **Test ID:** SK-07-T038
- **Scenario:** Accept prerelease 001alpha.
- **Objective:** Verify accept prerelease 001alpha against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-001alpha`.
- **Expected Result:** Prerelease identifiers are preserved as a frozen string array; canonical spelling is unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T039 — Numeric leading zeroes

- **Test ID:** SK-07-T039
- **Scenario:** Numeric leading zeroes.
- **Objective:** Verify numeric leading zeroes against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 1.0.0-alpha.01 and 1.0.0-001 separately.
- **Expected Result:** Purely numeric noncanonical identifiers are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_PRERELEASE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T040 — Empty prerelease list

- **Test ID:** SK-07-T040
- **Scenario:** Empty prerelease list.
- **Objective:** Verify empty prerelease list against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0-`.
- **Expected Result:** An empty prerelease identifier is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_PRERELEASE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T041 — Empty prerelease identifier

- **Test ID:** SK-07-T041
- **Scenario:** Empty prerelease identifier.
- **Objective:** Verify empty prerelease identifier against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 1.0.0-alpha..1 and 1.0.0-alpha. separately.
- **Expected Result:** Empty dot-separated identifiers are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_PRERELEASE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T042 — Invalid prerelease characters

- **Test ID:** SK-07-T042
- **Scenario:** Invalid prerelease characters.
- **Objective:** Verify invalid prerelease characters against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply prerelease text containing an underscore, slash, or non-ASCII letter.
- **Expected Result:** Characters outside ASCII alphanumerics and hyphens are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_PRERELEASE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T043 — Prerelease is not an environment

- **Test ID:** SK-07-T043
- **Scenario:** Prerelease is not an environment.
- **Objective:** Verify prerelease is not an environment against the documented contract.
- **Component:** SemanticVersion contract.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect labels beta, rc, and arbitrary valid prerelease text.
- **Expected Result:** Labels are version text only and do not select an environment or deployment state.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## E. Build Metadata

### SK-07-T044 — Single build identifier

- **Test ID:** SK-07-T044
- **Scenario:** Single build identifier.
- **Objective:** Verify single build identifier against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+build`.
- **Expected Result:** Build text is preserved in a frozen metadata array.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T045 — Multiple build identifiers

- **Test ID:** SK-07-T045
- **Scenario:** Multiple build identifiers.
- **Objective:** Verify multiple build identifiers against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+build.sha.abc123`.
- **Expected Result:** All identifiers are preserved in order.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T046 — Numeric build leading zeroes

- **Test ID:** SK-07-T046
- **Scenario:** Numeric build leading zeroes.
- **Objective:** Verify numeric build leading zeroes against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+001`.
- **Expected Result:** Numeric build leading zeroes are retained as valid text.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T047 — Empty build metadata

- **Test ID:** SK-07-T047
- **Scenario:** Empty build metadata.
- **Objective:** Verify empty build metadata against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+`.
- **Expected Result:** An empty identifier is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_BUILD_METADATA`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T048 — Empty build identifier

- **Test ID:** SK-07-T048
- **Scenario:** Empty build identifier.
- **Objective:** Verify empty build identifier against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+build..1`.
- **Expected Result:** Empty dot-separated identifiers are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_BUILD_METADATA`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T049 — Invalid build characters

- **Test ID:** SK-07-T049
- **Scenario:** Invalid build characters.
- **Objective:** Verify invalid build characters against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply build metadata containing an underscore or non-ASCII punctuation.
- **Expected Result:** Unsupported build characters are rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_BUILD_METADATA`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T050 — Duplicate plus separator

- **Test ID:** SK-07-T050
- **Scenario:** Duplicate plus separator.
- **Objective:** Verify duplicate plus separator against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0.0+build+extra`.
- **Expected Result:** Multiple build separators are rejected before component parsing.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T051 — Build preserved in canonical text

- **Test ID:** SK-07-T051
- **Scenario:** Build preserved in canonical text.
- **Objective:** Verify build preserved in canonical text against the documented contract.
- **Component:** SemanticVersion.toString and toJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use 1.0.0-rc.1+build.7.
- **Expected Result:** Both serialization methods retain the complete build suffix.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T052 — Build ignored for precedence

- **Test ID:** SK-07-T052
- **Scenario:** Build ignored for precedence.
- **Objective:** Verify build ignored for precedence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0+build.1 and 1.0.0+build.2.
- **Expected Result:** Precedence is zero while exact equality is false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## F. Numeric Safety

### SK-07-T053 — Multi-digit minor ordering

- **Test ID:** SK-07-T053
- **Scenario:** Multi-digit minor ordering.
- **Objective:** Verify multi-digit minor ordering against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.10.0 against 1.9.0.
- **Expected Result:** The comparison returns 1 using numeric core ordering.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T054 — Multi-digit patch ordering

- **Test ID:** SK-07-T054
- **Scenario:** Multi-digit patch ordering.
- **Objective:** Verify multi-digit patch ordering against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.10 against 1.0.9.
- **Expected Result:** The comparison returns 1 rather than lexicographic string ordering.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T055 — Maximum safe core component

- **Test ID:** SK-07-T055
- **Scenario:** Maximum safe core component.
- **Objective:** Verify maximum safe core component against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `9007199254740991.0.0`.
- **Expected Result:** The maximum component is retained exactly as a safe integer.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T056 — Core bound in each position

- **Test ID:** SK-07-T056
- **Scenario:** Core bound in each position.
- **Objective:** Verify core bound in each position against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use Number.MAX_SAFE_INTEGER decimal text in major, minor, and patch separately.
- **Expected Result:** Each position permits the inclusive bound without precision loss.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T057 — Reject unsafe core integer

- **Test ID:** SK-07-T057
- **Scenario:** Reject unsafe core integer.
- **Objective:** Verify reject unsafe core integer against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply 9007199254740992.0.0 and unsafe minor or patch variants.
- **Expected Result:** The value is rejected before converting its decimal text to Number.
- **Expected Diagnostics:** `SEMANTIC_VERSION_UNSAFE_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T058 — Large canonical core text

- **Test ID:** SK-07-T058
- **Scenario:** Large canonical core text.
- **Objective:** Verify large canonical core text against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a core component containing 100 nonzero decimal digits within the full-string limit.
- **Expected Result:** The component is rejected without floating-point conversion.
- **Expected Diagnostics:** `SEMANTIC_VERSION_UNSAFE_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T059 — Precision-safe prerelease numbers

- **Test ID:** SK-07-T059
- **Scenario:** Precision-safe prerelease numbers.
- **Objective:** Verify precision-safe prerelease numbers against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare canonical numeric prerelease identifiers above 9007199254740991, including 63 versus 64 digits.
- **Expected Result:** Digit lengths and ordinal digit text establish exact numeric ordering without Number conversion.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T060 — No full-version float parsing

- **Test ID:** SK-07-T060
- **Scenario:** No full-version float parsing.
- **Objective:** Verify no full-version float parsing against the documented contract.
- **Component:** SemanticVersion implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect parsing and compare 1.10.0 with 1.1.0.
- **Expected Result:** Core components are parsed independently; decimal versions are not collapsed to one floating-point value.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## G. Version Equality

### SK-07-T061 — Exact canonical match

- **Test ID:** SK-07-T061
- **Scenario:** Exact canonical match.
- **Objective:** Verify exact canonical match against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare two independently parsed 1.2.3 values.
- **Expected Result:** Exact value equality is true.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T062 — Different core component

- **Test ID:** SK-07-T062
- **Scenario:** Different core component.
- **Objective:** Verify different core component against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.2.3 and 1.2.4.
- **Expected Result:** Exact equality is false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T063 — Different prerelease

- **Test ID:** SK-07-T063
- **Scenario:** Different prerelease.
- **Objective:** Verify different prerelease against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0-alpha and 1.0.0-beta.
- **Expected Result:** Exact equality is false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T064 — Different build metadata

- **Test ID:** SK-07-T064
- **Scenario:** Different build metadata.
- **Objective:** Verify different build metadata against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0+build.1 and 1.0.0+build.2.
- **Expected Result:** Exact equality is false even though precedence is equal.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T065 — Independent metadata-bearing instances

- **Test ID:** SK-07-T065
- **Scenario:** Independent metadata-bearing instances.
- **Objective:** Verify independent metadata-bearing instances against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Parse the same complete prerelease-plus-build string into separate instances.
- **Expected Result:** Equality does not depend on object reference identity.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T066 — Case-sensitive exact identity

- **Test ID:** SK-07-T066
- **Scenario:** Case-sensitive exact identity.
- **Objective:** Verify case-sensitive exact identity against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare valid Alpha versus alpha prerelease spellings and Build versus build metadata.
- **Expected Result:** Different exact spellings compare unequal; parsing never folds case.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T067 — Reject cross-type equality

- **Test ID:** SK-07-T067
- **Scenario:** Reject cross-type equality.
- **Objective:** Verify reject cross-type equality against the documented contract.
- **Component:** SemanticVersion.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare a version with a raw string, null, and a reference object.
- **Expected Result:** The equality method returns false for non-SemanticVersion values.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## H. Precedence Comparison

### SK-07-T068 — Major precedence

- **Test ID:** SK-07-T068
- **Scenario:** Major precedence.
- **Objective:** Verify major precedence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.9.9 with 2.0.0.
- **Expected Result:** The result is -1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T069 — Minor precedence

- **Test ID:** SK-07-T069
- **Scenario:** Minor precedence.
- **Objective:** Verify minor precedence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.9.9 with 1.10.0.
- **Expected Result:** The result is -1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T070 — Patch precedence

- **Test ID:** SK-07-T070
- **Scenario:** Patch precedence.
- **Objective:** Verify patch precedence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.9 with 1.0.10.
- **Expected Result:** The result is -1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T071 — Prerelease below stable

- **Test ID:** SK-07-T071
- **Scenario:** Prerelease below stable.
- **Objective:** Verify prerelease below stable against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0-alpha with 1.0.0.
- **Expected Result:** The result is -1; the reverse result is 1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T072 — Numeric prerelease ordering

- **Test ID:** SK-07-T072
- **Scenario:** Numeric prerelease ordering.
- **Objective:** Verify numeric prerelease ordering against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0-beta.2 with 1.0.0-beta.11.
- **Expected Result:** The result is -1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T073 — ASCII identifier ordering

- **Test ID:** SK-07-T073
- **Scenario:** ASCII identifier ordering.
- **Objective:** Verify aSCII identifier ordering against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare alpha versus beta and Alpha versus alpha with equal core components.
- **Expected Result:** Ordering follows ASCII ordinal comparison, without locale APIs.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T074 — Numeric below nonnumeric identifier

- **Test ID:** SK-07-T074
- **Scenario:** Numeric below nonnumeric identifier.
- **Objective:** Verify numeric below nonnumeric identifier against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare prerelease identifier 1 against alpha at the first differing position.
- **Expected Result:** The numeric identifier has lower precedence.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T075 — Equal-prefix identifier count

- **Test ID:** SK-07-T075
- **Scenario:** Equal-prefix identifier count.
- **Objective:** Verify equal-prefix identifier count against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0-alpha against 1.0.0-alpha.1.
- **Expected Result:** The shorter equal-prefix list has lower precedence.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T076 — Same precedence, different build

- **Test ID:** SK-07-T076
- **Scenario:** Same precedence, different build.
- **Objective:** Verify same precedence, different build against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare equal core and prerelease values with different build metadata.
- **Expected Result:** The result is zero without claiming exact equality.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T077 — Stable versions with builds

- **Test ID:** SK-07-T077
- **Scenario:** Stable versions with builds.
- **Objective:** Verify stable versions with builds against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.0.0 against 1.0.0+001.
- **Expected Result:** The result is zero; exact equality remains false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T078 — Standard complete precedence sequence

- **Test ID:** SK-07-T078
- **Scenario:** Standard complete precedence sequence.
- **Objective:** Verify standard complete precedence sequence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use alpha, alpha.1, alpha.beta, beta, beta.2, beta.11, rc.1, and stable for core 1.0.0.
- **Expected Result:** Every adjacent pair follows the standard ascending sequence.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T079 — Normalized comparison result

- **Test ID:** SK-07-T079
- **Scenario:** Normalized comparison result.
- **Objective:** Verify normalized comparison result against the documented contract.
- **Component:** SemanticVersion.comparePrecedence declarations.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect return typing and future comparisons across large component distances.
- **Expected Result:** Only -1, 0, and 1 are returned; neither Boolean nor numeric distance is used.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T080 — Invalid comparison component

- **Test ID:** SK-07-T080
- **Scenario:** Invalid comparison component.
- **Objective:** Verify invalid comparison component against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** In future JavaScript verification, supply a raw string or missing argument.
- **Expected Result:** A controlled comparison error is thrown.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPARISON`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## I. Canonical Serialization

### SK-07-T081 — Stable toString

- **Test ID:** SK-07-T081
- **Scenario:** Stable toString.
- **Objective:** Verify stable toString against the documented contract.
- **Component:** SemanticVersion.toString.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use a valid canonical 1.2.3 value repeatedly.
- **Expected Result:** The original exact text is returned unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T082 — Prerelease spelling retained

- **Test ID:** SK-07-T082
- **Scenario:** Prerelease spelling retained.
- **Objective:** Verify prerelease spelling retained against the documented contract.
- **Component:** SemanticVersion.toString.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use 1.0.0-Alpha.1.
- **Expected Result:** Identifier spelling and case are preserved.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T083 — Build spelling retained

- **Test ID:** SK-07-T083
- **Scenario:** Build spelling retained.
- **Objective:** Verify build spelling retained against the documented contract.
- **Component:** SemanticVersion.toString.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use 1.0.0+001.sha.ABC.
- **Expected Result:** Numeric zeroes and case in build metadata are retained.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T084 — No leading v insertion

- **Test ID:** SK-07-T084
- **Scenario:** No leading v insertion.
- **Objective:** Verify no leading v insertion against the documented contract.
- **Component:** SemanticVersion serialization.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Serialize a valid exact version.
- **Expected Result:** No prefix is added to canonical text.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T085 — No identity or context insertion

- **Test ID:** SK-07-T085
- **Scenario:** No identity or context insertion.
- **Objective:** Verify no identity or context insertion against the documented contract.
- **Component:** SemanticVersion serialization.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use a version alongside an element identity and context.
- **Expected Result:** Version text remains independent of identity, name, tenant, and context.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T086 — No implicit normalization

- **Test ID:** SK-07-T086
- **Scenario:** No implicit normalization.
- **Objective:** Verify no implicit normalization against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply malformed whitespace, prefix, or leading-zero variants.
- **Expected Result:** Invalid input fails instead of being rewritten to a valid canonical version.
- **Expected Diagnostics:** The appropriate controlled version error.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## J. JSON Round-Trip

### SK-07-T087 — Native JSON string

- **Test ID:** SK-07-T087
- **Scenario:** Native JSON string.
- **Objective:** Verify native JSON string against the documented contract.
- **Component:** SemanticVersion.toJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Serialize a version through the standard JSON interface.
- **Expected Result:** Wire data is the canonical JSON string, not an object of internal fields.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T088 — Validated reconstruction

- **Test ID:** SK-07-T088
- **Scenario:** Validated reconstruction.
- **Objective:** Verify validated reconstruction against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Decode a canonical JSON version string into unknown data and parse it.
- **Expected Result:** A validated SemanticVersion is reconstructed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T089 — Exact round-trip with metadata

- **Test ID:** SK-07-T089
- **Scenario:** Exact round-trip with metadata.
- **Objective:** Verify exact round-trip with metadata against the documented contract.
- **Component:** SemanticVersion JSON interchange.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Serialize, decode, and reconstruct 1.0.0-rc.1+build.7 in future authorized verification.
- **Expected Result:** The reconstructed value equals the original exactly, including metadata.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T090 — Invalid decoded non-string

- **Test ID:** SK-07-T090
- **Scenario:** Invalid decoded non-string.
- **Objective:** Verify invalid decoded non-string against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Decode numeric or object-shaped JSON as version input.
- **Expected Result:** The decoded non-string value is rejected.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T091 — Invalid decoded selector

- **Test ID:** SK-07-T091
- **Scenario:** Invalid decoded selector.
- **Objective:** Verify invalid decoded selector against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Decode the JSON string latest.
- **Expected Result:** A selector is rejected instead of resolved.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T092 — No private representation leak

- **Test ID:** SK-07-T092
- **Scenario:** No private representation leak.
- **Objective:** Verify no private representation leak against the documented contract.
- **Component:** SemanticVersion.toJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect canonical wire data for internal fields.
- **Expected Result:** No private canonical field, mutable array, or numeric implementation state appears in JSON.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## K. Immutability

### SK-07-T093 — Readonly core fields

- **Test ID:** SK-07-T093
- **Scenario:** Readonly core fields.
- **Objective:** Verify readonly core fields against the documented contract.
- **Component:** SemanticVersion declarations.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect public component types and a future attempted assignment.
- **Expected Result:** Core components are readonly and the runtime instance is frozen.
- **Expected Diagnostics:** TypeScript readonly-property error or native strict-mode TypeError for attempted mutation.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T094 — Frozen prerelease identifiers

- **Test ID:** SK-07-T094
- **Scenario:** Frozen prerelease identifiers.
- **Objective:** Verify frozen prerelease identifiers against the documented contract.
- **Component:** SemanticVersion.prerelease.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Attempt to modify or extend a returned prerelease array in future authorized verification.
- **Expected Result:** The frozen array and canonical text cannot change.
- **Expected Diagnostics:** Native TypeError where required by host strict mode.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T095 — Frozen build metadata

- **Test ID:** SK-07-T095
- **Scenario:** Frozen build metadata.
- **Objective:** Verify frozen build metadata against the documented contract.
- **Component:** SemanticVersion.buildMetadata.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Attempt to modify or extend the build array.
- **Expected Result:** Build identifiers and exact representation remain unchanged.
- **Expected Diagnostics:** Native TypeError where required by host strict mode.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T096 — No public setters or constructor

- **Test ID:** SK-07-T096
- **Scenario:** No public setters or constructor.
- **Objective:** Verify no public setters or constructor against the documented contract.
- **Component:** SemanticVersion declarations.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect construction and mutation APIs.
- **Expected Result:** Construction is private and no setter or bumping method is exported.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T097 — No shared caller-array mutation

- **Test ID:** SK-07-T097
- **Scenario:** No shared caller-array mutation.
- **Objective:** Verify no shared caller-array mutation against the documented contract.
- **Component:** SemanticVersion constructor.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review defensive copies and frozen array ownership.
- **Expected Result:** No caller-accessible mutable array can change an existing version.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T098 — Frozen reference components

- **Test ID:** SK-07-T098
- **Scenario:** Frozen reference components.
- **Objective:** Verify frozen reference components against the documented contract.
- **Component:** ElementVersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Attempt to replace elementId or version through a JavaScript consumer.
- **Expected Result:** The exact reference remains unchanged and uses immutable component values.
- **Expected Diagnostics:** Native TypeError where required by host strict mode.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## L. Exact Version Versus Selector

### SK-07-T099 — Reject selector latest

- **Test ID:** SK-07-T099
- **Scenario:** Reject selector latest.
- **Objective:** Verify reject selector latest against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `latest`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T100 — Reject selector stable

- **Test ID:** SK-07-T100
- **Scenario:** Reject selector stable.
- **Objective:** Verify reject selector stable against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `stable`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T101 — Reject selector ^1.0.0

- **Test ID:** SK-07-T101
- **Scenario:** Reject selector ^1.0.0.
- **Objective:** Verify reject selector ^1.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `^1.0.0`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T102 — Reject selector ~1.0.0

- **Test ID:** SK-07-T102
- **Scenario:** Reject selector ~1.0.0.
- **Objective:** Verify reject selector ~1.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `~1.0.0`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T103 — Reject selector >=1.0.0

- **Test ID:** SK-07-T103
- **Scenario:** Reject selector >=1.0.0.
- **Objective:** Verify reject selector >=1.0.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `>=1.0.0`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_COMPONENT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T104 — Reject selector \*

- **Test ID:** SK-07-T104
- **Scenario:** Reject selector \*.
- **Objective:** Verify reject selector \* against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `*`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T105 — Reject selector 1.x

- **Test ID:** SK-07-T105
- **Scenario:** Reject selector 1.x.
- **Objective:** Verify reject selector 1.x against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.x`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T106 — Reject selector 1.0

- **Test ID:** SK-07-T106
- **Scenario:** Reject selector 1.0.
- **Objective:** Verify reject selector 1.0 against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply `1.0`.
- **Expected Result:** Input is rejected without choosing, looking up, or defaulting a version.
- **Expected Diagnostics:** `SEMANTIC_VERSION_INVALID_FORMAT`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T107 — No automatic version selection

- **Test ID:** SK-07-T107
- **Scenario:** No automatic version selection.
- **Objective:** Verify no automatic version selection against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect all exact-version and reference operations.
- **Expected Result:** No candidate collection, registry, latest policy, or range solver is consulted.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## M. ElementVersionRef Construction

### SK-07-T108 — Valid typed composition

- **Test ID:** SK-07-T108
- **Scenario:** Valid typed composition.
- **Objective:** Verify valid typed composition against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply SemanticElementId for customer-element-id and SemanticVersion for 1.0.0.
- **Expected Result:** A frozen exact reference exposes the original immutable component values.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T109 — Valid metadata-bearing version

- **Test ID:** SK-07-T109
- **Scenario:** Valid metadata-bearing version.
- **Objective:** Verify valid metadata-bearing version against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compose a valid ID with 1.0.0-rc.1+build.7.
- **Expected Result:** The complete exact version is retained.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T110 — Missing ID

- **Test ID:** SK-07-T110
- **Scenario:** Missing ID.
- **Objective:** Verify missing ID against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** In future JavaScript verification, omit or supply undefined for elementId.
- **Expected Result:** No ID is generated or defaulted.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_ID`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T111 — Missing version

- **Test ID:** SK-07-T111
- **Scenario:** Missing version.
- **Objective:** Verify missing version against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Omit or supply undefined for version.
- **Expected Result:** No version is selected or defaulted.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_VERSION`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T112 — Wrong ID type

- **Test ID:** SK-07-T112
- **Scenario:** Wrong ID type.
- **Objective:** Verify wrong ID type against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a raw ID string, QualifiedName, or context object as the typed ID.
- **Expected Result:** A SemanticElementId instance is required without coercion.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_ID`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T113 — Wrong version type

- **Test ID:** SK-07-T113
- **Scenario:** Wrong version type.
- **Objective:** Verify wrong version type against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a raw version string or structural VersionRef object.
- **Expected Result:** A SemanticVersion instance is required without coercion.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_VERSION`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T114 — No unresolved selector component

- **Test ID:** SK-07-T114
- **Scenario:** No unresolved selector component.
- **Objective:** Verify no unresolved selector component against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply latest or a range string as the version component.
- **Expected Result:** Unresolved selectors cannot form an exact reference.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_VERSION`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T115 — No implicit defaults

- **Test ID:** SK-07-T115
- **Scenario:** No implicit defaults.
- **Objective:** Verify no implicit defaults against the documented contract.
- **Component:** ElementVersionRef API.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect constructor and public factory signatures.
- **Expected Result:** Both authentic components are mandatory; there are no ambient defaults.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## N. ElementVersionRef Equality

### SK-07-T116 — Same ID and exact version

- **Test ID:** SK-07-T116
- **Scenario:** Same ID and exact version.
- **Objective:** Verify same ID and exact version against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Construct independent references with equal ID text and full version text.
- **Expected Result:** Exact value equality is true.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T117 — Different ID

- **Test ID:** SK-07-T117
- **Scenario:** Different ID.
- **Objective:** Verify different ID against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use distinct valid IDs with the same version.
- **Expected Result:** Exact reference equality is false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T118 — Different version

- **Test ID:** SK-07-T118
- **Scenario:** Different version.
- **Objective:** Verify different version against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use one ID at 1.0.0 and 1.1.0.
- **Expected Result:** Exact reference equality is false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T119 — Different build metadata

- **Test ID:** SK-07-T119
- **Scenario:** Different build metadata.
- **Objective:** Verify different build metadata against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use one ID at 1.0.0+build.1 and 1.0.0+build.2.
- **Expected Result:** Equality is false although the versions have equal precedence.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T120 — Independent component instances

- **Test ID:** SK-07-T120
- **Scenario:** Independent component instances.
- **Objective:** Verify independent component instances against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Parse equivalent IDs and versions independently before composition.
- **Expected Result:** Reference identity is not required for equality.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T121 — No precedence-based exact identity

- **Test ID:** SK-07-T121
- **Scenario:** No precedence-based exact identity.
- **Objective:** Verify no precedence-based exact identity against the documented contract.
- **Component:** ElementVersionRef implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect equality operations for version comparison choice.
- **Expected Result:** Version.equals is used, not comparePrecedence returning zero.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T122 — Cross-type comparison

- **Test ID:** SK-07-T122
- **Scenario:** Cross-type comparison.
- **Objective:** Verify cross-type comparison against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare a reference with null, plain wire data, or a version instance.
- **Expected Result:** Equality safely returns false.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## O. ElementVersionRef Serialization

### SK-07-T123 — Canonical structured JSON

- **Test ID:** SK-07-T123
- **Scenario:** Canonical structured JSON.
- **Objective:** Verify canonical structured JSON against the documented contract.
- **Component:** ElementVersionRef.toJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Serialize a valid customer-element-id reference at 1.2.3.
- **Expected Result:** Exactly elementId and version string fields are emitted in a fresh frozen record.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T124 — Stable field values

- **Test ID:** SK-07-T124
- **Scenario:** Stable field values.
- **Objective:** Verify stable field values against the documented contract.
- **Component:** ElementVersionRef.toJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Serialize a metadata-bearing reference repeatedly.
- **Expected Result:** Stable ID text and complete exact version text are preserved.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T125 — Validated exact round-trip

- **Test ID:** SK-07-T125
- **Scenario:** Validated exact round-trip.
- **Objective:** Verify validated exact round-trip against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Decode standard JSON produced from a reference and reconstruct it.
- **Expected Result:** The reconstructed reference equals the original by component value.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T126 — Invalid ID field

- **Test ID:** SK-07-T126
- **Scenario:** Invalid ID field.
- **Objective:** Verify invalid ID field against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply invalid ID text, a number, or null in an otherwise exact record.
- **Expected Result:** SK-01 validation is used and the reference reports a controlled ID error.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_ID`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T127 — Invalid version field

- **Test ID:** SK-07-T127
- **Scenario:** Invalid version field.
- **Objective:** Verify invalid version field against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply latest, unsafe numeric text, or a non-string version field.
- **Expected Result:** Exact version validation is used and the reference reports a controlled version error.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_VERSION`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T128 — Missing required wire fields

- **Test ID:** SK-07-T128
- **Scenario:** Missing required wire fields.
- **Objective:** Verify missing required wire fields against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Omit elementId, version, or both.
- **Expected Result:** The record shape is rejected without defaults.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T129 — Unexpected container shape

- **Test ID:** SK-07-T129
- **Scenario:** Unexpected container shape.
- **Objective:** Verify unexpected container shape against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply null, an array, a raw string, or a class instance.
- **Expected Result:** Only the supported decoded record shape is accepted.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T130 — Unexpected extra field

- **Test ID:** SK-07-T130
- **Scenario:** Unexpected extra field.
- **Objective:** Verify unexpected extra field against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Add a context, tenant, selector, or unrelated field to an otherwise valid record.
- **Expected Result:** The closed two-field wire contract rejects extra data.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T131 — Inherited component fields

- **Test ID:** SK-07-T131
- **Scenario:** Inherited component fields.
- **Objective:** Verify inherited component fields against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Provide required fields through a prototype rather than own data properties.
- **Expected Result:** Inherited fields cannot establish the wire contract.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T132 — Accessor component fields

- **Test ID:** SK-07-T132
- **Scenario:** Accessor component fields.
- **Objective:** Verify accessor component fields against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Provide a getter for elementId or version.
- **Expected Result:** Accessor fields are rejected without reading component getters.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T133 — Symbol or nonenumerable fields

- **Test ID:** SK-07-T133
- **Scenario:** Symbol or nonenumerable fields.
- **Objective:** Verify symbol or nonenumerable fields against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Add symbol fields or make a required field nonenumerable.
- **Expected Result:** The supported JSON-compatible data-field shape is rejected.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T134 — Null-prototype wire record

- **Test ID:** SK-07-T134
- **Scenario:** Null-prototype wire record.
- **Objective:** Verify null-prototype wire record against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Provide exactly two own enumerable string data fields on a null-prototype record.
- **Expected Result:** The valid wire record is accepted and component parsing remains strict.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T135 — Inspection failure

- **Test ID:** SK-07-T135
- **Scenario:** Inspection failure.
- **Objective:** Verify inspection failure against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** In future authorized verification, use a record whose reflective inspection throws.
- **Expected Result:** A fixed controlled shape error is reported without forwarding untrusted exception text.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## P. Semantic Identity Separation

### SK-07-T136 — Same element across versions

- **Test ID:** SK-07-T136
- **Scenario:** Same element across versions.
- **Objective:** Verify same element across versions against the documented contract.
- **Component:** ElementVersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Reuse customer-element-id at 1.0.0 and 1.1.0.
- **Expected Result:** The stable identity is unchanged while references differ.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T137 — Different elements, same version

- **Test ID:** SK-07-T137
- **Scenario:** Different elements, same version.
- **Objective:** Verify different elements, same version against the documented contract.
- **Component:** ElementVersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use customer-element-id and another valid ID at 1.0.0.
- **Expected Result:** The references remain distinct despite equal version text.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T138 — No ID regeneration

- **Test ID:** SK-07-T138
- **Scenario:** No ID regeneration.
- **Objective:** Verify no ID regeneration against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review composition and retained component references.
- **Expected Result:** No random, time-derived, or version-derived identity is generated.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T139 — No name-derived identity

- **Test ID:** SK-07-T139
- **Scenario:** No name-derived identity.
- **Objective:** Verify no name-derived identity against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect input requirements and dependencies.
- **Expected Result:** A typed SemanticElementId is required for composition; no QualifiedName is resolved to an ID.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T140 — No version mutation of identity

- **Test ID:** SK-07-T140
- **Scenario:** No version mutation of identity.
- **Objective:** Verify no version mutation of identity against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Construct a later-version reference while retaining the earlier reference.
- **Expected Result:** Version data stays in the version component; neither reference mutates or appends to the ID.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T141 — Preserve opaque ID grammar

- **Test ID:** SK-07-T141
- **Scenario:** Preserve opaque ID grammar.
- **Objective:** Verify preserve opaque ID grammar against the documented contract.
- **Component:** SemanticElementId contract.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare SK-01 grammar and source with the pre-SK-07 base.
- **Expected Result:** Existing valid ID spelling remains untouched and is not reinterpreted as version or name data.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## Q. QualifiedName Separation

### SK-07-T142 — QualifiedName implementation unchanged

- **Test ID:** SK-07-T142
- **Scenario:** QualifiedName implementation unchanged.
- **Objective:** Verify qualifiedName implementation unchanged against the documented contract.
- **Component:** SK-03 source inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare naming source with the pre-SK-07 base.
- **Expected Result:** QualifiedName parsing and serialization remain unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T143 — No version parser in QualifiedName

- **Test ID:** SK-07-T143
- **Scenario:** No version parser in QualifiedName.
- **Objective:** Verify no version parser in QualifiedName against the documented contract.
- **Component:** Versioning dependencies.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect naming imports and new version operations.
- **Expected Result:** Version grammar is owned only by SemanticVersion, with no naming changes.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T144 — Reject name object as ID component

- **Test ID:** SK-07-T144
- **Scenario:** Reject name object as ID component.
- **Objective:** Verify reject name object as ID component against the documented contract.
- **Component:** ElementVersionRef.fromParts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply a QualifiedName instance as elementId in future runtime verification.
- **Expected Result:** Name spelling does not substitute for a stable ID value object.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_ID`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T145 — No combined name-at-version string grammar

- **Test ID:** SK-07-T145
- **Scenario:** No combined name-at-version string grammar.
- **Objective:** Verify no combined name-at-version string grammar against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply sales.Customer@1.0.0 as a raw reference string.
- **Expected Result:** No textual name-based resolver or implicit delimiter parser is invoked.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T146 — Opaque name-like ID spelling

- **Test ID:** SK-07-T146
- **Scenario:** Opaque name-like ID spelling.
- **Objective:** Verify opaque name-like ID spelling against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use syntactically valid SK-01 ID text resembling a name in the explicit elementId field.
- **Expected Result:** Text is treated only as an opaque ID; no name lookup, context resolution, or existence claim occurs.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## R. Context Separation

### SK-07-T147 — SemanticContextRef unchanged

- **Test ID:** SK-07-T147
- **Scenario:** SemanticContextRef unchanged.
- **Objective:** Verify semanticContextRef unchanged against the documented contract.
- **Component:** SK-04 source inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare context source with the pre-SK-07 base.
- **Expected Result:** Context grammar, equality, and immutability are preserved.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T148 — No context inferred from version

- **Test ID:** SK-07-T148
- **Scenario:** No context inferred from version.
- **Objective:** Verify no context inferred from version against the documented contract.
- **Component:** SemanticVersion contract.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect component fields and parser operations.
- **Expected Result:** No contextual meaning or ambient context is attached to version text.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T149 — No context in exact wire shape

- **Test ID:** SK-07-T149
- **Scenario:** No context in exact wire shape.
- **Objective:** Verify no context in exact wire shape against the documented contract.
- **Component:** ElementVersionRef.fromJSON.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply an extra contextRef field.
- **Expected Result:** Context remains separate from the exact reference wire contract.
- **Expected Diagnostics:** `ELEMENT_VERSION_REF_INVALID_SHAPE`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T150 — No tenant inference

- **Test ID:** SK-07-T150
- **Scenario:** No tenant inference.
- **Objective:** Verify no tenant inference against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect parsing, composition, and equality.
- **Expected Result:** No tenant is inferred from ID, version, or metadata.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T151 — No authorization inference

- **Test ID:** SK-07-T151
- **Scenario:** No authorization inference.
- **Objective:** Verify no authorization inference against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use a valid exact reference alongside an unrelated actor identity.
- **Expected Result:** Syntactic validation grants no authority or access.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T152 — No ambient context dependency

- **Test ID:** SK-07-T152
- **Scenario:** No ambient context dependency.
- **Objective:** Verify no ambient context dependency against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review all external dependencies and method signatures.
- **Expected Result:** Parsing and references require only explicit inputs and fixed grammar.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## S. SemanticElement Integration

### SK-07-T153 — Preserve SK-05 base

- **Test ID:** SK-07-T153
- **Scenario:** Preserve SK-05 base.
- **Objective:** Verify preserve SK-05 base against the documented contract.
- **Component:** SemanticElement.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare its interface and implementation with the task base.
- **Expected Result:** The base keeps only id, qualifiedName, and contextRef as required properties.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T154 — No mandatory version field

- **Test ID:** SK-07-T154
- **Scenario:** No mandatory version field.
- **Objective:** Verify no mandatory version field against the documented contract.
- **Component:** SemanticElement public declarations.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect the current base contract after SK-07.
- **Expected Result:** Existing three-field consumers remain source-compatible.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T155 — No inherited versioned base class

- **Test ID:** SK-07-T155
- **Scenario:** No inherited versioned base class.
- **Objective:** Verify no inherited versioned base class against the documented contract.
- **Component:** Public Kernel API.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect new exports and existing element contracts.
- **Expected Result:** No class hierarchy is imposed on semantic definitions.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T156 — Future composition boundary

- **Test ID:** SK-07-T156
- **Scenario:** Future composition boundary.
- **Objective:** Verify future composition boundary against the documented contract.
- **Component:** Versioning documentation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review how a future concrete definition may compose SemanticElement and SemanticVersion.
- **Expected Result:** Composition remains possible without implementing a speculative versioned-element contract now.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## T. SemanticElementKind Integration

### SK-07-T157 — Preserve closed kind set

- **Test ID:** SK-07-T157
- **Scenario:** Preserve closed kind set.
- **Objective:** Verify preserve closed kind set against the documented contract.
- **Component:** SK-06 source inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare classification source with the task base.
- **Expected Result:** All nine existing canonical kind codes are unchanged.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T158 — Kind independent of version

- **Test ID:** SK-07-T158
- **Scenario:** Kind independent of version.
- **Objective:** Verify kind independent of version against the documented contract.
- **Component:** SemanticVersion API.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect version fields and parsing parameters.
- **Expected Result:** No classification value is required or inferred.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T159 — No kind-specific parser

- **Test ID:** SK-07-T159
- **Scenario:** No kind-specific parser.
- **Objective:** Verify no kind-specific parser against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect parsing dispatch and imports.
- **Expected Result:** One exact grammar is used; no kind selects a parser or version policy.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T160 — No implied support

- **Test ID:** SK-07-T160
- **Scenario:** No implied support.
- **Objective:** Verify no implied support against the documented contract.
- **Component:** Versioning documentation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use a known kind and valid version where no compiler or runtime support exists.
- **Expected Result:** Validation does not claim compiler or runtime capability.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## U. Compatibility Boundary

### SK-07-T161 — No breaking-change analysis

- **Test ID:** SK-07-T161
- **Scenario:** No breaking-change analysis.
- **Objective:** Verify no breaking-change analysis against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review comparison inputs and outputs.
- **Expected Result:** Only exact version precedence is calculated; definitions are not diffed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T162 — No compatibility proof

- **Test ID:** SK-07-T162
- **Scenario:** No compatibility proof.
- **Objective:** Verify no compatibility proof against the documented contract.
- **Component:** SemanticVersion contract.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Consider changes numbered 1.2.0 to 1.3.0 or 1.0.0 to 2.0.0.
- **Expected Result:** Numbers alone do not prove a particular model change compatible or incompatible.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T163 — No automatic bump

- **Test ID:** SK-07-T163
- **Scenario:** No automatic bump.
- **Objective:** Verify no automatic bump against the documented contract.
- **Component:** Public Kernel API.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect for nextMajor, nextMinor, nextPatch, or autoBump.
- **Expected Result:** No version generation or change-classification API is introduced.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T164 — No migration planning

- **Test ID:** SK-07-T164
- **Scenario:** No migration planning.
- **Objective:** Verify no migration planning against the documented contract.
- **Component:** Changed-file inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect new implementations and data types.
- **Expected Result:** No semantic migration plan, deprecation workflow, or evolution engine is created.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T165 — No model diffing

- **Test ID:** SK-07-T165
- **Scenario:** No model diffing.
- **Objective:** Verify no model diffing against the documented contract.
- **Component:** Versioning dependencies.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect imports and operations.
- **Expected Result:** No model definitions or compatibility analyzer is consumed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## V. Runtime and Persistence Isolation

### SK-07-T166 — Exclude Artifact loader

- **Test ID:** SK-07-T166
- **Scenario:** Exclude Artifact loader.
- **Objective:** Verify exclude Artifact loader against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** No compiled artifact loader or artifact revision is introduced.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T167 — Exclude Runtime registry

- **Test ID:** SK-07-T167
- **Scenario:** Exclude Runtime registry.
- **Objective:** Verify exclude Runtime registry against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** No Runtime model or version registry is introduced.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T168 — Exclude Runtime activation

- **Test ID:** SK-07-T168
- **Scenario:** Exclude Runtime activation.
- **Objective:** Verify exclude Runtime activation against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** Reference construction never activates or executes a definition.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T169 — Exclude Instance revision

- **Test ID:** SK-07-T169
- **Scenario:** Exclude Instance revision.
- **Objective:** Verify exclude Instance revision against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** No instance revision or optimistic concurrency type is introduced.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T170 — Exclude Storage revision

- **Test ID:** SK-07-T170
- **Scenario:** Exclude Storage revision.
- **Objective:** Verify exclude Storage revision against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** No storage revision or persistence CAS contract is introduced.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T171 — Exclude Database connection

- **Test ID:** SK-07-T171
- **Scenario:** Exclude Database connection.
- **Objective:** Verify exclude Database connection against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** Parsing and composition require no database, query, or transaction.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T172 — Exclude Publication and deployment

- **Test ID:** SK-07-T172
- **Scenario:** Exclude Publication and deployment.
- **Objective:** Verify exclude Publication and deployment against the documented contract.
- **Component:** Versioning implementation and inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect fields, imports, public exports, and changed files.
- **Expected Result:** No lifecycle, release, publication, or deployment status is inferred.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## W. Framework Independence

### SK-07-T173 — No NestJS dependency

- **Test ID:** SK-07-T173
- **Scenario:** No NestJS dependency.
- **Objective:** Verify no NestJS dependency against the documented contract.
- **Component:** Kernel imports and manifests.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect implementation and dependency declarations.
- **Expected Result:** No NestJS package, decorator, provider, or initialization is required.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T174 — No Angular dependency

- **Test ID:** SK-07-T174
- **Scenario:** No Angular dependency.
- **Objective:** Verify no Angular dependency against the documented contract.
- **Component:** Kernel imports and manifests.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect implementation and dependency declarations.
- **Expected Result:** No Angular package, decorator, provider, or initialization is required.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T175 — No PrimeNG dependency

- **Test ID:** SK-07-T175
- **Scenario:** No PrimeNG dependency.
- **Objective:** Verify no PrimeNG dependency against the documented contract.
- **Component:** Kernel imports and manifests.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect implementation and dependency declarations.
- **Expected Result:** No PrimeNG package, decorator, provider, or initialization is required.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T176 — No ORM dependency

- **Test ID:** SK-07-T176
- **Scenario:** No ORM dependency.
- **Objective:** Verify no ORM dependency against the documented contract.
- **Component:** Kernel imports and manifests.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect implementation and dependency declarations.
- **Expected Result:** No ORM package, decorator, provider, or initialization is required.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T177 — No Node-only core dependency

- **Test ID:** SK-07-T177
- **Scenario:** No Node-only core dependency.
- **Objective:** Verify no Node-only core dependency against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect for fs, path, crypto, process, Buffer, or Node-only imports.
- **Expected Result:** Core parsing, composition, ordering, and serialization use portable JavaScript only.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T178 — Browser and worker portability

- **Test ID:** SK-07-T178
- **Scenario:** Browser and worker portability.
- **Objective:** Verify browser and worker portability against the documented contract.
- **Component:** Public versioning API.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Plan future verification in a modern browser or worker without Node globals.
- **Expected Result:** The same explicit inputs produce the same values and diagnostics.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## X. Public API and Legacy Compatibility

### SK-07-T179 — Approved public import

- **Test ID:** SK-07-T179
- **Scenario:** Approved public import.
- **Objective:** Verify approved public import against the documented contract.
- **Component:** Kernel src/index.ts.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect exports for both classes, wire/result types, errors, and bounds.
- **Expected Result:** Both primitives and their supported contract types are exported through @ecosystem/semantic-kernel.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T180 — Package export discipline

- **Test ID:** SK-07-T180
- **Scenario:** Package export discipline.
- **Objective:** Verify package export discipline against the documented contract.
- **Component:** Kernel package.json.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare the approved package export map with the task base.
- **Expected Result:** Root exports remain sufficient; no private subpath is exposed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T181 — TypeScript declarations

- **Test ID:** SK-07-T181
- **Scenario:** TypeScript declarations.
- **Objective:** Verify typeScript declarations against the documented contract.
- **Component:** Non-test Kernel build.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect emitted declarations after permitted compilation.
- **Expected Result:** Readonly components, private constructors, typed parsing results, and normalized comparison are represented.
- **Expected Diagnostics:** No TypeScript diagnostic expected.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T182 — No private consumer deep imports

- **Test ID:** SK-07-T182
- **Scenario:** No private consumer deep imports.
- **Objective:** Verify no private consumer deep imports against the documented contract.
- **Component:** Versioning documentation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect consumer examples.
- **Expected Result:** Consumers use the approved package root.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T183 — No circular dependency

- **Test ID:** SK-07-T183
- **Scenario:** No circular dependency.
- **Objective:** Verify no circular dependency against the documented contract.
- **Component:** Versioning import graph.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect direct imports, barrels, and the structural compatibility module.
- **Expected Result:** New primitives do not import the root or higher layers; legacy functions depend on the new parser, never the reverse.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T184 — Legacy structural fields retained

- **Test ID:** SK-07-T184
- **Scenario:** Legacy structural fields retained.
- **Objective:** Verify legacy structural fields retained against the documented contract.
- **Component:** VersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect public interface before and after SK-07.
- **Expected Result:** major/minor/patch and optional prerelease/build retain their existing field types.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T185 — Legacy parser delegation

- **Test ID:** SK-07-T185
- **Scenario:** Legacy parser delegation.
- **Objective:** Verify legacy parser delegation against the documented contract.
- **Component:** parseVersion.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review the function and plan future parsing of 1.0.0-alpha.1+build.7.
- **Expected Result:** The authoritative parser is used and a frozen structural view retains full text metadata.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T186 — Legacy formatting delegation

- **Test ID:** SK-07-T186
- **Scenario:** Legacy formatting delegation.
- **Objective:** Verify legacy formatting delegation against the documented contract.
- **Component:** formatVersion.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply valid safe components and optional canonical metadata in future verification.
- **Expected Result:** Formatting uses the same exact parser and preserves complete canonical version text.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T187 — Legacy comparison corrected

- **Test ID:** SK-07-T187
- **Scenario:** Legacy comparison corrected.
- **Objective:** Verify legacy comparison corrected against the documented contract.
- **Component:** compareVersions.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare beta.2 versus beta.11 and versions differing only in build metadata.
- **Expected Result:** The legacy helper implements correct prerelease ordering and normalized precedence, excluding build metadata.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T188 — Legacy malformed data rejected

- **Test ID:** SK-07-T188
- **Scenario:** Legacy malformed data rejected.
- **Objective:** Verify legacy malformed data rejected against the documented contract.
- **Component:** Legacy version helpers.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply unsafe, fractional, negative-zero numeric components or wrong optional field types.
- **Expected Result:** No arbitrary object coercion or unsafe numeric rendering occurs; controlled component/metadata errors are reported.
- **Expected Diagnostics:** INVALID_COMPONENT, INVALID_PRERELEASE, or INVALID_BUILD_METADATA according to the field.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T189 — Legacy empty metadata is invalid

- **Test ID:** SK-07-T189
- **Scenario:** Legacy empty metadata is invalid.
- **Objective:** Verify legacy empty metadata is invalid against the documented contract.
- **Component:** formatVersion.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply empty strings for an explicitly present prerelease or build field.
- **Expected Result:** Empty suffix data is rejected rather than silently omitted.
- **Expected Diagnostics:** INVALID_PRERELEASE or INVALID_BUILD_METADATA.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T190 — One authoritative SemVer parser

- **Test ID:** SK-07-T190
- **Scenario:** One authoritative SemVer parser.
- **Objective:** Verify one authoritative SemVer parser against the documented contract.
- **Component:** Versioning source inventory.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect the legacy helpers and new source.
- **Expected Result:** No independent loose SemVer regex or numeric-subtraction comparator remains in legacy helpers.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## Y. Security and Determinism

### SK-07-T191 — No executable version text

- **Test ID:** SK-07-T191
- **Scenario:** No executable version text.
- **Objective:** Verify no executable version text against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect for eval, Function, shell commands, or executable strings.
- **Expected Result:** Version and reference data never become executable code.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T192 — No dynamic module loading

- **Test ID:** SK-07-T192
- **Scenario:** No dynamic module loading.
- **Objective:** Verify no dynamic module loading against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect for input-selected modules, handlers, or loaders.
- **Expected Result:** Only fixed Kernel imports are used.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T193 — No filesystem or network

- **Test ID:** SK-07-T193
- **Scenario:** No filesystem or network.
- **Objective:** Verify no filesystem or network against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect parsing and reference operations for I/O.
- **Expected Result:** No path, file, network, database, or registry is accessed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T194 — Full length boundary

- **Test ID:** SK-07-T194
- **Scenario:** Full length boundary.
- **Objective:** Verify full length boundary against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use exactly 256 characters with otherwise valid bounded identifiers, then 257 characters.
- **Expected Result:** The supported boundary is accepted; excess length is rejected before parsing work.
- **Expected Diagnostics:** None at a valid boundary; TOO_LONG beyond it.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T195 — Identifier length boundary

- **Test ID:** SK-07-T195
- **Scenario:** Identifier length boundary.
- **Objective:** Verify identifier length boundary against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use a 64-character valid identifier, then a 65-character identifier, in prerelease and build separately.
- **Expected Result:** The exact identifier bound is accepted; excess length is rejected.
- **Expected Diagnostics:** None at a valid boundary; IDENTIFIER_TOO_LONG beyond it.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T196 — Prerelease count boundary

- **Test ID:** SK-07-T196
- **Scenario:** Prerelease count boundary.
- **Objective:** Verify prerelease count boundary against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use 16 valid short prerelease identifiers, then 17, within the full-string bound.
- **Expected Result:** The inclusive count is accepted; excess count is rejected.
- **Expected Diagnostics:** None at a valid boundary; TOO_MANY_IDENTIFIERS beyond it.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T197 — Build count boundary

- **Test ID:** SK-07-T197
- **Scenario:** Build count boundary.
- **Objective:** Verify build count boundary against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use 16 valid short build identifiers, then 17, within the full-string bound.
- **Expected Result:** The inclusive count is accepted; excess count is rejected.
- **Expected Diagnostics:** None at a valid boundary; TOO_MANY_IDENTIFIERS beyond it.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T198 — No input truncation

- **Test ID:** SK-07-T198
- **Scenario:** No input truncation.
- **Objective:** Verify no input truncation against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply oversized input with a valid-looking prefix.
- **Expected Result:** The whole input fails validation instead of being truncated into validity.
- **Expected Diagnostics:** `SEMANTIC_VERSION_TOO_LONG`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T199 — Controlled diagnostic content

- **Test ID:** SK-07-T199
- **Scenario:** Controlled diagnostic content.
- **Objective:** Verify controlled diagnostic content against the documented contract.
- **Component:** Version and reference errors.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply long invalid or secret-like text and invalid component records in future verification.
- **Expected Result:** Diagnostic messages use fixed descriptions and limits without echoing raw version/reference data.
- **Expected Diagnostics:** The appropriate controlled validation code.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T200 — No implicit object conversion

- **Test ID:** SK-07-T200
- **Scenario:** No implicit object conversion.
- **Objective:** Verify no implicit object conversion against the documented contract.
- **Component:** SemanticVersion.parse.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Supply an object with custom toString or conversion hooks.
- **Expected Result:** The object is rejected without invoking conversion methods.
- **Expected Diagnostics:** `SEMANTIC_VERSION_NON_STRING`
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T201 — No timestamps or randomness

- **Test ID:** SK-07-T201
- **Scenario:** No timestamps or randomness.
- **Objective:** Verify no timestamps or randomness against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect all value construction and comparison operations.
- **Expected Result:** No current time, random source, or generated identity affects results.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T202 — No environment or locale dependence

- **Test ID:** SK-07-T202
- **Scenario:** No environment or locale dependence.
- **Objective:** Verify no environment or locale dependence against the documented contract.
- **Component:** Versioning source.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review comparison and repeat identical inputs under different locales in future authorized verification.
- **Expected Result:** ASCII ordering and explicit inputs determine results; no locale or environment policy is consulted.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T203 — No automated verification in this task

- **Test ID:** SK-07-T203
- **Scenario:** No automated verification in this task.
- **Objective:** Verify no automated verification in this task against the documented contract.
- **Component:** Tracked changes and archive.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Inspect task artifacts and execution report.
- **Expected Result:** No runnable test file is created or modified; no test runner or ad hoc parsing experiment is executed.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

## Z. Mini Sales

### SK-07-T204 — Customer initial version

- **Test ID:** SK-07-T204
- **Scenario:** Customer initial version.
- **Objective:** Verify customer initial version against the documented contract.
- **Component:** SemanticVersion.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use Customer definition version 1.0.0.
- **Expected Result:** An exact version is represented without loading a Customer model.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T205 — Customer later version

- **Test ID:** SK-07-T205
- **Scenario:** Customer later version.
- **Objective:** Verify customer later version against the documented contract.
- **Component:** SemanticVersion.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use Customer definition version 1.1.0.
- **Expected Result:** A later exact version can be represented independently.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T206 — Same stable Customer identity

- **Test ID:** SK-07-T206
- **Scenario:** Same stable Customer identity.
- **Objective:** Verify same stable Customer identity against the documented contract.
- **Component:** ElementVersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Reuse customer-element-id for both definition versions.
- **Expected Result:** Stable semantic identity is retained.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T207 — Different exact Customer references

- **Test ID:** SK-07-T207
- **Scenario:** Different exact Customer references.
- **Objective:** Verify different exact Customer references against the documented contract.
- **Component:** ElementVersionRef.equals.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare that ID at 1.0.0 and 1.1.0.
- **Expected Result:** The references compare unequal.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T208 — Customer version precedence

- **Test ID:** SK-07-T208
- **Scenario:** Customer version precedence.
- **Objective:** Verify customer version precedence against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 1.1.0 with 1.0.0.
- **Expected Result:** The result is 1.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T209 — Customer prerelease ordering

- **Test ID:** SK-07-T209
- **Scenario:** Customer prerelease ordering.
- **Objective:** Verify customer prerelease ordering against the documented contract.
- **Component:** SemanticVersion.comparePrecedence.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Compare 2.0.0-beta.1 with 2.0.0.
- **Expected Result:** The prerelease has lower precedence.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T210 — Customer build equivalence versus equality

- **Test ID:** SK-07-T210
- **Scenario:** Customer build equivalence versus equality.
- **Objective:** Verify customer build equivalence versus equality against the documented contract.
- **Component:** SemanticVersion and ElementVersionRef.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Use one Customer ID at 1.0.0+build.1 and 1.0.0+build.2.
- **Expected Result:** Version precedence is equal while exact versions and references are unequal.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED

### SK-07-T211 — No Mini Sales execution

- **Test ID:** SK-07-T211
- **Scenario:** No Mini Sales execution.
- **Objective:** Verify no Mini Sales execution against the documented contract.
- **Component:** Versioning implementation.
- **Prerequisites:** SK-01 through SK-06 preserved; SK-07 implemented; future automated verification authorized.
- **Input / Setup:** Review composition alongside the conceptual example.
- **Expected Result:** No model load, compilation, activation, migration, database query, or latest-version selection occurs.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** Expected results and diagnostic category match exactly, without implicit defaults or unrelated side effects.
- **Execution Status:** NOT_RUN — DEFERRED
