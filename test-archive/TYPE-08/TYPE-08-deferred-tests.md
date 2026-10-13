# TYPE-08 — Deferred Test Specification

Task: TYPE-08 — Semantic Instance Contract

Layer: C. Semantic Type System

Technology: Pure TypeScript / Model Core

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:

- ARC-01 through ARC-05
- SK-01 through SK-11
- TYPE-01 through TYPE-07

| Test ID      | Scenario            | Objective                                   | Component         | Prerequisites        | Input / Setup           | Expected Result                | Expected Diagnostics   | Acceptance Criteria         | Execution Status   |
| ------------ | ------------------- | ------------------------------------------- | ----------------- | -------------------- | ----------------------- | ------------------------------ | ---------------------- | --------------------------- | ------------------ |
| TYPE-08-T001 | Valid instance      | Build exact bound snapshot                  | Factory           | Valid kernel values  | ID, ref, fields         | Frozen instance                | None                   | Core contract valid         | NOT_RUN — DEFERRED |
| TYPE-08-T002 | Instance ID grammar | Reject invalid IDs                          | InstanceId        | None                 | empty, whitespace, long | Controlled failure             | `INSTANCE_ID_INVALID`  | No normalization/generation | NOT_RUN — DEFERRED |
| TYPE-08-T003 | Exact binding       | Require ElementVersionRef                   | Factory           | Valid ID             | missing/wrong type ref  | Controlled failure             | Instance error         | No latest fallback          | NOT_RUN — DEFERRED |
| TYPE-08-T004 | Null/value/missing  | Preserve three states                       | Value/lookup      | Valid field ID       | absent, null, primitive | Distinct observable states     | None                   | No truthiness conversion    | NOT_RUN — DEFERRED |
| TYPE-08-T005 | Primitive fidelity  | Preserve false, zero, empty, exact decimals | Factory           | SK-09 values         | BOOLEAN false etc.      | Values retained                | None                   | No coercion                 | NOT_RUN — DEFERRED |
| TYPE-08-T006 | Duplicate field IDs | Reject duplicate entries                    | Factory           | Valid fields         | same ID twice           | Controlled failure             | Instance error         | No overwrite                | NOT_RUN — DEFERRED |
| TYPE-08-T007 | Serialization       | Round-trip valid instance                   | Parser            | Valid instance       | serialize/parse         | Equivalent structural snapshot | None                   | Stable ordered JSON         | NOT_RUN — DEFERRED |
| TYPE-08-T008 | Invalid JSON        | Reject malformed states/primitive/IDs       | Parser            | None                 | invalid inputs          | Controlled failure             | Instance/kernel errors | No unchecked casts          | NOT_RUN — DEFERRED |
| TYPE-08-T009 | Immutability        | Defend input arrays                         | Factory           | Mutable source array | mutate after build      | Snapshot unchanged             | None                   | Frozen ownership            | NOT_RUN — DEFERRED |
| TYPE-08-T010 | Boundaries          | Exclude runtime/persistence/constraints     | Source inspection | Workspace            | inspect imports/APIs    | No lifecycle, ORM, resolver    | None                   | Model Core purity           | NOT_RUN — DEFERRED |
