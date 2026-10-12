/**
 * @file element-ref.ts
 * @module @ecosystem/semantic-kernel/references
 *
 * SK-08: Semantic Element References.
 *
 * Establishes a precise, immutable, strongly typed semantic reference model.
 * An ElementRef expresses reference *intent* — it describes the target of a
 * semantic relationship, model declaration, dependency, or future resolution
 * request.
 *
 * Architectural Invariants:
 * - ElementRef ≠ SemanticElementId: the ID is a target component, not a ref.
 * - ElementRef ≠ QualifiedName: a name is a target component, not a ref.
 * - ElementRef ≠ SemanticElement: a ref does not contain the definition.
 * - ElementRef ≠ ResolvedElement: resolution is out of scope for SK-08.
 * - ElementRef ≠ RuntimeInstanceRef: no business-data instance identity here.
 * - Reference ≠ Resolution: a valid ref proves structural validity only.
 * - Missing ≠ Null ≠ Value for the optional version field.
 * - Context owns meaning: named refs carry an explicit SemanticContextRef.
 * - No registry, resolver, policy, or I/O is invoked during construction.
 * - Pure TypeScript: zero external dependencies, browser- and Node.js-safe.
 */

import {
  SemanticElementId,
  SemanticElementIdValidationError,
} from '../identity/semantic-element-id.js';
import {
  SemanticContextRef,
  SemanticContextRefValidationError,
} from '../identity/semantic-context-ref.js';
import {
  QualifiedName,
  QualifiedNameValidationError,
} from '../naming/qualified-name.js';
import {
  SemanticVersion,
  SemanticVersionValidationError,
} from '../versioning/semantic-version.js';
import { ElementVersionRef } from '../versioning/element-version-ref.js';
import { SemanticKernelError } from '../semantic-id.js';

// ─── Error Codes ──────────────────────────────────────────────────────────────

/**
 * Canonical SK-08 error codes.
 * These are diagnostic labels; the full SK-11 Diagnostics Model is deferred.
 */
export const ELEMENT_REF_ERROR_CODES = Object.freeze({
  INVALID_TYPE: 'ELEMENT_REF_INVALID_TYPE',
  UNKNOWN_VARIANT: 'ELEMENT_REF_UNKNOWN_VARIANT',
  MISSING_TARGET: 'ELEMENT_REF_MISSING_TARGET',
  CONFLICTING_TARGET: 'ELEMENT_REF_CONFLICTING_TARGET',
  INVALID_ELEMENT_ID: 'ELEMENT_REF_INVALID_ELEMENT_ID',
  INVALID_QUALIFIED_NAME: 'ELEMENT_REF_INVALID_QUALIFIED_NAME',
  MISSING_CONTEXT: 'ELEMENT_REF_MISSING_CONTEXT',
  INVALID_CONTEXT: 'ELEMENT_REF_INVALID_CONTEXT',
  INVALID_VERSION: 'ELEMENT_REF_INVALID_VERSION',
  INVALID_SHAPE: 'ELEMENT_REF_INVALID_SHAPE',
  NULL_VERSION: 'ELEMENT_REF_NULL_VERSION',
  NULL_CONTEXT: 'ELEMENT_REF_NULL_CONTEXT',
  EXTRA_FIELD: 'ELEMENT_REF_EXTRA_FIELD',
} as const);

export type ElementRefErrorCode =
  (typeof ELEMENT_REF_ERROR_CODES)[keyof typeof ELEMENT_REF_ERROR_CODES];

/**
 * Structured validation error for SK-08 reference construction and parsing
 * failures. Extends the established SemanticKernelError convention.
 */
export class ElementRefValidationError extends SemanticKernelError {
  public override readonly code: ElementRefErrorCode;

  public constructor(code: ElementRefErrorCode, message: string) {
    super(message, code);
    this.name = 'ElementRefValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Reference Variant Interfaces ─────────────────────────────────────────────

/**
 * An identity-based ElementRef targets a semantic element by its stable
 * SemanticElementId (SK-01).
 *
 * Design choices:
 * - `by: 'id'` is the explicit discriminant; narrowing is always reliable.
 * - `qualifiedName?: never` and `contextRef?: never` prevent callers from
 *   accidentally providing name or context fields in an object literal,
 *   giving an additional compile-time guard on top of runtime validation.
 * - `version` is truly optional (not null-able): Missing ≠ Null ≠ Value.
 */
export interface ElementIdRef {
  readonly by: 'id';
  readonly elementId: SemanticElementId;
  /** Forbidden on this variant; enforces no dual-target shape at compile time. */
  readonly qualifiedName?: never;
  /** Forbidden on this variant; explicit context is not required for ID-based refs. */
  readonly contextRef?: never;
  /** Exact requested definition version. Omission is version-unspecified. */
  readonly version?: SemanticVersion;
}

/**
 * A named ElementRef targets a semantic element by QualifiedName (SK-03) within
 * an explicit SemanticContextRef (SK-04).
 *
 * Design choices:
 * - `by: 'name'` is the explicit discriminant.
 * - `contextRef` is required for name-based refs: context owns meaning.
 * - `elementId?: never` prevents dual-target shapes at compile time.
 * - `version` is truly optional.
 */
export interface ElementNameRef {
  readonly by: 'name';
  readonly qualifiedName: QualifiedName;
  /** Required: the same QualifiedName can exist in different contexts. */
  readonly contextRef: SemanticContextRef;
  /** Forbidden on this variant. */
  readonly elementId?: never;
  /** Exact requested definition version. Omission is version-unspecified. */
  readonly version?: SemanticVersion;
}

/**
 * A discriminated union of all supported semantic element reference variants.
 *
 * ```
 * ElementRef
 *   ├── ElementIdRef   — target by stable SemanticElementId
 *   └── ElementNameRef — target by QualifiedName within an explicit context
 * ```
 *
 * Both variants are immutable after construction.
 * Cross-variant structural equality is always false (see {@link equalsElementRef}).
 */
export type ElementRef = ElementIdRef | ElementNameRef;

// ─── Canonical JSON Wire Types ─────────────────────────────────────────────────

/**
 * Wire representation for an identity-based reference.
 * Version is omitted when unspecified (missing ≠ null ≠ value).
 */
export interface ElementIdRefJSON {
  readonly by: 'id';
  readonly elementId: string;
  readonly version?: string;
}

/**
 * Wire representation for a named reference.
 * Version is omitted when unspecified.
 */
export interface ElementNameRefJSON {
  readonly by: 'name';
  readonly qualifiedName: string;
  readonly contextRef: string;
  readonly version?: string;
}

/** Canonical union of all SK-08 wire shapes. */
export type ElementRefJSON = ElementIdRefJSON | ElementNameRefJSON;

// ─── Factory Functions ─────────────────────────────────────────────────────────

/**
 * Creates a validated, immutable identity-based ElementRef.
 *
 * @param elementId — An already-validated SemanticElementId instance (SK-01).
 * @param version   — An already-validated exact SemanticVersion (SK-07), or
 *                    omitted for a version-unspecified reference.
 * @throws ElementRefValidationError if elementId is not a SemanticElementId
 *   instance, or version is not a SemanticVersion instance (when provided).
 */
export function createElementIdRef(
  elementId: SemanticElementId,
  version?: SemanticVersion,
): ElementIdRef {
  if (!(elementId instanceof SemanticElementId)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_ELEMENT_ID,
      'createElementIdRef requires an authenticated SemanticElementId instance.',
    );
  }
  if (version !== undefined && !(version instanceof SemanticVersion)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_VERSION,
      'createElementIdRef: version must be a SemanticVersion instance when provided.',
    );
  }

  // Construct with explicit presence state; omit the key when unspecified.
  const ref: ElementIdRef = Object.freeze(
    version !== undefined
      ? { by: 'id' as const, elementId, version }
      : { by: 'id' as const, elementId },
  );
  return ref;
}

/**
 * Creates a validated, immutable named ElementRef.
 *
 * Context is always required for named references. The same QualifiedName can
 * exist in different contexts and must not silently resolve to one of them.
 *
 * @param qualifiedName — An already-validated QualifiedName instance (SK-03).
 * @param contextRef    — An already-validated SemanticContextRef instance (SK-04).
 * @param version       — An already-validated exact SemanticVersion (SK-07), or
 *                        omitted for a version-unspecified reference.
 * @throws ElementRefValidationError for invalid component instances.
 */
export function createElementNameRef(
  qualifiedName: QualifiedName,
  contextRef: SemanticContextRef,
  version?: SemanticVersion,
): ElementNameRef {
  if (!(qualifiedName instanceof QualifiedName)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'createElementNameRef requires an authenticated QualifiedName instance.',
    );
  }
  if (!(contextRef instanceof SemanticContextRef)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.MISSING_CONTEXT,
      'createElementNameRef requires an authenticated SemanticContextRef instance.',
    );
  }
  if (version !== undefined && !(version instanceof SemanticVersion)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_VERSION,
      'createElementNameRef: version must be a SemanticVersion instance when provided.',
    );
  }

  const ref: ElementNameRef = Object.freeze(
    version !== undefined
      ? { by: 'name' as const, qualifiedName, contextRef, version }
      : { by: 'name' as const, qualifiedName, contextRef },
  );
  return ref;
}

// ─── Structural Equality ──────────────────────────────────────────────────────

/**
 * Structural equality for ElementRef values.
 *
 * Two references are equal only when:
 * 1. They use the same target mode (same `by` discriminant).
 * 2. Their target components are equal by value.
 * 3. Their explicit contexts are equal where applicable.
 * 4. Their version fields have the same presence state.
 * 5. Their versions are equal when both are present.
 *
 * Cross-variant equality is always false; an ID ref and a name ref that
 * resolve to the same element are structurally different references.
 *
 * This function does NOT perform I/O, resolve names, or consult registries.
 */
export function equalsElementRef(a: ElementRef, b: ElementRef): boolean {
  if (a.by !== b.by) return false;

  if (a.by === 'id' && b.by === 'id') {
    if (!a.elementId.equals(b.elementId)) return false;
    const aHasVersion = a.version !== undefined;
    const bHasVersion = b.version !== undefined;
    if (aHasVersion !== bHasVersion) return false;
    if (aHasVersion && bHasVersion) {
      // Both present — use SK-07 exact equality (includes build metadata).
      return (a.version as SemanticVersion).equals(
        b.version as SemanticVersion,
      );
    }
    return true;
  }

  if (a.by === 'name' && b.by === 'name') {
    if (!a.qualifiedName.equals(b.qualifiedName)) return false;
    if (!a.contextRef.equals(b.contextRef)) return false;
    const aHasVersion = a.version !== undefined;
    const bHasVersion = b.version !== undefined;
    if (aHasVersion !== bHasVersion) return false;
    if (aHasVersion && bHasVersion) {
      return (a.version as SemanticVersion).equals(
        b.version as SemanticVersion,
      );
    }
    return true;
  }

  /* istanbul ignore next — discriminant exhaustion guard */
  return false;
}

// ─── SK-07 Conversion ─────────────────────────────────────────────────────────

/**
 * Converts a fully specified identity-based ElementRef into an ElementVersionRef.
 *
 * Conversion is only possible when:
 * - The reference is identity-based (`by: 'id'`).
 * - An exact version is present.
 *
 * Returns `undefined` when the version is absent (version-unspecified).
 *
 * A named reference cannot be converted without name resolution, which is out
 * of scope for SK-08. No ID is fabricated, no registry is consulted.
 */
export function toElementVersionRef(
  ref: ElementIdRef,
): ElementVersionRef | undefined {
  if (!(ref.elementId instanceof SemanticElementId)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_ELEMENT_ID,
      'toElementVersionRef: reference does not carry a valid SemanticElementId.',
    );
  }
  if (ref.version === undefined) {
    return undefined;
  }
  if (!(ref.version instanceof SemanticVersion)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_VERSION,
      'toElementVersionRef: version field is present but not a SemanticVersion instance.',
    );
  }
  return ElementVersionRef.fromParts(ref.elementId, ref.version);
}

// ─── Serialization ────────────────────────────────────────────────────────────

/**
 * Produces a canonical JSON-safe object for an ElementRef.
 *
 * Serialization rules:
 * - `by` discriminant is always present.
 * - Component primitives serialize via their `.toString()` contract.
 * - The `version` property is omitted entirely when unspecified
 *   (missing ≠ null ≠ value; `null` is not produced).
 * - No private state or internal metadata is serialized.
 * - The switch is exhaustive; unknown discriminants throw.
 */
export function serializeElementRef(ref: ElementRef): ElementRefJSON {
  switch (ref.by) {
    case 'id': {
      const record: {
        by: 'id';
        elementId: string;
        version?: string;
      } = { by: 'id', elementId: ref.elementId.toString() };
      if (ref.version !== undefined) {
        record.version = ref.version.toString();
      }
      return Object.freeze(record) as ElementIdRefJSON;
    }

    case 'name': {
      const record: {
        by: 'name';
        qualifiedName: string;
        contextRef: string;
        version?: string;
      } = {
        by: 'name',
        qualifiedName: ref.qualifiedName.toString(),
        contextRef: ref.contextRef.toString(),
      };
      if (ref.version !== undefined) {
        record.version = ref.version.toString();
      }
      return Object.freeze(record) as ElementNameRefJSON;
    }

    default: {
      // TypeScript narrows `ref` to `never` here; this branch is a safety net.
      const exhaustiveCheck: never = ref;
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.UNKNOWN_VARIANT,
        `serializeElementRef: unrecognized reference variant '${(exhaustiveCheck as { by: string }).by}'.`,
      );
    }
  }
}

// ─── Deserialization / Parsing ────────────────────────────────────────────────

/**
 * Parses and validates an untrusted external value into a trusted ElementRef.
 *
 * Parsing rules:
 * 1. Input must be a plain object (not null, not an array, not a class instance).
 * 2. The `by` discriminant must be present and must be 'id' or 'name'.
 * 3. For `by: 'id'`:
 *    - `elementId` (string) is required.
 *    - `version` (string) is optional; null is rejected.
 *    - `qualifiedName` and `contextRef` must be absent.
 * 4. For `by: 'name'`:
 *    - `qualifiedName` (string) is required.
 *    - `contextRef` (string) is required.
 *    - `version` (string) is optional; null is rejected.
 *    - `elementId` must be absent.
 * 5. Unknown fields are rejected to prevent silent interpretation shifts.
 * 6. Component strings are parsed through existing Kernel APIs.
 * 7. The resulting reference is fully validated and immutable.
 *
 * @throws ElementRefValidationError for any structural or semantic violation.
 */
export function parseElementRef(input: unknown): ElementRef {
  // ── 1. Top-level shape check ──────────────────────────────────────────────
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_TYPE,
      'ElementRef input must be a plain object record.',
    );
  }

  // Guard against class instances or exotic objects.
  const proto: unknown = Object.getPrototypeOf(input);
  if (proto !== Object.prototype && proto !== null) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_TYPE,
      'ElementRef input must be a plain object, not a class instance.',
    );
  }

  const raw = input as Record<string, unknown>;

  // ── 2. Read and validate the discriminant ────────────────────────────────
  const by = raw['by'];
  if (by === undefined || by === null) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.MISSING_TARGET,
      "ElementRef input must include a 'by' discriminant ('id' or 'name').",
    );
  }
  if (typeof by !== 'string') {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_SHAPE,
      "ElementRef 'by' discriminant must be a string.",
    );
  }
  if (by !== 'id' && by !== 'name') {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.UNKNOWN_VARIANT,
      `ElementRef: unrecognized target mode '${by}'. Expected 'id' or 'name'.`,
    );
  }

  // ── 3. Dispatch on discriminant ───────────────────────────────────────────
  if (by === 'id') {
    return parseElementIdRefRecord(raw);
  } else {
    return parseElementNameRefRecord(raw);
  }
}

/** Permitted own-key sets, pre-computed for fast membership checks. */
const ID_REF_REQUIRED_KEYS = new Set<string>(['by', 'elementId']);
const ID_REF_ALLOWED_KEYS = new Set<string>(['by', 'elementId', 'version']);
const NAME_REF_REQUIRED_KEYS = new Set<string>([
  'by',
  'qualifiedName',
  'contextRef',
]);
const NAME_REF_ALLOWED_KEYS = new Set<string>([
  'by',
  'qualifiedName',
  'contextRef',
  'version',
]);

/**
 * Parses the inner record for an identity-based (`by: 'id'`) variant.
 * Enforces strict field presence; rejects conflicting or unknown keys.
 */
function parseElementIdRefRecord(raw: Record<string, unknown>): ElementIdRef {
  const ownKeys = Object.keys(raw);

  // Reject unknown keys first (security: conflicting intent).
  for (const key of ownKeys) {
    if (!ID_REF_ALLOWED_KEYS.has(key)) {
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.EXTRA_FIELD,
        `ElementIdRef: unexpected field '${key}'. Only 'by', 'elementId', and 'version' are permitted.`,
      );
    }
  }

  // Detect conflicting name-targeting fields.
  if ('qualifiedName' in raw || 'contextRef' in raw) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.CONFLICTING_TARGET,
      "ElementIdRef: 'qualifiedName' and 'contextRef' must not appear in an identity reference.",
    );
  }

  // Require elementId.
  if (!ownKeys.includes('elementId')) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.MISSING_TARGET,
      "ElementIdRef: 'elementId' is required.",
    );
  }
  void ID_REF_REQUIRED_KEYS; // silence unused-var lint

  const rawId = raw['elementId'];
  let elementId: SemanticElementId;
  try {
    elementId = SemanticElementId.parse(rawId);
  } catch (error) {
    if (!(error instanceof SemanticElementIdValidationError)) throw error;
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_ELEMENT_ID,
      'ElementIdRef: elementId contains an invalid semantic element identity.',
    );
  }

  // Parse optional version — reject null explicitly (missing ≠ null ≠ value).
  if ('version' in raw) {
    const rawVersion = raw['version'];
    if (rawVersion === null) {
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.NULL_VERSION,
        'ElementIdRef: version must be a string or omitted; null is not permitted.',
      );
    }
    let version: SemanticVersion;
    try {
      version = SemanticVersion.parse(rawVersion);
    } catch (error) {
      if (!(error instanceof SemanticVersionValidationError)) throw error;
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.INVALID_VERSION,
        'ElementIdRef: version contains an invalid semantic version string.',
      );
    }
    return createElementIdRef(elementId, version);
  }

  return createElementIdRef(elementId);
}

/**
 * Parses the inner record for a named (`by: 'name'`) variant.
 * Enforces strict field presence; rejects conflicting or unknown keys.
 */
function parseElementNameRefRecord(
  raw: Record<string, unknown>,
): ElementNameRef {
  const ownKeys = Object.keys(raw);

  // Reject unknown keys.
  for (const key of ownKeys) {
    if (!NAME_REF_ALLOWED_KEYS.has(key)) {
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.EXTRA_FIELD,
        `ElementNameRef: unexpected field '${key}'. Only 'by', 'qualifiedName', 'contextRef', and 'version' are permitted.`,
      );
    }
  }

  // Detect conflicting ID-targeting fields.
  if ('elementId' in raw) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.CONFLICTING_TARGET,
      "ElementNameRef: 'elementId' must not appear in a named reference.",
    );
  }

  // Require qualifiedName.
  if (!ownKeys.includes('qualifiedName')) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.MISSING_TARGET,
      "ElementNameRef: 'qualifiedName' is required.",
    );
  }

  // Require contextRef (context owns meaning).
  if (!ownKeys.includes('contextRef')) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.MISSING_CONTEXT,
      "ElementNameRef: 'contextRef' is required. Named references must carry an explicit semantic context.",
    );
  }
  void NAME_REF_REQUIRED_KEYS; // silence unused-var lint

  // Reject null context (missing ≠ null ≠ value).
  if (raw['contextRef'] === null) {
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.NULL_CONTEXT,
      'ElementNameRef: contextRef must be a string or omitted; null is not permitted.',
    );
  }

  const rawQualifiedName = raw['qualifiedName'];
  let qualifiedName: QualifiedName;
  try {
    qualifiedName = QualifiedName.parse(rawQualifiedName);
  } catch (error) {
    if (!(error instanceof QualifiedNameValidationError)) throw error;
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_QUALIFIED_NAME,
      'ElementNameRef: qualifiedName contains an invalid qualified name string.',
    );
  }

  const rawContextRef = raw['contextRef'];
  let contextRef: SemanticContextRef;
  try {
    contextRef = SemanticContextRef.parse(rawContextRef);
  } catch (error) {
    if (!(error instanceof SemanticContextRefValidationError)) throw error;
    throw new ElementRefValidationError(
      ELEMENT_REF_ERROR_CODES.INVALID_CONTEXT,
      'ElementNameRef: contextRef contains an invalid semantic context reference.',
    );
  }

  // Parse optional version.
  if ('version' in raw) {
    const rawVersion = raw['version'];
    if (rawVersion === null) {
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.NULL_VERSION,
        'ElementNameRef: version must be a string or omitted; null is not permitted.',
      );
    }
    let version: SemanticVersion;
    try {
      version = SemanticVersion.parse(rawVersion);
    } catch (error) {
      if (!(error instanceof SemanticVersionValidationError)) throw error;
      throw new ElementRefValidationError(
        ELEMENT_REF_ERROR_CODES.INVALID_VERSION,
        'ElementNameRef: version contains an invalid semantic version string.',
      );
    }
    return createElementNameRef(qualifiedName, contextRef, version);
  }

  return createElementNameRef(qualifiedName, contextRef);
}

// ─── Type Narrowing Helpers ───────────────────────────────────────────────────

/** Narrows an ElementRef to the identity-based variant at runtime. */
export function isElementIdRef(ref: ElementRef): ref is ElementIdRef {
  return ref.by === 'id';
}

/** Narrows an ElementRef to the named variant at runtime. */
export function isElementNameRef(ref: ElementRef): ref is ElementNameRef {
  return ref.by === 'name';
}

/**
 * Human-readable diagnostic rendering of an ElementRef.
 * This is NOT the canonical interchange format — use serializeElementRef
 * for wire-safe JSON. The diagnostic string is not parseable.
 */
export function describeElementRef(ref: ElementRef): string {
  switch (ref.by) {
    case 'id': {
      const versionPart =
        ref.version !== undefined ? ` @${ref.version.toString()}` : '';
      return `ElementIdRef(${ref.elementId.toString()}${versionPart})`;
    }
    case 'name': {
      const versionPart =
        ref.version !== undefined ? ` @${ref.version.toString()}` : '';
      return `ElementNameRef(${ref.qualifiedName.toString()} in ${ref.contextRef.toString()}${versionPart})`;
    }
    default: {
      const exhaustiveCheck: never = ref;
      return `ElementRef(unknown:${(exhaustiveCheck as { by: string }).by})`;
    }
  }
}
