# Semantic Kernel Architecture & Identity Primitives

> **Document Version:** 1.2.0\
> **Status:** Approved Architectural Specification  
> **Layer:** `B. Semantic Kernel` (`layer:kernel`)  
> **Milestone:** `SK-01 through SK-07 — Semantic Kernel Foundations`\
> **Package:** `@ecosystem/semantic-kernel`  
> **Audience:** Core Meta-Model Architects, Compiler Engineers, Platform Integrators

---

## 1. Overview & Architectural Role

The **Semantic Kernel** (`@ecosystem/semantic-kernel`) represents the irreducible, zero-dependency foundation of the Model-Driven Enterprise Ecosystem Platform. It owns foundational semantic primitives, identity models, facet contracts, SemVer representations, and diagnostic contracts.

In accordance with the Architecture Constitution (`AGENTS.md`), the Semantic Kernel must remain:
- **Pure TypeScript:** Zero runtime framework dependencies (no `@nestjs/*`, no `@angular/*`, no `primeng`, no database drivers).
- **Universal Portability:** Fully functional across Node.js, modern web browsers, web workers, and edge environments without relying on server-only APIs (`node:fs`, `node:crypto`).
- **Completely Independent:** Has **ZERO dependencies** on the Compiler, Runtime, Application Hosts, Persistence, or Presentation layers.

---

## 2. Foundational Identity: `SemanticElementId` (SK-01)

### 2.1 Core Purpose & Semantics
`SemanticElementId` is an immutable, strongly typed, opaque value object representing the durable identity of one semantic element within the platform.

### 2.2 Critical Identity Separations
The platform strictly upholds orthogonal boundaries between identity and descriptive or structural models:

```text
SemanticElementId ≠ Element Name (Display label or title)
SemanticElementId ≠ QualifiedName (Scoped logical path, e.g., sales.Customer)
SemanticElementId ≠ Namespace (Bounded conceptual boundary, e.g., sales)
SemanticElementId ≠ SemanticVersion (Temporal evolution, e.g., 1.0.0)
SemanticElementId ≠ SemanticContextRef (Tenant/Organization resolution scope)
SemanticElementId ≠ Runtime InstanceId (Active in-memory entity record)
SemanticElementId ≠ Database Primary Key (Relational or document store ID)
SemanticElementId ≠ Compiler Artifact ID (Intermediate lowering hash)
```

### 2.3 Identity Stability Across Mutation
A semantic element retains its exact `SemanticElementId` when:
- Its display name or title changes (e.g., renamed from `sales.Customer` to `sales.Client`).
- Its documentation, comments, or metadata attributes change.
- A new `SemanticVersion` is cut.
- Its physical storage representation or database schema is migrated.

---

## 3. Representation Grammar & Decision

To ensure cross-runtime durability, zero collisions, and deterministic serialization, `SemanticElementId` adopts a strict canonical grammar:

### 3.1 Specification:
- **Accepted Input Type:** String primitive only. All other types (`null`, `undefined`, number, boolean, object, array, symbol, bigint) are rejected.
- **Length Bounds:** Minimum **3** characters; Maximum **128** characters.
- **Character Set:** Alphanumeric (`a-z`, `A-Z`, `0-9`), hyphen (`-`), underscore (`_`), dot (`.`), colon (`:`).
- **Boundary Anchors:** Must both start and end with an alphanumeric character (`[a-zA-Z0-9]`).
- **Whitespace Policy:** Leading, trailing, and embedded whitespace are strictly forbidden (no silent trimming).
- **Regular Expression:**
  ```regexp
  ^[a-zA-Z0-9][a-zA-Z0-9._:-]{1,126}[a-zA-Z0-9]$
  ```
- **Case Sensitivity:** Case is preserved with exact ordinal value comparison (`===`). Differently cased values represent distinct identities.

### 3.2 Valid Examples:
- Canonical UUID: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- Prefixed Opaque ID: `typ_customer_123`, `elem_01h7x8p9q2r3`
- URN Identifier: `urn:ecosystem:type:order`
- Legacy Scoped ID: `ecosystem.types:CustomerOrder`

---

## 4. Construction & Validation API

The `SemanticElementId` constructor is private to guarantee that no unvalidated instances can ever exist:

```typescript
import { SemanticElementId, SemanticElementIdValidationError } from '@ecosystem/semantic-kernel';

// 1. Throwing parse (Primary entry point)
try {
  const id = SemanticElementId.parse('typ_customer_123');
  console.log(id.toString()); // "typ_customer_123"
} catch (err) {
  if (err instanceof SemanticElementIdValidationError) {
    console.error(`Validation failed: [${err.code}] ${err.message}`);
  }
}

// 2. Non-throwing parse (Discriminated union)
const result = SemanticElementId.tryParse('invalid id with spaces');
if (result.ok) {
  const id = result.value;
} else {
  console.error(result.error.code); // 'SEMANTIC_ELEMENT_ID_WHITESPACE'
}

// 3. Type guard validation
if (SemanticElementId.isValid(someInput)) {
  // someInput is typed as valid string
}
```

---

## 5. Value Equality & Immutability

### 5.1 Value-Based Equality
Two `SemanticElementId` instances compare equal if and only if their canonical string representations are identical:

```typescript
const idA = SemanticElementId.parse('typ_customer_123');
const idB = SemanticElementId.parse('typ_customer_123');
const idC = SemanticElementId.parse('typ_customer_456');

idA.equals(idB); // true (distinct objects, equal value)
idA.equals(idC); // false
idA.equals('typ_customer_123'); // false (type-safe, non-instance rejected)
idA.equals(null); // false (safe null handling)
```

### 5.2 Deep Immutability
- Instances are frozen at construction via `Object.freeze(this)`.
- Internal fields are `readonly` and inaccessible from external callers.
- State cannot be modified through serialization or reflection.

---

## 6. Serialization & Round-Trip Guarantees

`SemanticElementId` serializes directly to its canonical string representation:
- `id.toString()` returns the exact canonical string.
- `id.toJSON()` returns the exact canonical string.

### Round-Trip Invariant:
```text
SemanticElementId
      ↓  (toJSON / toString)
Canonical String Primitive
      ↓  (JSON.stringify / HTTP payload)
JSON Value
      ↓  (JSON.parse)
Deserialized String
      ↓  (SemanticElementId.parse)
Equivalent SemanticElementId
```

Reconstruction through `parse()` produces an object that satisfies:
```typescript
SemanticElementId.parse(JSON.parse(JSON.stringify(id))).equals(id) === true
```

---

## 7. Error Handling & Diagnostic Codes

Invalid construction inputs throw or return `SemanticElementIdValidationError` with dedicated error codes:

| Error Code | Trigger Condition |
| :--- | :--- |
| `SEMANTIC_ELEMENT_ID_NON_STRING` | Input is not a primitive string (null, undefined, number, object, array, etc.). |
| `SEMANTIC_ELEMENT_ID_EMPTY` | Input is an empty string (`""`). |
| `SEMANTIC_ELEMENT_ID_WHITESPACE` | Input contains leading, trailing, or embedded spaces (`" typ_1"`, `"typ 1"`). |
| `SEMANTIC_ELEMENT_ID_TOO_SHORT` | Input length is less than 3 characters. |
| `SEMANTIC_ELEMENT_ID_TOO_LONG` | Input length exceeds 128 characters. |
| `SEMANTIC_ELEMENT_ID_INVALID_FORMAT` | Input starts/ends with punctuation or contains forbidden characters. |

---

## 8. Identifier Generation Boundary

`SK-01` explicitly separates **Identifier Validation** from **Identifier Generation**:
- Validation and parsing are fully implemented and deterministic.
- Global identity allocation / generation (e.g. UUID v7 generation, central counter allocation) is intentionally deferred to dedicated identifier generator services or authoring tooling to preserve kernel minimalism and avoid non-deterministic dependencies (timestamps, random number generators) within core value objects.

---

## 9. Foundational Naming Scope: `Namespace` (SK-02)

### 9.1 Core Purpose & Semantics
`Namespace` is an immutable, strongly typed value object representing a canonical semantic naming scope. It organizes semantic element names across the platform into logical hierarchical scopes.

### 9.2 Critical Orthogonal Separations
`Namespace` preserves strict boundaries against related concepts:
- **`Namespace ≠ SemanticElementId`**: A namespace organizes names; an ID provides immutable, opaque element identity. Changing a namespace spelling does not alter an element's durable `SemanticElementId`.
- **`Namespace ≠ QualifiedName`**: A namespace defines the naming scope; `QualifiedName` (SK-03) will combine a namespace with a local name.
- **`Namespace ≠ SemanticContextRef`**: A namespace is a naming scope; `SemanticContextRef` (SK-04) defines the contextual interpretation boundary.
- **`Namespace ≠ TenantId / OrganizationId`**: A namespace does not represent a tenant or security partition. Possession of `enterprise.sales` grants zero access to sales data.
- **`Namespace ≠ PackageId`**: A semantic namespace is decoupled from npm/pnpm packages or file paths.
- **`Namespace ≠ Database Schema / Path`**: A namespace is not a filesystem path, URL, or relational schema.

### 9.3 Canonical Grammar
The canonical grammar for `Namespace` v0 is defined as:
```text
namespace := segment ("." segment)*
segment   := first_character subsequent_character*
first_character      := ASCII letter ([a-zA-Z])
subsequent_character := ASCII letter | digit | "_" ([a-zA-Z0-9_])
```

- **Separator:** Strict single dot (`.`).
- **Case Sensitivity:** Strictly case-sensitive. Canonical spelling is preserved (`sales` ≠ `Sales`).
- **Whitespace Policy:** Leading, trailing, and embedded whitespace are strictly forbidden (no silent trimming).
- **Unicode Policy:** ASCII-only letters, digits, and underscores in v0.
- **Resource Bounds:**
  - Maximum overall length: **255** characters (`NAMESPACE_MAX_LENGTH`).
  - Maximum segment length: **63** characters (`NAMESPACE_MAX_SEGMENT_LENGTH`).
  - Maximum depth (segment count): **16** (`NAMESPACE_MAX_DEPTH`).
  - Minimum depth: **1** (`NAMESPACE_MIN_DEPTH`).

### 9.4 Implemented API Surface
```typescript
class Namespace {
  static parse(raw: unknown): Namespace;
  static tryParse(raw: unknown): NamespaceParseResult;
  static isValid(raw: unknown): raw is string;

  equals(other: unknown): boolean;
  toString(): string;
  toJSON(): string;
  valueOf(): string;

  segments(): readonly string[];
  depth(): number;
  parent(): Namespace | undefined;
  child(segment: string): Namespace;
  isAncestorOf(other: unknown): boolean;
}
```

### 9.5 Segment Semantics & Syntactic Hierarchy
- `segments()`: Returns an immutable, frozen snapshot of logical segments.
- `depth()`: Returns the number of segments (e.g., `sales` = 1, `enterprise.sales` = 2).
- `parent()`: Returns the syntactic parent `Namespace`, or `undefined` if single-segment (no fictional empty root namespace).
- `child(segment: string)`: Appends a single validated segment. Rejects dotted strings or invalid characters.
- `isAncestorOf(other: unknown)`: Checks strict syntactic ancestry based on segment boundaries, not raw substring prefixes (`enterprise.sales` is NOT an ancestor of `enterprise.salesforce`).

### 9.6 Value Equality & Immutability
- Evaluates exact canonical ordinal string equality (`===`).
- State is sealed at construction using `Object.freeze(this)` and `Object.freeze(this.#segments)`.

### 9.7 Serialization Round-Trip
- `toJSON()` and `toString()` return the exact canonical dotted string primitive.
- Round-trip invariant:
  `Namespace.parse(JSON.parse(JSON.stringify(ns))).equals(ns) === true`

### 9.8 Diagnostic Error Codes
| Error Code | Trigger Condition |
| :--- | :--- |
| `NAMESPACE_NON_STRING` | Input is not a string primitive (null, undefined, number, object, etc.). |
| `NAMESPACE_EMPTY` | Input is an empty string (`""`). |
| `NAMESPACE_WHITESPACE` | Input contains whitespace characters. |
| `NAMESPACE_TOO_LONG` | Total length exceeds 255 characters. |
| `NAMESPACE_TOO_DEEP` | Segment count exceeds 16 segments. |
| `NAMESPACE_EMPTY_SEGMENT` | Consecutive dots (`sales..crm`), leading dot (`.sales`), or trailing dot (`sales.`). |
| `NAMESPACE_SEGMENT_TOO_LONG` | Any individual segment exceeds 63 characters. |
| `NAMESPACE_INVALID_SEGMENT_START` | Segment begins with a non-ASCII letter (digit or underscore, e.g. `123sales`, `_sales`). |
| `NAMESPACE_INVALID_CHARACTER` | Segment contains disallowed characters (hyphen, slash, backslash, colon, etc.). |

---

## 10. Foundational Qualified Name: `QualifiedName` (SK-03)

### 10.1 Core Purpose & Semantics
`QualifiedName` is an immutable, strictly validated, canonical value object combining an existing `Namespace` with exactly one local semantic element name. It establishes the canonical name of a semantic element within its naming scope.

### 10.2 Critical Orthogonal Separations
- **`QualifiedName ≠ SemanticElementId`**: A qualified name designates a semantic name in a naming scope; `SemanticElementId` provides durable, opaque element identity. Renaming an element (e.g. `sales.Customer` ──► `sales.Client`) modifies its `QualifiedName` without changing its stable `SemanticElementId`.
- **`QualifiedName ≠ Namespace`**: A qualified name combines a namespace with one local name segment. It is not an undifferentiated namespace.
- **`QualifiedName ≠ SemanticContextRef`**: `QualifiedName` names an element; `SemanticContextRef` (SK-04) defines the contextual interpretation boundary. The same qualified name spelling can occur in multiple contexts.
- **`QualifiedName ≠ SemanticVersion`**: `QualifiedName` expresses naming only. Version suffixes (`sales.Customer@1.0.0`) are not part of SK-03 QualifiedName grammar.
- **`QualifiedName ≠ ElementRef`**: `QualifiedName` is a static naming value object, not a resolvable reference or dependency association.
- **`QualifiedName ≠ TenantId / Authorization`**: Naming does not grant access or represent a security partition.
- **`QualifiedName ≠ Resolver`**: Syntactic validity does not prove that the element exists or is registered in a catalog.

### 10.3 Canonical Grammar & Decomposition
- **Grammar:** `qualifiedName := namespace "." localName`
- **Local Name Grammar:**
  ```text
  localName := firstCharacter subsequentCharacter*
  firstCharacter      := ASCII letter ([a-zA-Z])
  subsequentCharacter := ASCII letter | digit | "_" ([a-zA-Z0-9_])
  ```
- **Final Separator Parsing:** The input string is partitioned at the **final** dot separator (`raw.lastIndexOf('.')`). The prefix is validated as a `Namespace`, and the suffix is validated as a local name.
- **Resource Bounds:**
  - Maximum local name length: **63** characters (`LOCAL_NAME_MAX_LENGTH`).
  - Maximum overall qualified name length: **319** characters (`QUALIFIED_NAME_MAX_LENGTH` = 255 + 1 + 63).
- **Whitespace & Case Policy:** Leading, trailing, and embedded whitespace are strictly rejected (`QUALIFIED_NAME_WHITESPACE`). Case is strictly preserved and evaluated ordinally.

### 10.4 Implemented API Surface
```typescript
class QualifiedName {
  static parse(raw: unknown): QualifiedName;
  static tryParse(raw: unknown): QualifiedNameParseResult;
  static isValid(raw: unknown): raw is string;

  static fromParts(namespace: Namespace, localName: string): QualifiedName;
  static tryFromParts(namespace: Namespace, localName: string): QualifiedNameParseResult;

  get namespace(): Namespace;
  get localName(): string;

  equals(other: unknown): boolean;
  toString(): string;
  toJSON(): string;
  valueOf(): string;
}
```

### 10.5 Construction Equivalence
Parsing from canonical string and composing from parts enforce identical invariants:
```typescript
QualifiedName.parse('enterprise.sales.Customer')
  .equals(QualifiedName.fromParts(Namespace.parse('enterprise.sales'), 'Customer')) === true
```

### 10.6 Value Equality & Serialization
- Value equality evaluates: `this.namespace.equals(other.namespace) && this.localName === other.localName`.
- `toString()` and `toJSON()` serialize directly to `${namespace.toString()}.${localName}`.
- Round-trip invariant:
  `QualifiedName.parse(JSON.parse(JSON.stringify(qn))).equals(qn) === true`

### 10.7 Diagnostic Error Codes
| Error Code | Trigger Condition |
| :--- | :--- |
| `QUALIFIED_NAME_NON_STRING` | Input is not a string primitive. |
| `QUALIFIED_NAME_EMPTY` | Input is an empty string (`""`). |
| `QUALIFIED_NAME_WHITESPACE` | Input contains whitespace characters. |
| `QUALIFIED_NAME_TOO_LONG` | Total length exceeds 319 characters. |
| `QUALIFIED_NAME_MISSING_NAMESPACE` | Input contains no namespace separator (e.g. `"Customer"`). |
| `QUALIFIED_NAME_EMPTY_NAMESPACE` | Input begins with separator (e.g. `".Customer"`). |
| `QUALIFIED_NAME_EMPTY_LOCAL_NAME` | Input ends with separator (e.g. `"sales."`). |
| `QUALIFIED_NAME_INVALID_NAMESPACE` | Namespace portion violates Namespace grammar. |
| `QUALIFIED_NAME_LOCAL_NAME_TOO_LONG` | Local name exceeds 63 characters. |
| `QUALIFIED_NAME_INVALID_LOCAL_NAME_START` | Local name begins with non-ASCII letter (e.g. `123Customer`). |
| `QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER` | Local name contains invalid characters (hyphen, slash, dot, etc.). |
| `QUALIFIED_NAME_INVALID_PARTS` | Non-Namespace instance passed to `fromParts()`. |

---

## 11. Foundational Context Reference: `SemanticContextRef` (SK-04)

### 11.1 Core Purpose & Semantics
`SemanticContextRef` is an immutable, strictly validated, opaque value object representing an explicit semantic interpretation boundary. In accordance with the core architectural principle **"Context Owns Meaning"**, semantic definitions, names, and references derive concrete meaning exclusively within their bounded context.

### 11.2 Critical Orthogonal Separations
- **`SemanticContextRef ≠ SemanticElementId`**: A context reference identifies an interpretation boundary; `SemanticElementId` provides durable, opaque identity to an element. Cross-type equality is strictly prohibited even if textual strings coincide.
- **`SemanticContextRef ≠ Namespace`**: A namespace organizes semantic names into a hierarchical scope; `SemanticContextRef` identifies the context in which names are interpreted. Context identity is not derived from namespace text.
- **`SemanticContextRef ≠ QualifiedName`**: `QualifiedName` names an element (`sales.Customer`); `SemanticContextRef` identifies the context boundary (`sales-context`). The same qualified name may exist with different meanings across separate contexts.
- **`SemanticContextRef ≠ TenantId / OrganizationId`**: A context reference is a semantic boundary, not an infrastructure tenant or legal organization. A tenant may possess multiple semantic contexts.
- **`SemanticContextRef ≠ Runtime ExecutionContext`**: `SemanticContextRef` is declarative and compile-time stable; `ExecutionContext` represents an active runtime execution trace and transaction.
- **`SemanticContextRef ≠ Authorization Scope`**: Possession or syntax validity of a context reference confers zero authorization or permissions.
- **`SemanticContextRef ≠ Context Definition / Registry`**: SK-04 implements only the opaque reference; context catalogs, lifecycles (ACTIVE/DEPLOYED), and resolution services are explicitly deferred.

### 11.3 Canonical Grammar & Resource Bounds
```text
contextRef := firstCharacter subsequentCharacter*
firstCharacter      := ASCII letter ([a-zA-Z])
subsequentCharacter := ASCII letter | digit | "_" | "-" ([a-zA-Z0-9_-])
```
- **Bounds:** Minimum **1** character (`SEMANTIC_CONTEXT_REF_MIN_LENGTH`); Maximum **128** characters (`SEMANTIC_CONTEXT_REF_MAX_LENGTH`).
- **Whitespace & Case Policy:** Leading, trailing, and embedded whitespace are strictly forbidden (`SEMANTIC_CONTEXT_REF_WHITESPACE`). Case is strictly preserved and compared ordinally (`sales-context` ≠ `Sales-context`).
- **Unicode Policy:** ASCII letters, digits, underscores, and hyphens in v0. Dotted separators (`.`), slashes (`/`), colons (`:`), and version suffixes (`@1.0.0`) are forbidden.

### 11.4 Implemented API Surface
```typescript
class SemanticContextRef {
  static parse(raw: unknown): SemanticContextRef;
  static tryParse(raw: unknown): SemanticContextRefParseResult;
  static isValid(raw: unknown): raw is string;

  equals(other: unknown): boolean;
  toString(): string;
  toJSON(): string;
  valueOf(): string;
}
```

### 11.5 Cross-Type Safety & Immutability
- Instances are frozen at construction via `Object.freeze(this)`.
- `equals(other)` evaluates exact canonical ordinal equality and verifies `other instanceof SemanticContextRef`. Comparing against strings, `SemanticElementId`, `Namespace`, or `QualifiedName` evaluates safely to `false`.

### 11.6 Serialization Round-Trip
- `toString()` and `toJSON()` serialize directly to the canonical context string.
- Round-trip invariant:
  `SemanticContextRef.parse(JSON.parse(JSON.stringify(ref))).equals(ref) === true`

### 11.7 Diagnostic Error Codes
| Error Code | Trigger Condition |
| :--- | :--- |
| `SEMANTIC_CONTEXT_REF_NON_STRING` | Input is not a string primitive (null, undefined, number, object, etc.). |
| `SEMANTIC_CONTEXT_REF_EMPTY` | Input is an empty string (`""`). |
| `SEMANTIC_CONTEXT_REF_WHITESPACE` | Input contains whitespace characters. |
| `SEMANTIC_CONTEXT_REF_TOO_LONG` | Total length exceeds 128 characters. |
| `SEMANTIC_CONTEXT_REF_INVALID_START` | Input starts with a non-ASCII letter (digit, hyphen, underscore). |
| `SEMANTIC_CONTEXT_REF_INVALID_CHARACTER` | Input contains disallowed characters (dot, slash, colon, etc.). |

---

## 12. SemanticElement Base Contract (SK-05)

### 12.1 Concept & Purpose
`SemanticElement` is the smallest stable, strongly typed, readonly semantic-definition contract in the platform. It composes three irreducible primitives:
- `id`: `SemanticElementId` (SK-01) — Stable platform-independent identity (URN).
- `qualifiedName`: `QualifiedName` (SK-03) — Canonical semantic naming within a namespace scope.
- `contextRef`: `SemanticContextRef` (SK-04) — Explicit semantic interpretation boundary.

### 12.2 Architectural Axiom: Composition Over Inheritance
- `SemanticElement` is declared as a pure TypeScript `interface`, NOT a concrete runtime class or mandatory superclass.
- Future semantic definitions (types, fields, relationships, actions, events) compose or specialize this contract without extending a monolithic class hierarchy.

### 12.3 Strict Minimalism & Excluded Concerns
The base contract strictly excludes:
- `kind` (owned by SK-06)
- `version` (owned by SK-07)
- `facets` (owned by SK-10)
- Generic metadata escape hatches (`Record<string, unknown>` bags)
- Persistence, lifecycle, timestamps, permissions, and runtime instance state.

### 12.4 Runtime Immutability & Validation Helper
- `createSemanticElement(params)` validates that all three fields are authentic value object instances (`instanceof`) and returns an immutable frozen object via `Object.freeze()`.
- `isSemanticElement(value)` provides a runtime type guard verifying authenticity of constituent primitives.

### 12.5 Equality & Renaming Semantics
- Identity equality is determined strictly by `elementA.id.equals(elementB.id)`.
- Contextual naming equality is determined by `elementA.qualifiedName.equals(elementB.qualifiedName) && elementA.contextRef.equals(elementB.contextRef)`.
- An authorized rename produces a new immutable definition sharing the same stable `SemanticElementId` with an altered `QualifiedName`.

---

## 13. Semantic Element Kinds (SK-06)

### 13.1 Purpose and Ownership

`SemanticElementKind` classifies a semantic **definition** at the platform level.
It answers what category of definition an element declares. The implementation
belongs to `platform/kernel/semantic-kernel/src/elements/semantic-element-kind.ts`
and is published through `@ecosystem/semantic-kernel`.

A kind does not identify an element, name it, resolve its context, describe an
instance's data, select a compiler pass, provide an executor, map a database
table, or grant permission. It is independent of `SemanticElementId`,
`Namespace`, `QualifiedName`, `SemanticContextRef`, versions, references, and
primitive semantic value types.

### 13.2 Authoritative SK-06 Baseline

No separate comprehensive taxonomy was approved before SK-06. The baseline
retains exactly the nine lowercase values explicitly named by the ARC-01
`SemanticElementKind` stub. Model Core already uses `type` and `field`, so the
canonical case is preserved. This section and ADR-014 establish the closed
SK-06 baseline; task examples are not an additional source of recognized codes.

| API Constant | Canonical Code | Definition Category |
| --- | --- | --- |
| `SemanticElementKinds.TYPE` | `type` | A semantic type definition describing a domain's data or conceptual type. |
| `SemanticElementKinds.FIELD` | `field` | A named field or attribute definition within a semantic structure. |
| `SemanticElementKinds.RELATIONSHIP` | `relationship` | A definition of an association between semantic elements or types. |
| `SemanticElementKinds.ACTION` | `action` | A declared operation expressing intent to produce a meaningful effect. |
| `SemanticElementKinds.EVENT` | `event` | A definition of an immutable fact that has occurred; not a future command. |
| `SemanticElementKinds.CAPABILITY` | `capability` | A declared functional ability; authority to exercise it is governed separately. |
| `SemanticElementKinds.FACET` | `facet` | A definition of an orthogonal semantic concern that can be composed with elements. |
| `SemanticElementKinds.NAMESPACE` | `namespace` | A definition declaring a semantic naming scope; not a tenant or storage partition. |
| `SemanticElementKinds.APPLICATION` | `application` | A definition composing semantic application intent; not a running host process or UI component. |

These codes classify definitions. In particular, `facet` does not implement
SK-10, and `namespace` does not turn every SK-02 `Namespace` value object into a
`SemanticElement`. Recognition does not implement concrete Action, Event,
Relationship, Capability, Facet, Namespace, or Application definitions.

`policy`, `constraint`, `expression`, and `workflow` remain unrecognized future
candidates. Business concepts (`customer`, `invoice`, `employee`, `sales_order`)
and scalar names (`string`, `integer`, `boolean`, `decimal`) are not built-in
kinds. The baseline contains no generic `other` fallback.

### 13.3 Representation and Immutability

`SemanticElementKinds` is a frozen literal object. Its values derive the closed
`SemanticElementKind` string-literal union. No `| string`, unsafe parsing cast,
numeric enum, class wrapper, display label, or mutable registry widens the union.

The internal membership collection is derived from that one declaration and
frozen. Classification strings are immutable primitives. Equality uses `===`
on canonical values; declaration order and object reference identity carry no
semantic meaning. `Object.values(SemanticElementKinds)` permits enumeration
without granting mutation or registration access.

### 13.4 Public API and Validation

```typescript
import {
  SemanticElementKinds,
  isSemanticElementKind,
  parseSemanticElementKind,
  SemanticElementKindValidationError,
  SEMANTIC_ELEMENT_KIND_ERROR_CODES,
  type SemanticElementKind,
  type SemanticElementKindErrorCode,
} from '@ecosystem/semantic-kernel';
```

| API | Contract |
| --- | --- |
| `SemanticElementKinds` | Frozen named constants containing all nine canonical codes. |
| `SemanticElementKind` | Closed union derived from those values; supports compile-time narrowing and exhaustive handling. |
| `isSemanticElementKind(value: unknown)` | Membership guard; returns true only for an exact recognized string primitive. |
| `parseSemanticElementKind(value: unknown)` | Returns the unchanged canonical value or throws a controlled validation error. |
| `SemanticElementKindValidationError` | Extends the existing `SemanticKernelError` and exposes a typed `code`. |
| `SemanticElementKindErrorCode` | Union of the two stable diagnostic codes declared below. |
| `SEMANTIC_ELEMENT_KIND_ERROR_CODES` | Frozen names for those diagnostic codes. |

| Error Code | Input Category |
| --- | --- |
| `SEMANTIC_ELEMENT_KIND_NON_STRING` | `undefined`, `null`, number, boolean, array, object, symbol, bigint, function, or boxed string. |
| `SEMANTIC_ELEMENT_KIND_UNKNOWN_KIND` | Any string outside the nine canonical codes, including empty strings, unknown categories, case variations, whitespace, version suffixes, and display labels. |

Parsing is strict and case-sensitive. `type` is accepted; `TYPE` and `Type` are
not. The uppercase constant property name is not an external code. Leading,
trailing, embedded, newline, tab, and Unicode whitespace are not trimmed.
Adapters can explicitly clean user input before calling the Kernel, but the
Kernel performs no implicit normalization or coercion.

The guard and parser share one membership rule. Non-string input is rejected
before any caller-defined `toString()` or primitive conversion can run. Error
messages do not interpolate raw untrusted input. There is no default kind.

### 13.5 Canonical JSON Interchange

A kind serializes as a native JSON string, for example `"type"`. Receiving JSON
requires validation of the decoded value; a cast does not establish validity.

```typescript
const kind: SemanticElementKind = SemanticElementKinds.TYPE;
const serialized = JSON.stringify(kind);
const decoded: unknown = JSON.parse(serialized);
const restored = parseSemanticElementKind(decoded);
```

The intended round-trip contract is `restored === kind`. This example documents
the API; it is not evidence of an executed behavioral test. Serialization has no
numeric ordinals, implementation-specific object fields, localized labels, or
ordering dependencies.

### 13.6 SK-05 Integration and Compatibility

The public SK-05 `SemanticElement`, its factory, and its guard remain unchanged.
Its required properties are still only `id`, `qualifiedName`, and `contextRef`.
There is no new mandatory `kind` and no speculative kind-aware extension
interface. A future consumer whose own definition contract requires classification
can compose the base with a readonly `SemanticElementKind` property.

The ARC-01 legacy module re-exports the same SK-06 type rather than retaining a
competing taxonomy. Its internal legacy guard validates `kind` with the new
membership guard. All nine named codes and current Model Core `type` / `field`
values remain valid. Removing the old `| string` deliberately rejects arbitrary
string assignments and unknown legacy kind values; callers handling external
strings must parse them and handle controlled failures. This tightening is an
explicit compatibility restriction, not a promise of full compatibility with
previous arbitrary-string usage.

Kind classification is never inferred from an ID prefix, a qualified name, or a
context. For example, a Mini Sales Customer definition can independently declare
ID `typ_customer_123`, name `sales.Customer`, context `sales-context`, and kind
`type`. A domain concept named Customer is not the foundational kind `customer`.

### 13.7 Extension and Evolution Boundaries

Future additions to the closed union require compatibility review, including
exhaustive consumers. Existing codes retain their meaning. Removal or renaming
requires explicit migration planning. Kind values carry no version suffix, and
SK-06 introduces no SemanticVersion, migration, or version-selection system.

Open extension kinds require a separate explicit contract for ownership,
namespacing, collision protection, and compatibility. No registration,
unregistration, discovery, plugin loading, or arbitrary extension string is
implemented here. Display labels and translations belong to presentation
adapters and do not affect equality or wire values.

### 13.8 Independence, Determinism, and Verification Limits

Parsing and membership depend only on the supplied input and fixed recognized
set. They do not access timestamps, randomness, environment variables, tenants,
users, files, networks, databases, or framework state. No NestJS, Angular,
PrimeNG, Node-only API, Compiler, Runtime, or persistence dependency is added.

Recognizing `action` does not execute an Action; recognizing `event` does not
publish an Event; recognizing any kind provides no compiler compatibility,
storage mapping, or authorization. No API endpoint, CLI command, registry,
handler, ORM mapping, or later Semantic Kernel capability is introduced.

Automated tests are intentionally not created, modified, or executed for SK-06.
The single archive `test-archive/SK-06/SK-06-deferred-tests.md` records expected
verification scenarios as `NOT_RUN — DEFERRED`. Typechecking, non-test builds,
linting where tooling is available, and static source inspection are separate
from behavioral verification. Full runtime guarantees remain deferred until
authorized automated verification is performed.

---

## 14. Exact Semantic Version References (SK-07)

### 14.1 Concepts and Ownership

`SemanticVersion` represents one exact semantic **definition version**.
`ElementVersionRef` combines one existing stable `SemanticElementId` with one
exact `SemanticVersion`. Both live in the Kernel's `src/versioning` subsystem and
are exported through `@ecosystem/semantic-kernel`.

A version does not replace identity. Customer definitions at `1.0.0` and `1.1.0`
can share ID `customer-element-id` while producing different exact references.
Versions do not denote instance/storage revisions, package releases, compiler
versions, deployments, artifact revisions, publication state, or authorization.

### 14.2 Exact Grammar and Canonical Spelling

The grammar follows [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html) for exact
versions, within the explicit platform bounds below:

```text
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

Core components are canonical nonnegative decimal integers. Leading zeroes,
signs, missing components, and extra components are invalid. Prerelease and build
lists consist of nonempty dot-separated ASCII alphanumeric/hyphen identifiers.
Purely numeric prerelease identifiers cannot have leading zeroes; numeric build
identifiers can. Case and the full supplied spelling are preserved exactly.

Valid examples include `0.0.0`, `1.2.3`, `2.0.0-beta.2`, and
`2.1.0-rc.1+build.45`. Empty text, whitespace, `v1.2.3`, `01.2.3`, empty
identifiers, non-ASCII digits or separators, and duplicate build separators are
rejected. No trimming, case folding, Unicode normalization, or object coercion
occurs. `latest`, `stable`, ranges, wildcards, and partial versions are rejected
instead of resolved.

### 14.3 Numeric Precision and Resource Bounds

| Exported Constant | Bound |
| --- | --- |
| `SEMANTIC_VERSION_MAX_COMPONENT` | `9007199254740991` (`Number.MAX_SAFE_INTEGER`), inclusive, for each core component. |
| `SEMANTIC_VERSION_MAX_LENGTH` | 256 characters for the complete exact version. |
| `SEMANTIC_VERSION_MAX_IDENTIFIER_LENGTH` | 64 characters per prerelease or build identifier. |
| `SEMANTIC_VERSION_MAX_PRERELEASE_IDENTIFIERS` | 16 prerelease identifiers. |
| `SEMANTIC_VERSION_MAX_BUILD_IDENTIFIERS` | 16 build identifiers. |

All bounds apply together; the full-string bound can be stricter than the sum of
the identifier allowances. Oversized input is rejected before parsing work, never
truncated. Core decimal text is compared to the maximum before Number conversion;
this prevents unsafe rounding. Ordering uses comparisons rather than subtracting
components or parsing a full version as a floating-point number.

Numeric prerelease identifiers remain canonical digit strings and can exceed
the Number safe range within the 64-character identifier limit. Their digit
counts, followed by ordinal text comparison for equal counts, provide exact
numeric ordering without Number conversion. ASCII ordinal comparison is used for
non-numeric identifiers; locale settings have no effect.

### 14.4 SemanticVersion API, Equality, and Precedence

| API | Contract |
| --- | --- |
| `SemanticVersion.parse(value: unknown)` | Strict throwing parse of an exact canonical version string. |
| `SemanticVersion.tryParse(value: unknown)` | Discriminated `{ ok: true, value }` / `{ ok: false, error }` result for validation failures. |
| `SemanticVersion.isValid(value: unknown)` | Guard validating a raw version string; class instances are not raw strings. |
| `major`, `minor`, `patch` | Readonly safe integer components. |
| `prerelease`, `buildMetadata` | Readonly frozen identifier arrays; absent lists are empty. |
| `equals(other: unknown)` | Exact canonical equality, including identifier case and build metadata. |
| `comparePrecedence(other: SemanticVersion)` | Normalized `-1`, `0`, or `1`; compares core and prerelease, excluding build metadata. |
| `toString()`, `toJSON()` | Unchanged canonical full version as a native string. |

Construction is private. The instance and defensive copies of its arrays are
frozen; no setters, automatic increments, or mutable internal lists are exposed.

Precedence compares major/minor/patch numerically, then prerelease identifiers.
A stable version outranks its prerelease. Numeric identifiers compare numerically
and rank below non-numeric identifiers. Non-numeric identifiers compare in ASCII
order. After an equal prefix, the longer prerelease list has higher precedence.
Build metadata never determines precedence.

For example, `1.9.0` precedes `1.10.0`, `1.0.0-beta.2` precedes
`1.0.0-beta.11`, and `1.0.0-alpha` precedes `1.0.0`. Versions
`1.0.0+build.1` and `1.0.0+build.2` have equal precedence but are not exactly equal.
This distinction is explicit; comparison is not a compatibility analysis.

### 14.5 Exact ElementVersionRef Composition

```typescript
import {
  SemanticElementId,
  SemanticVersion,
  ElementVersionRef,
} from '@ecosystem/semantic-kernel';

const elementId = SemanticElementId.parse('customer-element-id');
const version = SemanticVersion.parse('1.1.0');
const reference = ElementVersionRef.fromParts(elementId, version);
```

Both components are mandatory authentic Kernel class instances, following the
existing `instanceof` convention. Raw strings, missing parts, names, contexts,
and selectors are not accepted as typed components. The existing ID is reused;
no identity is generated or changed. The reference is frozen and exposes only
readonly `elementId` and `version` components.

`reference.equals(other)` requires a reference instance, stable ID equality, and
full exact version equality. Equal precedence alone is insufficient. Changing
either ID or version, including build metadata, creates a different exact
reference. There is no custom textual `toString()` grammar or ambiguous delimiter.

### 14.6 Structured JSON Interchange and Deserialization

The reference's canonical wire representation is:

```json
{
  "elementId": "customer-element-id",
  "version": "1.1.0"
}
```

`toJSON()` returns a fresh frozen record of these two canonical strings.
`ElementVersionRef.fromJSON(value: unknown)` accepts an already decoded plain
record with exactly these two own enumerable data fields. Null-prototype records
are also supported. Arrays, null, string containers, class instances, inherited
fields, accessor fields, symbol/extra fields, and missing fields fail shape
validation. Accessor getters are not used to obtain component data.

ID data is parsed using the unchanged SK-01 grammar. Version data is parsed using
SemanticVersion. Invalid component values become controlled reference-boundary
errors. No cast turns wire strings into trusted value objects.

```typescript
const versionJSON = JSON.stringify(version);
const decodedVersion: unknown = JSON.parse(versionJSON);
const restoredVersion = SemanticVersion.parse(decodedVersion);

const referenceJSON = JSON.stringify(reference);
const decodedReference: unknown = JSON.parse(referenceJSON);
const restoredReference = ElementVersionRef.fromJSON(decodedReference);
```

The intended contracts are exact value equality after each reconstruction. These
examples document the APIs; they are not executed behavioral verification.

### 14.7 Errors and Validation Boundaries

`SemanticVersionValidationError` and `ElementVersionRefValidationError` extend the
existing `SemanticKernelError`. Their typed code unions are derived from frozen
`SEMANTIC_VERSION_ERROR_CODES` and `ELEMENT_VERSION_REF_ERROR_CODES` collections.
Messages do not echo raw untrusted version or reference data.

| SemanticVersion Code | Meaning |
| --- | --- |
| `SEMANTIC_VERSION_NON_STRING` | Input is not a string primitive. |
| `SEMANTIC_VERSION_EMPTY` | Input is an empty string. |
| `SEMANTIC_VERSION_TOO_LONG` | Full input exceeds the 256-character bound. |
| `SEMANTIC_VERSION_WHITESPACE` | Input contains whitespace, including Unicode whitespace. |
| `SEMANTIC_VERSION_INVALID_FORMAT` | Core component count or build separator structure is invalid. |
| `SEMANTIC_VERSION_INVALID_COMPONENT` | A core component is not a canonical nonnegative integer. |
| `SEMANTIC_VERSION_UNSAFE_COMPONENT` | A core component exceeds Number.MAX_SAFE_INTEGER. |
| `SEMANTIC_VERSION_INVALID_PRERELEASE` | Prerelease syntax, empty identifiers, or numeric leading zeroes are invalid. |
| `SEMANTIC_VERSION_INVALID_BUILD_METADATA` | Build identifier syntax or empty identifiers are invalid. |
| `SEMANTIC_VERSION_IDENTIFIER_TOO_LONG` | An identifier exceeds 64 characters. |
| `SEMANTIC_VERSION_TOO_MANY_IDENTIFIERS` | A prerelease/build list exceeds 16 identifiers. |
| `SEMANTIC_VERSION_INVALID_COMPARISON` | A precedence argument is not a SemanticVersion instance. |

| ElementVersionRef Code | Meaning |
| --- | --- |
| `ELEMENT_VERSION_REF_INVALID_SHAPE` | Decoded wire data is not the exact supported record shape or cannot be inspected. |
| `ELEMENT_VERSION_REF_INVALID_ID` | Typed composition lacks a SemanticElementId, or the wire ID fails SK-01 parsing. |
| `ELEMENT_VERSION_REF_INVALID_VERSION` | Typed composition lacks a SemanticVersion, or the wire version fails exact parsing. |

Version length validation precedes other string checks. Core validation precedes
identifier validation. Shape validation precedes ID and then version decoding.
These orders keep rejection deterministic. Component failure messages at the
reference boundary remain fixed rather than forwarding raw input summaries.

### 14.8 Existing VersionRef Compatibility

The ARC-01 `VersionRef` retains readonly number fields `major`, `minor`, and
`patch`, with optional string fields `prerelease` and `build`. Existing helper
signatures remain available through the public root:

- `parseVersion(string)` delegates to SemanticVersion and returns a frozen
  structural view, preserving full metadata text.
- `formatVersion(VersionRef)` validates safe numeric components and optional
  string fields before rendering and using the same exact parser.
- `compareVersions(a, b)` delegates to the authoritative precedence comparison
  and returns a normalized sign, including prerelease behavior.

There is no competing loose parser. Formerly accepted leading zeroes, malformed
identifier lists, unsafe components, and empty optional metadata now fail strict
validation. Structural negative zero, non-integers, and non-string optional
metadata also fail validation. The signed comparison contract remains supported;
callers must not interpret its result as numeric version distance or full exact
equality including build metadata. These compatibility changes are deliberate
and recorded in ADR-015.

### 14.9 Architectural Integration and Deferred Verification

SK-01 identity grammar, SK-02 Namespace, SK-03 QualifiedName, SK-04 context,
SK-05's three-field base, and SK-06's closed classifications remain unchanged.
No mandatory version is added to SemanticElement, no versioned base class is
introduced, and no kind-specific version parser is selected.

A valid exact reference does not establish definition existence, publication,
compatibility, access, compiler support, or runtime activation. ID text remains
opaque; spelling resembling a name is not resolved. Context and tenant scope may
be supplied separately to a future resolver, without being inferred here.
ElementRef, selectors, ranges, registries, publication, migrations, compatibility
analysis, automatic version bumping, artifact revisions, instance revisions, and
storage revisions remain outside SK-07.

All new behavior is portable Pure TypeScript. Parsing, comparison, composition,
and serialization use no I/O, Node-only API, database, framework, timestamps,
randomness, environment, locale, active tenant, or current user. No REST endpoint
or CLI command is added.

The single archive `test-archive/SK-07/SK-07-deferred-tests.md` specifies future
scenarios as `NOT_RUN — DEFERRED`. No automated test file is created or modified,
and no test runner, architecture test, or ad hoc parsing experiment is executed.
Permitted static checks are reported separately; runtime guarantees still need
future authorized behavioral verification. Core numeric and resource limits, the
strict two-field wire shape, and future resolution needs are explicit limitations.
