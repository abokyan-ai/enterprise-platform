/**
 * @file semantic-element-id.ts
 * @module @ecosystem/semantic-kernel/identity
 *
 * Foundational semantic identity primitive (SK-01).
 * Represents the unique, stable, immutable, opaque identity value object
 * for semantic elements across the enterprise ecosystem.
 *
 * Invariants:
 * 1. Opaque and immutable value object (Object.freeze, private constructor).
 * 2. Independent of Element Name, QualifiedName, Namespace, SemanticVersion,
 *    persistence keys, and runtime instance IDs.
 * 3. Pure TypeScript: Zero external dependencies, browser/Node-neutral.
 * 4. Value-based equality: Canonical ordinal comparison.
 */

import { SemanticKernelError } from '../semantic-id.js';

export const SEMANTIC_ELEMENT_ID_MIN_LENGTH = 3;
export const SEMANTIC_ELEMENT_ID_MAX_LENGTH = 128;

/**
 * Canonical grammar for SemanticElementId:
 * - Must start and end with an alphanumeric character [a-zA-Z0-9].
 * - Allowed interior characters: alphanumeric, hyphen (-), underscore (_), dot (.), colon (:).
 * - Length between 3 and 128 characters.
 * - Whitespace is strictly forbidden.
 */
export const SEMANTIC_ELEMENT_ID_PATTERN =
  /^[a-zA-Z0-9][a-zA-Z0-9._:-]{1,126}[a-zA-Z0-9]$/;

export type SemanticElementIdErrorCode =
  | 'SEMANTIC_ELEMENT_ID_NON_STRING'
  | 'SEMANTIC_ELEMENT_ID_EMPTY'
  | 'SEMANTIC_ELEMENT_ID_WHITESPACE'
  | 'SEMANTIC_ELEMENT_ID_TOO_SHORT'
  | 'SEMANTIC_ELEMENT_ID_TOO_LONG'
  | 'SEMANTIC_ELEMENT_ID_INVALID_FORMAT';

/**
 * Dedicated, structured validation error for SemanticElementId failures.
 */
export class SemanticElementIdValidationError extends SemanticKernelError {
  public override readonly code: SemanticElementIdErrorCode;
  public readonly invalidInputSummary: string;

  constructor(code: SemanticElementIdErrorCode, message: string, rawInput?: unknown) {
    super(message, code);
    this.name = 'SemanticElementIdValidationError';
    this.code = code;

    // Safely summarize raw input without leaking unbounded or sensitive content
    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }
  }
}

export type SemanticElementIdParseResult =
  | { readonly ok: true; readonly value: SemanticElementId }
  | { readonly ok: false; readonly error: SemanticElementIdValidationError };

/**
 * Immutable SemanticElementId Value Object.
 */
export class SemanticElementId {
  private readonly canonicalValue: string;

  private constructor(value: string) {
    this.canonicalValue = value;
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses raw input into a SemanticElementId.
   * Throws SemanticElementIdValidationError if input violates identity grammar.
   */
  public static parse(raw: unknown): SemanticElementId {
    const validationError = SemanticElementId.validate(raw);
    if (validationError) {
      throw validationError;
    }

    return new SemanticElementId(raw as string);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): SemanticElementIdParseResult {
    const validationError = SemanticElementId.validate(raw);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    return { ok: true, value: new SemanticElementId(raw as string) };
  }

  /**
   * Type guard validating whether a value conforms to the SemanticElementId grammar.
   */
  public static isValid(raw: unknown): raw is string {
    return SemanticElementId.validate(raw) === null;
  }

  /**
   * Internal validation rule engine.
   */
  private static validate(raw: unknown): SemanticElementIdValidationError | null {
    if (typeof raw !== 'string') {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_NON_STRING',
        `SemanticElementId input must be a string, received ${typeof raw}.`,
        raw
      );
    }

    if (raw.length === 0) {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_EMPTY',
        'SemanticElementId cannot be an empty string.',
        raw
      );
    }

    if (/\s/.test(raw)) {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_WHITESPACE',
        'SemanticElementId must not contain leading, trailing, or embedded whitespace.',
        raw
      );
    }

    if (raw.length < SEMANTIC_ELEMENT_ID_MIN_LENGTH) {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_TOO_SHORT',
        `SemanticElementId must be at least ${SEMANTIC_ELEMENT_ID_MIN_LENGTH} characters long (received ${raw.length}).`,
        raw
      );
    }

    if (raw.length > SEMANTIC_ELEMENT_ID_MAX_LENGTH) {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_TOO_LONG',
        `SemanticElementId must not exceed ${SEMANTIC_ELEMENT_ID_MAX_LENGTH} characters (received ${raw.length}).`,
        raw
      );
    }

    if (!SEMANTIC_ELEMENT_ID_PATTERN.test(raw)) {
      return new SemanticElementIdValidationError(
        'SEMANTIC_ELEMENT_ID_INVALID_FORMAT',
        `SemanticElementId "${raw.slice(0, 32)}" violates canonical grammar. It must start and end with an alphanumeric character and contain only [a-zA-Z0-9._:-].`,
        raw
      );
    }

    return null;
  }

  /**
   * Value equality comparison.
   * Two SemanticElementId instances are equal iff their canonical identity representations are equal.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof SemanticElementId)) {
      return false;
    }

    return this.canonicalValue === other.canonicalValue;
  }

  /**
   * Returns canonical string representation for stable interchange.
   */
  public toString(): string {
    return this.canonicalValue;
  }

  /**
   * JSON serialization hook.
   * Serializes directly to canonical string primitive.
   */
  public toJSON(): string {
    return this.canonicalValue;
  }

  /**
   * Primitive value inspection.
   */
  public valueOf(): string {
    return this.canonicalValue;
  }
}
