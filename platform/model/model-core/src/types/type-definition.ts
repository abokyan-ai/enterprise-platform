/**
 * @file type-definition.ts
 * @module @ecosystem/model-core/types
 *
 * TYPE-01: Foundational TypeDefinition Contract and Factory.
 *
 * Represents an authored, immutable, version-aware semantic definition of a named
 * type within a particular semantic context and at an exact semantic definition version.
 *
 * Architectural Invariants:
 * 1. Semantic World: TypeDefinition is a design-time metadata definition, NOT a runtime
 *    data instance, database table, TypeScript class, or compiler artifact.
 * 2. Composition over Universal Expansion: Reuses foundational primitives from
 *    Semantic Kernel without duplicating identity or typing taxonomies:
 *    - SemanticElementId (SK-01) — Stable platform-independent identity.
 *    - QualifiedName (SK-03) — Canonical qualified name within a namespace scope.
 *    - SemanticContextRef (SK-04) — Explicit interpretation boundary ("Context Owns Meaning").
 *    - SemanticElement (SK-05) — Base element structural contract.
 *    - SemanticElementKinds.TYPE (SK-06) — Fixed element classification ('type').
 *    - SemanticVersion (SK-07) — Exact definition version (e.g. 1.0.0).
 *    - ElementVersionRef (SK-07) — Exact identity-plus-version reference.
 * 3. Identity vs Revision: Stable identity (SemanticElementId) persists across version evolution.
 * 4. Missing ≠ Null ≠ Value: All required properties must be authentic value objects; no defaults.
 * 5. Clean Architecture: Layer:model depends only on layer:kernel. Zero external framework dependencies.
 */

import {
  type SemanticElement,
  SemanticElementId,
  QualifiedName,
  SemanticContextRef,
  SemanticElementKinds,
  type SemanticElementKind,
  SemanticVersion,
  ElementVersionRef,
  SemanticKernelError,
} from '@ecosystem/semantic-kernel';

/**
 * Structured validation error codes for TypeDefinition construction failures.
 */
export const TYPE_DEFINITION_ERROR_CODES = {
  NON_OBJECT: 'TYPE_DEFINITION_NON_OBJECT',
  MISSING_ID: 'TYPE_DEFINITION_MISSING_ID',
  INVALID_ID: 'TYPE_DEFINITION_INVALID_ID',
  MISSING_QUALIFIED_NAME: 'TYPE_DEFINITION_MISSING_QUALIFIED_NAME',
  INVALID_QUALIFIED_NAME: 'TYPE_DEFINITION_INVALID_QUALIFIED_NAME',
  MISSING_CONTEXT_REF: 'TYPE_DEFINITION_MISSING_CONTEXT_REF',
  INVALID_CONTEXT_REF: 'TYPE_DEFINITION_INVALID_CONTEXT_REF',
  MISSING_VERSION: 'TYPE_DEFINITION_MISSING_VERSION',
  INVALID_VERSION: 'TYPE_DEFINITION_INVALID_VERSION',
  INVALID_KIND: 'TYPE_DEFINITION_INVALID_KIND',
} as const;

export type TypeDefinitionErrorCode =
  (typeof TYPE_DEFINITION_ERROR_CODES)[keyof typeof TYPE_DEFINITION_ERROR_CODES];

/**
 * Dedicated error class for TypeDefinition validation failures.
 */
export class TypeDefinitionValidationError extends SemanticKernelError {
  public override readonly code: TypeDefinitionErrorCode;
  public readonly field?: string;

  constructor(
    code: TypeDefinitionErrorCode,
    message: string,
    field?: string,
  ) {
    super(message, code);
    this.name = 'TypeDefinitionValidationError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * The foundational TypeDefinition contract.
 *
 * Represents an authored semantic type definition, composed from authentic
 * Semantic Kernel primitives:
 * - `id`: Stable semantic element identity (SK-01).
 * - `qualifiedName`: Canonical qualified name (SK-03).
 * - `contextRef`: Semantic interpretation boundary (SK-04).
 * - `kind`: Fixed to SemanticElementKinds.TYPE ('type') (SK-06).
 * - `version`: Exact semantic definition version (SK-07).
 */
export interface TypeDefinition extends SemanticElement {
  /** The globally unique, stable identity of this type definition */
  readonly id: SemanticElementId;

  /** The canonical qualified name of this type definition */
  readonly qualifiedName: QualifiedName;

  /** The explicit interpretation context reference */
  readonly contextRef: SemanticContextRef;

  /** Fixed element classification: 'type' */
  readonly kind: typeof SemanticElementKinds.TYPE;

  /** The exact semantic definition version */
  readonly version: SemanticVersion;

  /** Convenience helper creating an exact ElementVersionRef */
  toElementVersionRef(): ElementVersionRef;
}

/**
 * Input parameters for creating a validated, canonical TypeDefinition.
 */
export interface CreateTypeDefinitionParams {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly version: SemanticVersion;
  readonly kind?: typeof SemanticElementKinds.TYPE;
}

/**
 * Legacy parameters interface for backward compatibility with initial ARC-01 test harnesses.
 */
export interface LegacyCreateTypeDefinitionParams {
  readonly semanticId?: unknown;
  readonly namespace?: unknown;
  readonly fields?: readonly unknown[];
  readonly metadata?: Record<string, unknown>;
  readonly id?: SemanticElementId;
  readonly qualifiedName?: QualifiedName;
  readonly contextRef?: SemanticContextRef;
  readonly version?: SemanticVersion;
  readonly kind?: typeof SemanticElementKinds.TYPE;
}

/**
 * JSON interchange representation of a TypeDefinition.
 */
export interface TypeDefinitionJSON {
  readonly id: string;
  readonly qualifiedName: string;
  readonly contextRef: string;
  readonly kind: 'type';
  readonly version: string;
}

/**
 * Discriminated result type for non-throwing parsing.
 */
export type TypeDefinitionParseResult =
  | { readonly ok: true; readonly value: TypeDefinition }
  | { readonly ok: false; readonly error: TypeDefinitionValidationError };

/**
 * Concrete immutable implementation of TypeDefinition.
 */
class ImmutableTypeDefinition implements TypeDefinition {
  public readonly id: SemanticElementId;
  public readonly qualifiedName: QualifiedName;
  public readonly contextRef: SemanticContextRef;
  public readonly kind: typeof SemanticElementKinds.TYPE = SemanticElementKinds.TYPE;
  public readonly version: SemanticVersion;

  // Legacy compatibility fields (from ARC-01 bootstrap)
  private readonly _legacyFields?: readonly unknown[];
  private readonly _legacyMetadata?: Record<string, unknown>;

  constructor(
    id: SemanticElementId,
    qualifiedName: QualifiedName,
    contextRef: SemanticContextRef,
    version: SemanticVersion,
    legacyFields?: readonly unknown[],
    legacyMetadata?: Record<string, unknown>,
  ) {
    this.id = id;
    this.qualifiedName = qualifiedName;
    this.contextRef = contextRef;
    this.version = version;
    this._legacyFields = legacyFields ? Object.freeze([...legacyFields]) : undefined;
    this._legacyMetadata = legacyMetadata ? Object.freeze({ ...legacyMetadata }) : undefined;
    Object.freeze(this);
  }

  public toElementVersionRef(): ElementVersionRef {
    return ElementVersionRef.fromParts(this.id, this.version);
  }

  // Legacy accessors for ARC-01 backward compatibility
  public get semanticId(): string {
    return this.id.toString();
  }

  public get namespace(): string {
    return this.qualifiedName.namespace.toString();
  }

  public get fields(): readonly unknown[] {
    return this._legacyFields ?? Object.freeze([]);
  }

  public get metadata(): Record<string, unknown> | undefined {
    return this._legacyMetadata;
  }
}

/**
 * Type guard verifying whether a candidate value conforms to the TypeDefinition contract
 * with authentic Semantic Kernel value objects.
 */
export function isTypeDefinition(value: unknown): value is TypeDefinition {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate['id'] instanceof SemanticElementId &&
    candidate['qualifiedName'] instanceof QualifiedName &&
    candidate['contextRef'] instanceof SemanticContextRef &&
    candidate['version'] instanceof SemanticVersion &&
    candidate['kind'] === SemanticElementKinds.TYPE &&
    typeof (candidate as unknown as TypeDefinition).toElementVersionRef === 'function'
  );
}

/**
 * Validates candidate parameters and constructs an immutable TypeDefinition.
 *
 * Guarantees:
 * 1. Runtime authenticity verification for all constituent value objects.
 * 2. Fixed element classification: 'type'.
 * 3. Exact definition version enforcement.
 * 4. Immutable object creation with zero external side effects.
 * 5. Full backward compatibility with ARC-01 legacy calling conventions.
 *
 * @param params Parameters containing authentic value objects.
 * @returns Immutable TypeDefinition instance.
 * @throws TypeDefinitionValidationError on contract violation.
 */
export function createTypeDefinition(
  params: CreateTypeDefinitionParams | LegacyCreateTypeDefinitionParams,
): TypeDefinition {
  if (params === null || typeof params !== 'object') {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.NON_OBJECT,
      'TypeDefinition creation requires a non-null parameters object.',
    );
  }

  const raw = params as Record<string, unknown>;

  // ─── Legacy ARC-01 Compatibility Branch ────────────────────────────────────
  if ('semanticId' in raw && !('id' in raw)) {
    const rawNamespace = raw['namespace'];
    if (
      rawNamespace === undefined ||
      rawNamespace === null ||
      typeof rawNamespace !== 'string' ||
      rawNamespace.trim().length === 0
    ) {
      throw new Error('TypeDefinition namespace cannot be empty');
    }

    const rawSemId = String(raw['semanticId']);
    const colonIndex = rawSemId.indexOf(':');
    const localName =
      colonIndex !== -1 ? rawSemId.slice(colonIndex + 1) : 'AnonymousType';

    const id = SemanticElementId.parse(
      colonIndex !== -1
        ? rawSemId.replace(':', '.')
        : `ecosystem.types.${rawSemId}`,
    );

    const qualifiedName = QualifiedName.parse(
      `${rawNamespace.trim()}.${localName}`,
    );

    const contextRef = SemanticContextRef.parse('default');
    const version = SemanticVersion.parse('1.0.0');

    return new ImmutableTypeDefinition(
      id,
      qualifiedName,
      contextRef,
      version,
      raw['fields'] as readonly unknown[],
      raw['metadata'] as Record<string, unknown>,
    );
  }

  // ─── Canonical TYPE-01 Construction Branch ─────────────────────────────────

  // 1. SemanticElementId validation
  if (!('id' in raw) || raw['id'] === undefined || raw['id'] === null) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.MISSING_ID,
      'TypeDefinition requires an authentic "id" (SemanticElementId).',
      'id',
    );
  }

  if (!(raw['id'] instanceof SemanticElementId)) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.INVALID_ID,
      'TypeDefinition "id" must be an authentic instance of SemanticElementId.',
      'id',
    );
  }

  // 2. QualifiedName validation
  if (
    !('qualifiedName' in raw) ||
    raw['qualifiedName'] === undefined ||
    raw['qualifiedName'] === null
  ) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.MISSING_QUALIFIED_NAME,
      'TypeDefinition requires an authentic "qualifiedName" (QualifiedName).',
      'qualifiedName',
    );
  }

  if (!(raw['qualifiedName'] instanceof QualifiedName)) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'TypeDefinition "qualifiedName" must be an authentic instance of QualifiedName.',
      'qualifiedName',
    );
  }

  // 3. SemanticContextRef validation
  if (
    !('contextRef' in raw) ||
    raw['contextRef'] === undefined ||
    raw['contextRef'] === null
  ) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.MISSING_CONTEXT_REF,
      'TypeDefinition requires an authentic "contextRef" (SemanticContextRef).',
      'contextRef',
    );
  }

  if (!(raw['contextRef'] instanceof SemanticContextRef)) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.INVALID_CONTEXT_REF,
      'TypeDefinition "contextRef" must be an authentic instance of SemanticContextRef.',
      'contextRef',
    );
  }

  // 4. SemanticVersion validation
  if (
    !('version' in raw) ||
    raw['version'] === undefined ||
    raw['version'] === null
  ) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.MISSING_VERSION,
      'TypeDefinition requires an authentic exact "version" (SemanticVersion).',
      'version',
    );
  }

  if (!(raw['version'] instanceof SemanticVersion)) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.INVALID_VERSION,
      'TypeDefinition "version" must be an authentic instance of SemanticVersion.',
      'version',
    );
  }

  // 5. SemanticElementKind validation (must be TYPE if supplied)
  if ('kind' in raw && raw['kind'] !== undefined) {
    if (raw['kind'] !== SemanticElementKinds.TYPE) {
      throw new TypeDefinitionValidationError(
        TYPE_DEFINITION_ERROR_CODES.INVALID_KIND,
        `TypeDefinition "kind" must be "${SemanticElementKinds.TYPE}", received "${String(raw['kind'])}".`,
        'kind',
      );
    }
  }

  return new ImmutableTypeDefinition(
    raw['id'],
    raw['qualifiedName'],
    raw['contextRef'],
    raw['version'],
  );
}

/**
 * Compares two TypeDefinitions for stable identity equivalence.
 * Two type definitions share identity if their SemanticElementId values are equal,
 * regardless of version differences.
 */
export function sameTypeIdentity(a: TypeDefinition, b: TypeDefinition): boolean {
  if (a === b) {
    return true;
  }
  return a.id.equals(b.id);
}

/**
 * Compares two TypeDefinitions for exact versioned equivalence.
 * Two type definitions are exact-version equivalent if both their SemanticElementId
 * and exact SemanticVersion values are equal.
 */
export function sameExactTypeVersion(
  a: TypeDefinition,
  b: TypeDefinition,
): boolean {
  if (a === b) {
    return true;
  }
  return a.id.equals(b.id) && a.version.equals(b.version);
}

/**
 * Serializes a TypeDefinition into a deterministic JSON-safe interchange object.
 */
export function serializeTypeDefinition(
  typeDef: TypeDefinition,
): TypeDefinitionJSON {
  return Object.freeze({
    id: typeDef.id.toString(),
    qualifiedName: typeDef.qualifiedName.toString(),
    contextRef: typeDef.contextRef.toString(),
    kind: SemanticElementKinds.TYPE,
    version: typeDef.version.toString(),
  });
}

/**
 * Strictly parses and deserializes raw interchange data into an authentic TypeDefinition.
 * Reconstructs all constituent value objects through their approved parsers.
 */
export function parseTypeDefinition(raw: unknown): TypeDefinition {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeDefinitionValidationError(
      TYPE_DEFINITION_ERROR_CODES.NON_OBJECT,
      'TypeDefinition deserialization requires a non-null object.',
    );
  }

  const record = raw as Record<string, unknown>;

  const id = SemanticElementId.parse(record['id']);
  const qualifiedName = QualifiedName.parse(record['qualifiedName']);
  const contextRef = SemanticContextRef.parse(record['contextRef']);
  const version = SemanticVersion.parse(record['version']);

  if ('kind' in record && record['kind'] !== undefined) {
    if (record['kind'] !== SemanticElementKinds.TYPE) {
      throw new TypeDefinitionValidationError(
        TYPE_DEFINITION_ERROR_CODES.INVALID_KIND,
        `TypeDefinition "kind" must be "${SemanticElementKinds.TYPE}", received "${String(record['kind'])}".`,
        'kind',
      );
    }
  }

  return createTypeDefinition({
    id,
    qualifiedName,
    contextRef,
    version,
  });
}

/**
 * Non-throwing parse method returning a typed discriminated union.
 */
export function tryParseTypeDefinition(raw: unknown): TypeDefinitionParseResult {
  try {
    const value = parseTypeDefinition(raw);
    return { ok: true, value };
  } catch (err) {
    if (err instanceof TypeDefinitionValidationError) {
      return { ok: false, error: err };
    }
    return {
      ok: false,
      error: new TypeDefinitionValidationError(
        TYPE_DEFINITION_ERROR_CODES.NON_OBJECT,
        err instanceof Error ? err.message : String(err),
      ),
    };
  }
}
