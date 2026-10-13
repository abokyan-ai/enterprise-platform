# MOD-03 — Deferred Test Specification

Task: MOD-03 — Source Location Tracking

Layer: D. Model Authoring & Canonical Model

Technology: Pure TypeScript / Model Core

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:

- ARC-01 through ARC-05
- SK-01 through SK-11
- TYPE-01 through TYPE-08, where relevant
- MOD-01
- MOD-02

## Fixture and verification policy

This is a Markdown specification only. No runnable tests or parser experiments
were created or executed. Expected outcomes below are future acceptance targets,
not passing execution evidence. Extraction-only scenarios may use arbitrary raw
JSON/YAML through parseWithLocations; SUCCESS loader scenarios require the actual
MOD-01 envelope and existing validated type/facet/field/constraint shapes.

Mini Sales fixture: use the Customer definition and field in
[the architecture guide](../../docs/architecture/source-location-tracking.md), add
a second explicitly identified STRING field with matching ownerType, and append
Product/SalesOrder declarations with distinct IDs/names. Constraints use the
existing fieldId/ownerType/constraints wire contract. Never derive identities from
source paths. The fixture is a future verification setup, not an executed example.

Coordinate oracle: original UTF-16 code units; line/column 1-based; LF/lone CR
advance one line and CRLF advances one line after both units; entry offsets are
half-open while Kernel end coordinates are inclusive. Unknown origins remain
absent. Native JSON duplicate values remain last-wins with ambiguous metadata;
YAML duplicate keys retain their existing rejection policy. Alias use is located
without inventing expanded child spans.

## A. Source Identity

### MOD-03-T001 — Explicit source ID

- **Test ID:** MOD-03-T001
- **Scenario:** Source Identity: Explicit source ID.
- **Objective:** Verify explicit source id against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load valid envelope with sourceId="logical:mini-sales".
- **Expected Result:** Map sourceId and entry sourceUri equal the exact supplied string.
- **Expected Diagnostics:** None for a valid envelope.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T002 — Missing optional source ID

- **Test ID:** MOD-03-T002
- **Scenario:** Source Identity: Missing optional source ID.
- **Objective:** Verify missing optional source id against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Omit sourceId entirely from an otherwise valid request.
- **Expected Result:** Map/source positions have no invented source identifier.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T003 — Document-local coordinates

- **Test ID:** MOD-03-T003
- **Scenario:** Source Identity: Document-local coordinates.
- **Objective:** Verify document-local coordinates against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load the valid Mini Sales envelope with sourceId="mini-sales", then omit it; inspect only the selected source identity. Exercise specifically: Document-local coordinates.
- **Expected Result:** The explicit opaque source ID is preserved; absent identity stays absent and coordinates remain document-local. Verify the stated document-local coordinates condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T004 — No filesystem interpretation

- **Test ID:** MOD-03-T004
- **Scenario:** Source Identity: No filesystem interpretation.
- **Objective:** Verify no filesystem interpretation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load the valid Mini Sales envelope with sourceId="mini-sales", then omit it; inspect only the selected source identity. Exercise specifically: No filesystem interpretation.
- **Expected Result:** The explicit opaque source ID is preserved; absent identity stays absent and coordinates remain document-local. Verify the stated no filesystem interpretation condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T005 — No tenant inference

- **Test ID:** MOD-03-T005
- **Scenario:** Source Identity: No tenant inference.
- **Objective:** Verify no tenant inference against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load the valid Mini Sales envelope with sourceId="mini-sales", then omit it; inspect only the selected source identity. Exercise specifically: No tenant inference.
- **Expected Result:** The explicit opaque source ID is preserved; absent identity stays absent and coordinates remain document-local. Verify the stated no tenant inference condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T006 — No semantic identity conflation

- **Test ID:** MOD-03-T006
- **Scenario:** Source Identity: No semantic identity conflation.
- **Objective:** Verify no semantic identity conflation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelSource / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load the valid Mini Sales envelope with sourceId="mini-sales", then omit it; inspect only the selected source identity. Exercise specifically: No semantic identity conflation.
- **Expected Result:** The explicit opaque source ID is preserved; absent identity stays absent and coordinates remain document-local. Verify the stated no semantic identity conflation condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## B. SourceLocation Contract

### MOD-03-T007 — Existing Kernel contract

- **Test ID:** MOD-03-T007
- **Scenario:** SourceLocation Contract: Existing Kernel contract.
- **Objective:** Verify existing kernel contract against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the unchanged Kernel SourcePosition/DiagnosticLocation validators and authentic parser spans within the original source length. Exercise specifically: Existing Kernel contract.
- **Expected Result:** Published coordinates satisfy the existing 1-based UTF-16, inclusive-end Kernel contract; no competing SourceLocation type appears. Verify the stated existing kernel contract condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T008 — Valid position

- **Test ID:** MOD-03-T008
- **Scenario:** SourceLocation Contract: Valid position.
- **Objective:** Verify valid position against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the unchanged Kernel SourcePosition/DiagnosticLocation validators and authentic parser spans within the original source length. Exercise specifically: Valid position.
- **Expected Result:** Published coordinates satisfy the existing 1-based UTF-16, inclusive-end Kernel contract; no competing SourceLocation type appears. Verify the stated valid position condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T009 — Invalid position

- **Test ID:** MOD-03-T009
- **Scenario:** SourceLocation Contract: Invalid position.
- **Objective:** Verify invalid position against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Validate line=0, column=0, fractional coordinates and non-object positions through the authoritative Kernel validation API.
- **Expected Result:** Invalid coordinates are rejected, not silently normalized.
- **Expected Diagnostics:** Existing DIAGNOSTIC*LOCATION*\* validation errors.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T010 — Valid range where supported

- **Test ID:** MOD-03-T010
- **Scenario:** SourceLocation Contract: Valid range where supported.
- **Objective:** Verify valid range where supported against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the unchanged Kernel SourcePosition/DiagnosticLocation validators and authentic parser spans within the original source length. Exercise specifically: Valid range where supported.
- **Expected Result:** Published coordinates satisfy the existing 1-based UTF-16, inclusive-end Kernel contract; no competing SourceLocation type appears. Verify the stated valid range where supported condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T011 — Invalid range

- **Test ID:** MOD-03-T011
- **Scenario:** SourceLocation Contract: Invalid range.
- **Objective:** Verify invalid range against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Provide internal start>end, negative offsets and endpoints beyond original source length.
- **Expected Result:** Invalid mapping evidence fails; no out-of-bounds entry is published.
- **Expected Diagnostics:** MODEL_LOADER_LOCATION_ERROR at the built-in loading boundary.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T012 — Source mismatch

- **Test ID:** MOD-03-T012
- **Scenario:** SourceLocation Contract: Source mismatch.
- **Objective:** Verify source mismatch against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inject a location-aware parser returning a map with sourceId different from the request.
- **Expected Result:** The result is FAILURE and publishes no successful document.
- **Expected Diagnostics:** MODEL_LOADER_LOCATION_ERROR.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T013 — No duplicate location model

- **Test ID:** MOD-03-T013
- **Scenario:** SourceLocation Contract: No duplicate location model.
- **Objective:** Verify no duplicate location model against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SK-11 / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the unchanged Kernel SourcePosition/DiagnosticLocation validators and authentic parser spans within the original source length. Exercise specifically: No duplicate location model.
- **Expected Result:** Published coordinates satisfy the existing 1-based UTF-16, inclusive-end Kernel contract; no competing SourceLocation type appears. Verify the stated no duplicate location model condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## C. Coordinate Conventions

### MOD-03-T014 — First line

- **Test ID:** MOD-03-T014
- **Scenario:** Coordinate Conventions: First line.
- **Objective:** Verify first line against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON parser source {"a":1}; inspect root start.
- **Expected Result:** Root starts at line 1, column 1, offset 0 by actual node evidence.
- **Expected Diagnostics:** None at syntax parsing boundary.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T015 — First column

- **Test ID:** MOD-03-T015
- **Scenario:** Coordinate Conventions: First column.
- **Objective:** Verify first column against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Source with a valid scalar/property beginning at the first character after a line break.
- **Expected Result:** Its start column is 1 under the original newline policy.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T016 — Zero-based versus one-based conversion

- **Test ID:** MOD-03-T016
- **Scenario:** Coordinate Conventions: Zero-based versus one-based conversion.
- **Objective:** Verify zero-based versus one-based conversion against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use JSON source {"a":"😀"} with LF, CRLF and lone CR layout variants; compare authentic offsets with hand-derived original-string coordinates. Exercise specifically: Zero-based versus one-based conversion.
- **Expected Result:** Line breaks follow the documented policy and columns count UTF-16 units; conversion does not rewrite the original text. Verify the stated zero-based versus one-based conversion condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T017 — CRLF newlines

- **Test ID:** MOD-03-T017
- **Scenario:** Coordinate Conventions: CRLF newlines.
- **Objective:** Verify crlf newlines against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use JSON source {"a":"😀"} with LF, CRLF and lone CR layout variants; compare authentic offsets with hand-derived original-string coordinates. Exercise specifically: CRLF newlines.
- **Expected Result:** Line breaks follow the documented policy and columns count UTF-16 units; conversion does not rewrite the original text. Verify the stated crlf newlines condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T018 — LF newlines

- **Test ID:** MOD-03-T018
- **Scenario:** Coordinate Conventions: LF newlines.
- **Objective:** Verify lf newlines against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use JSON source {"a":"😀"} with LF, CRLF and lone CR layout variants; compare authentic offsets with hand-derived original-string coordinates. Exercise specifically: LF newlines.
- **Expected Result:** Line breaks follow the documented policy and columns count UTF-16 units; conversion does not rewrite the original text. Verify the stated lf newlines condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T019 — Unicode characters

- **Test ID:** MOD-03-T019
- **Scenario:** Coordinate Conventions: Unicode characters.
- **Objective:** Verify unicode characters against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use JSON source {"a":"😀"} with LF, CRLF and lone CR layout variants; compare authentic offsets with hand-derived original-string coordinates. Exercise specifically: Unicode characters.
- **Expected Result:** Line breaks follow the documented policy and columns count UTF-16 units; conversion does not rewrite the original text. Verify the stated unicode characters condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T020 — UTF-16 surrogate pairs

- **Test ID:** MOD-03-T020
- **Scenario:** Coordinate Conventions: UTF-16 surrogate pairs.
- **Objective:** Verify utf-16 surrogate pairs against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON source {"a":"😀","b":1}; inspect the later b value using original UTF-16 offsets.
- **Expected Result:** The surrogate pair contributes two column units; offsets are not Unicode-code-point indices.
- **Expected Diagnostics:** None at syntax boundary.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T021 — End-exclusive ranges

- **Test ID:** MOD-03-T021
- **Scenario:** Coordinate Conventions: End-exclusive ranges.
- **Objective:** Verify end-exclusive ranges against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON source {"a":1}; inspect /a.
- **Expected Result:** Offsets are [5,6); Kernel start/end are both line 1 column 6, with inclusive end.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T022 — End-of-input position

- **Test ID:** MOD-03-T022
- **Scenario:** Coordinate Conventions: End-of-input position.
- **Objective:** Verify end-of-input position against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a parser error with start offset exactly source.length and no valid nonempty end.
- **Expected Result:** EOF is a valid point; no endpoint past source length is fabricated.
- **Expected Diagnostics:** Authentic syntax failure with a start-only location.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## D. SourcePath

### MOD-03-T023 — Root path

- **Test ID:** MOD-03-T023
- **Scenario:** SourcePath: Root path.
- **Objective:** Verify root path against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct SourcePath.fromSegments([]); separately construct [""].
- **Expected Result:** Root renders empty string; empty property renders /; these are distinct addresses.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T024 — Object-property path

- **Test ID:** MOD-03-T024
- **Scenario:** SourcePath: Object-property path.
- **Objective:** Verify object-property path against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct typed segments ["declarations",0,"definition","version"] and compare lookup with pointer /declarations/0/definition/version. Exercise specifically: Object-property path.
- **Expected Result:** Properties and array indices retain their segment kinds; JSON Pointer escaping is deterministic and case-sensitive. Verify the stated object-property path condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T025 — Array-index path

- **Test ID:** MOD-03-T025
- **Scenario:** SourcePath: Array-index path.
- **Objective:** Verify array-index path against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct typed segments ["declarations",0,"definition","version"] and compare lookup with pointer /declarations/0/definition/version. Exercise specifically: Array-index path.
- **Expected Result:** Properties and array indices retain their segment kinds; JSON Pointer escaping is deterministic and case-sensitive. Verify the stated array-index path condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T026 — Nested paths

- **Test ID:** MOD-03-T026
- **Scenario:** SourcePath: Nested paths.
- **Objective:** Verify nested paths against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct typed segments ["declarations",0,"definition","version"] and compare lookup with pointer /declarations/0/definition/version. Exercise specifically: Nested paths.
- **Expected Result:** Properties and array indices retain their segment kinds; JSON Pointer escaping is deterministic and case-sensitive. Verify the stated nested paths condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T027 — Escaped property names

- **Test ID:** MOD-03-T027
- **Scenario:** SourcePath: Escaped property names.
- **Objective:** Verify escaped property names against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Parse {"a/b~c":1} and query /a~1b~0c.
- **Expected Result:** Escapes round-trip to the actual decoded property name and its value range.
- **Expected Diagnostics:** None at syntax boundary.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T028 — Repeated names

- **Test ID:** MOD-03-T028
- **Scenario:** SourcePath: Repeated names.
- **Objective:** Verify repeated names against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct typed segments ["declarations",0,"definition","version"] and compare lookup with pointer /declarations/0/definition/version. Exercise specifically: Repeated names.
- **Expected Result:** Properties and array indices retain their segment kinds; JSON Pointer escaping is deterministic and case-sensitive. Verify the stated repeated names condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T029 — Invalid path

- **Test ID:** MOD-03-T029
- **Scenario:** SourcePath: Invalid path.
- **Objective:** Verify invalid path against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use pointer /bad~2escape; construct sparse segments, negative/fractional indices and invalid segment types.
- **Expected Result:** Malformed pointers/segments fail explicitly rather than aliasing a valid address.
- **Expected Diagnostics:** TypeError for malformed path input.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T030 — No filesystem path confusion

- **Test ID:** MOD-03-T030
- **Scenario:** SourcePath: No filesystem path confusion.
- **Objective:** Verify no filesystem path confusion against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Construct typed segments ["declarations",0,"definition","version"] and compare lookup with pointer /declarations/0/definition/version. Exercise specifically: No filesystem path confusion.
- **Expected Result:** Properties and array indices retain their segment kinds; JSON Pointer escaping is deterministic and case-sensitive. Verify the stated no filesystem path confusion condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## E. JSON Extraction

### MOD-03-T031 — Root object

- **Test ID:** MOD-03-T031
- **Scenario:** JSON Extraction: Root object.
- **Objective:** Verify root object against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Root object.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated root object condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T032 — Nested object

- **Test ID:** MOD-03-T032
- **Scenario:** JSON Extraction: Nested object.
- **Objective:** Verify nested object against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Nested object.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated nested object condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T033 — Array

- **Test ID:** MOD-03-T033
- **Scenario:** JSON Extraction: Array.
- **Objective:** Verify array against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Array.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated array condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T034 — String value

- **Test ID:** MOD-03-T034
- **Scenario:** JSON Extraction: String value.
- **Objective:** Verify string value against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: String value.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated string value condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T035 — Escaped string

- **Test ID:** MOD-03-T035
- **Scenario:** JSON Extraction: Escaped string.
- **Objective:** Verify escaped string against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Escaped string.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated escaped string condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T036 — Repeated scalar

- **Test ID:** MOD-03-T036
- **Scenario:** JSON Extraction: Repeated scalar.
- **Objective:** Verify repeated scalar against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Repeated scalar.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated repeated scalar condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T037 — Multiline formatting

- **Test ID:** MOD-03-T037
- **Scenario:** JSON Extraction: Multiline formatting.
- **Objective:** Verify multiline formatting against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on raw JSON fixtures {"a":1}, {"a":[{"b":"same"},{"b":"same"}]} and their formatted variants. Exercise specifically: Multiline formatting.
- **Expected Result:** Actual JSON tree offsets supply independent root, object, array and scalar spans; no string uniqueness or raw-text search is required. Verify the stated multiline formatting condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T038 — Invalid JSON

- **Test ID:** MOD-03-T038
- **Scenario:** JSON Extraction: Invalid JSON.
- **Objective:** Verify invalid json against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load a request whose JSON has a missing colon, comment, trailing comma or unclosed container.
- **Expected Result:** FAILURE; no successful document or partial location map.
- **Expected Diagnostics:** MODEL_LOADER_JSON_SYNTAX_ERROR with structured parser evidence where available.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T039 — End-of-input syntax error

- **Test ID:** MOD-03-T039
- **Scenario:** JSON Extraction: End-of-input syntax error.
- **Objective:** Verify end-of-input syntax error against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JsonModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use JSON {"schemaVersion": and an unclosed YAML flow collection.
- **Expected Result:** Authentic EOF parser positions remain valid points; missing ranges are not invented.
- **Expected Diagnostics:** JSON/YAML syntax diagnostic; location absent only if structured evidence is unavailable.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## F. YAML Extraction

### MOD-03-T040 — Root mapping

- **Test ID:** MOD-03-T040
- **Scenario:** YAML Extraction: Root mapping.
- **Objective:** Verify root mapping against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Root mapping.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated root mapping condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T041 — Nested mapping

- **Test ID:** MOD-03-T041
- **Scenario:** YAML Extraction: Nested mapping.
- **Objective:** Verify nested mapping against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Nested mapping.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated nested mapping condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T042 — Sequence

- **Test ID:** MOD-03-T042
- **Scenario:** YAML Extraction: Sequence.
- **Objective:** Verify sequence against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Sequence.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated sequence condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T043 — Scalar

- **Test ID:** MOD-03-T043
- **Scenario:** YAML Extraction: Scalar.
- **Objective:** Verify scalar against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Scalar.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated scalar condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T044 — Multiline scalar

- **Test ID:** MOD-03-T044
- **Scenario:** YAML Extraction: Multiline scalar.
- **Objective:** Verify multiline scalar against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Multiline scalar.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated multiline scalar condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T045 — Duplicate mapping key

- **Test ID:** MOD-03-T045
- **Scenario:** YAML Extraction: Duplicate mapping key.
- **Objective:** Verify duplicate mapping key against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Parse YAML a: 1
  a: 2
  under existing uniqueKeys=true.
- **Expected Result:** Duplicate key fails before successful data/map publication.
- **Expected Diagnostics:** MODEL_LOADER_YAML_SYNTAX_ERROR at the parser-provided duplicate-key position.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T046 — Anchors and aliases

- **Test ID:** MOD-03-T046
- **Scenario:** YAML Extraction: Anchors and aliases.
- **Objective:** Verify anchors and aliases against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Anchors and aliases.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated anchors and aliases condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T047 — Invalid YAML

- **Test ID:** MOD-03-T047
- **Scenario:** YAML Extraction: Invalid YAML.
- **Objective:** Verify invalid yaml against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Call parseWithLocations on YAML a: 1, nested mappings/sequences, block scalars, directives and alias variants. Exercise specifically: Invalid YAML.
- **Expected Result:** Supported actual node ranges are mapped; unavailable/transformed structures are explicit absence, and existing YAML value policies remain intact. Verify the stated invalid yaml condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T048 — Unsupported tag

- **Test ID:** MOD-03-T048
- **Scenario:** YAML Extraction: Unsupported tag.
- **Objective:** Verify unsupported tag against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Parse an unresolved !unregistered tag and an unsafe JavaScript-tag spelling without adding custom tag handlers.
- **Expected Result:** Existing yaml unresolved-tag fallback/warning policy is preserved; no source or custom constructor executes.
- **Expected Diagnostics:** No newly fabricated tag-rejection rule; actual parser errors remain controlled if emitted.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T049 — Multiple-document policy

- **Test ID:** MOD-03-T049
- **Scenario:** YAML Extraction: Multiple-document policy.
- **Objective:** Verify multiple-document policy against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** YamlModelParser
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load YAML containing two --- document sections.
- **Expected Result:** FAILURE; if available, the second document content node supplies the diagnostic span.
- **Expected Diagnostics:** MODEL_LOADER_YAML_DOCUMENT_COUNT.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## G. Document Locations

### MOD-03-T050 — Root location

- **Test ID:** MOD-03-T050
- **Scenario:** Document Locations: Root location.
- **Objective:** Verify root location against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: Root location.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated root location condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T051 — Schema-version location

- **Test ID:** MOD-03-T051
- **Scenario:** Document Locations: Schema-version location.
- **Objective:** Verify schema-version location against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: Schema-version location.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated schema-version location condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T052 — Declarations collection

- **Test ID:** MOD-03-T052
- **Scenario:** Document Locations: Declarations collection.
- **Objective:** Verify declarations collection against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: Declarations collection.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated declarations collection condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T053 — First declaration

- **Test ID:** MOD-03-T053
- **Scenario:** Document Locations: First declaration.
- **Objective:** Verify first declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: First declaration.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated first declaration condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T054 — Multiple declarations

- **Test ID:** MOD-03-T054
- **Scenario:** Document Locations: Multiple declarations.
- **Objective:** Verify multiple declarations against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: Multiple declarations.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated multiple declarations condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T055 — Empty declarations

- **Test ID:** MOD-03-T055
- **Scenario:** Document Locations: Empty declarations.
- **Objective:** Verify empty declarations against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load schemaVersion="1.0.0" with valid Mini Sales declarations; also use an empty declarations array. Exercise specifically: Empty declarations.
- **Expected Result:** The actual root, /schemaVersion, /declarations and distinct indexed declaration ranges are available from parser evidence. Verify the stated empty declarations condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## H. Type Locations

### MOD-03-T056 — Semantic identity property

- **Test ID:** MOD-03-T056
- **Scenario:** Type Locations: Semantic identity property.
- **Objective:** Verify semantic identity property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: Semantic identity property.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated semantic identity property condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T057 — QualifiedName

- **Test ID:** MOD-03-T057
- **Scenario:** Type Locations: QualifiedName.
- **Objective:** Verify qualifiedname against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: QualifiedName.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated qualifiedname condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T058 — SemanticVersion

- **Test ID:** MOD-03-T058
- **Scenario:** Type Locations: SemanticVersion.
- **Objective:** Verify semanticversion against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: SemanticVersion.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated semanticversion condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T059 — Context

- **Test ID:** MOD-03-T059
- **Scenario:** Type Locations: Context.
- **Objective:** Verify context against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: Context.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated context condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T060 — Nested DataFacet

- **Test ID:** MOD-03-T060
- **Scenario:** Type Locations: Nested DataFacet.
- **Objective:** Verify nested datafacet against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: Nested DataFacet.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated nested datafacet condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T061 — Multiple type declarations

- **Test ID:** MOD-03-T061
- **Scenario:** Type Locations: Multiple type declarations.
- **Objective:** Verify multiple type declarations against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load Mini Sales Customer/Product/SalesOrder declarations whose definition contains id, qualifiedName, contextRef, kind and version. Exercise specifically: Multiple type declarations.
- **Expected Result:** Lookup follows /declarations/i/definition/... and optional /declarations/i/dataFacet; identities are not generated from positions. Verify the stated multiple type declarations condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## I. Field Locations

### MOD-03-T062 — Field declaration

- **Test ID:** MOD-03-T062
- **Scenario:** Field Locations: Field declaration.
- **Objective:** Verify field declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a valid Customer dataFacet with two fields, each with qualifiedName and valueType, plus a valid authored constraint set. Exercise specifically: Field declaration.
- **Expected Result:** Each actual field/valueType/qualifiedName and constraints node has its own source path; no conceptual name/type path is invented. Verify the stated field declaration condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T063 — Field name

- **Test ID:** MOD-03-T063
- **Scenario:** Field Locations: Field name.
- **Objective:** Verify field name against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect /declarations/0/dataFacet/fields/0/qualifiedName in the actual schema.
- **Expected Result:** The actual qualifiedName range is returned; no nonexistent field name property is fabricated.
- **Expected Diagnostics:** None on valid fixture.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T064 — Field type

- **Test ID:** MOD-03-T064
- **Scenario:** Field Locations: Field type.
- **Objective:** Verify field type against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a valid Customer dataFacet with two fields, each with qualifiedName and valueType, plus a valid authored constraint set. Exercise specifically: Field type.
- **Expected Result:** Each actual field/valueType/qualifiedName and constraints node has its own source path; no conceptual name/type path is invented. Verify the stated field type condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T065 — Constraint declaration

- **Test ID:** MOD-03-T065
- **Scenario:** Field Locations: Constraint declaration.
- **Objective:** Verify constraint declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect /declarations/0/constraints/0/constraints/0 in a valid authored constraint-set fixture.
- **Expected Result:** The actual nested constraint node range is returned independently of semantic resolution.
- **Expected Diagnostics:** None on valid fixture.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T066 — Repeated field names

- **Test ID:** MOD-03-T066
- **Scenario:** Field Locations: Repeated field names.
- **Objective:** Verify repeated field names against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a valid Customer dataFacet with two fields, each with qualifiedName and valueType, plus a valid authored constraint set. Exercise specifically: Repeated field names.
- **Expected Result:** Each actual field/valueType/qualifiedName and constraints node has its own source path; no conceptual name/type path is invented. Verify the stated repeated field names condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T067 — Nested field collection

- **Test ID:** MOD-03-T067
- **Scenario:** Field Locations: Nested field collection.
- **Objective:** Verify nested field collection against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a valid Customer dataFacet with two fields, each with qualifiedName and valueType, plus a valid authored constraint set. Exercise specifically: Nested field collection.
- **Expected Result:** Each actual field/valueType/qualifiedName and constraints node has its own source path; no conceptual name/type path is invented. Verify the stated nested field collection condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## J. Diagnostic Enrichment

### MOD-03-T068 — Invalid property type

- **Test ID:** MOD-03-T068
- **Scenario:** Diagnostic Enrichment: Invalid property type.
- **Objective:** Verify invalid property type against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load {"schemaVersion":17,"declarations":[]}.
- **Expected Result:** Existing schema diagnostic locates /schemaVersion value.
- **Expected Diagnostics:** AUTHORING_INVALID_PROPERTY_TYPE.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T069 — Missing required property

- **Test ID:** MOD-03-T069
- **Scenario:** Diagnostic Enrichment: Missing required property.
- **Objective:** Verify missing required property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load {"schemaVersion":"1.0.0"}, then remove kind or definition from a declaration.
- **Expected Result:** Missing root property uses actual root object; missing declaration property uses actual containing declaration.
- **Expected Diagnostics:** AUTHORING_MISSING_REQUIRED_PROPERTY.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T070 — Unsupported declaration kind

- **Test ID:** MOD-03-T070
- **Scenario:** Diagnostic Enrichment: Unsupported declaration kind.
- **Objective:** Verify unsupported declaration kind against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use kind="event" in a declaration with an otherwise valid definition.
- **Expected Result:** Unsupported kind fails and locates the actual kind value.
- **Expected Diagnostics:** AUTHORING_INVALID_DECLARATION_KIND.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T071 — Unsupported schema version

- **Test ID:** MOD-03-T071
- **Scenario:** Diagnostic Enrichment: Unsupported schema version.
- **Objective:** Verify unsupported schema version against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load {"schemaVersion":"2.0.0","declarations":[]}.
- **Expected Result:** Failure is attached to the actual version value, not an arbitrary root fallback.
- **Expected Diagnostics:** AUTHORING_UNSUPPORTED_SCHEMA_VERSION.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T072 — Parser syntax failure

- **Test ID:** MOD-03-T072
- **Scenario:** Diagnostic Enrichment: Parser syntax failure.
- **Objective:** Verify parser syntax failure against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Mutate one structural property in the valid Mini Sales envelope or remove a required property; retain the original source text. Exercise specifically: Parser syntax failure.
- **Expected Result:** Existing structural codes and structured field/index metadata select verified value or containing-object spans; otherwise positions stay absent. Verify the stated parser syntax failure condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T073 — Verified parent fallback

- **Test ID:** MOD-03-T073
- **Scenario:** Diagnostic Enrichment: Verified parent fallback.
- **Objective:** Verify verified parent fallback against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Mutate one structural property in the valid Mini Sales envelope or remove a required property; retain the original source text. Exercise specifically: Verified parent fallback.
- **Expected Result:** Existing structural codes and structured field/index metadata select verified value or containing-object spans; otherwise positions stay absent. Verify the stated verified parent fallback condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T074 — Unavailable location

- **Test ID:** MOD-03-T074
- **Scenario:** Diagnostic Enrichment: Unavailable location.
- **Objective:** Verify unavailable location against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Mutate one structural property in the valid Mini Sales envelope or remove a required property; retain the original source text. Exercise specifically: Unavailable location.
- **Expected Result:** Existing structural codes and structured field/index metadata select verified value or containing-object spans; otherwise positions stay absent. Verify the stated unavailable location condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T075 — No fabricated coordinates

- **Test ID:** MOD-03-T075
- **Scenario:** Diagnostic Enrichment: No fabricated coordinates.
- **Objective:** Verify no fabricated coordinates against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader diagnostic enrichment
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Mutate one structural property in the valid Mini Sales envelope or remove a required property; retain the original source text. Exercise specifically: No fabricated coordinates.
- **Expected Result:** Existing structural codes and structured field/index metadata select verified value or containing-object spans; otherwise positions stay absent. Verify the stated no fabricated coordinates condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## K. MOD-02 Integration

### MOD-03-T076 — Existing successful load

- **Test ID:** MOD-03-T076
- **Scenario:** MOD-02 Integration: Existing successful load.
- **Objective:** Verify existing successful load against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: Existing successful load.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated existing successful load condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T077 — Existing failure result

- **Test ID:** MOD-03-T077
- **Scenario:** MOD-02 Integration: Existing failure result.
- **Objective:** Verify existing failure result against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: Existing failure result.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated existing failure result condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T078 — Location-aware successful load

- **Test ID:** MOD-03-T078
- **Scenario:** MOD-02 Integration: Location-aware successful load.
- **Objective:** Verify location-aware successful load against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: Location-aware successful load.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated location-aware successful load condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T079 — Location-aware structural failure

- **Test ID:** MOD-03-T079
- **Scenario:** MOD-02 Integration: Location-aware structural failure.
- **Objective:** Verify location-aware structural failure against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: Location-aware structural failure.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated location-aware structural failure condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T080 — Source ID preservation

- **Test ID:** MOD-03-T080
- **Scenario:** MOD-02 Integration: Source ID preservation.
- **Objective:** Verify source id preservation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: Source ID preservation.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated source id preservation condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T081 — No incompatible parser behavior

- **Test ID:** MOD-03-T081
- **Scenario:** MOD-02 Integration: No incompatible parser behavior.
- **Objective:** Verify no incompatible parser behavior against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: No incompatible parser behavior.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated no incompatible parser behavior condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T082 — No duplicate-parsing semantic divergence

- **Test ID:** MOD-03-T082
- **Scenario:** MOD-02 Integration: No duplicate-parsing semantic divergence.
- **Objective:** Verify no duplicate-parsing semantic divergence against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** ModelLoader / ModelDocumentParser / ModelLoadResult
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load equivalent valid/invalid JSON and YAML envelopes through built-ins, then inject a parse-only implementation. Exercise specifically: No duplicate-parsing semantic divergence.
- **Expected Result:** Existing SUCCESS/FAILURE shape is retained; built-in maps are optional result fields and legacy parsers explicitly provide no provenance. Verify the stated no duplicate-parsing semantic divergence condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## L. Parser Evidence

### MOD-03-T083 — Actual parser node range

- **Test ID:** MOD-03-T083
- **Scenario:** Parser Evidence: Actual parser node range.
- **Objective:** Verify actual parser node range against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: Actual parser node range.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated actual parser node range condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T084 — Actual parser error position

- **Test ID:** MOD-03-T084
- **Scenario:** Parser Evidence: Actual parser error position.
- **Objective:** Verify actual parser error position against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: Actual parser error position.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated actual parser error position condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T085 — No regex guessing

- **Test ID:** MOD-03-T085
- **Scenario:** Parser Evidence: No regex guessing.
- **Objective:** Verify no regex guessing against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: No regex guessing.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated no regex guessing condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T086 — No text-search guessing

- **Test ID:** MOD-03-T086
- **Scenario:** Parser Evidence: No text-search guessing.
- **Objective:** Verify no text-search guessing against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: No text-search guessing.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated no text-search guessing condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T087 — Repeated identical tokens

- **Test ID:** MOD-03-T087
- **Scenario:** Parser Evidence: Repeated identical tokens.
- **Objective:** Verify repeated identical tokens against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: Repeated identical tokens.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated repeated identical tokens condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T088 — No fabricated spans

- **Test ID:** MOD-03-T088
- **Scenario:** Parser Evidence: No fabricated spans.
- **Objective:** Verify no fabricated spans against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** JSON/YAML parser evidence
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use repeated identical literals at different structural paths and inspect the parser offsets rather than searching their spellings. Exercise specifically: No fabricated spans.
- **Expected Result:** Every available entry corresponds to an actual parser node/error range; no regex matching of authored source creates coordinates. Verify the stated no fabricated spans condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## M. Duplicate Properties

### MOD-03-T089 — Duplicate JSON property

- **Test ID:** MOD-03-T089
- **Scenario:** Duplicate Properties: Duplicate JSON property.
- **Objective:** Verify duplicate json property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Duplicate-key policy
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use duplicate schemaVersion and nested definition keys in JSON, including identical values.
- **Expected Result:** Native last value wins; duplicate path and descendants are unavailable and listed as ambiguous.
- **Expected Diagnostics:** MODEL_SOURCE_DUPLICATE_KEY warning at duplicate key token; other MOD-01 diagnostics only if resulting data is invalid.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T090 — Duplicate YAML key

- **Test ID:** MOD-03-T090
- **Scenario:** Duplicate Properties: Duplicate YAML key.
- **Objective:** Verify duplicate yaml key against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Duplicate-key policy
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON fixture {"schemaVersion":"0.0.0","schemaVersion":"1.0.0","declarations":[]}; YAML fixture a: 1 followed by a: 2. Exercise specifically: Duplicate YAML key.
- **Expected Result:** JSON retains native last-value-wins data, warns at the duplicate token, and makes that subtree ambiguous. YAML duplicate keys fail before a successful map. Verify the stated duplicate yaml key condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T091 — Source-level rejection

- **Test ID:** MOD-03-T091
- **Scenario:** Duplicate Properties: Source-level rejection.
- **Objective:** Verify source-level rejection against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Duplicate-key policy
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load duplicate YAML keys; compare native-accepted duplicate JSON keys separately.
- **Expected Result:** YAML is rejected; JSON is not newly rejected solely for duplicates and receives explicit ambiguity metadata.
- **Expected Diagnostics:** YAML syntax error versus bounded JSON duplicate warning.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T092 — Verified error location where supported

- **Test ID:** MOD-03-T092
- **Scenario:** Duplicate Properties: Verified error location where supported.
- **Objective:** Verify verified error location where supported against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Duplicate-key policy
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON fixture {"schemaVersion":"0.0.0","schemaVersion":"1.0.0","declarations":[]}; YAML fixture a: 1 followed by a: 2. Exercise specifically: Verified error location where supported.
- **Expected Result:** JSON retains native last-value-wins data, warns at the duplicate token, and makes that subtree ambiguous. YAML duplicate keys fail before a successful map. Verify the stated verified error location where supported condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T093 — No silent location overwrite

- **Test ID:** MOD-03-T093
- **Scenario:** Duplicate Properties: No silent location overwrite.
- **Objective:** Verify no silent location overwrite against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Duplicate-key policy
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** JSON fixture {"schemaVersion":"0.0.0","schemaVersion":"1.0.0","declarations":[]}; YAML fixture a: 1 followed by a: 2. Exercise specifically: No silent location overwrite.
- **Expected Result:** JSON retains native last-value-wins data, warns at the duplicate token, and makes that subtree ambiguous. YAML duplicate keys fail before a successful map. Verify the stated no silent location overwrite condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## N. Missing Locations

### MOD-03-T094 — Unknown path

- **Test ID:** MOD-03-T094
- **Scenario:** Missing Locations: Unknown path.
- **Objective:** Verify unknown path against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Query /does-not-exist on a valid published map.
- **Expected Result:** Lookup returns undefined; it does not substitute the root or another document.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T095 — Optional location absent

- **Test ID:** MOD-03-T095
- **Scenario:** Missing Locations: Optional location absent.
- **Objective:** Verify optional location absent against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Query /not-present, alias-expanded child paths and deliberately unavailable structured error endpoints. Exercise specifically: Optional location absent.
- **Expected Result:** Unknown/unavailable/ambiguous origins return undefined or remain unlocated; a valid start-only error stays a point and never receives an invented end. Verify the stated optional location absent condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T096 — Missing source position

- **Test ID:** MOD-03-T096
- **Scenario:** Missing Locations: Missing source position.
- **Objective:** Verify missing source position against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Query /not-present, alias-expanded child paths and deliberately unavailable structured error endpoints. Exercise specifically: Missing source position.
- **Expected Result:** Unknown/unavailable/ambiguous origins return undefined or remain unlocated; a valid start-only error stays a point and never receives an invented end. Verify the stated missing source position condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T097 — Partial range

- **Test ID:** MOD-03-T097
- **Scenario:** Missing Locations: Partial range.
- **Objective:** Verify partial range against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use genuine structured parser start with an unavailable/out-of-bounds end.
- **Expected Result:** Only the valid start is emitted; no reversed or clipped synthetic end is claimed.
- **Expected Diagnostics:** Underlying controlled syntax error.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T098 — No fake root fallback

- **Test ID:** MOD-03-T098
- **Scenario:** Missing Locations: No fake root fallback.
- **Objective:** Verify no fake root fallback against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Query /not-present, alias-expanded child paths and deliberately unavailable structured error endpoints. Exercise specifically: No fake root fallback.
- **Expected Result:** Unknown/unavailable/ambiguous origins return undefined or remain unlocated; a valid start-only error stays a point and never receives an invented end. Verify the stated no fake root fallback condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T099 — No fabricated offset zero

- **Test ID:** MOD-03-T099
- **Scenario:** Missing Locations: No fabricated offset zero.
- **Objective:** Verify no fabricated offset zero against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourceLocationMap / SourceCoordinateIndex
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Query /not-present, alias-expanded child paths and deliberately unavailable structured error endpoints. Exercise specifically: No fabricated offset zero.
- **Expected Result:** Unknown/unavailable/ambiguous origins return undefined or remain unlocated; a valid start-only error stays a point and never receives an invented end. Verify the stated no fabricated offset zero condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## O. Immutability

### MOD-03-T100 — Readonly map contract

- **Test ID:** MOD-03-T100
- **Scenario:** Immutability: Readonly map contract.
- **Objective:** Verify readonly map contract against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / immutable published map
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Attempt to mutate caller segment arrays, returned entries, positions, path segments and ambiguity collections after extraction. Exercise specifically: Readonly map contract.
- **Expected Result:** Published metadata is frozen and defensively isolated; no writable internal Map or AST is exposed. Raw parsed values retain their pre-existing untrusted contract. Verify the stated readonly map contract condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T101 — Private internal indexes

- **Test ID:** MOD-03-T101
- **Scenario:** Immutability: Private internal indexes.
- **Objective:** Verify private internal indexes against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / immutable published map
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Attempt to mutate caller segment arrays, returned entries, positions, path segments and ambiguity collections after extraction. Exercise specifically: Private internal indexes.
- **Expected Result:** Published metadata is frozen and defensively isolated; no writable internal Map or AST is exposed. Raw parsed values retain their pre-existing untrusted contract. Verify the stated private internal indexes condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T102 — No input mutation

- **Test ID:** MOD-03-T102
- **Scenario:** Immutability: No input mutation.
- **Objective:** Verify no input mutation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / immutable published map
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Attempt to mutate caller segment arrays, returned entries, positions, path segments and ambiguity collections after extraction. Exercise specifically: No input mutation.
- **Expected Result:** Published metadata is frozen and defensively isolated; no writable internal Map or AST is exposed. Raw parsed values retain their pre-existing untrusted contract. Verify the stated no input mutation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T103 — No returned collection mutation

- **Test ID:** MOD-03-T103
- **Scenario:** Immutability: No returned collection mutation.
- **Objective:** Verify no returned collection mutation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / immutable published map
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Attempt to mutate caller segment arrays, returned entries, positions, path segments and ambiguity collections after extraction. Exercise specifically: No returned collection mutation.
- **Expected Result:** Published metadata is frozen and defensively isolated; no writable internal Map or AST is exposed. Raw parsed values retain their pre-existing untrusted contract. Verify the stated no returned collection mutation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T104 — No global mutable state

- **Test ID:** MOD-03-T104
- **Scenario:** Immutability: No global mutable state.
- **Objective:** Verify no global mutable state against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** SourcePath / immutable published map
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Attempt to mutate caller segment arrays, returned entries, positions, path segments and ambiguity collections after extraction. Exercise specifically: No global mutable state.
- **Expected Result:** Published metadata is frozen and defensively isolated; no writable internal Map or AST is exposed. Raw parsed values retain their pre-existing untrusted contract. Verify the stated no global mutable state condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## P. Determinism

### MOD-03-T105 — Same source

- **Test ID:** MOD-03-T105
- **Scenario:** Determinism: Same source.
- **Objective:** Verify same source against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: Same source.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated same source condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T106 — Same parser options

- **Test ID:** MOD-03-T106
- **Scenario:** Determinism: Same parser options.
- **Objective:** Verify same parser options against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: Same parser options.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated same parser options condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T107 — Same source ID

- **Test ID:** MOD-03-T107
- **Scenario:** Determinism: Same source ID.
- **Objective:** Verify same source id against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: Same source ID.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated same source id condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T108 — Equivalent mapping

- **Test ID:** MOD-03-T108
- **Scenario:** Determinism: Equivalent mapping.
- **Objective:** Verify equivalent mapping against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: Equivalent mapping.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated equivalent mapping condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T109 — Stable diagnostic locations

- **Test ID:** MOD-03-T109
- **Scenario:** Determinism: Stable diagnostic locations.
- **Objective:** Verify stable diagnostic locations against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: Stable diagnostic locations.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated stable diagnostic locations condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T110 — No time or randomness dependence

- **Test ID:** MOD-03-T110
- **Scenario:** Determinism: No time or randomness dependence.
- **Objective:** Verify no time or randomness dependence against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Deterministic extraction
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract the identical source, parser settings and optional ID repeatedly; compare serialized entry content and entry order. Exercise specifically: No time or randomness dependence.
- **Expected Result:** Equivalent metadata and diagnostic locations result without clock, random, user, environment, network or database inputs. Verify the stated no time or randomness dependence condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## Q. Performance

### MOD-03-T111 — Large declaration collection

- **Test ID:** MOD-03-T111
- **Scenario:** Performance: Large declaration collection.
- **Objective:** Verify large declaration collection against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser resource bounds
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sources near the length/depth/node/pointer budgets, large collections within bounds, and explicit over-limit variants. Exercise specifically: Large declaration collection.
- **Expected Result:** Construction uses bounded iterative walks and a temporary linear coordinate table; excess input has controlled failure rather than silent truncation. Verify the stated large declaration collection condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T112 — Deeply nested document within supported limits

- **Test ID:** MOD-03-T112
- **Scenario:** Performance: Deeply nested document within supported limits.
- **Objective:** Verify deeply nested document within supported limits against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser resource bounds
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sources near the length/depth/node/pointer budgets, large collections within bounds, and explicit over-limit variants. Exercise specifically: Deeply nested document within supported limits.
- **Expected Result:** Construction uses bounded iterative walks and a temporary linear coordinate table; excess input has controlled failure rather than silent truncation. Verify the stated deeply nested document within supported limits condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T113 — Efficient path lookup

- **Test ID:** MOD-03-T113
- **Scenario:** Performance: Efficient path lookup.
- **Objective:** Verify efficient path lookup against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser resource bounds
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sources near the length/depth/node/pointer budgets, large collections within bounds, and explicit over-limit variants. Exercise specifically: Efficient path lookup.
- **Expected Result:** Construction uses bounded iterative walks and a temporary linear coordinate table; excess input has controlled failure rather than silent truncation. Verify the stated efficient path lookup condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T114 — No repeated full-text scans

- **Test ID:** MOD-03-T114
- **Scenario:** Performance: No repeated full-text scans.
- **Objective:** Verify no repeated full-text scans against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser resource bounds
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sources near the length/depth/node/pointer budgets, large collections within bounds, and explicit over-limit variants. Exercise specifically: No repeated full-text scans.
- **Expected Result:** Construction uses bounded iterative walks and a temporary linear coordinate table; excess input has controlled failure rather than silent truncation. Verify the stated no repeated full-text scans condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T115 — No excessive AST retention

- **Test ID:** MOD-03-T115
- **Scenario:** Performance: No excessive AST retention.
- **Objective:** Verify no excessive ast retention against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser resource bounds
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sources near the length/depth/node/pointer budgets, large collections within bounds, and explicit over-limit variants. Exercise specifically: No excessive AST retention.
- **Expected Result:** Construction uses bounded iterative walks and a temporary linear coordinate table; excess input has controlled failure rather than silent truncation. Verify the stated no excessive ast retention condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## R. Security

### MOD-03-T116 — Unsafe YAML tags

- **Test ID:** MOD-03-T116
- **Scenario:** Security: Unsafe YAML tags.
- **Objective:** Verify unsafe yaml tags against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use **proto**/constructor keys, unsafe tag spellings, aliases, oversized source and invalid sourceId types; inspect returned diagnostics and side effects. Exercise specifically: Unsafe YAML tags.
- **Expected Result:** Input is never executed or fetched; prototypes and alias policies are preserved, maps stay finite, and new parser failures do not echo source snippets. Verify the stated unsafe yaml tags condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T117 — Recursive aliases

- **Test ID:** MOD-03-T117
- **Scenario:** Security: Recursive aliases.
- **Objective:** Verify recursive aliases against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use an anchored collection containing alias references back to itself and repeated alias expansions.
- **Expected Result:** Tracking visits source nodes only and remains finite; existing yaml conversion/alias limits decide value acceptance without invented child spans.
- **Expected Diagnostics:** MODEL_LOADER_YAML_VALUE_ERROR on conversion/alias-limit failure, otherwise only existing structural diagnostics.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T118 — Prototype pollution

- **Test ID:** MOD-03-T118
- **Scenario:** Security: Prototype pollution.
- **Objective:** Verify prototype pollution against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use **proto**/constructor keys, unsafe tag spellings, aliases, oversized source and invalid sourceId types; inspect returned diagnostics and side effects. Exercise specifically: Prototype pollution.
- **Expected Result:** Input is never executed or fetched; prototypes and alias policies are preserved, maps stay finite, and new parser failures do not echo source snippets. Verify the stated prototype pollution condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T119 — Sensitive source snippets

- **Test ID:** MOD-03-T119
- **Scenario:** Security: Sensitive source snippets.
- **Objective:** Verify sensitive source snippets against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use **proto**/constructor keys, unsafe tag spellings, aliases, oversized source and invalid sourceId types; inspect returned diagnostics and side effects. Exercise specifically: Sensitive source snippets.
- **Expected Result:** Input is never executed or fetched; prototypes and alias policies are preserved, maps stay finite, and new parser failures do not echo source snippets. Verify the stated sensitive source snippets condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T120 — Invalid source identifiers

- **Test ID:** MOD-03-T120
- **Scenario:** Security: Invalid source identifiers.
- **Objective:** Verify invalid source identifiers against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use sourceId=7/null/object at runtime, then valid empty/logical strings.
- **Expected Result:** Non-string IDs are rejected; accepted strings are preserved as opaque values, including the existing empty-string contract.
- **Expected Diagnostics:** MODEL_LOADER_INVALID_REQUEST for invalid request source IDs.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T121 — Resource exhaustion safeguards

- **Test ID:** MOD-03-T121
- **Scenario:** Security: Resource exhaustion safeguards.
- **Objective:** Verify resource exhaustion safeguards against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use **proto**/constructor keys, unsafe tag spellings, aliases, oversized source and invalid sourceId types; inspect returned diagnostics and side effects. Exercise specifically: Resource exhaustion safeguards.
- **Expected Result:** Input is never executed or fetched; prototypes and alias policies are preserved, maps stay finite, and new parser failures do not echo source snippets. Verify the stated resource exhaustion safeguards condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T122 — No source code execution

- **Test ID:** MOD-03-T122
- **Scenario:** Security: No source code execution.
- **Objective:** Verify no source code execution against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Parser safety / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use **proto**/constructor keys, unsafe tag spellings, aliases, oversized source and invalid sourceId types; inspect returned diagnostics and side effects. Exercise specifically: No source code execution.
- **Expected Result:** Input is never executed or fetched; prototypes and alias policies are preserved, maps stay finite, and new parser failures do not echo source snippets. Verify the stated no source code execution condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## S. Semantic Identity Boundary

### MOD-03-T123 — Location changes without identity changes

- **Test ID:** MOD-03-T123
- **Scenario:** Semantic Identity Boundary: Location changes without identity changes.
- **Objective:** Verify location changes without identity changes against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Semantic identity boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Move unchanged declaration text to different lines and compare exact semantic IDs/versions with source entries. Exercise specifically: Location changes without identity changes.
- **Expected Result:** Only source coordinates change; no ID, name, registry key, tenant or context is inferred from position. Verify the stated location changes without identity changes condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T124 — Same name in different positions

- **Test ID:** MOD-03-T124
- **Scenario:** Semantic Identity Boundary: Same name in different positions.
- **Objective:** Verify same name in different positions against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Semantic identity boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Move unchanged declaration text to different lines and compare exact semantic IDs/versions with source entries. Exercise specifically: Same name in different positions.
- **Expected Result:** Only source coordinates change; no ID, name, registry key, tenant or context is inferred from position. Verify the stated same name in different positions condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T125 — Same ID in separate documents

- **Test ID:** MOD-03-T125
- **Scenario:** Semantic Identity Boundary: Same ID in separate documents.
- **Objective:** Verify same id in separate documents against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Semantic identity boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Move unchanged declaration text to different lines and compare exact semantic IDs/versions with source entries. Exercise specifically: Same ID in separate documents.
- **Expected Result:** Only source coordinates change; no ID, name, registry key, tenant or context is inferred from position. Verify the stated same id in separate documents condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T126 — No identity generation from offsets

- **Test ID:** MOD-03-T126
- **Scenario:** Semantic Identity Boundary: No identity generation from offsets.
- **Objective:** Verify no identity generation from offsets against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Semantic identity boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Move unchanged declaration text to different lines and compare exact semantic IDs/versions with source entries. Exercise specifically: No identity generation from offsets.
- **Expected Result:** Only source coordinates change; no ID, name, registry key, tenant or context is inferred from position. Verify the stated no identity generation from offsets condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T127 — No registry-key contamination

- **Test ID:** MOD-03-T127
- **Scenario:** Semantic Identity Boundary: No registry-key contamination.
- **Objective:** Verify no registry-key contamination against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Semantic identity boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Move unchanged declaration text to different lines and compare exact semantic IDs/versions with source entries. Exercise specifically: No registry-key contamination.
- **Expected Result:** Only source coordinates change; no ID, name, registry key, tenant or context is inferred from position. Verify the stated no registry-key contamination condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## T. Canonicalization Boundary

### MOD-03-T128 — No CanonicalModel

- **Test ID:** MOD-03-T128
- **Scenario:** Canonicalization Boundary: No CanonicalModel.
- **Objective:** Verify no canonicalmodel against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Model Core architecture boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect the MOD-03 source imports, exports and load result while loading the valid authoring envelope. Exercise specifically: No CanonicalModel.
- **Expected Result:** No CanonicalModel, normalizer, resolver, semantic dependency graph or IR is constructed. Verify the stated no canonicalmodel condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T129 — No normalization

- **Test ID:** MOD-03-T129
- **Scenario:** Canonicalization Boundary: No normalization.
- **Objective:** Verify no normalization against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Model Core architecture boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect the MOD-03 source imports, exports and load result while loading the valid authoring envelope. Exercise specifically: No normalization.
- **Expected Result:** No CanonicalModel, normalizer, resolver, semantic dependency graph or IR is constructed. Verify the stated no normalization condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T130 — No reference resolution

- **Test ID:** MOD-03-T130
- **Scenario:** Canonicalization Boundary: No reference resolution.
- **Objective:** Verify no reference resolution against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Model Core architecture boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect the MOD-03 source imports, exports and load result while loading the valid authoring envelope. Exercise specifically: No reference resolution.
- **Expected Result:** No CanonicalModel, normalizer, resolver, semantic dependency graph or IR is constructed. Verify the stated no reference resolution condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T131 — No semantic graph construction

- **Test ID:** MOD-03-T131
- **Scenario:** Canonicalization Boundary: No semantic graph construction.
- **Objective:** Verify no semantic graph construction against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Model Core architecture boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect the MOD-03 source imports, exports and load result while loading the valid authoring envelope. Exercise specifically: No semantic graph construction.
- **Expected Result:** No CanonicalModel, normalizer, resolver, semantic dependency graph or IR is constructed. Verify the stated no semantic graph construction condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T132 — No Semantic IR

- **Test ID:** MOD-03-T132
- **Scenario:** Canonicalization Boundary: No Semantic IR.
- **Objective:** Verify no semantic ir against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Model Core architecture boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect the MOD-03 source imports, exports and load result while loading the valid authoring envelope. Exercise specifically: No Semantic IR.
- **Expected Result:** No CanonicalModel, normalizer, resolver, semantic dependency graph or IR is constructed. Verify the stated no semantic ir condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## U. Runtime Provenance Boundary

### MOD-03-T133 — No traceId generation

- **Test ID:** MOD-03-T133
- **Scenario:** Runtime Provenance Boundary: No traceId generation.
- **Objective:** Verify no traceid generation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Source/runtime provenance boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect published entries/results and production imports for trace/correlation/event execution metadata. Exercise specifically: No traceId generation.
- **Expected Result:** Only source provenance is retained; no runtime actor, trace IDs, event history, artifact version or telemetry subsystem is introduced. Verify the stated no traceid generation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T134 — No correlationId generation

- **Test ID:** MOD-03-T134
- **Scenario:** Runtime Provenance Boundary: No correlationId generation.
- **Objective:** Verify no correlationid generation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Source/runtime provenance boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect published entries/results and production imports for trace/correlation/event execution metadata. Exercise specifically: No correlationId generation.
- **Expected Result:** Only source provenance is retained; no runtime actor, trace IDs, event history, artifact version or telemetry subsystem is introduced. Verify the stated no correlationid generation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T135 — No Event provenance

- **Test ID:** MOD-03-T135
- **Scenario:** Runtime Provenance Boundary: No Event provenance.
- **Objective:** Verify no event provenance against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Source/runtime provenance boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect published entries/results and production imports for trace/correlation/event execution metadata. Exercise specifically: No Event provenance.
- **Expected Result:** Only source provenance is retained; no runtime actor, trace IDs, event history, artifact version or telemetry subsystem is introduced. Verify the stated no event provenance condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T136 — No runtime execution metadata

- **Test ID:** MOD-03-T136
- **Scenario:** Runtime Provenance Boundary: No runtime execution metadata.
- **Objective:** Verify no runtime execution metadata against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Source/runtime provenance boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect published entries/results and production imports for trace/correlation/event execution metadata. Exercise specifically: No runtime execution metadata.
- **Expected Result:** Only source provenance is retained; no runtime actor, trace IDs, event history, artifact version or telemetry subsystem is introduced. Verify the stated no runtime execution metadata condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T137 — No OpenTelemetry dependency

- **Test ID:** MOD-03-T137
- **Scenario:** Runtime Provenance Boundary: No OpenTelemetry dependency.
- **Objective:** Verify no opentelemetry dependency against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Source/runtime provenance boundary
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect published entries/results and production imports for trace/correlation/event execution metadata. Exercise specifically: No OpenTelemetry dependency.
- **Expected Result:** Only source provenance is retained; no runtime actor, trace IDs, event history, artifact version or telemetry subsystem is introduced. Verify the stated no opentelemetry dependency condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## V. Framework Independence

### MOD-03-T138 — No NestJS

- **Test ID:** MOD-03-T138
- **Scenario:** Framework Independence: No NestJS.
- **Objective:** Verify no nestjs against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: No NestJS.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated no nestjs condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T139 — No Angular

- **Test ID:** MOD-03-T139
- **Scenario:** Framework Independence: No Angular.
- **Objective:** Verify no angular against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: No Angular.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated no angular condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T140 — No PrimeNG

- **Test ID:** MOD-03-T140
- **Scenario:** Framework Independence: No PrimeNG.
- **Objective:** Verify no primeng against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: No PrimeNG.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated no primeng condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T141 — No ORM

- **Test ID:** MOD-03-T141
- **Scenario:** Framework Independence: No ORM.
- **Objective:** Verify no orm against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: No ORM.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated no orm condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T142 — No Node.js-only APIs

- **Test ID:** MOD-03-T142
- **Scenario:** Framework Independence: No Node.js-only APIs.
- **Objective:** Verify no node.js-only apis against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: No Node.js-only APIs.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated no node.js-only apis condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T143 — Browser-safe parser usage

- **Test ID:** MOD-03-T143
- **Scenario:** Framework Independence: Browser-safe parser usage.
- **Objective:** Verify browser-safe parser usage against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Universal Model Core
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inspect production dependency/import declarations and compile for the repository universal target. Exercise specifically: Browser-safe parser usage.
- **Expected Result:** Only public Kernel contracts, existing yaml and declared jsonc-parser are used; no Node-only/framework/database implementation import appears. Verify the stated browser-safe parser usage condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## W. Public API

### MOD-03-T144 — Approved package exports

- **Test ID:** MOD-03-T144
- **Scenario:** Public API: Approved package exports.
- **Objective:** Verify approved package exports against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Public Model Core API
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Import SourcePath, SourceLocationMap types, ModelLoadResult, ModelLoader, JsonModelParser and YamlModelParser from @ecosystem/model-core. Exercise specifically: Approved package exports.
- **Expected Result:** The restored root/subsystem exports expose coherent contracts without private deep imports, circular barrels or parser AST types. Verify the stated approved package exports condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T145 — No private deep imports

- **Test ID:** MOD-03-T145
- **Scenario:** Public API: No private deep imports.
- **Objective:** Verify no private deep imports against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Public Model Core API
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Import SourcePath, SourceLocationMap types, ModelLoadResult, ModelLoader, JsonModelParser and YamlModelParser from @ecosystem/model-core. Exercise specifically: No private deep imports.
- **Expected Result:** The restored root/subsystem exports expose coherent contracts without private deep imports, circular barrels or parser AST types. Verify the stated no private deep imports condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T146 — No circular barrels

- **Test ID:** MOD-03-T146
- **Scenario:** Public API: No circular barrels.
- **Objective:** Verify no circular barrels against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Public Model Core API
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Import SourcePath, SourceLocationMap types, ModelLoadResult, ModelLoader, JsonModelParser and YamlModelParser from @ecosystem/model-core. Exercise specifically: No circular barrels.
- **Expected Result:** The restored root/subsystem exports expose coherent contracts without private deep imports, circular barrels or parser AST types. Verify the stated no circular barrels condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T147 — No parser AST leakage

- **Test ID:** MOD-03-T147
- **Scenario:** Public API: No parser AST leakage.
- **Objective:** Verify no parser ast leakage against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Public Model Core API
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Import SourcePath, SourceLocationMap types, ModelLoadResult, ModelLoader, JsonModelParser and YamlModelParser from @ecosystem/model-core. Exercise specifically: No parser AST leakage.
- **Expected Result:** The restored root/subsystem exports expose coherent contracts without private deep imports, circular barrels or parser AST types. Verify the stated no parser ast leakage condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T148 — Existing exports preserved

- **Test ID:** MOD-03-T148
- **Scenario:** Public API: Existing exports preserved.
- **Objective:** Verify existing exports preserved against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Public Model Core API
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Import SourcePath, SourceLocationMap types, ModelLoadResult, ModelLoader, JsonModelParser and YamlModelParser from @ecosystem/model-core. Exercise specifically: Existing exports preserved.
- **Expected Result:** The restored root/subsystem exports expose coherent contracts without private deep imports, circular barrels or parser AST types. Verify the stated existing exports preserved condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## X. Mini Sales

### MOD-03-T149 — Customer root declaration

- **Test ID:** MOD-03-T149
- **Scenario:** Mini Sales: Customer root declaration.
- **Objective:** Verify customer root declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: Customer root declaration.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated customer root declaration condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T150 — Product declaration

- **Test ID:** MOD-03-T150
- **Scenario:** Mini Sales: Product declaration.
- **Objective:** Verify product declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: Product declaration.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated product declaration condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T151 — SalesOrder declaration

- **Test ID:** MOD-03-T151
- **Scenario:** Mini Sales: SalesOrder declaration.
- **Objective:** Verify salesorder declaration against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: SalesOrder declaration.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated salesorder declaration condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T152 — Multiple fields

- **Test ID:** MOD-03-T152
- **Scenario:** Mini Sales: Multiple fields.
- **Objective:** Verify multiple fields against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: Multiple fields.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated multiple fields condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T153 — Repeated field names

- **Test ID:** MOD-03-T153
- **Scenario:** Mini Sales: Repeated field names.
- **Objective:** Verify repeated field names against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: Repeated field names.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated repeated field names condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T154 — Invalid field property

- **Test ID:** MOD-03-T154
- **Scenario:** Mini Sales: Invalid field property.
- **Objective:** Verify invalid field property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Change one nested field valueType to an invalid existing TYPE-02 shape in Mini Sales.
- **Expected Result:** MOD-01 fails; its current coarse factory field=dataFacet yields the actual facet span rather than a guessed inner token.
- **Expected Diagnostics:** AUTHORING_INVALID_DECLARATION; no invalid document succeeds.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T155 — Missing required property

- **Test ID:** MOD-03-T155
- **Scenario:** Mini Sales: Missing required property.
- **Objective:** Verify missing required property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Load {"schemaVersion":"1.0.0"}, then remove kind or definition from a declaration.
- **Expected Result:** Missing root property uses actual root object; missing declaration property uses actual containing declaration.
- **Expected Diagnostics:** AUTHORING_MISSING_REQUIRED_PROPERTY.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T156 — JSON and YAML source locations

- **Test ID:** MOD-03-T156
- **Scenario:** Mini Sales: JSON and YAML source locations.
- **Objective:** Verify json and yaml source locations against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Mini Sales / ModelLoader
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use the actual-schema Customer YAML example in docs/architecture/source-location-tracking.md; add valid Product/SalesOrder and a second field with matching ownership. Exercise specifically: JSON and YAML source locations.
- **Expected Result:** Actual declaration/field/property paths are independent in each source format; structural failures never publish an invalid document. Verify the stated json and yaml source locations condition independently.
- **Expected Diagnostics:** Only the applicable existing parser/authoring diagnostic; no invented location or source snippet.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## Y. Architecture Preservation

### MOD-03-T157 — ARC-02 dependency direction

- **Test ID:** MOD-03-T157
- **Scenario:** Architecture Preservation: ARC-02 dependency direction.
- **Objective:** Verify arc-02 dependency direction against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: ARC-02 dependency direction.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated arc-02 dependency direction condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T158 — SK-11 contract reuse

- **Test ID:** MOD-03-T158
- **Scenario:** Architecture Preservation: SK-11 contract reuse.
- **Objective:** Verify sk-11 contract reuse against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: SK-11 contract reuse.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated sk-11 contract reuse condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T159 — MOD-01 preservation

- **Test ID:** MOD-03-T159
- **Scenario:** Architecture Preservation: MOD-01 preservation.
- **Objective:** Verify mod-01 preservation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: MOD-01 preservation.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated mod-01 preservation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T160 — MOD-02 compatibility

- **Test ID:** MOD-03-T160
- **Scenario:** Architecture Preservation: MOD-02 compatibility.
- **Objective:** Verify mod-02 compatibility against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: MOD-02 compatibility.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated mod-02 compatibility condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T161 — Model Core isolation

- **Test ID:** MOD-03-T161
- **Scenario:** Architecture Preservation: Model Core isolation.
- **Objective:** Verify model core isolation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: Model Core isolation.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated model core isolation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T162 — No Compiler or Runtime coupling

- **Test ID:** MOD-03-T162
- **Scenario:** Architecture Preservation: No Compiler or Runtime coupling.
- **Objective:** Verify no compiler or runtime coupling against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: No Compiler or Runtime coupling.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated no compiler or runtime coupling condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T163 — No MOD-04 implementation

- **Test ID:** MOD-03-T163
- **Scenario:** Architecture Preservation: No MOD-04 implementation.
- **Objective:** Verify no mod-04 implementation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** Architecture preservation
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review diffs, Nx tags/graph, unchanged Kernel/schema/harness files, source imports and prior test archives. Exercise specifically: No MOD-04 implementation.
- **Expected Result:** MOD-03 remains Model Core -> Kernel, preserves MOD-01 rules and parser value policies, and does not advance to MOD-04. Verify the stated no mod-04 implementation condition independently.
- **Expected Diagnostics:** No new source diagnostic for a valid supported fixture; invalid cases retain the documented controlled owner diagnostic.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## Z. Additional Contract and Resource Edges

### MOD-03-T164 — Numeric property versus numeric index

- **Test ID:** MOD-03-T164
- **Scenario:** Additional Contract and Resource Edges: Numeric property versus numeric index.
- **Objective:** Verify numeric property versus numeric index against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Compare SourcePath(["0"]) with SourcePath([0]); use maps from {"0":1} and [1].
- **Expected Result:** Typed equality/lookups distinguish segment kinds even when rendered pointers both spell /0.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T165 — Sparse path segment input

- **Test ID:** MOD-03-T165
- **Scenario:** Additional Contract and Resource Edges: Sparse path segment input.
- **Objective:** Verify sparse path segment input against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Pass a sparse array as SourcePath segments.
- **Expected Result:** Invalid undefined holes are rejected; no shorter misleading pointer is created.
- **Expected Diagnostics:** TypeError.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T166 — Pointer length budget

- **Test ID:** MOD-03-T166
- **Scenario:** Additional Contract and Resource Edges: Pointer length budget.
- **Objective:** Verify pointer length budget against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Create path spelling at 4096 units, then at 4097.
- **Expected Result:** Supported boundary is retained; excess spelling fails explicitly.
- **Expected Diagnostics:** RangeError for excess length.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T167 — Aggregate pointer budget

- **Test ID:** MOD-03-T167
- **Scenario:** Additional Contract and Resource Edges: Aggregate pointer budget.
- **Objective:** Verify aggregate pointer budget against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a long shared property prefix with many children so attempted rendered paths exceed 8,000,000 units.
- **Expected Result:** Mapping fails within the documented metadata budget; no partial successful document.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T168 — Source length boundary

- **Test ID:** MOD-03-T168
- **Scenario:** Additional Contract and Resource Edges: Source length boundary.
- **Objective:** Verify source length boundary against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Provide documents at 2,000,000 and 2,000,001 UTF-16 units with otherwise acceptable syntax.
- **Expected Result:** The supported bound is considered normally; excess length fails before trimming/scanning.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT for excess length.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T169 — JSON container depth bound

- **Test ID:** MOD-03-T169
- **Scenario:** Additional Contract and Resource Edges: JSON container depth bound.
- **Objective:** Verify json container depth bound against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use valid nested JSON at the 128-container limit and an additional container.
- **Expected Result:** The extra container fails before tree construction; no uncontrolled recursive mapping.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T170 — YAML walk depth bound

- **Test ID:** MOD-03-T170
- **Scenario:** Additional Contract and Resource Edges: YAML walk depth bound.
- **Objective:** Verify yaml walk depth bound against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use nested YAML nodes within depth 128 (root zero), then exceed it.
- **Expected Result:** Iterative tracking enforces the documented depth/path bounds.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT for excess depth.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T171 — JSON token budget

- **Test ID:** MOD-03-T171
- **Scenario:** Additional Contract and Resource Edges: JSON token budget.
- **Objective:** Verify json token budget against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Provide more than 400,000 scanner tokens before AST extraction.
- **Expected Result:** Preflight stops with controlled resource failure.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T172 — Map node budget

- **Test ID:** MOD-03-T172
- **Scenario:** Additional Contract and Resource Edges: Map node budget.
- **Objective:** Verify map node budget against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use more than 100,000 value/node or entry attempts.
- **Expected Result:** No successful over-budget map is published.
- **Expected Diagnostics:** MODEL_LOADER_RESOURCE_LIMIT.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T173 — Bounded duplicate warnings

- **Test ID:** MOD-03-T173
- **Scenario:** Additional Contract and Resource Edges: Bounded duplicate warnings.
- **Objective:** Verify bounded duplicate warnings against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use more than 128 duplicate JSON key occurrences in a supported-size source.
- **Expected Result:** At most 128 warning diagnostics are emitted; ambiguity handling continues for all tracked duplicates.
- **Expected Diagnostics:** Bounded MODEL_SOURCE_DUPLICATE_KEY warnings.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T174 — Bounded load diagnostics

- **Test ID:** MOD-03-T174
- **Scenario:** Additional Contract and Resource Edges: Bounded load diagnostics.
- **Objective:** Verify bounded load diagnostics against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Supply many structural failures and a trusted injected diagnostic sequence whose first error is after the output window.
- **Expected Result:** At most 256 diagnostics are published and failure retains an ERROR.
- **Expected Diagnostics:** Existing structural or injected ERROR retained.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T175 — Unknown-tag scalar provenance

- **Test ID:** MOD-03-T175
- **Scenario:** Additional Contract and Resource Edges: Unknown-tag scalar provenance.
- **Objective:** Verify unknown-tag scalar provenance against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a safely unresolved YAML scalar tag under an ordinary mapping.
- **Expected Result:** Default value semantics and actual scalar range are retained without tag evaluation.
- **Expected Diagnostics:** Only actual parser/structural diagnostics.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T176 — Tagged transformed collection

- **Test ID:** MOD-03-T176
- **Scenario:** Additional Contract and Resource Edges: Tagged transformed collection.
- **Objective:** Verify tagged transformed collection against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a parsed collection whose tag changes JS representation, such as a supported set.
- **Expected Result:** Own node range remains available; child property/index locations are not invented.
- **Expected Diagnostics:** Existing structural diagnostics if not an AuthoringDocument.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T177 — Complex YAML key

- **Test ID:** MOD-03-T177
- **Scenario:** Additional Contract and Resource Edges: Complex YAML key.
- **Objective:** Verify complex yaml key against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a collection-valued YAML mapping key.
- **Expected Result:** No guessed structural child path is published; unrelated verified paths remain available and parser logs are silent.
- **Expected Diagnostics:** Only actual parser/structural failures.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T178 — Alias YAML key

- **Test ID:** MOD-03-T178
- **Scenario:** Additional Contract and Resource Edges: Alias YAML key.
- **Objective:** Verify alias yaml key against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use an alias as a mapping key.
- **Expected Result:** No guessed property conversion is used for location indexing.
- **Expected Diagnostics:** Only actual parser/structural failures.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T179 — Null YAML key conversion

- **Test ID:** MOD-03-T179
- **Scenario:** Additional Contract and Resource Edges: Null YAML key conversion.
- **Objective:** Verify null yaml key conversion against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use a null mapping key and an empty-string key variant.
- **Expected Result:** Object key conversion follows yaml null -> empty string; any resulting collision is ambiguous.
- **Expected Diagnostics:** Existing parser duplicate policy or ambiguity metadata.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T180 — Converted YAML key collision

- **Test ID:** MOD-03-T180
- **Scenario:** Additional Contract and Resource Edges: Converted YAML key collision.
- **Objective:** Verify converted yaml key collision against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use numeric 1 and string "1" keys when accepted by the parser.
- **Expected Result:** Any shared JS-property path is marked ambiguous, never silently overwritten.
- **Expected Diagnostics:** Actual YAML duplicate error if rejected; otherwise ambiguity metadata.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T181 — Multi-document empty second body

- **Test ID:** MOD-03-T181
- **Scenario:** Additional Contract and Resource Edges: Multi-document empty second body.
- **Objective:** Verify multi-document empty second body against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use multiple YAML documents whose second document lacks a content-node range.
- **Expected Result:** Multi-document rejection has no fabricated position.
- **Expected Diagnostics:** MODEL_LOADER_YAML_DOCUMENT_COUNT, optional location absent.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T182 — Native JSON language parity

- **Test ID:** MOD-03-T182
- **Scenario:** Additional Contract and Resource Edges: Native JSON language parity.
- **Objective:** Verify native json language parity against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Cover valid escapes, raw Unicode, whitespace, exponent overflow, numeric spelling and native-rejected BOM/comments.
- **Expected Result:** Native JSON remains authoritative; metadata disagreement is controlled failure and fault-tolerant data never succeeds.
- **Expected Diagnostics:** JSON_SYNTAX_ERROR for native rejection; LOCATION_ERROR for unverifiable provenance.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T183 — Legacy parser degradation

- **Test ID:** MOD-03-T183
- **Scenario:** Additional Contract and Resource Edges: Legacy parser degradation.
- **Objective:** Verify legacy parser degradation against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Inject only parse(content), returning a supported raw authoring envelope.
- **Expected Result:** Existing structural acceptance is preserved and locations stays absent.
- **Expected Diagnostics:** None on a valid fixture.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T184 — Factory-only unknown declaration property

- **Test ID:** MOD-03-T184
- **Scenario:** Additional Contract and Resource Edges: Factory-only unknown declaration property.
- **Objective:** Verify factory-only unknown declaration property against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Add an unknown key to a valid declaration, which the existing factory rejects.
- **Expected Result:** The typed error field selects the actual unexpected value; no invalid document succeeds.
- **Expected Diagnostics:** AUTHORING_UNKNOWN_PROPERTY.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T185 — Coordinate/AST release

- **Test ID:** MOD-03-T185
- **Scenario:** Additional Contract and Resource Edges: Coordinate/AST release.
- **Objective:** Verify coordinate/ast release against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Extract a large map, discard parser locals, then inspect the reachable published API.
- **Expected Result:** No raw source string, parser node, coordinate table or mutable collector is exposed/retained by the map closure.
- **Expected Diagnostics:** None.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T186 — Built-in metadata integrity failure

- **Test ID:** MOD-03-T186
- **Scenario:** Additional Contract and Resource Edges: Built-in metadata integrity failure.
- **Objective:** Verify built-in metadata integrity failure against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Use future internal fault injection to supply an invalid parser node range.
- **Expected Result:** Integrity failure stays distinct from optional legacy metadata absence and resource exhaustion.
- **Expected Diagnostics:** MODEL_LOADER_LOCATION_ERROR.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

### MOD-03-T187 — No behavioral verification claim

- **Test ID:** MOD-03-T187
- **Scenario:** Additional Contract and Resource Edges: No behavioral verification claim.
- **Objective:** Verify no behavioral verification claim against the actual MOD-03 contract, independently of semantic identity and future canonicalization.
- **Component:** MOD-03 contracts
- **Prerequisites:** Later explicit authorization for automated verification; built MOD-03 and unchanged Kernel/MOD-01 contracts; original fixture text and its caller-supplied source identity.
- **Input / Setup:** Review this archive and completion report without invoking production parsers or a test runner.
- **Expected Result:** All newly documented scenarios remain NOT_RUN — DEFERRED; executed static checks are reported separately.
- **Expected Diagnostics:** No claimed test passes.
- **Acceptance Criteria:** The specified result and diagnostic originate from authentic parser evidence or the existing validator metadata; lookup/coordinates obey documented source ownership, bounds and immutability; unsupported origins are explicit absence; no invalid document is published as success.
- **Execution Status:** NOT_RUN — DEFERRED

## Archive accounting

Documented Scenarios: 187

Categories: 26 (A–Z)

New Tests Implemented: 0

Tests Executed: 0

Status: NOT_RUN — DEFERRED
