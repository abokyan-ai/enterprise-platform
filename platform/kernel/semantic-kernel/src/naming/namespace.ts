/**
 * @file namespace.ts
 * @module @ecosystem/semantic-kernel/naming
 *
 * Foundational semantic naming scope primitive (SK-02).
 * Represents an immutable, strictly validated, strongly typed, canonical
 * semantic naming scope used to organize semantic names across the enterprise ecosystem.
 *
 * Invariants:
 * 1. Immutable Value Object: Sealed state via private constructor and Object.freeze.
 * 2. Distinct Semantic Role:
 *    Namespace ≠ SemanticElementId ≠ QualifiedName ≠ SemanticContextRef ≠
 *    TenantId ≠ OrganizationId ≠ PackageId ≠ Database Schema ≠ Filesystem Path.
 * 3. Case-Sensitive: Preserves canonical spelling without silent lowercasing or trimming.
 * 4. Bounded: Max 255 chars total, max 63 chars per segment, max 16 segments depth.
 * 5. Pure TypeScript: Universal browser/Node runtime compatibility, zero external dependencies.
 */

import { SemanticKernelError } from '../semantic-id.js';

export const NAMESPACE_SEPARATOR = '.' as const;
export const NAMESPACE_MAX_LENGTH = 255;
export const NAMESPACE_MAX_SEGMENT_LENGTH = 63;
export const NAMESPACE_MAX_DEPTH = 16;
export const NAMESPACE_MIN_DEPTH = 1;

/**
 * Segment grammar:
 * - First character: ASCII letter [a-zA-Z]
 * - Subsequent characters: ASCII letter, digit, underscore [a-zA-Z0-9_]
 */
export const NAMESPACE_SEGMENT_START_PATTERN = /^[a-zA-Z]/;
export const NAMESPACE_SEGMENT_FULL_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export type NamespaceErrorCode =
  | 'NAMESPACE_NON_STRING'
  | 'NAMESPACE_EMPTY'
  | 'NAMESPACE_WHITESPACE'
  | 'NAMESPACE_TOO_LONG'
  | 'NAMESPACE_EMPTY_SEGMENT'
  | 'NAMESPACE_SEGMENT_TOO_LONG'
  | 'NAMESPACE_TOO_DEEP'
  | 'NAMESPACE_INVALID_SEGMENT_START'
  | 'NAMESPACE_INVALID_CHARACTER';

/**
 * Dedicated structured validation error for Namespace parsing failures.
 */
export class NamespaceValidationError extends SemanticKernelError {
  public override readonly code: NamespaceErrorCode;
  public readonly invalidInputSummary: string;

  constructor(code: NamespaceErrorCode, message: string, rawInput?: unknown) {
    super(message, code);
    this.name = 'NamespaceValidationError';
    this.code = code;

    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }
  }
}

export type NamespaceParseResult =
  | { readonly ok: true; readonly value: Namespace }
  | { readonly ok: false; readonly error: NamespaceValidationError };

/**
 * Immutable Namespace Value Object.
 * Organizes semantic element names within a canonical, hierarchically structured naming scope.
 */
export class Namespace {
  private readonly canonicalValue: string;
  private readonly segmentList: readonly string[];

  private constructor(canonicalValue: string, segments: readonly string[]) {
    this.canonicalValue = canonicalValue;
    this.segmentList = Object.freeze([...segments]);
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses raw input into a canonical Namespace.
   * Throws NamespaceValidationError if input violates grammar or bounds.
   */
  public static parse(raw: unknown): Namespace {
    const result = Namespace.validateAndSplit(raw);
    if ('error' in result) {
      throw result.error;
    }

    return new Namespace(result.canonicalValue, result.segments);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): NamespaceParseResult {
    const result = Namespace.validateAndSplit(raw);
    if ('error' in result) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      value: new Namespace(result.canonicalValue, result.segments),
    };
  }

  /**
   * Type guard validating whether a value conforms to the Namespace grammar.
   */
  public static isValid(raw: unknown): raw is string {
    const result = Namespace.validateAndSplit(raw);
    return !('error' in result);
  }

  /**
   * Internal validation and segment extraction engine.
   */
  private static validateAndSplit(
    raw: unknown
  ):
    | { canonicalValue: string; segments: readonly string[] }
    | { error: NamespaceValidationError } {
    if (typeof raw !== 'string') {
      return {
        error: new NamespaceValidationError(
          'NAMESPACE_NON_STRING',
          `Namespace input must be a string primitive, received ${typeof raw}.`,
          raw
        ),
      };
    }

    if (raw.length === 0) {
      return {
        error: new NamespaceValidationError(
          'NAMESPACE_EMPTY',
          'Namespace cannot be an empty string.',
          raw
        ),
      };
    }

    if (/\s/.test(raw)) {
      return {
        error: new NamespaceValidationError(
          'NAMESPACE_WHITESPACE',
          'Namespace must not contain leading, trailing, or embedded whitespace.',
          raw
        ),
      };
    }

    if (raw.length > NAMESPACE_MAX_LENGTH) {
      return {
        error: new NamespaceValidationError(
          'NAMESPACE_TOO_LONG',
          `Namespace length (${raw.length}) exceeds maximum permitted length of ${NAMESPACE_MAX_LENGTH} characters.`,
          raw
        ),
      };
    }

    const segments = raw.split(NAMESPACE_SEPARATOR);

    if (segments.length > NAMESPACE_MAX_DEPTH) {
      return {
        error: new NamespaceValidationError(
          'NAMESPACE_TOO_DEEP',
          `Namespace segment count (${segments.length}) exceeds maximum permitted depth of ${NAMESPACE_MAX_DEPTH}.`,
          raw
        ),
      };
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (segment.length === 0) {
        return {
          error: new NamespaceValidationError(
            'NAMESPACE_EMPTY_SEGMENT',
            `Namespace contains an empty segment at index ${i}. Consecutive separators, leading, or trailing dots are forbidden.`,
            raw
          ),
        };
      }

      if (segment.length > NAMESPACE_MAX_SEGMENT_LENGTH) {
        return {
          error: new NamespaceValidationError(
            'NAMESPACE_SEGMENT_TOO_LONG',
            `Namespace segment "${segment.slice(0, 16)}..." exceeds maximum segment length of ${NAMESPACE_MAX_SEGMENT_LENGTH} characters.`,
            raw
          ),
        };
      }

      if (!NAMESPACE_SEGMENT_START_PATTERN.test(segment)) {
        return {
          error: new NamespaceValidationError(
            'NAMESPACE_INVALID_SEGMENT_START',
            `Namespace segment "${segment}" must begin with an ASCII letter [a-zA-Z].`,
            raw
          ),
        };
      }

      if (!NAMESPACE_SEGMENT_FULL_PATTERN.test(segment)) {
        return {
          error: new NamespaceValidationError(
            'NAMESPACE_INVALID_CHARACTER',
            `Namespace segment "${segment}" contains invalid characters. Only ASCII letters, digits, and underscores are permitted.`,
            raw
          ),
        };
      }
    }

    return {
      canonicalValue: raw,
      segments,
    };
  }

  /**
   * Value equality comparison.
   * Evaluates exact canonical ordinal string equality.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof Namespace)) {
      return false;
    }

    return this.canonicalValue === other.canonicalValue;
  }

  /**
   * Returns canonical string representation.
   */
  public toString(): string {
    return this.canonicalValue;
  }

  /**
   * JSON serialization hook. Serializes directly to canonical string primitive.
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

  /**
   * Returns an immutable snapshot of logical namespace segments in order.
   */
  public segments(): readonly string[] {
    return this.segmentList;
  }

  /**
   * Returns logical nesting depth (number of segments).
   */
  public depth(): number {
    return this.segmentList.length;
  }

  /**
   * Syntactic parent namespace.
   * Returns undefined if this is a single-segment root namespace.
   */
  public parent(): Namespace | undefined {
    if (this.segmentList.length <= 1) {
      return undefined;
    }

    const parentSegments = this.segmentList.slice(0, -1);
    const parentValue = parentSegments.join(NAMESPACE_SEPARATOR);
    return new Namespace(parentValue, parentSegments);
  }

  /**
   * Composes a child namespace by appending a single segment.
   * Validates the child segment strictly against segment grammar and bounds.
   */
  public child(segment: string): Namespace {
    if (typeof segment !== 'string') {
      throw new NamespaceValidationError(
        'NAMESPACE_NON_STRING',
        `Child segment must be a string primitive, received ${typeof segment}.`,
        segment
      );
    }

    if (segment.length === 0) {
      throw new NamespaceValidationError(
        'NAMESPACE_EMPTY',
        'Child segment cannot be empty.',
        segment
      );
    }

    if (/\s/.test(segment)) {
      throw new NamespaceValidationError(
        'NAMESPACE_WHITESPACE',
        'Child segment must not contain whitespace.',
        segment
      );
    }

    if (segment.includes(NAMESPACE_SEPARATOR)) {
      throw new NamespaceValidationError(
        'NAMESPACE_INVALID_CHARACTER',
        `Child segment "${segment}" cannot contain namespace separator "${NAMESPACE_SEPARATOR}". Use a single segment.`,
        segment
      );
    }

    if (segment.length > NAMESPACE_MAX_SEGMENT_LENGTH) {
      throw new NamespaceValidationError(
        'NAMESPACE_SEGMENT_TOO_LONG',
        `Child segment exceeds maximum length of ${NAMESPACE_MAX_SEGMENT_LENGTH} characters.`,
        segment
      );
    }

    if (!NAMESPACE_SEGMENT_START_PATTERN.test(segment)) {
      throw new NamespaceValidationError(
        'NAMESPACE_INVALID_SEGMENT_START',
        `Child segment "${segment}" must begin with an ASCII letter [a-zA-Z].`,
        segment
      );
    }

    if (!NAMESPACE_SEGMENT_FULL_PATTERN.test(segment)) {
      throw new NamespaceValidationError(
        'NAMESPACE_INVALID_CHARACTER',
        `Child segment "${segment}" contains invalid characters.`,
        segment
      );
    }

    if (this.segmentList.length + 1 > NAMESPACE_MAX_DEPTH) {
      throw new NamespaceValidationError(
        'NAMESPACE_TOO_DEEP',
        `Appending child segment would exceed maximum namespace depth of ${NAMESPACE_MAX_DEPTH}.`,
        segment
      );
    }

    const candidateValue = `${this.canonicalValue}${NAMESPACE_SEPARATOR}${segment}`;
    if (candidateValue.length > NAMESPACE_MAX_LENGTH) {
      throw new NamespaceValidationError(
        'NAMESPACE_TOO_LONG',
        `Appending child segment would exceed maximum namespace length of ${NAMESPACE_MAX_LENGTH} characters.`,
        candidateValue
      );
    }

    const nextSegments = [...this.segmentList, segment];
    return new Namespace(candidateValue, nextSegments);
  }

  /**
   * Evaluates whether this namespace is a strict syntactic ancestor of another namespace.
   * Compares logical segment boundaries rather than raw string prefixes.
   */
  public isAncestorOf(other: unknown): boolean {
    if (!other || !(other instanceof Namespace)) {
      return false;
    }

    if (other.segmentList.length <= this.segmentList.length) {
      return false;
    }

    for (let i = 0; i < this.segmentList.length; i++) {
      if (this.segmentList[i] !== other.segmentList[i]) {
        return false;
      }
    }

    return true;
  }
}
