# ADR-024: Domain-Typed TypeReference Wrapping SK-08 ElementRef (TYPE-05)

## Status

Accepted for TYPE-05.

## Context

As the Semantic Type System (Model Core) matures, model elements increasingly need to express typed
references to specific definition kinds — TypeDefinitions in particular. The existing generic Semantic
Kernel ElementRef (SK-08) is deliberately kind-agnostic: it can reference any semantic element
(fields, types, contexts, etc.) with no compile-time kind constraint.

This presents two problems:

1. **No kind constraint at compile time**: Code that expects a reference to a TypeDefinition cannot
   distinguish it from a generic element reference without runtime checks.
2. **Authoring ambiguity**: Consumers reading `typeRef: ElementRef` cannot know from the type alone
   that the target must be a TypeDefinition rather than any other element kind.

TYPE-05 introduces the `TypeReference` contract in `@ecosystem/model-core` to solve this.

## Decision

### 1. Architectural Ownership in Model Core

`TypeReference` belongs to Layer C (**Model Core** / `@ecosystem/model-core`), located under
`platform/model/model-core/src/types/`. Model Core depends exclusively on
`@ecosystem/semantic-kernel`; no framework, ORM, UI, or database dependencies are introduced.

### 2. Composition Over Duplication of SK-08

`TypeReference` is NOT a reimplementation of ElementRef logic. It is a thin, domain-typed wrapper:
- **Encapsulates** an authenticated `ElementRef` (SK-08).
- **Adds** a fixed `targetKind: 'type'` discriminant to encode the TypeDefinition constraint.
- **Mirrors** the inner `by` discriminant for direct variant narrowing.
- **Delegates** all inner reference validation to the Kernel's `createElementIdRef` and
  `createElementNameRef` factories.

```typescript
export interface TypeReference {
  readonly by: 'id' | 'name';
  readonly ref: ElementRef;
  readonly targetKind: 'type';
}
```

### 3. Two Specialization Sub-Types

- `TypeIdReference` — inner `ref` is an `ElementIdRef` (targets by stable `SemanticElementId`).
- `TypeNameReference` — inner `ref` is an `ElementNameRef` (targets by `QualifiedName` + `SemanticContextRef`).

Both sub-interfaces refine `TypeReference` and are produced by the corresponding factory functions.

### 4. Distinction from Related Concepts

| Concept | Role |
|---|---|
| `ElementRef` (SK-08) | Generic semantic element reference. No kind constraint. |
| `TypeReference` (TYPE-05) | Domain-typed reference locked to `TypeDefinition`. |
| `ReferencedFieldType` (TYPE-02) | Field-level value-type variant using `ElementRef` inside `FieldDefinition`. |
| `TypeDefinition` (TYPE-01) | The actual definition payload. Not a reference. |

### 5. Version-Awareness

The optional `version` field (from the wrapped `ElementRef`) supports:
- **Version-pinned**: `version` present — compiler must resolve that exact snapshot.
- **Version-unspecified**: `version` absent — compiler resolves latest compatible version.

Missing != Null != Value: `version: null` or `version: undefined` as explicit values are
structurally invalid.

### 6. Canonical JSON Serialization

`TypeReferenceJSON` wraps `ElementRefJSON` with the `targetKind` discriminant:
```json
{ "ref": { "by": "id", "elementId": "cust-type-01", "version": "1.2.0" }, "targetKind": "type" }
{ "ref": { "by": "name", "qualifiedName": "sales.Customer", "contextRef": "com.example.crm" }, "targetKind": "type" }
```

Parsing delegates inner `ref` deserialization to the Kernel's `parseElementRef`.

### 7. Diagnostic Rendering

`describeTypeReference` produces non-canonical human-readable representations for logs and errors:
```
TypeRef[id:cust-type-01@1.2.0]
TypeRef[name:sales.Customer@com.example.crm]
```
This function MUST NOT be used for canonical data interchange.

## Consequences

- Type-safe cross-type references across Model Core authoring models.
- Kernel ElementRef validation logic is reused, not duplicated.
- Downstream Compiler can narrow `TypeReference` to find its kind-specific resolution target
  without casting.
- Test archive (TYPE-05) deferred following established TYPE-03/04 pattern.
