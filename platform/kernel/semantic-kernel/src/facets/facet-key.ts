/**
 * @file facet-key.ts
 * @module @ecosystem/semantic-kernel/facets
 *
 * SK-10: FacetKey Value Object and Grammar.
 *
 * Represents an immutable, strictly validated, strongly typed value object
 * identifying an orthogonal semantic aspect category (e.g. 'core.documentation',
 * 'validation.required', 'presentation.displayName').
 *
 * Architectural Invariants:
 * 1. FacetKey ≠ SemanticElementId: Identifies an aspect category, NOT an element.
 * 2. FacetKey ≠ SemanticElementKind: Aspect category, NOT element kind definition.
 * 3. FacetKey ≠ QualifiedName: Key taxonomy, NOT an element scoped in a Namespace.
 * 4. FacetKey ≠ PrimitiveType: Aspect classification, NOT primitive value category.
 * 5. Bounded Grammar:
 *    - Separator: '.' (dot).
 *    - Segments: 2 to 8 segments (at least one category scope and one aspect name).
 *    - Length: 3 to 256 characters total; max 64 chars per segment.
 *    - Segment grammar: Starts with ASCII letter [a-zA-Z], followed by [a-zA-Z0-9_-].
 *    - Case-sensitive: Preserves canonical casing (no silent lowercasing).
 *    - Whitespace strictly forbidden: No silent trimming.
 * 6. Pure TypeScript: Universal browser and Node.js portability, zero external dependencies.
 * 7. Value Object: Private constructor, Object.freeze, value-based ordinal equality.
 */

import { SemanticKernelError } from '../semantic-id.js';

export const FACET_KEY_SEPARATOR = '.' as const;
export const FACET_KEY_MIN_LENGTH = 3;
export const FACET_KEY_MAX_LENGTH = 256;
export const FACET_KEY_MAX_SEGMENT_LENGTH = 64;
export const FACET_KEY_MIN_SEGMENTS = 2;
export const FACET_KEY_MAX_SEGMENTS = 8;

/**
 * Segment grammar:
 * - Must start with an ASCII letter [a-zA-Z].
 * - Followed by ASCII letters, digits, underscores, or hyphens [a-zA-Z0-9_-].
 */
export const FACET_KEY_SEGMENT_START_PATTERN = /^[a-zA-Z]/;
export const FACET_KEY_SEGMENT_FULL_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

/**
 * Structured validation error codes for FacetKey failures.
 */
export const FACET_KEY_ERROR_CODES = {
  NON_STRING: 'FACET_KEY_NON_STRING',
  EMPTY: 'FACET_KEY_EMPTY',
  WHITESPACE: 'FACET_KEY_WHITESPACE',
  TOO_SHORT: 'FACET_KEY_TOO_SHORT',
  TOO_LONG: 'FACET_KEY_TOO_LONG',
  EMPTY_SEGMENT: 'FACET_KEY_EMPTY_SEGMENT',
  SEGMENT_TOO_LONG: 'FACET_KEY_SEGMENT_TOO_LONG',
  TOO_FEW_SEGMENTS: 'FACET_KEY_TOO_FEW_SEGMENTS',
  TOO_MANY_SEGMENTS: 'FACET_KEY_TOO_MANY_SEGMENTS',
  INVALID_SEGMENT_START: 'FACET_KEY_INVALID_SEGMENT_START',
  INVALID_SEGMENT_CHARACTER: 'FACET_KEY_INVALID_SEGMENT_CHARACTER',
} as const;

export type FacetKeyErrorCode =
  (typeof FACET_KEY_ERROR_CODES)[keyof typeof FACET_KEY_ERROR_CODES];

/**
 * Dedicated structured validation error for FacetKey failures.
 */
export class FacetKeyValidationError extends SemanticKernelError {
  public override readonly code: FacetKeyErrorCode;
  public readonly invalidInputSummary: string;

  constructor(code: FacetKeyErrorCode, message: string, rawInput?: unknown) {
    super(message, code);
    this.name = 'FacetKeyValidationError';
    this.code = code;

    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Discriminated result type for non-throwing parsing operations.
 */
export type FacetKeyParseResult =
  | { readonly ok: true; readonly value: FacetKey }
  | { readonly ok: false; readonly error: FacetKeyValidationError };

/**
 * Immutable FacetKey Value Object.
 */
export class FacetKey {
  private readonly canonicalValue: string;
  private readonly parsedSegments: readonly string[];

  private constructor(canonicalValue: string, segments: readonly string[]) {
    this.canonicalValue = canonicalValue;
    this.parsedSegments = Object.freeze([...segments]);
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses raw input into an immutable FacetKey value object.
   * Throws FacetKeyValidationError if input violates grammar or bounds.
   */
  public static parse(raw: unknown): FacetKey {
    const result = FacetKey.validateAndExtract(raw);
    if ('error' in result) {
      throw result.error;
    }

    return new FacetKey(result.canonicalValue, result.segments);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): FacetKeyParseResult {
    const result = FacetKey.validateAndExtract(raw);
    if ('error' in result) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      value: new FacetKey(result.canonicalValue, result.segments),
    };
  }

  /**
   * Type guard validating whether a value conforms to the FacetKey grammar.
   */
  public static isValid(raw: unknown): raw is string {
    const result = FacetKey.validateAndExtract(raw);
    return !('error' in result);
  }

  /**
   * Internal validation and segment extraction engine.
   */
  private static validateAndExtract(
    raw: unknown,
  ):
    | { canonicalValue: string; segments: readonly string[] }
    | { error: FacetKeyValidationError } {
    if (typeof raw !== 'string') {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.NON_STRING,
          `FacetKey input must be a string primitive, received ${typeof raw}.`,
          raw,
        ),
      };
    }

    if (raw.length === 0) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.EMPTY,
          'FacetKey cannot be an empty string.',
          raw,
        ),
      };
    }

    if (raw !== raw.trim() || /\s/.test(raw)) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.WHITESPACE,
          'FacetKey contains forbidden whitespace. Silent trimming is not permitted.',
          raw,
        ),
      };
    }

    if (raw.length < FACET_KEY_MIN_LENGTH) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.TOO_SHORT,
          `FacetKey length (${raw.length}) is below the minimum limit of ${FACET_KEY_MIN_LENGTH} characters.`,
          raw,
        ),
      };
    }

    if (raw.length > FACET_KEY_MAX_LENGTH) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.TOO_LONG,
          `FacetKey length (${raw.length}) exceeds the maximum limit of ${FACET_KEY_MAX_LENGTH} characters.`,
          raw,
        ),
      };
    }

    const segments = raw.split(FACET_KEY_SEPARATOR);

    if (segments.length < FACET_KEY_MIN_SEGMENTS) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.TOO_FEW_SEGMENTS,
          `FacetKey must contain at least ${FACET_KEY_MIN_SEGMENTS} dot-separated segments, received ${segments.length}.`,
          raw,
        ),
      };
    }

    if (segments.length > FACET_KEY_MAX_SEGMENTS) {
      return {
        error: new FacetKeyValidationError(
          FACET_KEY_ERROR_CODES.TOO_MANY_SEGMENTS,
          `FacetKey cannot contain more than ${FACET_KEY_MAX_SEGMENTS} segments, received ${segments.length}.`,
          raw,
        ),
      };
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!;

      if (segment.length === 0) {
        return {
          error: new FacetKeyValidationError(
            FACET_KEY_ERROR_CODES.EMPTY_SEGMENT,
            `FacetKey contains an empty segment at position ${i + 1}. Consecutive or leading/trailing separators are forbidden.`,
            raw,
          ),
        };
      }

      if (segment.length > FACET_KEY_MAX_SEGMENT_LENGTH) {
        return {
          error: new FacetKeyValidationError(
            FACET_KEY_ERROR_CODES.SEGMENT_TOO_LONG,
            `FacetKey segment "${segment}" at position ${i + 1} exceeds maximum length of ${FACET_KEY_MAX_SEGMENT_LENGTH} characters.`,
            raw,
          ),
        };
      }

      if (!FACET_KEY_SEGMENT_START_PATTERN.test(segment)) {
        return {
          error: new FacetKeyValidationError(
            FACET_KEY_ERROR_CODES.INVALID_SEGMENT_START,
            `FacetKey segment "${segment}" at position ${i + 1} must start with an ASCII letter [a-zA-Z].`,
            raw,
          ),
        };
      }

      if (!FACET_KEY_SEGMENT_FULL_PATTERN.test(segment)) {
        return {
          error: new FacetKeyValidationError(
            FACET_KEY_ERROR_CODES.INVALID_SEGMENT_CHARACTER,
            `FacetKey segment "${segment}" at position ${i + 1} contains invalid characters. Only [a-zA-Z0-9_-] are allowed.`,
            raw,
          ),
        };
      }
    }

    return { canonicalValue: raw, segments };
  }

  /**
   * Returns canonical string representation.
   */
  public get value(): string {
    return this.canonicalValue;
  }

  /**
   * Returns the immutable array of individual segments.
   */
  public get segments(): readonly string[] {
    return this.parsedSegments;
  }

  /**
   * Returns the primary category scope (the first segment, e.g. 'core', 'validation', 'presentation').
   */
  public get scope(): string {
    return this.parsedSegments[0]!;
  }

  /**
   * Returns the local aspect name (the final segment, e.g. 'documentation', 'required').
   */
  public get localName(): string {
    return this.parsedSegments[this.parsedSegments.length - 1]!;
  }

  /**
   * Value equality comparison.
   * Compares canonical ordinal representations.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof FacetKey)) {
      return false;
    }

    return this.canonicalValue === other.canonicalValue;
  }

  /**
   * String coercion hook returning canonical dot-separated representation.
   */
  public toString(): string {
    return this.canonicalValue;
  }

  /**
   * JSON serialization hook returning canonical string primitive.
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
