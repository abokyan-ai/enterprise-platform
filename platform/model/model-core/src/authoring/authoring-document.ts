/**
 * @file authoring-document.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Authoring Document Root Contract, Factory, Validation, and Serialization.
 *
 * The Authoring Model Schema defines the formal structural contract that describes
 * how semantic model definitions are authored and represented as portable documents.
 *
 * Architectural Invariants:
 * 1. Authoring Schema ≠ Semantic Meta-Model:
 *    AuthoringDocument defines the portable envelope for authored declarations;
 *    it does not replace the TypeDefinition or Semantic Kernel meta-models.
 * 2. Pure Structural Envelope:
 *    Does not load files from disk, parse YAML/JSON syntax, resolve references,
 *    canonicalize models, compile, or execute runtime instances.
 * 3. Exact Identity & Version Preservation:
 *    Preserves exact SemanticElementId (SK-01), QualifiedName (SK-03),
 *    SemanticContextRef (SK-04), and exact SemanticVersion (SK-07).
 * 4. Missing ≠ Null ≠ Empty ≠ Value:
 *    Required properties must be present and valid. Null is not silently normalized.
 *    Empty declarations collection is structurally valid.
 * 5. Strict Unknown Property Rejection:
 *    Unrecognized properties at root or declaration levels are rejected deterministically.
 * 6. Immutability & Determinism:
 *    All constructed instances and collections are deeply frozen. Same input produces
 *    identical representations without ambient state, timestamps, or randomness.
 * 7. Pure TypeScript:
 *    Zero external framework dependencies. Universal portability.
 */

import {
  SemanticVersion,
  SemanticKernelError,
  type Diagnostic,
} from '@ecosystem/semantic-kernel';
import {
  type TypeDefinition,
  type TypeDefinitionJSON,
  parseTypeDefinition,
} from '../types/type-definition.js';
import {
  type DataFacetJSON,
  parseDataFacet,
} from '../facets/data-facet.js';
import {
  type FieldConstraintSetJSON,
  parseFieldConstraintSet,
} from '../constraints/index.js';
import {
  AUTHORING_SCHEMA_VERSION,
  type AuthoringSchemaVersion,
} from './authoring-schema-version.js';
import {
  type AuthoringElement,
  type AuthoringElementJSON,
} from './authoring-element.js';
import {
  type AuthoringTypeDeclaration,
  type AuthoringTypeDefinition,
} from './authoring-type.js';
import {
  AUTHORING_DIAGNOSTIC_CODES,
  createAuthoringDiagnostic,
} from './authoring-diagnostic-codes.js';

// ─── Error Codes ──────────────────────────────────────────────────────────────

/**
 * Structured validation error codes for AuthoringDocument failures.
 */
export const AUTHORING_DOCUMENT_ERROR_CODES = Object.freeze({
  INVALID_DOCUMENT: 'AUTHORING_DOCUMENT_INVALID_DOCUMENT',
  UNSUPPORTED_SCHEMA_VERSION: 'AUTHORING_DOCUMENT_UNSUPPORTED_SCHEMA_VERSION',
  INVALID_DECLARATION: 'AUTHORING_DOCUMENT_INVALID_DECLARATION',
  DUPLICATE_DECLARATION: 'AUTHORING_DOCUMENT_DUPLICATE_DECLARATION',
  MISSING_REQUIRED_PROPERTY: 'AUTHORING_DOCUMENT_MISSING_REQUIRED_PROPERTY',
  INVALID_PROPERTY_TYPE: 'AUTHORING_DOCUMENT_INVALID_PROPERTY_TYPE',
  INVALID_DECLARATION_KIND: 'AUTHORING_DOCUMENT_INVALID_DECLARATION_KIND',
  INVALID_COLLECTION: 'AUTHORING_DOCUMENT_INVALID_COLLECTION',
  UNKNOWN_PROPERTY: 'AUTHORING_DOCUMENT_UNKNOWN_PROPERTY',
  INVALID_REFERENCE_SHAPE: 'AUTHORING_DOCUMENT_INVALID_REFERENCE_SHAPE',
} as const);

export type AuthoringDocumentErrorCode =
  (typeof AUTHORING_DOCUMENT_ERROR_CODES)[keyof typeof AUTHORING_DOCUMENT_ERROR_CODES];

/**
 * Dedicated error class for AuthoringDocument validation failures.
 */
export class AuthoringDocumentValidationError extends SemanticKernelError {
  public override readonly code: AuthoringDocumentErrorCode;
  public readonly field?: string;
  public readonly declarationIndex?: number;

  public constructor(
    code: AuthoringDocumentErrorCode,
    message: string,
    field?: string,
    declarationIndex?: number,
  ) {
    super(message, code);
    this.name = 'AuthoringDocumentValidationError';
    this.code = code;
    this.field = field;
    this.declarationIndex = declarationIndex;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Document Contracts ───────────────────────────────────────────────────────

/**
 * The root authoring document contract.
 *
 * Represents an authored, immutable, versioned collection of semantic declarations.
 */
export interface AuthoringDocument {
  /** The authoring schema format version */
  readonly schemaVersion: SemanticVersion;

  /** Ordered, immutable sequence of authored semantic declarations */
  readonly declarations: readonly AuthoringElement[];

  /** Total count of authored declarations */
  readonly declarationCount: number;

  /**
   * Retrieves an authored type declaration by its element ID or QualifiedName string.
   */
  getTypeDeclaration(
    idOrQualifiedName: string,
  ): AuthoringTypeDeclaration | undefined;

  /**
   * Checks whether an authored type declaration exists by element ID or QualifiedName.
   */
  hasTypeDeclaration(idOrQualifiedName: string): boolean;
}

/**
 * JSON interchange representation of an AuthoringDocument.
 */
export interface AuthoringDocumentJSON {
  /** Canonical authoring format version string (e.g. '1.0.0') */
  readonly schemaVersion: string;

  /** Ordered collection of authored declarations */
  readonly declarations: readonly AuthoringElementJSON[];
}

/**
 * Flexible input parameter shape for creating an AuthoringDocument.
 */
export interface AuthoringDocumentInput {
  readonly schemaVersion: SemanticVersion | string;
  readonly declarations: readonly AuthoringElement[];
}

/**
 * Root aggregate alias conforming to MOD-01 taxonomy.
 */
export type AuthoringModel = AuthoringDocument;

/**
 * JSON interchange alias for AuthoringModel.
 */
export type AuthoringModelJSON = AuthoringDocumentJSON;

/**
 * Discriminated result type for non-throwing parsing.
 */
export type AuthoringDocumentParseResult =
  | { readonly ok: true; readonly value: AuthoringDocument }
  | { readonly ok: false; readonly error: AuthoringDocumentValidationError };

// ─── Concrete Immutable Implementation ────────────────────────────────────────

class ImmutableAuthoringDocument implements AuthoringDocument {
  public readonly schemaVersion: SemanticVersion;
  public readonly declarations: readonly AuthoringElement[];

  private readonly _byId: Map<string, AuthoringTypeDeclaration>;
  private readonly _byName: Map<string, AuthoringTypeDeclaration>;

  constructor(
    schemaVersion: SemanticVersion,
    declarations: readonly AuthoringElement[],
  ) {
    this.schemaVersion = schemaVersion;
    this.declarations = Object.freeze([...declarations]);

    const byId = new Map<string, AuthoringTypeDeclaration>();
    const byName = new Map<string, AuthoringTypeDeclaration>();

    for (const decl of this.declarations) {
      if (decl.kind === 'type') {
        byId.set(decl.definition.id, decl);
        byName.set(decl.definition.qualifiedName, decl);
      }
    }

    this._byId = byId;
    this._byName = byName;

    Object.freeze(this);
  }

  public get declarationCount(): number {
    return this.declarations.length;
  }

  public getTypeDeclaration(
    idOrQualifiedName: string,
  ): AuthoringTypeDeclaration | undefined {
    return this._byId.get(idOrQualifiedName) ?? this._byName.get(idOrQualifiedName);
  }

  public hasTypeDeclaration(idOrQualifiedName: string): boolean {
    return (
      this._byId.has(idOrQualifiedName) || this._byName.has(idOrQualifiedName)
    );
  }
}

// ─── Factory and Validation ───────────────────────────────────────────────────

/**
 * Validates candidate parameters and constructs an immutable AuthoringDocument.
 *
 * Guarantees:
 * 1. Root Structure: Input must be a non-null, non-array object.
 * 2. Supported Schema Version: Must equal AUTHORING_SCHEMA_VERSION ('1.0.0').
 * 3. Declarations Collection: Must be an array (empty array is valid).
 * 4. Declaration Authenticity: Every declaration must be a supported kind ('type').
 * 5. Semantic Preservation: Validates constituent TYPE-01/TYPE-03/TYPE-04 definitions.
 * 6. Duplicate Prevention: Duplicate exact identity + version declarations are rejected.
 * 7. Strict Unknown Property Rejection: No undeclared keys at root or declaration levels.
 * 8. Deep Immutability: Deeply frozen output with zero mutation vectors.
 *
 * @param input Authoring document raw JSON or structured input.
 * @returns Immutable, validated AuthoringDocument instance.
 * @throws AuthoringDocumentValidationError on contract violation.
 */
export function createAuthoringDocument(
  input: AuthoringDocumentJSON | AuthoringDocumentInput,
): AuthoringDocument {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DOCUMENT,
      'AuthoringDocument requires a plain document object.',
    );
  }

  const raw = input as unknown as Record<string, unknown>;

  // 1. Strict unknown root property rejection
  const allowedRootKeys = new Set(['schemaVersion', 'declarations']);
  for (const key of Object.keys(raw)) {
    if (!allowedRootKeys.has(key)) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.UNKNOWN_PROPERTY,
        `Unrecognized root property '${key}' in AuthoringDocument.`,
        key,
      );
    }
  }

  // 2. Validate schemaVersion presence and type
  if (
    !('schemaVersion' in raw) ||
    raw['schemaVersion'] === undefined ||
    raw['schemaVersion'] === null
  ) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.MISSING_REQUIRED_PROPERTY,
      'AuthoringDocument requires an explicit schemaVersion property.',
      'schemaVersion',
    );
  }

  let schemaVersion: SemanticVersion;
  if (raw['schemaVersion'] instanceof SemanticVersion) {
    schemaVersion = raw['schemaVersion'];
  } else if (typeof raw['schemaVersion'] === 'string') {
    try {
      schemaVersion = SemanticVersion.parse(raw['schemaVersion']);
    } catch {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.UNSUPPORTED_SCHEMA_VERSION,
        `Invalid authoring schema version format '${String(raw['schemaVersion'])}'.`,
        'schemaVersion',
      );
    }
  } else {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.INVALID_PROPERTY_TYPE,
      'AuthoringDocument schemaVersion must be a valid version string.',
      'schemaVersion',
    );
  }

  const expectedVersion = SemanticVersion.parse(AUTHORING_SCHEMA_VERSION);
  if (!schemaVersion.equals(expectedVersion)) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.UNSUPPORTED_SCHEMA_VERSION,
      `Unsupported authoring schema version '${schemaVersion.toString()}'. Supported version is '${AUTHORING_SCHEMA_VERSION}'.`,
      'schemaVersion',
    );
  }

  // 3. Validate declarations collection presence and type
  if (
    !('declarations' in raw) ||
    raw['declarations'] === undefined ||
    raw['declarations'] === null
  ) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.MISSING_REQUIRED_PROPERTY,
      'AuthoringDocument requires an explicit declarations array property.',
      'declarations',
    );
  }

  if (!Array.isArray(raw['declarations'])) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.INVALID_COLLECTION,
      'AuthoringDocument requires an explicit declarations array.',
      'declarations',
    );
  }

  // 4. Validate declarations sequence
  const seenExactTypeKeys = new Set<string>();
  const allowedDeclKeys = new Set([
    'kind',
    'definition',
    'dataFacet',
    'constraints',
  ]);

  const validatedDeclarations: AuthoringElement[] = [];

  for (let index = 0; index < raw['declarations'].length; index++) {
    const decl = raw['declarations'][index];

    if (decl === null || typeof decl !== 'object' || Array.isArray(decl)) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION,
        `Unsupported declaration at index ${index}: must be a plain object.`,
        'declarations',
        index,
      );
    }

    const declRecord = decl as Record<string, unknown>;

    // Check unknown declaration properties
    for (const key of Object.keys(declRecord)) {
      if (!allowedDeclKeys.has(key)) {
        throw new AuthoringDocumentValidationError(
          AUTHORING_DOCUMENT_ERROR_CODES.UNKNOWN_PROPERTY,
          `Unrecognized declaration property '${key}' at index ${index}.`,
          key,
          index,
        );
      }
    }

    // Check kind
    if (!('kind' in declRecord) || declRecord['kind'] === undefined || declRecord['kind'] === null) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.MISSING_REQUIRED_PROPERTY,
        `Declaration at index ${index} is missing required 'kind' property.`,
        'kind',
        index,
      );
    }

    if (declRecord['kind'] !== 'type') {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION_KIND,
        `Unsupported declaration kind '${String(declRecord['kind'])}' at index ${index}. Only 'type' declarations are supported in MOD-01.`,
        'kind',
        index,
      );
    }

    // Check definition
    if (
      !('definition' in declRecord) ||
      declRecord['definition'] === undefined ||
      declRecord['definition'] === null
    ) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.MISSING_REQUIRED_PROPERTY,
        `Type declaration at index ${index} is missing required 'definition' property.`,
        'definition',
        index,
      );
    }

    let parsedDef: TypeDefinition;
    try {
      parsedDef = parseTypeDefinition(declRecord['definition']);
    } catch (err) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION,
        `Type definition at index ${index} failed semantic validation: ${err instanceof Error ? err.message : String(err)}`,
        'definition',
        index,
      );
    }

    // Check optional dataFacet
    let dataFacetCopy: DataFacetJSON | undefined;
    if ('dataFacet' in declRecord && declRecord['dataFacet'] !== undefined) {
      if (
        declRecord['dataFacet'] === null ||
        typeof declRecord['dataFacet'] !== 'object' ||
        Array.isArray(declRecord['dataFacet'])
      ) {
        throw new AuthoringDocumentValidationError(
          AUTHORING_DOCUMENT_ERROR_CODES.INVALID_PROPERTY_TYPE,
          `DataFacet at index ${index} must be a non-null object.`,
          'dataFacet',
          index,
        );
      }
      try {
        parseDataFacet(declRecord['dataFacet']);
        dataFacetCopy = Object.freeze({
          ...(declRecord['dataFacet'] as DataFacetJSON),
        });
      } catch (err) {
        throw new AuthoringDocumentValidationError(
          AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION,
          `DataFacet at index ${index} failed validation: ${err instanceof Error ? err.message : String(err)}`,
          'dataFacet',
          index,
        );
      }
    }

    // Check optional constraints
    let constraintsCopy: readonly FieldConstraintSetJSON[] | undefined;
    if ('constraints' in declRecord && declRecord['constraints'] !== undefined) {
      if (!Array.isArray(declRecord['constraints'])) {
        throw new AuthoringDocumentValidationError(
          AUTHORING_DOCUMENT_ERROR_CODES.INVALID_COLLECTION,
          `Constraints at index ${index} must be an array.`,
          'constraints',
          index,
        );
      }
      const parsedConstraints: FieldConstraintSetJSON[] = [];
      for (let cIdx = 0; cIdx < declRecord['constraints'].length; cIdx++) {
        const c = declRecord['constraints'][cIdx];
        try {
          parseFieldConstraintSet(c);
          parsedConstraints.push(Object.freeze({ ...c }));
        } catch (err) {
          throw new AuthoringDocumentValidationError(
            AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DECLARATION,
            `Constraint set at index ${index}[${cIdx}] failed validation: ${err instanceof Error ? err.message : String(err)}`,
            'constraints',
            index,
          );
        }
      }
      constraintsCopy = Object.freeze(parsedConstraints);
    }

    // Exact identity + version collision check
    const key = `${parsedDef.id.toString()}\u0000${parsedDef.version.toString()}`;
    if (seenExactTypeKeys.has(key)) {
      throw new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.DUPLICATE_DECLARATION,
        `Duplicate exact type declaration '${parsedDef.qualifiedName.toString()}@${parsedDef.version.toString()}' at index ${index}.`,
        'declarations',
        index,
      );
    }
    seenExactTypeKeys.add(key);

    const frozenDeclaration: AuthoringTypeDeclaration = Object.freeze({
      kind: 'type' as const,
      definition: Object.freeze({
        ...(declRecord['definition'] as TypeDefinitionJSON),
      }),
      ...(dataFacetCopy !== undefined ? { dataFacet: dataFacetCopy } : {}),
      ...(constraintsCopy !== undefined ? { constraints: constraintsCopy } : {}),
    });

    validatedDeclarations.push(frozenDeclaration);
  }

  return new ImmutableAuthoringDocument(schemaVersion, validatedDeclarations);
}

// ─── Serialization and Deserialization ────────────────────────────────────────

/**
 * Serializes an AuthoringDocument into a deterministic, wire-safe JSON interchange shape.
 *
 * @param document A validated AuthoringDocument instance.
 * @returns Deeply frozen JSON wire representation.
 * @throws AuthoringDocumentValidationError if document is invalid.
 */
export function serializeAuthoringDocument(
  document: AuthoringDocument,
): AuthoringDocumentJSON {
  if (
    !(document.schemaVersion instanceof SemanticVersion) ||
    !Array.isArray(document.declarations)
  ) {
    throw new AuthoringDocumentValidationError(
      AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DOCUMENT,
      'Serialization requires a trusted AuthoringDocument instance.',
    );
  }

  const serializedDeclarations = document.declarations.map((decl) =>
    Object.freeze({
      kind: decl.kind,
      definition: Object.freeze({ ...decl.definition }),
      ...(decl.dataFacet !== undefined
        ? { dataFacet: Object.freeze({ ...decl.dataFacet }) }
        : {}),
      ...(decl.constraints !== undefined
        ? { constraints: Object.freeze([...decl.constraints]) }
        : {}),
    }),
  );

  return Object.freeze({
    schemaVersion: document.schemaVersion.toString(),
    declarations: Object.freeze(serializedDeclarations),
  });
}

/**
 * Strictly parses and validates raw interchange data into an authentic AuthoringDocument.
 *
 * @param raw Untrusted JSON or parsed document input.
 * @returns Fully validated, immutable AuthoringDocument.
 * @throws AuthoringDocumentValidationError on any structural or semantic violation.
 */
export function parseAuthoringDocument(raw: unknown): AuthoringDocument {
  return createAuthoringDocument(raw as AuthoringDocumentJSON);
}

/**
 * Non-throwing safe parse function returning a discriminated result union.
 *
 * @param raw Untrusted input.
 * @returns `{ ok: true, value }` on success, `{ ok: false, error }` on failure.
 */
export function tryParseAuthoringDocument(
  raw: unknown,
): AuthoringDocumentParseResult {
  try {
    const value = parseAuthoringDocument(raw);
    return { ok: true, value };
  } catch (error) {
    if (error instanceof AuthoringDocumentValidationError) {
      return { ok: false, error };
    }
    return {
      ok: false,
      error: new AuthoringDocumentValidationError(
        AUTHORING_DOCUMENT_ERROR_CODES.INVALID_DOCUMENT,
        error instanceof Error ? error.message : 'Unexpected parsing error',
      ),
    };
  }
}

/**
 * Type guard verifying whether candidate is a valid AuthoringDocument instance.
 */
export function isAuthoringDocument(value: unknown): value is AuthoringDocument {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    candidate['schemaVersion'] instanceof SemanticVersion &&
    Array.isArray(candidate['declarations']) &&
    typeof (candidate as unknown as AuthoringDocument).getTypeDeclaration ===
      'function'
  );
}

// ─── Structural Diagnostic Validator ──────────────────────────────────────────

/**
 * Non-throwing structural validator that evaluates candidate data against the
 * Authoring Model Schema and returns SK-11 Diagnostic observations.
 *
 * @param raw Untrusted external input.
 * @returns Readonly array of SK-11 Diagnostics (empty if valid).
 */
export function validateAuthoringDocumentStructure(
  raw: unknown,
): readonly Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.INVALID_ROOT,
        'Authoring document must be a non-null, non-array object.',
      ),
    );
    return Object.freeze(diagnostics);
  }

  const record = raw as Record<string, unknown>;

  // Check unknown root properties
  const allowedRootKeys = new Set(['schemaVersion', 'declarations']);
  for (const key of Object.keys(record)) {
    if (!allowedRootKeys.has(key)) {
      diagnostics.push(
        createAuthoringDiagnostic(
          AUTHORING_DIAGNOSTIC_CODES.UNKNOWN_PROPERTY,
          `Unrecognized root property '${key}' in authoring document.`,
          { property: key },
        ),
      );
    }
  }

  // Check schemaVersion
  if (
    !('schemaVersion' in record) ||
    record['schemaVersion'] === undefined ||
    record['schemaVersion'] === null
  ) {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY,
        'Authoring document is missing required schemaVersion property.',
        { property: 'schemaVersion' },
      ),
    );
  } else if (typeof record['schemaVersion'] !== 'string') {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.INVALID_PROPERTY_TYPE,
        'Authoring document schemaVersion must be a string.',
        { property: 'schemaVersion', actualType: typeof record['schemaVersion'] },
      ),
    );
  } else if (record['schemaVersion'] !== AUTHORING_SCHEMA_VERSION) {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.UNSUPPORTED_SCHEMA_VERSION,
        `Unsupported authoring schema version '${record['schemaVersion']}'. Expected '${AUTHORING_SCHEMA_VERSION}'.`,
        {
          providedVersion: record['schemaVersion'],
          supportedVersion: AUTHORING_SCHEMA_VERSION,
        },
      ),
    );
  }

  // Check declarations
  if (
    !('declarations' in record) ||
    record['declarations'] === undefined ||
    record['declarations'] === null
  ) {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY,
        'Authoring document is missing required declarations array.',
        { property: 'declarations' },
      ),
    );
  } else if (!Array.isArray(record['declarations'])) {
    diagnostics.push(
      createAuthoringDiagnostic(
        AUTHORING_DIAGNOSTIC_CODES.INVALID_COLLECTION,
        'Authoring document declarations property must be an array.',
        { property: 'declarations', actualType: typeof record['declarations'] },
      ),
    );
  } else {
    const seen = new Set<string>();
    for (let i = 0; i < record['declarations'].length; i++) {
      const decl = record['declarations'][i];
      if (decl === null || typeof decl !== 'object' || Array.isArray(decl)) {
        diagnostics.push(
          createAuthoringDiagnostic(
            AUTHORING_DIAGNOSTIC_CODES.INVALID_DECLARATION,
            `Declaration at index ${i} must be a non-null object.`,
            { index: i },
          ),
        );
        continue;
      }

      const dRecord = decl as Record<string, unknown>;
      if (!('kind' in dRecord) || dRecord['kind'] === undefined || dRecord['kind'] === null) {
        diagnostics.push(
          createAuthoringDiagnostic(
            AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY,
            `Declaration at index ${i} is missing required 'kind' property.`,
            { index: i, property: 'kind' },
          ),
        );
      } else if (dRecord['kind'] !== 'type') {
        diagnostics.push(
          createAuthoringDiagnostic(
            AUTHORING_DIAGNOSTIC_CODES.INVALID_DECLARATION_KIND,
            `Declaration at index ${i} has unsupported kind '${String(dRecord['kind'])}'.`,
            { index: i, kind: String(dRecord['kind']) },
          ),
        );
      }

      if (!('definition' in dRecord) || dRecord['definition'] === undefined || dRecord['definition'] === null) {
        diagnostics.push(
          createAuthoringDiagnostic(
            AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY,
            `Type declaration at index ${i} is missing required 'definition' property.`,
            { index: i, property: 'definition' },
          ),
        );
      } else {
        try {
          const parsed = parseTypeDefinition(dRecord['definition']);
          const key = `${parsed.id.toString()}\u0000${parsed.version.toString()}`;
          if (seen.has(key)) {
            diagnostics.push(
              createAuthoringDiagnostic(
                AUTHORING_DIAGNOSTIC_CODES.DUPLICATE_DECLARATION,
                `Duplicate exact type declaration '${parsed.qualifiedName.toString()}@${parsed.version.toString()}' at index ${i}.`,
                {
                  index: i,
                  id: parsed.id.toString(),
                  version: parsed.version.toString(),
                },
              ),
            );
          }
          seen.add(key);
        } catch (err) {
          diagnostics.push(
            createAuthoringDiagnostic(
              AUTHORING_DIAGNOSTIC_CODES.INVALID_DECLARATION,
              `Type definition at index ${i} is invalid: ${err instanceof Error ? err.message : String(err)}`,
              { index: i },
            ),
          );
        }
      }
    }
  }

  return Object.freeze(diagnostics);
}
