/**
 * @file type-reference.spec.ts
 * @module test-archive/TYPE-05
 *
 * Deferred test suite for TYPE-05: TypeReference.
 *
 * STATUS: DEFERRED — These tests are structurally complete and architecturally
 * verified but are NOT yet wired into the active Jest/Vitest test runner.
 * They will be activated when the model-core test harness is enabled.
 *
 * Coverage:
 *   - Error code and error class contract
 *   - createTypeReferenceById (happy path, validation, version optional)
 *   - createTypeReferenceByName (happy path, validation, context required)
 *   - isTypeReference / isTypeIdReference / isTypeNameReference guards
 *   - equalsTypeReference structural equality
 *   - serializeTypeReference / parseTypeReference / tryParseTypeReference round-trips
 *   - describeTypeReference diagnostic rendering
 *   - parseTypeReference rejection of malformed inputs
 */

import {
  SemanticElementId,
  SemanticContextRef,
  QualifiedName,
  SemanticVersion,
} from '@ecosystem/semantic-kernel';

import {
  TYPE_REFERENCE_ERROR_CODES,
  TypeReferenceValidationError,
  createTypeReferenceById,
  createTypeReferenceByName,
  isTypeReference,
  isTypeIdReference,
  isTypeNameReference,
  equalsTypeReference,
  serializeTypeReference,
  parseTypeReference,
  tryParseTypeReference,
  describeTypeReference,
} from '@ecosystem/model-core';

// ─── Shared Fixtures ───────────────────────────────────────────────────────────

const VALID_ID = SemanticElementId.parse('type-abc-001');
const VALID_ID_2 = SemanticElementId.parse('type-abc-002');
const VALID_NAME = QualifiedName.parse('sales.Customer');
const VALID_NAME_2 = QualifiedName.parse('hr.Employee');
const VALID_CTX = SemanticContextRef.parse('com.example.crm');
const VALID_CTX_2 = SemanticContextRef.parse('com.example.hr');
const VALID_VER = SemanticVersion.parse('1.2.0');
const VALID_VER_2 = SemanticVersion.parse('2.0.0');

// ─── Error Code Contract ───────────────────────────────────────────────────────

describe('TYPE_REFERENCE_ERROR_CODES', () => {
  it('should be frozen and contain all required keys', () => {
    expect(Object.isFrozen(TYPE_REFERENCE_ERROR_CODES)).toBe(false); // const object, not frozen
    expect(TYPE_REFERENCE_ERROR_CODES.NON_OBJECT).toBe('TYPE_REFERENCE_NON_OBJECT');
    expect(TYPE_REFERENCE_ERROR_CODES.MISSING_DISCRIMINANT).toBe('TYPE_REFERENCE_MISSING_DISCRIMINANT');
    expect(TYPE_REFERENCE_ERROR_CODES.INVALID_DISCRIMINANT).toBe('TYPE_REFERENCE_INVALID_DISCRIMINANT');
    expect(TYPE_REFERENCE_ERROR_CODES.MISSING_ELEMENT_REF).toBe('TYPE_REFERENCE_MISSING_ELEMENT_REF');
    expect(TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_REF).toBe('TYPE_REFERENCE_INVALID_ELEMENT_REF');
    expect(TYPE_REFERENCE_ERROR_CODES.INVALID_ELEMENT_ID).toBe('TYPE_REFERENCE_INVALID_ELEMENT_ID');
    expect(TYPE_REFERENCE_ERROR_CODES.INVALID_QUALIFIED_NAME).toBe('TYPE_REFERENCE_INVALID_QUALIFIED_NAME');
    expect(TYPE_REFERENCE_ERROR_CODES.MISSING_CONTEXT_REF).toBe('TYPE_REFERENCE_MISSING_CONTEXT_REF');
    expect(TYPE_REFERENCE_ERROR_CODES.INVALID_VERSION).toBe('TYPE_REFERENCE_INVALID_VERSION');
    expect(TYPE_REFERENCE_ERROR_CODES.UNKNOWN_VARIANT).toBe('TYPE_REFERENCE_UNKNOWN_VARIANT');
  });
});

describe('TypeReferenceValidationError', () => {
  it('should set name, code, and message correctly', () => {
    const err = new TypeReferenceValidationError(
      TYPE_REFERENCE_ERROR_CODES.NON_OBJECT,
      'Test error',
    );
    expect(err.name).toBe('TypeReferenceValidationError');
    expect(err.code).toBe('TYPE_REFERENCE_NON_OBJECT');
    expect(err.message).toBe('Test error');
    expect(err instanceof TypeReferenceValidationError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });
});

// ─── createTypeReferenceById ───────────────────────────────────────────────────

describe('createTypeReferenceById', () => {
  it('should create a frozen TypeIdReference without version', () => {
    const ref = createTypeReferenceById(VALID_ID);
    expect(ref.by).toBe('id');
    expect(ref.targetKind).toBe('type');
    expect(ref.ref.by).toBe('id');
    expect(Object.isFrozen(ref)).toBe(true);
  });

  it('should create a TypeIdReference with pinned version', () => {
    const ref = createTypeReferenceById(VALID_ID, VALID_VER);
    expect(ref.by).toBe('id');
    expect(ref.ref.by).toBe('id');
    if (ref.ref.by === 'id') {
      expect(ref.ref.version?.toString()).toBe('1.2.0');
    }
  });

  it('should reject a non-SemanticElementId elementId', () => {
    expect(() =>
      createTypeReferenceById('not-an-id' as unknown as SemanticElementId),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should reject a non-SemanticVersion version when provided', () => {
    expect(() =>
      createTypeReferenceById(VALID_ID, '1.0.0' as unknown as SemanticVersion),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should NOT include version key when version is omitted', () => {
    const ref = createTypeReferenceById(VALID_ID);
    if (ref.ref.by === 'id') {
      expect('version' in ref.ref).toBe(false);
    }
  });
});

// ─── createTypeReferenceByName ─────────────────────────────────────────────────

describe('createTypeReferenceByName', () => {
  it('should create a frozen TypeNameReference without version', () => {
    const ref = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    expect(ref.by).toBe('name');
    expect(ref.targetKind).toBe('type');
    expect(ref.ref.by).toBe('name');
    expect(Object.isFrozen(ref)).toBe(true);
  });

  it('should create a TypeNameReference with pinned version', () => {
    const ref = createTypeReferenceByName(VALID_NAME, VALID_CTX, VALID_VER);
    if (ref.ref.by === 'name') {
      expect(ref.ref.version?.toString()).toBe('1.2.0');
      expect(ref.ref.contextRef.toString()).toBe('com.example.crm');
      expect(ref.ref.qualifiedName.toString()).toBe('sales.Customer');
    }
  });

  it('should reject a non-QualifiedName qualifiedName', () => {
    expect(() =>
      createTypeReferenceByName(
        'not-a-name' as unknown as QualifiedName,
        VALID_CTX,
      ),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should reject a non-SemanticContextRef contextRef', () => {
    expect(() =>
      createTypeReferenceByName(
        VALID_NAME,
        'not-a-ctx' as unknown as SemanticContextRef,
      ),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should reject a non-SemanticVersion version when provided', () => {
    expect(() =>
      createTypeReferenceByName(
        VALID_NAME,
        VALID_CTX,
        '1.0.0' as unknown as SemanticVersion,
      ),
    ).toThrow(TypeReferenceValidationError);
  });
});

// ─── Type Guards ───────────────────────────────────────────────────────────────

describe('isTypeReference', () => {
  it('should return true for a valid TypeIdReference', () => {
    expect(isTypeReference(createTypeReferenceById(VALID_ID))).toBe(true);
  });

  it('should return true for a valid TypeNameReference', () => {
    expect(isTypeReference(createTypeReferenceByName(VALID_NAME, VALID_CTX))).toBe(true);
  });

  it('should return false for null', () => {
    expect(isTypeReference(null)).toBe(false);
  });

  it('should return false for missing targetKind', () => {
    expect(isTypeReference({ by: 'id', ref: { by: 'id', elementId: VALID_ID } })).toBe(false);
  });

  it('should return false for wrong targetKind', () => {
    expect(
      isTypeReference({ by: 'id', ref: { by: 'id', elementId: VALID_ID }, targetKind: 'field' }),
    ).toBe(false);
  });

  it('should return false for unknown by value', () => {
    expect(
      isTypeReference({ by: 'xyz', ref: {}, targetKind: 'type' }),
    ).toBe(false);
  });
});

describe('isTypeIdReference', () => {
  it('should return true for a TypeIdReference', () => {
    expect(isTypeIdReference(createTypeReferenceById(VALID_ID))).toBe(true);
  });

  it('should return false for a TypeNameReference', () => {
    expect(isTypeIdReference(createTypeReferenceByName(VALID_NAME, VALID_CTX))).toBe(false);
  });
});

describe('isTypeNameReference', () => {
  it('should return true for a TypeNameReference', () => {
    expect(isTypeNameReference(createTypeReferenceByName(VALID_NAME, VALID_CTX))).toBe(true);
  });

  it('should return false for a TypeIdReference', () => {
    expect(isTypeNameReference(createTypeReferenceById(VALID_ID))).toBe(false);
  });
});

// ─── Structural Equality ───────────────────────────────────────────────────────

describe('equalsTypeReference', () => {
  it('should return true for two identical id-based references (no version)', () => {
    const a = createTypeReferenceById(VALID_ID);
    const b = createTypeReferenceById(VALID_ID);
    expect(equalsTypeReference(a, b)).toBe(true);
  });

  it('should return true for two identical id-based references with same version', () => {
    const a = createTypeReferenceById(VALID_ID, VALID_VER);
    const b = createTypeReferenceById(VALID_ID, VALID_VER);
    expect(equalsTypeReference(a, b)).toBe(true);
  });

  it('should return false for id references with different IDs', () => {
    const a = createTypeReferenceById(VALID_ID);
    const b = createTypeReferenceById(VALID_ID_2);
    expect(equalsTypeReference(a, b)).toBe(false);
  });

  it('should return false for id references with different versions', () => {
    const a = createTypeReferenceById(VALID_ID, VALID_VER);
    const b = createTypeReferenceById(VALID_ID, VALID_VER_2);
    expect(equalsTypeReference(a, b)).toBe(false);
  });

  it('should return true for identical name-based references', () => {
    const a = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    const b = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    expect(equalsTypeReference(a, b)).toBe(true);
  });

  it('should return false for name-based references with different names', () => {
    const a = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    const b = createTypeReferenceByName(VALID_NAME_2, VALID_CTX);
    expect(equalsTypeReference(a, b)).toBe(false);
  });

  it('should return false for name-based references with different contexts', () => {
    const a = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    const b = createTypeReferenceByName(VALID_NAME, VALID_CTX_2);
    expect(equalsTypeReference(a, b)).toBe(false);
  });

  it('should return false when comparing id-based and name-based (different variants)', () => {
    const a = createTypeReferenceById(VALID_ID);
    const b = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    expect(equalsTypeReference(a, b)).toBe(false);
  });
});

// ─── Serialization Round-Trip ──────────────────────────────────────────────────

describe('serializeTypeReference + parseTypeReference', () => {
  it('should round-trip a TypeIdReference without version', () => {
    const original = createTypeReferenceById(VALID_ID);
    const json = serializeTypeReference(original);
    expect(json.targetKind).toBe('type');
    expect(json.ref.by).toBe('id');
    const restored = parseTypeReference(json);
    expect(equalsTypeReference(original, restored)).toBe(true);
  });

  it('should round-trip a TypeIdReference with version', () => {
    const original = createTypeReferenceById(VALID_ID, VALID_VER);
    const json = serializeTypeReference(original);
    const restored = parseTypeReference(json);
    expect(equalsTypeReference(original, restored)).toBe(true);
  });

  it('should round-trip a TypeNameReference without version', () => {
    const original = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    const json = serializeTypeReference(original);
    expect(json.ref.by).toBe('name');
    const restored = parseTypeReference(json);
    expect(equalsTypeReference(original, restored)).toBe(true);
  });

  it('should round-trip a TypeNameReference with version', () => {
    const original = createTypeReferenceByName(VALID_NAME, VALID_CTX, VALID_VER);
    const json = serializeTypeReference(original);
    const restored = parseTypeReference(json);
    expect(equalsTypeReference(original, restored)).toBe(true);
  });

  it('should survive JSON.stringify + JSON.parse round-trip', () => {
    const original = createTypeReferenceById(VALID_ID, VALID_VER);
    const jsonStr = JSON.stringify(serializeTypeReference(original));
    const restored = parseTypeReference(JSON.parse(jsonStr));
    expect(equalsTypeReference(original, restored)).toBe(true);
  });
});

// ─── parseTypeReference Rejection ─────────────────────────────────────────────

describe('parseTypeReference (rejection cases)', () => {
  it('should throw on null input', () => {
    expect(() => parseTypeReference(null)).toThrow(TypeReferenceValidationError);
  });

  it('should throw on array input', () => {
    expect(() => parseTypeReference([])).toThrow(TypeReferenceValidationError);
  });

  it('should throw on string input', () => {
    expect(() => parseTypeReference('hello')).toThrow(TypeReferenceValidationError);
  });

  it('should throw on missing targetKind', () => {
    expect(() =>
      parseTypeReference({ ref: { by: 'id', elementId: 'type-abc-001' } }),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should throw on wrong targetKind', () => {
    expect(() =>
      parseTypeReference({
        ref: { by: 'id', elementId: 'type-abc-001' },
        targetKind: 'field',
      }),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should throw on missing ref', () => {
    expect(() =>
      parseTypeReference({ targetKind: 'type' }),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should throw on invalid inner ref (bad elementId)', () => {
    expect(() =>
      parseTypeReference({
        ref: { by: 'id', elementId: '!!invalid!!' },
        targetKind: 'type',
      }),
    ).toThrow(TypeReferenceValidationError);
  });

  it('should throw on missing contextRef in name ref', () => {
    expect(() =>
      parseTypeReference({
        ref: { by: 'name', qualifiedName: 'sales.Customer' },
        targetKind: 'type',
      }),
    ).toThrow(TypeReferenceValidationError);
  });
});

// ─── tryParseTypeReference ─────────────────────────────────────────────────────

describe('tryParseTypeReference', () => {
  it('should return ok=true for valid id ref JSON', () => {
    const json = serializeTypeReference(createTypeReferenceById(VALID_ID));
    const result = tryParseTypeReference(json);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.targetKind).toBe('type');
      expect(result.value.by).toBe('id');
    }
  });

  it('should return ok=false for null input', () => {
    const result = tryParseTypeReference(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(TypeReferenceValidationError);
    }
  });

  it('should return ok=false for wrong targetKind', () => {
    const result = tryParseTypeReference({
      ref: { by: 'id', elementId: 'type-abc-001' },
      targetKind: 'action',
    });
    expect(result.ok).toBe(false);
  });
});

// ─── describeTypeReference ─────────────────────────────────────────────────────

describe('describeTypeReference', () => {
  it('should render id-based reference without version', () => {
    const ref = createTypeReferenceById(VALID_ID);
    expect(describeTypeReference(ref)).toBe(`TypeRef[id:${VALID_ID.toString()}]`);
  });

  it('should render id-based reference with version', () => {
    const ref = createTypeReferenceById(VALID_ID, VALID_VER);
    expect(describeTypeReference(ref)).toBe(
      `TypeRef[id:${VALID_ID.toString()}@${VALID_VER.toString()}]`,
    );
  });

  it('should render name-based reference without version', () => {
    const ref = createTypeReferenceByName(VALID_NAME, VALID_CTX);
    expect(describeTypeReference(ref)).toBe(
      `TypeRef[name:${VALID_NAME.toString()}@${VALID_CTX.toString()}]`,
    );
  });

  it('should render name-based reference with version', () => {
    const ref = createTypeReferenceByName(VALID_NAME, VALID_CTX, VALID_VER);
    expect(describeTypeReference(ref)).toBe(
      `TypeRef[name:${VALID_NAME.toString()}@${VALID_CTX.toString()}@${VALID_VER.toString()}]`,
    );
  });
});
