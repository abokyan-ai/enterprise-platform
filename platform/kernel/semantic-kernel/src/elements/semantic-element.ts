/**
 * @file semantic-element.ts
 * @module @ecosystem/semantic-kernel
 *
 * SK-05: SemanticElement Base Contract.
 *
 * Establishes the minimal, immutable, strongly typed base contract for semantic
 * definitions by composing existing Kernel primitives:
 * - SemanticElementId (SK-01) — Stable semantic identity
 * - QualifiedName (SK-03) — Canonical semantic naming (incorporating SK-02 Namespace)
 * - SemanticContextRef (SK-04) — Explicit semantic interpretation boundary ("Context Owns Meaning")
 *
 * Architectural Invariants:
 * - Definitions ≠ Instances ≠ Execution.
 * - Composition over inheritance (Pure TypeScript interface, no mandatory class hierarchy).
 * - Strict minimalism: kind (SK-06), version (SK-07), facets (SK-10), and metadata are excluded.
 * - Pure TypeScript: Zero framework, ORM, database, or runtime dependencies.
 */

import { SemanticElementId } from '../identity/semantic-element-id.js';
import { QualifiedName } from '../naming/qualified-name.js';
import { SemanticContextRef } from '../identity/semantic-context-ref.js';
import { SemanticKernelError } from '../semantic-id.js';

/**
 * Structured error codes for SemanticElement validation failures.
 */
export const SEMANTIC_ELEMENT_ERROR_CODES = {
  NON_OBJECT: 'SEMANTIC_ELEMENT_NON_OBJECT',
  MISSING_ID: 'SEMANTIC_ELEMENT_MISSING_ID',
  INVALID_ID: 'SEMANTIC_ELEMENT_INVALID_ID',
  MISSING_QUALIFIED_NAME: 'SEMANTIC_ELEMENT_MISSING_QUALIFIED_NAME',
  INVALID_QUALIFIED_NAME: 'SEMANTIC_ELEMENT_INVALID_QUALIFIED_NAME',
  MISSING_CONTEXT_REF: 'SEMANTIC_ELEMENT_MISSING_CONTEXT_REF',
  INVALID_CONTEXT_REF: 'SEMANTIC_ELEMENT_INVALID_CONTEXT_REF',
} as const;

/**
 * Union type representing all valid SemanticElement validation error codes.
 */
export type SemanticElementErrorCode =
  (typeof SEMANTIC_ELEMENT_ERROR_CODES)[keyof typeof SEMANTIC_ELEMENT_ERROR_CODES];

/**
 * Error thrown when SemanticElement validation or construction fails.
 */
export class SemanticElementValidationError extends SemanticKernelError {
  public readonly code: SemanticElementErrorCode;
  public readonly field?: string;

  public constructor(
    code: SemanticElementErrorCode,
    message: string,
    field?: string,
  ) {
    super(message, code);
    this.name = 'SemanticElementValidationError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * The foundational base contract for any semantic definition recognized by the platform.
 *
 * A SemanticElement represents a semantic definition-level contract, NOT a runtime instance.
 * It strictly associates:
 * 1. `id`: Stable, platform-independent identity (URN format).
 * 2. `qualifiedName`: Canonical naming within a namespace scope (`namespace:localName`).
 * 3. `contextRef`: Opaque reference to the semantic interpretation boundary.
 *
 * Excluded from this base contract (deferred to designated milestones):
 * - `kind` (SK-06)
 * - `version` (SK-07)
 * - `facets` (SK-10)
 * - `metadata` (Record<string, unknown> escape hatches are strictly prohibited)
 * - Runtime state, timestamps, permissions, and persistence attributes.
 */
export interface SemanticElement {
  /**
   * The globally unique, stable semantic identity of this definition.
   */
  readonly id: SemanticElementId;

  /**
   * The canonical qualified name of this definition, incorporating its namespace.
   */
  readonly qualifiedName: QualifiedName;

  /**
   * The explicit semantic interpretation-context reference ("Context Owns Meaning").
   */
  readonly contextRef: SemanticContextRef;
}

/**
 * Input parameters for creating a validated, immutable SemanticElement.
 */
export interface CreateSemanticElementParams {
  readonly id: SemanticElementId;
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
}

/**
 * Runtime type guard to verify whether an unknown value conforms to the SemanticElement contract.
 *
 * Performs strict prototype checks on constituent value objects to ensure authenticity.
 *
 * @param value The value to inspect.
 * @returns True if value conforms to SemanticElement with authentic value-object constituents.
 */
export function isSemanticElement(value: unknown): value is SemanticElement {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate['id'] instanceof SemanticElementId &&
    candidate['qualifiedName'] instanceof QualifiedName &&
    candidate['contextRef'] instanceof SemanticContextRef
  );
}

/**
 * Constructs a minimal, frozen, validated SemanticElement from authentic constituent value objects.
 *
 * Guarantees:
 * 1. Runtime validation of required fields.
 * 2. Strict rejection of duck-typed objects or primitives masquerading as value objects.
 * 3. Construction of a fresh, immutable (`Object.freeze`) object.
 * 4. Zero mutations of caller-supplied arguments.
 * 5. Deterministic execution with zero I/O, timestamps, or ambient defaults.
 *
 * @param params Parameters containing authentic SemanticElementId, QualifiedName, and SemanticContextRef instances.
 * @returns An immutable SemanticElement instance.
 * @throws SemanticElementValidationError if parameters are missing or invalid.
 */
export function createSemanticElement(
  params: CreateSemanticElementParams,
): SemanticElement {
  if (typeof params !== 'object' || params === null) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.NON_OBJECT,
      'SemanticElement construction requires a non-null parameters object.',
    );
  }

  // 1. Identity validation
  if (!('id' in params) || params.id === undefined || params.id === null) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.MISSING_ID,
      'SemanticElement requires an authentic "id" (SemanticElementId).',
      'id',
    );
  }
  if (!(params.id instanceof SemanticElementId)) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.INVALID_ID,
      'SemanticElement "id" must be an authentic instance of SemanticElementId.',
      'id',
    );
  }

  // 2. QualifiedName validation
  if (
    !('qualifiedName' in params) ||
    params.qualifiedName === undefined ||
    params.qualifiedName === null
  ) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.MISSING_QUALIFIED_NAME,
      'SemanticElement requires an authentic "qualifiedName" (QualifiedName).',
      'qualifiedName',
    );
  }
  if (!(params.qualifiedName instanceof QualifiedName)) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'SemanticElement "qualifiedName" must be an authentic instance of QualifiedName.',
      'qualifiedName',
    );
  }

  // 3. SemanticContextRef validation
  if (
    !('contextRef' in params) ||
    params.contextRef === undefined ||
    params.contextRef === null
  ) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.MISSING_CONTEXT_REF,
      'SemanticElement requires an authentic "contextRef" (SemanticContextRef).',
      'contextRef',
    );
  }
  if (!(params.contextRef instanceof SemanticContextRef)) {
    throw new SemanticElementValidationError(
      SEMANTIC_ELEMENT_ERROR_CODES.INVALID_CONTEXT_REF,
      'SemanticElement "contextRef" must be an authentic instance of SemanticContextRef.',
      'contextRef',
    );
  }

  // Construct and freeze new minimal object
  return Object.freeze({
    id: params.id,
    qualifiedName: params.qualifiedName,
    contextRef: params.contextRef,
  });
}
