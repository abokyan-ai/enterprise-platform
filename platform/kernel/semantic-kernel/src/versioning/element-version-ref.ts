/**
 * SK-07: Immutable exact identity-plus-version references.
 * Structured interchange only; no name, context, tenant, or registry resolution.
 */
import {
  SemanticElementId,
  SemanticElementIdValidationError,
} from '../identity/semantic-element-id.js';
import { SemanticKernelError } from '../semantic-id.js';
import {
  SemanticVersion,
  SemanticVersionValidationError,
} from './semantic-version.js';

export const ELEMENT_VERSION_REF_ERROR_CODES = Object.freeze({
  INVALID_ID: 'ELEMENT_VERSION_REF_INVALID_ID',
  INVALID_VERSION: 'ELEMENT_VERSION_REF_INVALID_VERSION',
  INVALID_SHAPE: 'ELEMENT_VERSION_REF_INVALID_SHAPE',
} as const);

export type ElementVersionRefErrorCode =
  (typeof ELEMENT_VERSION_REF_ERROR_CODES)[keyof typeof ELEMENT_VERSION_REF_ERROR_CODES];

export class ElementVersionRefValidationError extends SemanticKernelError {
  public override readonly code: ElementVersionRefErrorCode;

  public constructor(code: ElementVersionRefErrorCode, message: string) {
    super(message, code);
    this.name = 'ElementVersionRefValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Canonical wire record; components serialize as validated strings. */
export interface ElementVersionRefJSON {
  readonly elementId: string;
  readonly version: string;
}

export class ElementVersionRef {
  private constructor(
    public readonly elementId: SemanticElementId,
    public readonly version: SemanticVersion,
  ) {
    Object.freeze(this);
  }

  /** Compose existing value objects without generating identity or defaults. */
  public static fromParts(
    elementId: SemanticElementId,
    version: SemanticVersion,
  ): ElementVersionRef {
    if (!(elementId instanceof SemanticElementId)) {
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_ID,
        'ElementVersionRef requires a SemanticElementId instance.',
      );
    }
    if (!(version instanceof SemanticVersion)) {
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_VERSION,
        'ElementVersionRef requires an exact SemanticVersion instance.',
      );
    }
    return new ElementVersionRef(elementId, version);
  }

  /**
   * Decode an already parsed JSON record with exactly two own data fields.
   * Reject extra fields, inherited fields, arrays, classes, and accessors.
   * Component errors are reported at the reference boundary without raw input.
   */
  public static fromJSON(value: unknown): ElementVersionRef {
    if (typeof value !== 'object' || value === null) {
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_SHAPE,
        'ElementVersionRef JSON must be a record containing elementId and version.',
      );
    }

    let rawId: unknown;
    let rawVersion: unknown;
    try {
      if (Array.isArray(value)) {
        throw new ElementVersionRefValidationError(
          ELEMENT_VERSION_REF_ERROR_CODES.INVALID_SHAPE,
          'ElementVersionRef JSON must be a record, not an array.',
        );
      }
      const prototype: unknown = Object.getPrototypeOf(value);
      const keys = Reflect.ownKeys(value);
      const idDescriptor = Object.getOwnPropertyDescriptor(value, 'elementId');
      const versionDescriptor = Object.getOwnPropertyDescriptor(
        value,
        'version',
      );
      if (
        (prototype !== Object.prototype && prototype !== null) ||
        keys.length !== 2 ||
        !keys.includes('elementId') ||
        !keys.includes('version') ||
        !idDescriptor ||
        !versionDescriptor ||
        !('value' in idDescriptor) ||
        !('value' in versionDescriptor) ||
        !idDescriptor.enumerable ||
        !versionDescriptor.enumerable
      ) {
        throw new ElementVersionRefValidationError(
          ELEMENT_VERSION_REF_ERROR_CODES.INVALID_SHAPE,
          'ElementVersionRef JSON requires exactly the own data fields elementId and version.',
        );
      }
      rawId = idDescriptor.value;
      rawVersion = versionDescriptor.value;
    } catch (error) {
      if (error instanceof ElementVersionRefValidationError) throw error;
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_SHAPE,
        'ElementVersionRef JSON record could not be inspected.',
      );
    }

    let elementId: SemanticElementId;
    try {
      elementId = SemanticElementId.parse(rawId);
    } catch (error) {
      if (!(error instanceof SemanticElementIdValidationError)) throw error;
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_ID,
        'ElementVersionRef JSON contains an invalid semantic element identity.',
      );
    }

    let version: SemanticVersion;
    try {
      version = SemanticVersion.parse(rawVersion);
    } catch (error) {
      if (!(error instanceof SemanticVersionValidationError)) throw error;
      throw new ElementVersionRefValidationError(
        ELEMENT_VERSION_REF_ERROR_CODES.INVALID_VERSION,
        'ElementVersionRef JSON contains an invalid exact semantic version.',
      );
    }
    return ElementVersionRef.fromParts(elementId, version);
  }

  /** Exact component equality; equal version precedence alone is insufficient. */
  public equals(other: unknown): boolean {
    return (
      other instanceof ElementVersionRef &&
      this.elementId.equals(other.elementId) &&
      this.version.equals(other.version)
    );
  }

  public toJSON(): ElementVersionRefJSON {
    return Object.freeze({
      elementId: this.elementId.toString(),
      version: this.version.toString(),
    });
  }
}
