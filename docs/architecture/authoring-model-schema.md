# Authoring Model Schema (MOD-01)

## 1. Executive Overview & Purpose

The **Authoring Model Schema** establishes the foundational structural contract for authored semantic model documents within the Model-Driven Enterprise Ecosystem Platform. It provides a versioned, deterministic, strongly typed, and serialization-friendly specification that defines the permitted structure of authored documents (`AuthoringDocument`).

Its core responsibility is to preserve authoritative semantic identity, type, field, facet, constraint, and reference information as authored, without implementing file loading (MOD-02), source location tracking (MOD-03), canonical model normalization (MOD-04), reference resolution, compilation, or runtime execution.

---

## 2. Architectural Ownership & Layer Boundaries

- **Layer:** D. Model Authoring & Canonical Model — Model Authoring Boundary.
- **Package:** `@ecosystem/model-core` (`platform/model/model-core`).
- **Dependency Invariant:** Model Authoring depends strictly downward on the Semantic Type System and the Semantic Kernel.
- **Forbidden Dependencies:**
  - Zero dependencies on Compiler Subsystem implementations.
  - Zero dependencies on Runtime Engine implementations.
  - Zero dependencies on Presentation adapters (`@angular/*`, `primeng/*`, etc.).
  - Zero dependencies on Backend frameworks (`@nestjs/*`, Express, etc.).
  - Zero dependencies on ORMs, databases, or Node.js-only APIs (`node:fs`, `node:path`).

```text
┌─────────────────────────────────────────────────────────────┐
│                 Model Authoring (MOD-01)                    │
│      (AuthoringDocument, AuthoringSchemaVersion, Schema)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Semantic Type System                       │
│    (TypeDefinition, FieldDefinition, DataFacet, Rules)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Semantic Meta-Model Kernel                  │
│    (SemanticElementId, QualifiedName, Version, Facets)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Relationship to Semantic Kernel and TYPE-01 through TYPE-08

The Authoring Model Schema reuses and strictly preserves the authoritative contracts established across preceding milestones:

| Preceding Milestone | Reused Authoritative Contract | Preservation in MOD-01 Authoring Schema |
| :--- | :--- | :--- |
| **SK-01** | `SemanticElementId` | Preserved as exact, stable element identity string in definition JSON. |
| **SK-02 / SK-03** | `Namespace` / `QualifiedName` | Preserved as exact canonical qualified name string (e.g. `sales.Customer`). |
| **SK-04** | `SemanticContextRef` | Preserved as explicit contextual interpretation boundary string. |
| **SK-05 / SK-06** | `SemanticElement` / `SemanticElementKinds` | Discriminant `kind: 'type'` enforces fixed classification. |
| **SK-07** | `SemanticVersion` / `ElementVersionRef` | Preserved as exact definition version (e.g. `1.0.0+build.1`). |
| **SK-08** | `ElementRef` | Preserved via `ElementRefJSON` in referenced field types. |
| **SK-09** | `PrimitiveType` | Preserved via canonical primitive type codes (`STRING`, `INTEGER`, etc.). |
| **SK-10** | `Facet` | Facet contracts respected via specialized `DataFacet`. |
| **SK-11** | `Diagnostic` / `DiagnosticCode` | Emits canonical SK-11 diagnostics for structural violations. |
| **TYPE-01** | `TypeDefinition` / `TypeDefinitionJSON` | Core payload of `AuthoringTypeDeclaration`. |
| **TYPE-02** | `FieldDefinition` / `FieldDefinitionJSON` | Owned field definitions inside DataFacet. |
| **TYPE-03** | `DataFacet` / `DataFacetJSON` | Optional data facet describing field collections. |
| **TYPE-04** | `FieldConstraintSet` / `FieldConstraintJSON` | Optional field constraint sets attached to type declarations. |
| **TYPE-05** | `TypeReference` / `TypeReferenceJSON` | Canonical wire shape for TypeDefinition references. |
| **TYPE-06** | `TypeValidationRules` | Evaluated during downstream validation, not pre-empted here. |
| **TYPE-07** | `TypeRegistry` | Boundary preserved: authoring documents are NOT registries. |
| **TYPE-08** | `SemanticInstance` | Boundary preserved: authoring declarations are NOT runtime records. |

---

## 4. Fundamental Distinctions

```text
Authoring Schema ≠ Semantic Meta-Model
Authoring Document ≠ TypeDefinition
Authoring Type Declaration ≠ Runtime Type
Authoring Source ≠ Authoring Document
Schema Version ≠ Semantic Element Version
Structural Validation ≠ Semantic Validation
Parsing ≠ Model Loading
Model Loading ≠ Canonicalization
Canonicalization ≠ Compilation
Type Reference ≠ Reference Resolution
Authoring Document ≠ TypeRegistry
Authoring Document ≠ SemanticInstance
Authoring Model ≠ Runtime Artifact
```

---

## 5. AuthoringDocument Root Contract

The root document represents a bounded collection of authored semantic declarations:

```typescript
export interface AuthoringDocument {
  /** The authoring schema format version */
  readonly schemaVersion: SemanticVersion;

  /** Ordered, immutable sequence of authored semantic declarations */
  readonly declarations: readonly AuthoringElement[];

  /** Total count of authored declarations */
  readonly declarationCount: number;

  /** Retrieves an authored type declaration by element ID or QualifiedName */
  getTypeDeclaration(idOrQualifiedName: string): AuthoringTypeDeclaration | undefined;

  /** Checks whether an authored type declaration exists */
  hasTypeDeclaration(idOrQualifiedName: string): boolean;
}
```

Wire interchange representation (`AuthoringDocumentJSON`):

```typescript
export interface AuthoringDocumentJSON {
  readonly schemaVersion: string;
  readonly declarations: readonly AuthoringElementJSON[];
}
```

---

## 6. Schema Version Policy

1. **Format Version Identity:** `AUTHORING_SCHEMA_VERSION = '1.0.0' as const`.
2. **Distinctness:** The schema version identifies the document format rules. It is NOT the semantic version of any contained `TypeDefinition`, NOT a compiler version, and NOT a platform build version.
3. **Strict Validation:** Only supported schema versions are accepted. Unsupported versions trigger `AUTHORING_DOCUMENT_ERROR_CODES.UNSUPPORTED_SCHEMA_VERSION`.
4. **No Silent Migration:** The system rejects format guessing, automated version bumps, or dynamic compatibility negotiation.

---

## 7. Supported Declaration Categories

MOD-01 concentrates strictly on currently implemented type semantics:
- `kind: 'type'` (`AuthoringTypeDeclaration` / `AuthoringTypeDefinition`).
- Extensible union: `AuthoringElement = AuthoringTypeDeclaration`.
- Fields, facets, and constraints are declared strictly within their owning type aggregate; they are not independent top-level declarations.
- Unknown declaration kinds (e.g. actions, workflows, events) are rejected with `AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION_KIND`.

---

## 8. Structural Rules: Required, Optional, Missing, Null, and Empty

The platform enforces the non-negotiable rule:
**Missing ≠ Null ≠ Empty ≠ Value**

| Condition | Behavior |
| :--- | :--- |
| **Missing Required Property** (`schemaVersion`, `declarations`, `kind`, `definition`) | Structural failure: throws `MISSING_REQUIRED_PROPERTY`. |
| **Null Required Property** | Structural failure: throws `MISSING_REQUIRED_PROPERTY` or `INVALID_PROPERTY_TYPE`. |
| **Missing Optional Property** (`dataFacet`, `constraints`) | Valid: property is omitted from output without inserting empty defaults. |
| **Null Optional Property** | Structural failure: optional properties cannot be null; they must be omitted or valid. |
| **Empty Declarations Collection** (`declarations: []`) | Valid: represents a structurally valid empty document. |
| **Empty Fields Collection in DataFacet** (`fields: []`) | Valid: represents a type with an empty data structure facet. |
| **Unknown Properties** | Strict rejection: any undeclared root or declaration property throws `UNKNOWN_PROPERTY`. |

---

## 9. Duplicate Declarations and Declaration Ordering

1. **Duplicate Exact Identity + Version:**
   If two declarations share the exact same `SemanticElementId` and `SemanticVersion`, construction fails with `AUTHORING_DOCUMENT_ERROR_CODES.DUPLICATE_DECLARATION`.
2. **Same Type Across Multiple Versions:**
   Declarations sharing the same `SemanticElementId` but possessing distinct `SemanticVersion` values (e.g. `1.0.0` and `2.0.0`) are both preserved as distinct entries in the authored document.
3. **Ordering Invariant:**
   Authored sequence is deterministically preserved. The schema does not sort by localized names, does not reorder by dependencies, and does not infer semantic precedence from source order.

---

## 10. Diagnostics and Error Model

MOD-01 conforms strictly to SK-11 Diagnostics:

- **Error Class:** `AuthoringDocumentValidationError extends SemanticKernelError`.
- **Diagnostic Codes:**
  - `AUTHORING_UNSUPPORTED_SCHEMA_VERSION`
  - `AUTHORING_INVALID_ROOT`
  - `AUTHORING_MISSING_REQUIRED_PROPERTY`
  - `AUTHORING_INVALID_PROPERTY_TYPE`
  - `AUTHORING_INVALID_DECLARATION`
  - `AUTHORING_INVALID_DECLARATION_KIND`
  - `AUTHORING_INVALID_COLLECTION`
  - `AUTHORING_UNKNOWN_PROPERTY`
  - `AUTHORING_DUPLICATE_DECLARATION`
  - `AUTHORING_INVALID_REFERENCE_SHAPE`

Both throwing (`createAuthoringDocument`, `parseAuthoringDocument`) and diagnostic-collecting (`validateAuthoringDocumentStructure`) APIs are provided.

---

## 11. Serialization, Immutability, and Determinism

1. **JSON Interchange:** Fully serializable via `serializeAuthoringDocument` producing plain JSON-safe data structures without classes, functions, symbols, or `Map` instances.
2. **Deep Immutability:** All returned objects, arrays, and sub-elements are recursively frozen with `Object.freeze`.
3. **Determinism:** Identical input produces identical output. No reliance on timestamps, randomness, environment variables, or ambient tenant state.

---

## 12. Illustrative Reference Domain: Mini Sales

```json
{
  "schemaVersion": "1.0.0",
  "declarations": [
    {
      "kind": "type",
      "definition": {
        "id": "urn:sales:customer",
        "qualifiedName": "sales.Customer",
        "contextRef": "sales-context",
        "kind": "type",
        "version": "1.0.0"
      },
      "dataFacet": {
        "kind": "core.data",
        "ownerType": {
          "elementId": "urn:sales:customer",
          "version": "1.0.0"
        },
        "fields": [
          {
            "id": "urn:sales:customer:name",
            "qualifiedName": "sales.Customer.name",
            "contextRef": "sales-context",
            "kind": "field",
            "ownerType": {
              "elementId": "urn:sales:customer",
              "version": "1.0.0"
            },
            "valueType": {
              "by": "primitive",
              "primitiveType": "STRING"
            }
          }
        ]
      }
    }
  ]
}
```

---

## 13. Public Model Core API

Consumers import exclusively from the root `@ecosystem/model-core` entry point:

```typescript
import {
  AUTHORING_SCHEMA_VERSION,
  type AuthoringSchemaVersion,
  type AuthoringDocument,
  type AuthoringDocumentJSON,
  type AuthoringElement,
  type AuthoringTypeDeclaration,
  createAuthoringDocument,
  serializeAuthoringDocument,
  parseAuthoringDocument,
  tryParseAuthoringDocument,
  validateAuthoringDocumentStructure,
  AuthoringDocumentValidationError,
  AUTHORING_DOCUMENT_ERROR_CODES,
  AUTHORING_DIAGNOSTIC_CODES,
} from '@ecosystem/model-core';
```

---

## 14. Explicit Non-Goals & Deferred Capabilities

The following capabilities are explicitly deferred to subsequent milestones:
- **MOD-02 Model Loader:** File reading (`node:fs`), YAML parsing, discovery.
- **MOD-03 Source Location Tracking:** AST positions, span mappings, file URIs.
- **MOD-04 Canonical Model Contract:** Symbol resolution, reference linking, normalization.
- **Semantic Compilation & IR:** Lowering, runtime code generation, optimization.
- **TypeRegistry Registration:** Automated publication or catalog mutation.
- **Runtime Execution:** Instance instantiation, validation, or persistence.
