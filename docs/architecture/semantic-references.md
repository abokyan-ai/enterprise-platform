# Semantic References — SK-08

**Module:** `@ecosystem/semantic-kernel`  
**Layer:** B. Semantic Kernel — Pure TypeScript  
**Milestone:** SK-08 — Semantic References  
**Status:** Implemented  
**ADR:** [ADR-016](../adr/ADR-016-semantic-element-references.md)

---

## 1. What Is an ElementRef?

An **ElementRef** is an immutable semantic reference that expresses *intent*
to target a semantic element. It carries the information needed to describe
which element is meant — by stable identity or qualified name — along with an
optional exact-version requirement.

An ElementRef is **not**:

| What it is not | Why |
|---|---|
| `SemanticElementId` | The ID is a *component* of an identity ref, not a ref itself. |
| `QualifiedName` | A name is a *component* of a named ref, not a ref itself. |
| A resolved `SemanticElement` | The definition object is the *output* of resolution. |
| A runtime instance reference | Instances are business-data records, not semantic definitions. |
| A database foreign key | Semantic identity is independent of persistence keys. |
| A compiler artifact ref | Compiler artifacts are produced by the Compiler subsystem. |
| An authorization grant | Context is not a permission; see §12. |

---

## 2. Reference ≠ Resolution

A valid `ElementRef` proves **structural validity** only.

It does **not** prove:
- The target element exists in any registry.
- The qualified name resolves uniquely in the given context.
- The requested version is available.
- The reference is authorized for the current actor.
- The compiler supports the target kind.
- The runtime can execute the referenced element.

```
Validated ElementRef
        │
        ▼
Future Resolution Request
        │
        ▼
Future Resolver (out of SK-08 scope)
        │
        ▼
Resolved SemanticElement
```

SK-08 implements only the first stage.

---

## 3. Reference Variants

```
ElementRef
  ├── ElementIdRef   — by: 'id'
  └── ElementNameRef — by: 'name'
```

The `by` field is the literal-string discriminant. TypeScript narrows the
type to the correct variant inside `if/switch` blocks.

### 3.1 Identity Reference (`ElementIdRef`)

Targets a semantic element by stable `SemanticElementId` (SK-01).

```typescript
interface ElementIdRef {
  readonly by: 'id';
  readonly elementId: SemanticElementId;
  readonly qualifiedName?: never;   // compile-time guard
  readonly contextRef?: never;      // compile-time guard
  readonly version?: SemanticVersion;
}
```

- The `elementId` provides stable identity independent of future renames.
- `contextRef` is not required: the ID already encodes target identity.
- `version` is optional (see §5).

### 3.2 Named Reference (`ElementNameRef`)

Targets a semantic element by `QualifiedName` (SK-03) within an explicit
`SemanticContextRef` (SK-04).

```typescript
interface ElementNameRef {
  readonly by: 'name';
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly elementId?: never;   // compile-time guard
  readonly version?: SemanticVersion;
}
```

- `contextRef` is **required**: the same `QualifiedName` can appear in
  different contexts with different definitions.
- `version` is optional (see §5).

---

## 4. Why Named References Require an Explicit Context

**Context owns meaning** (architecture principle 3). Consider:

```
Context A: sales-context   →  sales.Customer  →  Definition X
Context B: partner-context →  sales.Customer  →  Definition Y
```

These are different definitions despite sharing the same qualified name spelling.
An `ElementRef` must not silently assume one context.

- No default context is selected.
- No ambient current context is read.
- No tenant, organization, or deployment state is consulted.
- No namespace-derived inference is performed.

---

## 5. Optional Exact Version

Both variants accept an optional `version: SemanticVersion` (SK-07).

| State | Meaning |
|---|---|
| Version property absent | Version-unspecified — no exact version requirement |
| Version property present with `SemanticVersion` | Exact definition version required |
| `null` | **Invalid** — rejected by the parser |

Version-unspecified does **not** mean:
- Latest
- Stable
- Active
- Most recent
- Default

A future resolver decides whether version-unspecified references are allowed
and how they are handled under its resolution policy.

### Version Ranges Are Unsupported

The following are rejected as `version` values:
`^1.0.0`, `~2.0.0`, `>=1.0.0`, `1.x`, `latest`, `stable`, `*`.

SK-07 owns exact-version parsing. SK-08 delegates to it.

---

## 6. Factory Functions

Use the factory functions to construct valid, immutable references.

```typescript
import {
  createElementIdRef,
  createElementNameRef,
} from '@ecosystem/semantic-kernel';
```

### 6.1 Identity Reference

```typescript
const elementId = SemanticElementId.parse('sales.customer-a1b2');
const ref = createElementIdRef(elementId);

// With an exact version:
const version = SemanticVersion.parse('1.0.0');
const versionedRef = createElementIdRef(elementId, version);
```

Throws `ElementRefValidationError` if `elementId` is not a
`SemanticElementId` instance, or `version` is provided but is not a
`SemanticVersion` instance.

### 6.2 Named Reference

```typescript
const qualifiedName = QualifiedName.parse('sales.Customer');
const contextRef   = SemanticContextRef.parse('sales-context');
const ref = createElementNameRef(qualifiedName, contextRef);

// With an exact version:
const version = SemanticVersion.parse('1.2.0');
const versionedRef = createElementNameRef(qualifiedName, contextRef, version);
```

Throws `ElementRefValidationError` if any component fails its `instanceof`
check, or `version` is provided but is not a `SemanticVersion` instance.

---

## 7. Equality

Use `equalsElementRef` for structural equality.

```typescript
import { equalsElementRef } from '@ecosystem/semantic-kernel';

equalsElementRef(refA, refB); // boolean
```

Two references are equal **only** when:
1. They use the same target mode (`by` discriminant).
2. Their target components are equal by value (uses SK-01 / SK-03 / SK-04 equality).
3. Their explicit contexts are equal where applicable.
4. Their version fields have the same presence state.
5. Their exact versions are equal when both are present (uses SK-07 exact equality).

### Examples

```
ID A, no version   = ID A, no version      ✓
ID A, @1.0.0       = ID A, @1.0.0          ✓
ID A, no version  ≠ ID A, @1.0.0           ✗ (different presence)
ID A, @1.0.0      ≠ ID A, @2.0.0           ✗ (different exact version)
ID A              ≠ Name sales.Customer     ✗ (different variant)
sales.Customer/sales-context
                  ≠ sales.Customer/partner-context  ✗ (different context)
```

**Cross-variant equality is always false.** Even if an identity ref and a
named ref ultimately resolve to the same element, they differ in reference
structure and intent.

---

## 8. Serialization

```typescript
import { serializeElementRef } from '@ecosystem/semantic-kernel';

const json = serializeElementRef(ref); // ElementRefJSON
```

### Identity Reference

```json
{ "by": "id", "elementId": "sales.customer-a1b2" }
```

With version:

```json
{ "by": "id", "elementId": "sales.customer-a1b2", "version": "1.0.0" }
```

### Named Reference

```json
{ "by": "name", "qualifiedName": "sales.Customer", "contextRef": "sales-context" }
```

With version:

```json
{ "by": "name", "qualifiedName": "sales.Customer", "contextRef": "sales-context", "version": "1.2.0" }
```

### Serialization Rules

- `by` is always present.
- `version` is **omitted** when absent (not set to `null`).
- Component strings are produced by the primitive's `toString()`.
- No private state or class metadata is included.
- The switch is exhaustive; unknown variants throw.

---

## 9. Deserialization / Parsing

```typescript
import { parseElementRef } from '@ecosystem/semantic-kernel';

const ref: ElementRef = parseElementRef(untrustedInput);
```

External JSON is untrusted. `parseElementRef` enforces:

1. Plain object, not null, not an array, not a class instance.
2. `by` discriminant present, string, one of `'id'` or `'name'`.
3. For `by: 'id'`:
   - `elementId` required.
   - `version` optional; `null` rejected.
   - `qualifiedName` and `contextRef` must be absent.
4. For `by: 'name'`:
   - `qualifiedName` required.
   - `contextRef` required.
   - `version` optional; `null` rejected.
   - `elementId` must be absent.
5. Unknown fields are rejected.
6. Component strings are parsed via SK-01 / SK-03 / SK-04 / SK-07 APIs.

### Contradictory Input Examples

```json
// Rejected: ELEMENT_REF_CONFLICTING_TARGET
{ "by": "id", "elementId": "sales.customer-a1b2", "qualifiedName": "sales.Customer" }

// Rejected: ELEMENT_REF_NULL_VERSION
{ "by": "id", "elementId": "sales.customer-a1b2", "version": null }

// Rejected: ELEMENT_REF_UNKNOWN_VARIANT
{ "by": "uid", "elementId": "sales.customer-a1b2" }

// Rejected: ELEMENT_REF_MISSING_CONTEXT
{ "by": "name", "qualifiedName": "sales.Customer" }

// Rejected: ELEMENT_REF_EXTRA_FIELD
{ "by": "id", "elementId": "sales.customer-a1b2", "resolve": true }
```

---

## 10. Round-Trip Guarantee

```
ElementRef
    │ serializeElementRef
    ▼
ElementRefJSON
    │ parseElementRef
    ▼
ElementRef (structurally equal to original)
```

Preserved through round-trip:
- Target variant and discriminant
- Stable element ID or QualifiedName value
- Explicit context (named refs)
- Exact version (when present)
- Version absence (when unspecified)

Not preserved: internal frozen-object identity (reference equality). Use
`equalsElementRef` to compare.

---

## 11. SK-07 Integration: `toElementVersionRef`

```typescript
import { toElementVersionRef } from '@ecosystem/semantic-kernel';

const vref: ElementVersionRef | undefined = toElementVersionRef(idRef);
```

Converts an identity-based `ElementIdRef` that carries an exact version into
an `ElementVersionRef` (SK-07). Returns `undefined` if the version is absent.

Rules:
- Only `ElementIdRef` can convert; named refs cannot (no ID is fabricated).
- No registry is consulted, no resolution is performed.
- The resulting `ElementVersionRef` uses SK-07 equality semantics.

---

## 12. What SemanticContextRef Is Not

A `SemanticContextRef` within an `ElementNameRef` is an interpretation
boundary identifier — it is **not**:
- An authorization grant.
- A permission scope.
- A proof that the named element exists.
- A resolved semantic context object.

Do not infer permissions from a context ref. Authorization is a separate
trusted application concern evaluated at resolution time.

---

## 13. Type Narrowing Helpers

```typescript
import { isElementIdRef, isElementNameRef } from '@ecosystem/semantic-kernel';

if (isElementIdRef(ref)) {
  // ref is ElementIdRef
}
if (isElementNameRef(ref)) {
  // ref is ElementNameRef
}
```

---

## 14. Diagnostic Rendering

```typescript
import { describeElementRef } from '@ecosystem/semantic-kernel';

console.log(describeElementRef(ref));
// ElementIdRef(sales.customer-a1b2)
// ElementIdRef(sales.customer-a1b2 @1.0.0)
// ElementNameRef(sales.Customer in sales-context)
// ElementNameRef(sales.Customer in sales-context @1.2.0)
```

> **Warning:** `describeElementRef` output is **not** parseable canonical
> interchange. Use `serializeElementRef` for wire-safe JSON.

---

## 15. Relationships to Other Kernel Primitives

| Primitive | Relationship |
|---|---|
| `SemanticElementId` (SK-01) | Target component of `ElementIdRef`. Stable across renames. |
| `Namespace` (SK-02) | Used internally by `QualifiedName`. Not referenced directly in `ElementRef`. |
| `QualifiedName` (SK-03) | Target component of `ElementNameRef`. Reused without duplication. |
| `SemanticContextRef` (SK-04) | Required component of `ElementNameRef`. Owns name interpretation. |
| `SemanticElement` (SK-05) | The resolved output of a future resolution. Not embedded in `ElementRef`. |
| `SemanticElementKind` (SK-06) | Not included in `ElementRef`. A future resolver may validate expected kind. |
| `SemanticVersion` (SK-07) | Optional version component of both variants. Exact equality semantics. |
| `ElementVersionRef` (SK-07) | `toElementVersionRef` converts a fully specified `ElementIdRef` into one. |

---

## 16. Future Resolver Responsibilities

The following are **not** implemented in SK-08:

- Finding the semantic element in a registry.
- Resolving `QualifiedName` to a stable `SemanticElementId`.
- Validating that a version exists.
- Selecting a version when unspecified.
- Authorizing the reference for a specific actor.
- Evaluating `SemanticElementKind` constraints.
- Producing a compiled `SemanticElement` artifact.
- Caching or invalidating resolved definitions.

A future resolver contract will accept `ElementRef` as its input and return
resolved results through a separate interface.

---

## 17. Security Boundaries

Reference values are treated as untrusted input. The parser enforces:
- No executable reference strings (no `eval`, no dynamic import).
- No module paths derived from identifier values.
- No filesystem path construction.
- No shell injection risk.
- Bounded input sizes (reuses SK-01 / SK-03 / SK-04 / SK-07 length limits).
- No sensitive platform state is exposed in diagnostics.

---

## 18. Known Limitations

- `toString()` on `ElementRef` itself is not defined. Use `describeElementRef`
  for diagnostics or `serializeElementRef` for canonical JSON.
- No formal text grammar exists for `ElementRef` as a single string. A future
  ADR may define one if justified and unambiguous.
- Deferred automated verification: all behavioral scenarios are documented in
  `test-archive/SK-08/SK-08-deferred-tests.md`. Static typechecking passes.
- A tolerant-reader policy (ignoring unknown fields) was rejected for this
  foundational contract; future higher-level layers may relax this.
