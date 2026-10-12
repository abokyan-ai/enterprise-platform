# SK-08 — Deferred Test Specification

**Task:** SK-08 — Semantic References  
**Layer:** B. Semantic Kernel  
**Technology:** Pure TypeScript  
**Status:** NOT_RUN — DEFERRED  
**New Tests Implemented:** 0  
**Tests Executed:** 0

**Dependencies:**
- ARC-01 through ARC-05
- SK-01 SemanticElementId
- SK-02 Namespace
- SK-03 QualifiedName
- SK-04 SemanticContextRef
- SK-05 SemanticElement
- SK-06 SemanticElementKind
- SK-07 SemanticVersion and ElementVersionRef

---

## Overview

All scenarios below are deferred pending authorization to execute automated
Vitest test suites. No test files have been created. No tests have been run.

Scenarios are organized by the verification categories mandated in SK-08
section 76 (A through Z).

---

## A. Identity References

---

### SK-08-T001

**Test ID:** SK-08-T001  
**Scenario:** Valid ID reference — no version  
**Objective:** Verify that `createElementIdRef` accepts a valid `SemanticElementId` and produces an immutable `ElementIdRef` with `by: 'id'`.  
**Component:** `createElementIdRef`, `ElementIdRef`  
**Prerequisites:** SK-01 `SemanticElementId.parse` available.  
**Input / Setup:**
```typescript
const id = SemanticElementId.parse('sales.customer-a1b2');
const ref = createElementIdRef(id);
```
**Expected Result:** `ref.by === 'id'`, `ref.elementId.equals(id)`, `ref.version === undefined`.  
**Expected Diagnostics:** None.  
**Acceptance Criteria:** No error thrown; reference is frozen; `by` is `'id'`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T002

**Test ID:** SK-08-T002  
**Scenario:** Valid exact-version ID reference  
**Objective:** Verify that `createElementIdRef` accepts an exact `SemanticVersion` and attaches it correctly.  
**Component:** `createElementIdRef`  
**Prerequisites:** SK-01, SK-07.  
**Input / Setup:**
```typescript
const id = SemanticElementId.parse('sales.customer-a1b2');
const ver = SemanticVersion.parse('1.0.0');
const ref = createElementIdRef(id, ver);
```
**Expected Result:** `ref.version !== undefined`, `ref.version.equals(ver)`.  
**Expected Diagnostics:** None.  
**Acceptance Criteria:** Version is present and exactly equal.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T003

**Test ID:** SK-08-T003  
**Scenario:** Missing ID — null passed as elementId  
**Objective:** Verify that `createElementIdRef` throws when `elementId` is not a `SemanticElementId` instance.  
**Component:** `createElementIdRef`  
**Prerequisites:** None.  
**Input / Setup:**
```typescript
createElementIdRef(null as unknown as SemanticElementId);
```
**Expected Result:** `ElementRefValidationError` with code `ELEMENT_REF_INVALID_ELEMENT_ID`.  
**Expected Diagnostics:** `ELEMENT_REF_INVALID_ELEMENT_ID`.  
**Acceptance Criteria:** Error thrown with correct code.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T004

**Test ID:** SK-08-T004  
**Scenario:** Invalid ID type — plain string passed instead of instance  
**Objective:** Verify that `createElementIdRef` rejects a raw string where a `SemanticElementId` instance is required.  
**Component:** `createElementIdRef`  
**Prerequisites:** None.  
**Input / Setup:**
```typescript
createElementIdRef('sales.customer-a1b2' as unknown as SemanticElementId);
```
**Expected Result:** `ElementRefValidationError` with code `ELEMENT_REF_INVALID_ELEMENT_ID`.  
**Acceptance Criteria:** Error thrown.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T005

**Test ID:** SK-08-T005  
**Scenario:** No implicit QualifiedName on ID-based reference  
**Objective:** Verify that `elementIdRef.qualifiedName` is `undefined` (TypeScript `never`) — no name is inferred from the ID.  
**Component:** `ElementIdRef`  
**Prerequisites:** SK-08-T001.  
**Input / Setup:** Use ref from SK-08-T001.  
**Expected Result:** `ref.qualifiedName === undefined`.  
**Acceptance Criteria:** No name inferred; TypeScript treats it as `never`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T006

**Test ID:** SK-08-T006  
**Scenario:** No implicit context on ID-based reference  
**Objective:** Verify that `elementIdRef.contextRef` is `undefined` (TypeScript `never`).  
**Component:** `ElementIdRef`  
**Prerequisites:** SK-08-T001.  
**Input / Setup:** Use ref from SK-08-T001.  
**Expected Result:** `ref.contextRef === undefined`.  
**Acceptance Criteria:** No context inferred.  
**Execution Status:** NOT_RUN — DEFERRED

---

## B. Named References

---

### SK-08-T007

**Test ID:** SK-08-T007  
**Scenario:** Valid named reference — no version  
**Objective:** Verify that `createElementNameRef` accepts valid `QualifiedName` and `SemanticContextRef` and produces an immutable `ElementNameRef`.  
**Component:** `createElementNameRef`, `ElementNameRef`  
**Prerequisites:** SK-03, SK-04.  
**Input / Setup:**
```typescript
const qname = QualifiedName.parse('sales.Customer');
const ctx   = SemanticContextRef.parse('sales-context');
const ref   = createElementNameRef(qname, ctx);
```
**Expected Result:** `ref.by === 'name'`, `ref.qualifiedName.equals(qname)`, `ref.contextRef.equals(ctx)`, `ref.version === undefined`.  
**Acceptance Criteria:** No error; reference frozen.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T008

**Test ID:** SK-08-T008  
**Scenario:** Valid exact-version named reference  
**Objective:** Verify that `createElementNameRef` accepts an exact `SemanticVersion`.  
**Component:** `createElementNameRef`  
**Prerequisites:** SK-03, SK-04, SK-07.  
**Input / Setup:**
```typescript
const ref = createElementNameRef(
  QualifiedName.parse('sales.Customer'),
  SemanticContextRef.parse('sales-context'),
  SemanticVersion.parse('1.2.0'),
);
```
**Expected Result:** `ref.version` is present and equals `1.2.0`.  
**Acceptance Criteria:** Exact version attached; precedence equality is not used.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T009

**Test ID:** SK-08-T009  
**Scenario:** Missing QualifiedName — null passed  
**Objective:** Verify rejection when `qualifiedName` is not a `QualifiedName` instance.  
**Component:** `createElementNameRef`  
**Input / Setup:**
```typescript
createElementNameRef(
  null as unknown as QualifiedName,
  SemanticContextRef.parse('sales-context'),
);
```
**Expected Result:** `ElementRefValidationError` code `ELEMENT_REF_INVALID_QUALIFIED_NAME`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T010

**Test ID:** SK-08-T010  
**Scenario:** Missing context — null passed  
**Objective:** Verify rejection when `contextRef` is not a `SemanticContextRef` instance.  
**Component:** `createElementNameRef`  
**Input / Setup:**
```typescript
createElementNameRef(
  QualifiedName.parse('sales.Customer'),
  null as unknown as SemanticContextRef,
);
```
**Expected Result:** `ElementRefValidationError` code `ELEMENT_REF_MISSING_CONTEXT`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T011

**Test ID:** SK-08-T011  
**Scenario:** Invalid context — plain string instead of instance  
**Objective:** Verify rejection when `contextRef` is a raw string.  
**Component:** `createElementNameRef`  
**Input / Setup:**
```typescript
createElementNameRef(
  QualifiedName.parse('sales.Customer'),
  'sales-context' as unknown as SemanticContextRef,
);
```
**Expected Result:** `ElementRefValidationError` code `ELEMENT_REF_MISSING_CONTEXT`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T012

**Test ID:** SK-08-T012  
**Scenario:** No default context — no ambient context lookup  
**Objective:** Verify that omitting `contextRef` throws, not silently defaults.  
**Component:** `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## C. Target Discrimination

---

### SK-08-T013

**Test ID:** SK-08-T013  
**Scenario:** Explicit `id` mode discriminant  
**Objective:** Verify `ref.by === 'id'` on ID-based reference.  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T014

**Test ID:** SK-08-T014  
**Scenario:** Explicit `name` mode discriminant  
**Objective:** Verify `ref.by === 'name'` on named reference.  
**Component:** `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T015

**Test ID:** SK-08-T015  
**Scenario:** Unknown mode in JSON input  
**Objective:** Verify that `parseElementRef({ by: 'uid', elementId: '...' })` throws with `ELEMENT_REF_UNKNOWN_VARIANT`.  
**Component:** `parseElementRef`  
**Expected Diagnostics:** `ELEMENT_REF_UNKNOWN_VARIANT`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T016

**Test ID:** SK-08-T016  
**Scenario:** Missing mode in JSON input  
**Objective:** Verify that `parseElementRef({ elementId: '...' })` (no `by`) throws with `ELEMENT_REF_MISSING_TARGET`.  
**Component:** `parseElementRef`  
**Expected Diagnostics:** `ELEMENT_REF_MISSING_TARGET`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T017

**Test ID:** SK-08-T017  
**Scenario:** Mode inferred from fields is not supported  
**Objective:** Verify that the parser never infers `by` from the presence of `elementId` or `qualifiedName` without an explicit discriminant.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## D. Contradictory States

---

### SK-08-T018

**Test ID:** SK-08-T018  
**Scenario:** Both ID and name present in JSON — dual target  
**Objective:** Verify that `parseElementRef({ by: 'id', elementId: '...', qualifiedName: '...' })` throws with `ELEMENT_REF_CONFLICTING_TARGET` or `ELEMENT_REF_EXTRA_FIELD`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T019

**Test ID:** SK-08-T019  
**Scenario:** Named ref with missing context in JSON  
**Objective:** Verify that `parseElementRef({ by: 'name', qualifiedName: '...' })` throws with `ELEMENT_REF_MISSING_CONTEXT`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T020

**Test ID:** SK-08-T020  
**Scenario:** ID ref with a forbidden contextRef field in JSON  
**Objective:** Verify rejection of `{ by: 'id', elementId: '...', contextRef: '...' }` with `ELEMENT_REF_EXTRA_FIELD`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T021

**Test ID:** SK-08-T021  
**Scenario:** No target — empty object  
**Objective:** Verify that `parseElementRef({})` throws with `ELEMENT_REF_MISSING_TARGET`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T022

**Test ID:** SK-08-T022  
**Scenario:** Null input  
**Objective:** Verify that `parseElementRef(null)` throws with `ELEMENT_REF_INVALID_TYPE`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T023

**Test ID:** SK-08-T023  
**Scenario:** Unknown extra field in ID ref JSON  
**Objective:** Verify that `{ by: 'id', elementId: '...', resolve: true }` throws `ELEMENT_REF_EXTRA_FIELD`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T024

**Test ID:** SK-08-T024  
**Scenario:** Unsupported reference mode string  
**Objective:** Verify that `{ by: 'runtime-ptr' }` throws `ELEMENT_REF_UNKNOWN_VARIANT`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## E. Optional Version

---

### SK-08-T025

**Test ID:** SK-08-T025  
**Scenario:** Version missing — `undefined` presence state preserved  
**Objective:** Verify that an ID ref created without version has `version === undefined` (key absent from object).  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T026

**Test ID:** SK-08-T026  
**Scenario:** Exact version supplied  
**Objective:** Verify that version is present and structurally equal to input.  
**Component:** `createElementIdRef`, `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T027

**Test ID:** SK-08-T027  
**Scenario:** Version null in JSON — rejected  
**Objective:** Verify that `{ by: 'id', elementId: '...', version: null }` throws `ELEMENT_REF_NULL_VERSION`.  
**Component:** `parseElementRef`  
**Expected Diagnostics:** `ELEMENT_REF_NULL_VERSION`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T028

**Test ID:** SK-08-T028  
**Scenario:** Invalid version string in JSON  
**Objective:** Verify that a malformed version like `'not-a-version'` throws `ELEMENT_REF_INVALID_VERSION`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T029

**Test ID:** SK-08-T029  
**Scenario:** Version range string rejected  
**Objective:** Verify that `'^1.0.0'` as a version string is rejected by `SemanticVersion.parse` (SK-07) and that the error propagates as `ELEMENT_REF_INVALID_VERSION`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T030

**Test ID:** SK-08-T030  
**Scenario:** `'latest'` as version rejected  
**Objective:** Verify that `'latest'` fails `SemanticVersion.parse` and propagates correctly.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T031

**Test ID:** SK-08-T031  
**Scenario:** No default version — unspecified ≠ latest  
**Objective:** Verify that an unversioned ref has `version === undefined` and that the absence is structurally distinct from any version value.  
**Component:** `createElementIdRef`, `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## F. SK-07 Integration

---

### SK-08-T032

**Test ID:** SK-08-T032  
**Scenario:** ElementVersionRef semantics preserved — equal conversion  
**Objective:** Verify that `toElementVersionRef(idRef)` produces an `ElementVersionRef` equal to `ElementVersionRef.fromParts(idRef.elementId, idRef.version)`.  
**Component:** `toElementVersionRef`, `ElementVersionRef`  
**Prerequisites:** SK-07.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T033

**Test ID:** SK-08-T033  
**Scenario:** ID ref + exact version is structurally equivalent to ElementVersionRef in target intent  
**Objective:** Confirm that the same ID and version produce the same `ElementVersionRef` via conversion.  
**Component:** `toElementVersionRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T034

**Test ID:** SK-08-T034  
**Scenario:** Valid conversion — returns ElementVersionRef  
**Objective:** Verify `toElementVersionRef` returns non-undefined when version is present.  
**Component:** `toElementVersionRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T035

**Test ID:** SK-08-T035  
**Scenario:** No conversion from named reference without resolution  
**Objective:** Verify that `toElementVersionRef` signature only accepts `ElementIdRef`; TypeScript prevents passing `ElementNameRef`. At runtime, a named ref's `elementId` is not present.  
**Component:** `toElementVersionRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T036

**Test ID:** SK-08-T036  
**Scenario:** No version → conversion returns undefined  
**Objective:** Verify `toElementVersionRef(idRefWithoutVersion)` returns `undefined`, not an error.  
**Component:** `toElementVersionRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T037

**Test ID:** SK-08-T037  
**Scenario:** Build metadata equality consistency  
**Objective:** Verify that versions `1.0.0+build1` and `1.0.0+build2` produce unequal `ElementVersionRef` values (SK-07 exact equality includes build metadata), and this is reflected in `equalsElementRef`.  
**Component:** `equalsElementRef`, `toElementVersionRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## G. SK-01 Integration

---

### SK-08-T038

**Test ID:** SK-08-T038  
**Scenario:** Authentic SemanticElementId required — no raw string accepted  
**Objective:** Verify factory rejects raw string for `elementId`.  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T039

**Test ID:** SK-08-T039  
**Scenario:** No ID parsing duplication inside ElementRef  
**Objective:** Verify the `parseElementRef` delegates parsing to `SemanticElementId.parse`, not a reimplemented parser.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T040

**Test ID:** SK-08-T040  
**Scenario:** Stable identity across semantic rename  
**Objective:** Verify that a `SemanticElementId` remains unchanged when the element's `QualifiedName` changes, so an identity-based ref retains its target.  
**Component:** Architecture (static analysis)  
**Execution Status:** NOT_RUN — DEFERRED

---

## H. SK-03 Integration

---

### SK-08-T041

**Test ID:** SK-08-T041  
**Scenario:** Authentic QualifiedName instance required  
**Objective:** Verify factory rejects a raw string for `qualifiedName`.  
**Component:** `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T042

**Test ID:** SK-08-T042  
**Scenario:** No namespace grammar duplication  
**Objective:** Confirm that `element-ref.ts` imports `QualifiedName` without reimplementing its parsing grammar.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T043

**Test ID:** SK-08-T043  
**Scenario:** No version embedded in QualifiedName  
**Objective:** Verify that `QualifiedName.parse` is called without a version suffix, and no dot-version parsing occurs inside SK-08.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## I. SK-04 Integration

---

### SK-08-T044

**Test ID:** SK-08-T044  
**Scenario:** Explicit context required for named ref  
**Objective:** Verify `createElementNameRef` rejects missing context.  
**Component:** `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T045

**Test ID:** SK-08-T045  
**Scenario:** Same name in different contexts — different references  
**Objective:** Verify that two named refs with `sales-context` vs `partner-context` are structurally unequal via `equalsElementRef`.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T046

**Test ID:** SK-08-T046  
**Scenario:** No ambient current context  
**Objective:** Verify no global state is read inside `createElementNameRef` or `parseElementRef`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## J. Strong Typing

---

### SK-08-T047

**Test ID:** SK-08-T047  
**Scenario:** Discriminated-union narrowing  
**Objective:** Verify that TypeScript narrows `ElementRef` to `ElementIdRef` or `ElementNameRef` inside `if (ref.by === 'id')`.  
**Component:** TypeScript type system (static)  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T048

**Test ID:** SK-08-T048  
**Scenario:** No arbitrary string substitution  
**Objective:** Verify that `elementId: SemanticElementId` in the type signature prevents assignment from plain `string`.  
**Component:** TypeScript (static)  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T049

**Test ID:** SK-08-T049  
**Scenario:** `never` fields guard on ElementIdRef  
**Objective:** Verify that assigning `qualifiedName` on an `ElementIdRef` object literal triggers a TypeScript error.  
**Component:** TypeScript (static)  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T050

**Test ID:** SK-08-T050  
**Scenario:** Runtime instanceof checks supplement static typing  
**Objective:** Verify that `createElementIdRef` throws `ElementRefValidationError` for a non-SemanticElementId at runtime (even when TypeScript is bypassed via `as unknown`).  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## K. Immutability

---

### SK-08-T051

**Test ID:** SK-08-T051  
**Scenario:** No mutable target after construction  
**Objective:** Verify that attempting to assign `ref.elementId = ...` at runtime throws in strict mode (frozen object).  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T052

**Test ID:** SK-08-T052  
**Scenario:** No mutable version after construction  
**Objective:** Verify that `ref.version = ...` throws on a frozen ref.  
**Component:** `createElementIdRef`, `createElementNameRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T053

**Test ID:** SK-08-T053  
**Scenario:** No public setters  
**Objective:** Static inspection confirms no setter properties on `ElementIdRef` or `ElementNameRef` instances.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## L. Structural Equality

---

### SK-08-T054

**Test ID:** SK-08-T054  
**Scenario:** Equal identity references — same ID, no version  
**Objective:** Verify `equalsElementRef(a, b)` is `true` when both are ID refs with equal `elementId` and no version.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T055

**Test ID:** SK-08-T055  
**Scenario:** Different IDs — not equal  
**Objective:** Verify `equalsElementRef` is `false` for two ID refs with different `SemanticElementId` values.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T056

**Test ID:** SK-08-T056  
**Scenario:** Different exact versions — not equal  
**Objective:** Verify `equalsElementRef` is `false` when `version` differs (e.g., `1.0.0` vs `2.0.0`).  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T057

**Test ID:** SK-08-T057  
**Scenario:** Missing vs explicit version — not equal  
**Objective:** Verify `equalsElementRef(noVersionRef, versionedRef)` is `false`.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T058

**Test ID:** SK-08-T058  
**Scenario:** Equal named references  
**Objective:** Verify `equalsElementRef` is `true` for two named refs with equal name and context.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T059

**Test ID:** SK-08-T059  
**Scenario:** Different contexts — not equal  
**Objective:** Verify `equalsElementRef` is `false` when `contextRef` differs.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T060

**Test ID:** SK-08-T060  
**Scenario:** Different QualifiedNames — not equal  
**Objective:** Verify `equalsElementRef` is `false` when `qualifiedName` differs.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T061

**Test ID:** SK-08-T061  
**Scenario:** Cross-variant inequality  
**Objective:** Verify `equalsElementRef(idRef, nameRef)` is always `false`.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## M. Serialization

---

### SK-08-T062

**Test ID:** SK-08-T062  
**Scenario:** Identity JSON shape — no version  
**Objective:** Verify `serializeElementRef(idRef)` produces `{ by: 'id', elementId: '...' }` with no `version` key.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T063

**Test ID:** SK-08-T063  
**Scenario:** Named JSON shape — no version  
**Objective:** Verify `serializeElementRef(nameRef)` produces `{ by: 'name', qualifiedName: '...', contextRef: '...' }`.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T064

**Test ID:** SK-08-T064  
**Scenario:** Versioned identity JSON  
**Objective:** Verify the `version` field appears in the output JSON when present.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T065

**Test ID:** SK-08-T065  
**Scenario:** Versioned named JSON  
**Objective:** Verify the `version` field appears in the named ref JSON when present.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T066

**Test ID:** SK-08-T066  
**Scenario:** Missing version not serialized as null  
**Objective:** Verify the `version` key is absent (not `null`) in JSON output when unspecified.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T067

**Test ID:** SK-08-T067  
**Scenario:** Stable canonical primitive strings  
**Objective:** Verify that `elementId`, `qualifiedName`, `contextRef`, and `version` strings match the result of `.toString()` on their respective value objects.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## N. Deserialization

---

### SK-08-T068

**Test ID:** SK-08-T068  
**Scenario:** Valid identity round-trip  
**Objective:** Verify that `parseElementRef(serializeElementRef(ref))` produces a ref structurally equal to the original.  
**Component:** `parseElementRef`, `serializeElementRef`, `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T069

**Test ID:** SK-08-T069  
**Scenario:** Valid named round-trip  
**Objective:** Verify name ref round-trips through JSON without losing context or name.  
**Component:** `parseElementRef`, `serializeElementRef`, `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T070

**Test ID:** SK-08-T070  
**Scenario:** Invalid JSON shape — string input  
**Objective:** Verify `parseElementRef('hello')` throws `ELEMENT_REF_INVALID_TYPE`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T071

**Test ID:** SK-08-T071  
**Scenario:** Unknown discriminator  
**Objective:** Verify unknown `by` value throws `ELEMENT_REF_UNKNOWN_VARIANT`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T072

**Test ID:** SK-08-T072  
**Scenario:** Missing fields for `by: 'id'`  
**Objective:** Verify `{ by: 'id' }` (no `elementId`) throws `ELEMENT_REF_MISSING_TARGET`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T073

**Test ID:** SK-08-T073  
**Scenario:** Invalid primitive string for elementId  
**Objective:** Verify an invalid ID string (e.g., `''` or `'!!bad'`) throws `ELEMENT_REF_INVALID_ELEMENT_ID`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T074

**Test ID:** SK-08-T074  
**Scenario:** Conflicting fields in ID ref JSON  
**Objective:** Verify `{ by: 'id', elementId: '...', qualifiedName: '...' }` is rejected.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T075

**Test ID:** SK-08-T075  
**Scenario:** Unsupported extra field  
**Objective:** Verify any unknown field triggers `ELEMENT_REF_EXTRA_FIELD`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## O. Missing / Null / Value

---

### SK-08-T076

**Test ID:** SK-08-T076  
**Scenario:** Missing version — key absent from object  
**Objective:** Verify `'version' in ref` is `false` on a no-version identity ref.  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T077

**Test ID:** SK-08-T077  
**Scenario:** Null version in JSON input  
**Objective:** Verify `{ by: 'id', elementId: '...', version: null }` throws `ELEMENT_REF_NULL_VERSION`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T078

**Test ID:** SK-08-T078  
**Scenario:** Explicit version value  
**Objective:** Verify `ref.version` is a `SemanticVersion` instance (not undefined, not null) when supplied.  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T079

**Test ID:** SK-08-T079  
**Scenario:** Null context in JSON for named ref  
**Objective:** Verify `{ by: 'name', qualifiedName: '...', contextRef: null }` throws `ELEMENT_REF_NULL_CONTEXT`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T080

**Test ID:** SK-08-T080  
**Scenario:** No accidental null normalization  
**Objective:** Verify that the parser never silently converts `null` to `undefined` for version or contextRef.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## P. Resolution Boundary

---

### SK-08-T081

**Test ID:** SK-08-T081  
**Scenario:** Valid reference without registered target  
**Objective:** Verify that creating a ref for a non-existent element ID succeeds (validation is structural, not existence-based).  
**Component:** `createElementIdRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T082

**Test ID:** SK-08-T082  
**Scenario:** No registry lookup during construction  
**Objective:** Static inspection confirms no Map, Set, or external service is queried in factory functions.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T083

**Test ID:** SK-08-T083  
**Scenario:** No resolved-object cache  
**Objective:** Verify no internal state stores resolved elements inside `element-ref.ts`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## Q. Semantic Identity Versus Reference

---

### SK-08-T084

**Test ID:** SK-08-T084  
**Scenario:** Identity reference retains ID after semantic rename  
**Objective:** Verify that a `SemanticElementId`-based ref does not depend on the element's current `QualifiedName` spelling.  
**Component:** Architecture (static analysis)  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T085

**Test ID:** SK-08-T085  
**Scenario:** Structural reference equality ≠ resolved target equality  
**Objective:** Verify `equalsElementRef(idRef, nameRef)` is `false` even if they theoretically target the same element.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## R. SemanticElement Integration

---

### SK-08-T086

**Test ID:** SK-08-T086  
**Scenario:** No embedded full SemanticElement  
**Objective:** Static inspection confirms no `SemanticElement` object is nested inside `ElementIdRef` or `ElementNameRef`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T087

**Test ID:** SK-08-T087  
**Scenario:** No element registration during construction  
**Objective:** Confirm that `createElementIdRef` does not call any registry-mutating function.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## S. SemanticElementKind Independence

---

### SK-08-T088

**Test ID:** SK-08-T088  
**Scenario:** No kind inferred from ID  
**Objective:** Static inspection confirms no `SemanticElementKind` is derived from an ID string.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T089

**Test ID:** SK-08-T089  
**Scenario:** No mandatory kind in ElementRef  
**Objective:** Verify neither `ElementIdRef` nor `ElementNameRef` has a `kind` field.  
**Component:** TypeScript types (static)  
**Execution Status:** NOT_RUN — DEFERRED

---

## T. Version Independence and Exactness

---

### SK-08-T090

**Test ID:** SK-08-T090  
**Scenario:** No ranges accepted  
**Objective:** Verify `'^1.0.0'` and `'>=1.0.0'` fail `SemanticVersion.parse` and that `parseElementRef` propagates the error.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T091

**Test ID:** SK-08-T091  
**Scenario:** No active-version selection  
**Objective:** Static inspection confirms no "active", "latest", or "stable" label is treated as a valid SemanticVersion.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## U. Framework Independence

---

### SK-08-T092

**Test ID:** SK-08-T092  
**Scenario:** No NestJS imports  
**Objective:** Static inspection confirms `element-ref.ts` does not import from `@nestjs/*`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T093

**Test ID:** SK-08-T093  
**Scenario:** No Angular or PrimeNG imports  
**Objective:** Static inspection confirms no `@angular/*` or `primeng/*` imports.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T094

**Test ID:** SK-08-T094  
**Scenario:** No Node.js-only API dependencies for basic operations  
**Objective:** Static inspection confirms no `node:fs`, `node:path`, `node:crypto`, `process`, or `Buffer` usage in core reference operations.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## V. Public API

---

### SK-08-T095

**Test ID:** SK-08-T095  
**Scenario:** Approved Kernel imports available  
**Objective:** Verify that `import { createElementIdRef, createElementNameRef, parseElementRef, serializeElementRef, equalsElementRef } from '@ecosystem/semantic-kernel'` compiles without error.  
**Component:** `src/index.ts`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T096

**Test ID:** SK-08-T096  
**Scenario:** No private deep import required  
**Objective:** Verify all SK-08 types and functions are available from the root barrel without importing `src/references/element-ref.ts` directly.  
**Component:** `src/index.ts`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T097

**Test ID:** SK-08-T097  
**Scenario:** No circular dependency introduced  
**Objective:** Verify that the new `references/` module does not import from consumers of the kernel.  
**Component:** Static/architecture inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## W. Security

---

### SK-08-T098

**Test ID:** SK-08-T098  
**Scenario:** No executable references — no eval  
**Objective:** Static inspection confirms no `eval()`, `Function()`, or `new Function()` in `element-ref.ts`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T099

**Test ID:** SK-08-T099  
**Scenario:** No dynamic module loading from reference values  
**Objective:** Confirm no `import()` call references an identifier-derived path.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T100

**Test ID:** SK-08-T100  
**Scenario:** Bounded parsing — excessively long elementId rejected  
**Objective:** Verify that a 129-character ID string causes `SemanticElementId.parse` to throw, which is propagated as `ELEMENT_REF_INVALID_ELEMENT_ID`.  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T101

**Test ID:** SK-08-T101  
**Scenario:** Unknown field with dangerous name  
**Objective:** Verify that `{ by: 'id', elementId: '...', __proto__: {} }` is rejected (prototype pollution attempt).  
**Component:** `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## X. Determinism

---

### SK-08-T102

**Test ID:** SK-08-T102  
**Scenario:** Stable construction — same inputs produce structurally equal refs  
**Objective:** Verify that two independently constructed refs from identical valid inputs are `equalsElementRef`-equal.  
**Component:** `createElementIdRef`, `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T103

**Test ID:** SK-08-T103  
**Scenario:** Stable serialization — same ref always produces the same JSON  
**Objective:** Verify `serializeElementRef(ref)` returns structurally identical objects on repeated calls.  
**Component:** `serializeElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T104

**Test ID:** SK-08-T104  
**Scenario:** No timestamps or randomness  
**Objective:** Static inspection confirms no `Date`, `Math.random`, or `crypto.randomUUID` in `element-ref.ts`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## Y. Mini Sales

---

### SK-08-T105

**Test ID:** SK-08-T105  
**Scenario:** Customer ID reference  
**Objective:** Create an ID ref targeting the mini-sales Customer element; verify structure.  
**Component:** `createElementIdRef`  
**Input / Setup:**
```typescript
const customerId = SemanticElementId.parse('sales.customer-id-01');
const ref = createElementIdRef(customerId);
```
**Expected Result:** `ref.by === 'id'`, `ref.elementId.toString() === 'sales.customer-id-01'`, no version.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T106

**Test ID:** SK-08-T106  
**Scenario:** Customer exact-version reference  
**Objective:** Create a versioned ID ref for the Customer at version `1.0.0`.  
**Component:** `createElementIdRef`  
**Input / Setup:**
```typescript
const ref = createElementIdRef(
  SemanticElementId.parse('sales.customer-id-01'),
  SemanticVersion.parse('1.0.0'),
);
```
**Expected Result:** `ref.version.toString() === '1.0.0'`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T107

**Test ID:** SK-08-T107  
**Scenario:** `sales.Customer` named reference in `sales-context`  
**Objective:** Create a named ref and verify fields.  
**Component:** `createElementNameRef`  
**Input / Setup:**
```typescript
const ref = createElementNameRef(
  QualifiedName.parse('sales.Customer'),
  SemanticContextRef.parse('sales-context'),
);
```
**Expected Result:** `ref.by === 'name'`, `ref.qualifiedName.toString() === 'sales.Customer'`, `ref.contextRef.toString() === 'sales-context'`.  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T108

**Test ID:** SK-08-T108  
**Scenario:** Same name in `partner-context` produces different reference  
**Objective:** Verify refs A (`sales-context`) and B (`partner-context`) are unequal.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T109

**Test ID:** SK-08-T109  
**Scenario:** ID ref vs name ref — structural inequality  
**Objective:** Verify `equalsElementRef(customerIdRef, customerNameRef)` is `false`.  
**Component:** `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T110

**Test ID:** SK-08-T110  
**Scenario:** Missing context — named ref rejected  
**Objective:** Verify that attempting to create `sales.Customer` named ref without a context throws.  
**Component:** `createElementNameRef`, `parseElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T111

**Test ID:** SK-08-T111  
**Scenario:** Unknown version not treated as latest  
**Objective:** Verify that a ref created without a version has `version === undefined` and is structurally unequal to any versioned ref.  
**Component:** `createElementNameRef`, `equalsElementRef`  
**Execution Status:** NOT_RUN — DEFERRED

---

## Z. Architectural Boundaries

---

### SK-08-T112

**Test ID:** SK-08-T112  
**Scenario:** No SK-09 implementation introduced  
**Objective:** Static inspection confirms no `PrimitiveSemanticType` or related SK-09 constructs exist in `src/references/`.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T113

**Test ID:** SK-08-T113  
**Scenario:** No resolver implementation  
**Objective:** Static inspection confirms no `SemanticReferenceResolver`, `resolve()`, or `load()` function is implemented.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T114

**Test ID:** SK-08-T114  
**Scenario:** No registry implementation  
**Objective:** Static inspection confirms no in-memory registry (Map, Set, global) is used to store known elements.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T115

**Test ID:** SK-08-T115  
**Scenario:** No Compiler dependency  
**Objective:** Static inspection confirms `element-ref.ts` imports only from within `src/` of `@ecosystem/semantic-kernel`.  
**Component:** Static / ARC-02 inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T116

**Test ID:** SK-08-T116  
**Scenario:** No Runtime dependency  
**Objective:** Verify no import from `@ecosystem/runtime-core` or equivalent.  
**Component:** Static / ARC-02 inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T117

**Test ID:** SK-08-T117  
**Scenario:** No REST endpoint introduced  
**Objective:** Verify no NestJS controller, route, or HTTP decorator exists in the new files.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

### SK-08-T118

**Test ID:** SK-08-T118  
**Scenario:** No CLI command introduced  
**Objective:** Verify no commander/yargs command registration or CLI entrypoint in new files.  
**Component:** Static inspection  
**Execution Status:** NOT_RUN — DEFERRED

---

## Summary

| Category | Scenarios |
|---|---|
| A. Identity References | T001–T006 (6) |
| B. Named References | T007–T012 (6) |
| C. Target Discrimination | T013–T017 (5) |
| D. Contradictory States | T018–T024 (7) |
| E. Optional Version | T025–T031 (7) |
| F. SK-07 Integration | T032–T037 (6) |
| G. SK-01 Integration | T038–T040 (3) |
| H. SK-03 Integration | T041–T043 (3) |
| I. SK-04 Integration | T044–T046 (3) |
| J. Strong Typing | T047–T050 (4) |
| K. Immutability | T051–T053 (3) |
| L. Structural Equality | T054–T061 (8) |
| M. Serialization | T062–T067 (6) |
| N. Deserialization | T068–T075 (8) |
| O. Missing/Null/Value | T076–T080 (5) |
| P. Resolution Boundary | T081–T083 (3) |
| Q. Semantic Identity vs Reference | T084–T085 (2) |
| R. SemanticElement Integration | T086–T087 (2) |
| S. SemanticElementKind Independence | T088–T089 (2) |
| T. Version Independence | T090–T091 (2) |
| U. Framework Independence | T092–T094 (3) |
| V. Public API | T095–T097 (3) |
| W. Security | T098–T101 (4) |
| X. Determinism | T102–T104 (3) |
| Y. Mini Sales | T105–T111 (7) |
| Z. Architectural Boundaries | T112–T118 (7) |
| **Total** | **118 scenarios** |

All scenarios: **NOT_RUN — DEFERRED**
