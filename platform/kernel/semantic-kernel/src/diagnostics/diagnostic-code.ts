/**
 * @file diagnostic-code.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * SK-11: DiagnosticCode Value Object and Canonical Grammar.
 *
 * Represents an immutable, strictly validated, machine-readable diagnostic code
 * identifying a specific category of observation, warning, or failure.
 *
 * Canonical Grammar:
 * - Format: segment ("_" segment)*
 * - Segment: Starts with ASCII uppercase letter [A-Z], followed by [A-Z0-9]*
 * - Separator: '_' (underscore)
 * - Length: 2 to 64 characters total
 * - Segments: 1 to 8 segments
 * - Whitespace: Strictly forbidden (leading, trailing, interior)
 * - Case: Strictly uppercase; no silent uppercase conversion or trimming
 * - No consecutive underscores or trailing/leading underscores
 *
 * Architectural Invariants:
 * 1. Codes Are Independent of Messages: Never generated from human-readable text.
 * 2. Stable Public Contract: Diagnostic codes remain stable across releases.
 * 3. Pure TypeScript: Universal browser and Node.js portability.
 */

import { SemanticKernelError } from '../semantic-id.js';

export const DIAGNOSTIC_CODE_SEPARATOR = '_' as const;
export const DIAGNOSTIC_CODE_MIN_LENGTH = 2;
export const DIAGNOSTIC_CODE_MAX_LENGTH = 64;
export const DIAGNOSTIC_CODE_MAX_SEGMENTS = 8;

/**
 * Strict regex for canonical diagnostic codes:
 * - Starts with an uppercase ASCII letter [A-Z]
 * - Followed by alphanumeric uppercase chars [A-Z0-9]*
 * - Separated by single underscores
 */
export const DIAGNOSTIC_CODE_PATTERN =
  /^[A-Z][A-Z0-9]*(_[A-Z][A-Z0-9]*)*$/;

/**
 * Structured validation error codes for DiagnosticCode failures.
 */
export const DIAGNOSTIC_CODE_ERROR_CODES = {
  NON_STRING: 'DIAGNOSTIC_CODE_NON_STRING',
  EMPTY: 'DIAGNOSTIC_CODE_EMPTY',
  WHITESPACE: 'DIAGNOSTIC_CODE_WHITESPACE',
  TOO_SHORT: 'DIAGNOSTIC_CODE_TOO_SHORT',
  TOO_LONG: 'DIAGNOSTIC_CODE_TOO_LONG',
  EMPTY_SEGMENT: 'DIAGNOSTIC_CODE_EMPTY_SEGMENT',
  TOO_MANY_SEGMENTS: 'DIAGNOSTIC_CODE_TOO_MANY_SEGMENTS',
  INVALID_FORMAT: 'DIAGNOSTIC_CODE_INVALID_FORMAT',
} as const;

export type DiagnosticCodeErrorCode =
  (typeof DIAGNOSTIC_CODE_ERROR_CODES)[keyof typeof DIAGNOSTIC_CODE_ERROR_CODES];

/**
 * Dedicated error class for diagnostic code validation failures.
 */
export class DiagnosticCodeValidationError extends SemanticKernelError {
  public override readonly code: DiagnosticCodeErrorCode;
  public readonly invalidInputSummary: string;

  constructor(
    code: DiagnosticCodeErrorCode,
    message: string,
    rawInput?: unknown,
  ) {
    super(message, code);
    this.name = 'DiagnosticCodeValidationError';
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
 * Discriminated result type for non-throwing code parsing.
 */
export type DiagnosticCodeParseResult =
  | { readonly ok: true; readonly value: DiagnosticCode }
  | { readonly ok: false; readonly error: DiagnosticCodeValidationError };

/**
 * Immutable DiagnosticCode Value Object.
 */
export class DiagnosticCode {
  private readonly canonicalValue: string;
  private readonly parsedSegments: readonly string[];

  private constructor(canonicalValue: string, segments: readonly string[]) {
    this.canonicalValue = canonicalValue;
    this.parsedSegments = Object.freeze([...segments]);
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses raw input into an immutable DiagnosticCode value object.
   * Throws DiagnosticCodeValidationError if input violates grammar or bounds.
   */
  public static parse(raw: unknown): DiagnosticCode {
    const result = DiagnosticCode.validateAndExtract(raw);
    if ('error' in result) {
      throw result.error;
    }

    return new DiagnosticCode(result.canonicalValue, result.segments);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): DiagnosticCodeParseResult {
    const result = DiagnosticCode.validateAndExtract(raw);
    if ('error' in result) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      value: new DiagnosticCode(result.canonicalValue, result.segments),
    };
  }

  /**
   * Type guard validating whether a value conforms to the DiagnosticCode grammar.
   */
  public static isValid(raw: unknown): raw is string {
    const result = DiagnosticCode.validateAndExtract(raw);
    return !('error' in result);
  }

  /**
   * Internal validation and segment extraction engine.
   */
  private static validateAndExtract(
    raw: unknown,
  ):
    | { canonicalValue: string; segments: readonly string[] }
    | { error: DiagnosticCodeValidationError } {
    if (typeof raw !== 'string') {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.NON_STRING,
          `DiagnosticCode must be a string, received ${typeof raw}.`,
          raw,
        ),
      };
    }

    if (raw.length === 0) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.EMPTY,
          'DiagnosticCode cannot be an empty string.',
          raw,
        ),
      };
    }

    if (raw !== raw.trim() || /\s/.test(raw)) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.WHITESPACE,
          'DiagnosticCode contains forbidden whitespace. Silent trimming is not permitted.',
          raw,
        ),
      };
    }

    if (raw.length < DIAGNOSTIC_CODE_MIN_LENGTH) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.TOO_SHORT,
          `DiagnosticCode length (${raw.length}) is below the minimum limit of ${DIAGNOSTIC_CODE_MIN_LENGTH} characters.`,
          raw,
        ),
      };
    }

    if (raw.length > DIAGNOSTIC_CODE_MAX_LENGTH) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.TOO_LONG,
          `DiagnosticCode length (${raw.length}) exceeds the maximum limit of ${DIAGNOSTIC_CODE_MAX_LENGTH} characters.`,
          raw,
        ),
      };
    }

    if (raw.startsWith('_') || raw.endsWith('_') || raw.includes('__')) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.EMPTY_SEGMENT,
          'DiagnosticCode cannot start with, end with, or contain consecutive underscore separators.',
          raw,
        ),
      };
    }

    if (!DIAGNOSTIC_CODE_PATTERN.test(raw)) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.INVALID_FORMAT,
          `DiagnosticCode "${raw}" violates canonical grammar: must contain only uppercase letters, digits, and underscores, starting with a letter.`,
          raw,
        ),
      };
    }

    const segments = raw.split(DIAGNOSTIC_CODE_SEPARATOR);

    if (segments.length > DIAGNOSTIC_CODE_MAX_SEGMENTS) {
      return {
        error: new DiagnosticCodeValidationError(
          DIAGNOSTIC_CODE_ERROR_CODES.TOO_MANY_SEGMENTS,
          `DiagnosticCode exceeds the maximum limit of ${DIAGNOSTIC_CODE_MAX_SEGMENTS} segments, received ${segments.length}.`,
          raw,
        ),
      };
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
   * Returns the primary domain prefix (the first segment, e.g. 'SK', 'MODEL', 'COMPILER').
   */
  public get prefix(): string {
    return this.parsedSegments[0]!;
  }

  /**
   * Value equality comparison.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof DiagnosticCode)) {
      return false;
    }

    return this.canonicalValue === other.canonicalValue;
  }

  /**
   * String representation hook.
   */
  public toString(): string {
    return this.canonicalValue;
  }

  /**
   * JSON serialization hook.
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
