/**
 * @file semantic-context-ref.ts
 * @module @ecosystem/semantic-kernel/identity
 *
 * Foundational semantic context reference primitive (SK-04).
 * Represents an immutable, strictly validated, opaque value object identifying
 * a semantic interpretation boundary across the enterprise platform.
 *
 * Invariants:
 * 1. Opaque and Immutable: Sealed state via private constructor and Object.freeze.
 * 2. Distinct Semantic Role:
 *    SemanticContextRef ≠ SemanticElementId ≠ Namespace ≠ QualifiedName ≠
 *    TenantId ≠ OrganizationId ≠ Deployment Environment ≠ Authorization Scope ≠
 *    Runtime ExecutionContext ≠ Runtime Registry ≠ Database Partition.
 * 3. Context Owns Meaning: Semantic names (QualifiedName) are interpreted within
 *    the boundary identified by this reference.
 * 4. Case-Sensitive: Preserves canonical spelling without silent lowercasing or trimming.
 * 5. Cross-Type Safety: Never compares equal to SemanticElementId, Namespace, or QualifiedName.
 * 6. Pure TypeScript: Universal browser and Node.js portability, zero external dependencies.
 */

import { SemanticKernelError } from '../semantic-id.js';

export const SEMANTIC_CONTEXT_REF_MIN_LENGTH = 1;
export const SEMANTIC_CONTEXT_REF_MAX_LENGTH = 128;

/**
 * Semantic context reference grammar:
 * - First character: ASCII letter [a-zA-Z]
 * - Subsequent characters: ASCII letter, digit, underscore, hyphen [a-zA-Z0-9_-]
 */
export const SEMANTIC_CONTEXT_REF_START_PATTERN = /^[a-zA-Z]/;
export const SEMANTIC_CONTEXT_REF_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

export type SemanticContextRefErrorCode =
  | 'SEMANTIC_CONTEXT_REF_NON_STRING'
  | 'SEMANTIC_CONTEXT_REF_EMPTY'
  | 'SEMANTIC_CONTEXT_REF_WHITESPACE'
  | 'SEMANTIC_CONTEXT_REF_TOO_LONG'
  | 'SEMANTIC_CONTEXT_REF_INVALID_START'
  | 'SEMANTIC_CONTEXT_REF_INVALID_CHARACTER';

/**
 * Dedicated structured validation error for SemanticContextRef failures.
 */
export class SemanticContextRefValidationError extends SemanticKernelError {
  public override readonly code: SemanticContextRefErrorCode;
  public readonly invalidInputSummary: string;

  constructor(
    code: SemanticContextRefErrorCode,
    message: string,
    rawInput?: unknown
  ) {
    super(message, code);
    this.name = 'SemanticContextRefValidationError';
    this.code = code;

    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }
  }
}

export type SemanticContextRefParseResult =
  | { readonly ok: true; readonly value: SemanticContextRef }
  | { readonly ok: false; readonly error: SemanticContextRefValidationError };

/**
 * Immutable SemanticContextRef Value Object.
 * Identifies a semantic interpretation boundary.
 */
export class SemanticContextRef {
  private readonly canonicalValue: string;

  private constructor(value: string) {
    this.canonicalValue = value;
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses raw input into a SemanticContextRef.
   * Throws SemanticContextRefValidationError if input violates grammar or bounds.
   */
  public static parse(raw: unknown): SemanticContextRef {
    const validationError = SemanticContextRef.validate(raw);
    if (validationError) {
      throw validationError;
    }

    return new SemanticContextRef(raw as string);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): SemanticContextRefParseResult {
    const validationError = SemanticContextRef.validate(raw);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    return { ok: true, value: new SemanticContextRef(raw as string) };
  }

  /**
   * Type guard validating whether a value conforms to the SemanticContextRef grammar.
   */
  public static isValid(raw: unknown): raw is string {
    return SemanticContextRef.validate(raw) === null;
  }

  /**
   * Internal validation rule engine.
   */
  private static validate(raw: unknown): SemanticContextRefValidationError | null {
    if (typeof raw !== 'string') {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_NON_STRING',
        `SemanticContextRef input must be a string primitive, received ${typeof raw}.`,
        raw
      );
    }

    if (raw.length === 0) {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_EMPTY',
        'SemanticContextRef cannot be an empty string.',
        raw
      );
    }

    if (/\s/.test(raw)) {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_WHITESPACE',
        'SemanticContextRef must not contain leading, trailing, or embedded whitespace.',
        raw
      );
    }

    if (raw.length > SEMANTIC_CONTEXT_REF_MAX_LENGTH) {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_TOO_LONG',
        `SemanticContextRef length (${raw.length}) exceeds maximum permitted length of ${SEMANTIC_CONTEXT_REF_MAX_LENGTH} characters.`,
        raw
      );
    }

    if (!SEMANTIC_CONTEXT_REF_START_PATTERN.test(raw)) {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_INVALID_START',
        `SemanticContextRef "${raw.slice(0, 32)}" must start with an ASCII letter [a-zA-Z].`,
        raw
      );
    }

    if (!SEMANTIC_CONTEXT_REF_PATTERN.test(raw)) {
      return new SemanticContextRefValidationError(
        'SEMANTIC_CONTEXT_REF_INVALID_CHARACTER',
        `SemanticContextRef "${raw.slice(0, 32)}" contains invalid characters. Only ASCII letters, digits, underscores, and hyphens are permitted.`,
        raw
      );
    }

    return null;
  }

  /**
   * Value equality comparison.
   * Compares canonical string representation and guarantees cross-type identity safety.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof SemanticContextRef)) {
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
}
