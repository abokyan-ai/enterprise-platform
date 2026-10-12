/**
 * @file qualified-name.ts
 * @module @ecosystem/semantic-kernel/naming
 *
 * Foundational qualified naming primitive (SK-03).
 * Represents an immutable, strictly validated, canonical QualifiedName value object
 * combining an existing Namespace naming scope with exactly one local semantic element name.
 *
 * Invariants:
 * 1. Immutable Value Object: Sealed instance via private constructor and Object.freeze.
 * 2. Distinct Semantic Role:
 *    QualifiedName ≠ SemanticElementId ≠ Namespace ≠ SemanticContextRef ≠
 *    SemanticVersion ≠ ElementRef ≠ TenantId ≠ Database Key ≠ Authorization Scope.
 * 3. Final Separator Parsing: Canonical string is split at the final separator ('.')
 *    dividing the Namespace from the local element name.
 * 4. Namespace Reuse: Reuses the existing SK-02 Namespace contract without duplicating its grammar.
 * 5. Case-Sensitive: Preserves canonical spelling without silent lowercasing or trimming.
 * 6. Pure TypeScript: Universal browser and Node.js portability, zero external dependencies.
 */

import { SemanticKernelError } from '../semantic-id.js';
import { Namespace, NAMESPACE_SEPARATOR, NAMESPACE_MAX_LENGTH } from './namespace.js';

export const LOCAL_NAME_MAX_LENGTH = 63;
export const QUALIFIED_NAME_MAX_LENGTH = NAMESPACE_MAX_LENGTH + 1 + LOCAL_NAME_MAX_LENGTH; // 319 chars

/**
 * Local name grammar:
 * - First character: ASCII letter [a-zA-Z]
 * - Subsequent characters: ASCII letter, digit, underscore [a-zA-Z0-9_]
 */
export const LOCAL_NAME_START_PATTERN = /^[a-zA-Z]/;
export const LOCAL_NAME_FULL_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export type QualifiedNameErrorCode =
  | 'QUALIFIED_NAME_NON_STRING'
  | 'QUALIFIED_NAME_EMPTY'
  | 'QUALIFIED_NAME_WHITESPACE'
  | 'QUALIFIED_NAME_TOO_LONG'
  | 'QUALIFIED_NAME_MISSING_NAMESPACE'
  | 'QUALIFIED_NAME_EMPTY_NAMESPACE'
  | 'QUALIFIED_NAME_EMPTY_LOCAL_NAME'
  | 'QUALIFIED_NAME_INVALID_NAMESPACE'
  | 'QUALIFIED_NAME_LOCAL_NAME_TOO_LONG'
  | 'QUALIFIED_NAME_INVALID_LOCAL_NAME_START'
  | 'QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER'
  | 'QUALIFIED_NAME_INVALID_PARTS';

/**
 * Dedicated structured validation error for QualifiedName parsing and composition failures.
 */
export class QualifiedNameValidationError extends SemanticKernelError {
  public override readonly code: QualifiedNameErrorCode;
  public readonly invalidInputSummary: string;

  constructor(code: QualifiedNameErrorCode, message: string, rawInput?: unknown) {
    super(message, code);
    this.name = 'QualifiedNameValidationError';
    this.code = code;

    if (typeof rawInput === 'string') {
      this.invalidInputSummary =
        rawInput.length > 32 ? `${rawInput.slice(0, 32)}...` : rawInput;
    } else {
      this.invalidInputSummary = typeof rawInput;
    }
  }
}

export type QualifiedNameParseResult =
  | { readonly ok: true; readonly value: QualifiedName }
  | { readonly ok: false; readonly error: QualifiedNameValidationError };

/**
 * Immutable QualifiedName Value Object.
 * Represents the canonical qualified name of a semantic element within an explicit Namespace.
 */
export class QualifiedName {
  private readonly ns: Namespace;
  private readonly local: string;
  private readonly canonicalValue: string;

  private constructor(ns: Namespace, localName: string, canonicalValue: string) {
    this.ns = ns;
    this.local = localName;
    this.canonicalValue = canonicalValue;
    Object.freeze(this);
  }

  /**
   * Strictly validates and parses a raw qualified name string.
   * Splits at the FINAL dot separator to extract the Namespace and local element name.
   * Throws QualifiedNameValidationError if input violates grammar or bounds.
   */
  public static parse(raw: unknown): QualifiedName {
    const result = QualifiedName.validateAndExtract(raw);
    if ('error' in result) {
      throw result.error;
    }

    return new QualifiedName(result.namespace, result.localName, result.canonicalValue);
  }

  /**
   * Non-throwing parse method returning a typed discriminated union.
   */
  public static tryParse(raw: unknown): QualifiedNameParseResult {
    const result = QualifiedName.validateAndExtract(raw);
    if ('error' in result) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      value: new QualifiedName(result.namespace, result.localName, result.canonicalValue),
    };
  }

  /**
   * Type guard validating whether a value conforms to the QualifiedName grammar.
   */
  public static isValid(raw: unknown): raw is string {
    const result = QualifiedName.validateAndExtract(raw);
    return !('error' in result);
  }

  /**
   * Composes a QualifiedName from an existing validated Namespace instance and local element name.
   * Throws QualifiedNameValidationError if local name or combined length violates grammar or bounds.
   */
  public static fromParts(namespace: Namespace, localName: string): QualifiedName {
    const result = QualifiedName.validateParts(namespace, localName);
    if ('error' in result) {
      throw result.error;
    }

    return new QualifiedName(namespace, localName, result.canonicalValue);
  }

  /**
   * Non-throwing composition method returning a typed discriminated union.
   */
  public static tryFromParts(
    namespace: Namespace,
    localName: string
  ): QualifiedNameParseResult {
    const result = QualifiedName.validateParts(namespace, localName);
    if ('error' in result) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      value: new QualifiedName(namespace, localName, result.canonicalValue),
    };
  }

  /**
   * Internal validation and decomposition engine for raw input strings.
   */
  private static validateAndExtract(
    raw: unknown
  ):
    | { namespace: Namespace; localName: string; canonicalValue: string }
    | { error: QualifiedNameValidationError } {
    if (typeof raw !== 'string') {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_NON_STRING',
          `QualifiedName input must be a string primitive, received ${typeof raw}.`,
          raw
        ),
      };
    }

    if (raw.length === 0) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_EMPTY',
          'QualifiedName cannot be an empty string.',
          raw
        ),
      };
    }

    if (/\s/.test(raw)) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_WHITESPACE',
          'QualifiedName must not contain leading, trailing, or embedded whitespace.',
          raw
        ),
      };
    }

    if (raw.length > QUALIFIED_NAME_MAX_LENGTH) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_TOO_LONG',
          `QualifiedName length (${raw.length}) exceeds maximum permitted length of ${QUALIFIED_NAME_MAX_LENGTH} characters.`,
          raw
        ),
      };
    }

    const lastDotIndex = raw.lastIndexOf(NAMESPACE_SEPARATOR);

    if (lastDotIndex === -1) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_MISSING_NAMESPACE',
          `QualifiedName "${raw}" is missing a Namespace. A QualifiedName requires at least one namespace segment followed by a dot separator.`,
          raw
        ),
      };
    }

    if (lastDotIndex === 0) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_EMPTY_NAMESPACE',
          `QualifiedName "${raw}" has an empty namespace portion before the dot separator.`,
          raw
        ),
      };
    }

    const rawNamespace = raw.slice(0, lastDotIndex);
    const rawLocalName = raw.slice(lastDotIndex + 1);

    if (rawLocalName.length === 0) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_EMPTY_LOCAL_NAME',
          `QualifiedName "${raw}" has an empty local name portion after the final dot separator.`,
          raw
        ),
      };
    }

    const nsResult = Namespace.tryParse(rawNamespace);
    if (!nsResult.ok) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_INVALID_NAMESPACE',
          `QualifiedName namespace portion "${rawNamespace}" is invalid: ${nsResult.error.message}`,
          raw
        ),
      };
    }

    const localValidationError = QualifiedName.validateLocalName(rawLocalName);
    if (localValidationError) {
      return { error: localValidationError };
    }

    return {
      namespace: nsResult.value,
      localName: rawLocalName,
      canonicalValue: raw,
    };
  }

  /**
   * Internal validation engine for composition from parts.
   */
  private static validateParts(
    namespace: Namespace,
    localName: string
  ): { canonicalValue: string } | { error: QualifiedNameValidationError } {
    if (!namespace || !(namespace instanceof Namespace)) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_INVALID_PARTS',
          'QualifiedName composition requires a valid Namespace value object instance.',
          namespace
        ),
      };
    }

    if (typeof localName !== 'string') {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_NON_STRING',
          `Local name must be a string primitive, received ${typeof localName}.`,
          localName
        ),
      };
    }

    if (localName.length === 0) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_EMPTY_LOCAL_NAME',
          'Local name cannot be an empty string.',
          localName
        ),
      };
    }

    if (/\s/.test(localName)) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_WHITESPACE',
          'Local name must not contain whitespace.',
          localName
        ),
      };
    }

    const localValidationError = QualifiedName.validateLocalName(localName);
    if (localValidationError) {
      return { error: localValidationError };
    }

    const canonicalValue = `${namespace.toString()}${NAMESPACE_SEPARATOR}${localName}`;

    if (canonicalValue.length > QUALIFIED_NAME_MAX_LENGTH) {
      return {
        error: new QualifiedNameValidationError(
          'QUALIFIED_NAME_TOO_LONG',
          `Combined QualifiedName length (${canonicalValue.length}) exceeds maximum limit of ${QUALIFIED_NAME_MAX_LENGTH} characters.`,
          canonicalValue
        ),
      };
    }

    return { canonicalValue };
  }

  /**
   * Validates local element name against grammar and bounds.
   */
  private static validateLocalName(
    localName: string
  ): QualifiedNameValidationError | null {
    if (localName.includes(NAMESPACE_SEPARATOR)) {
      return new QualifiedNameValidationError(
        'QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER',
        `Local name "${localName}" must not contain namespace separator "${NAMESPACE_SEPARATOR}".`,
        localName
      );
    }

    if (localName.length > LOCAL_NAME_MAX_LENGTH) {
      return new QualifiedNameValidationError(
        'QUALIFIED_NAME_LOCAL_NAME_TOO_LONG',
        `Local name length (${localName.length}) exceeds maximum limit of ${LOCAL_NAME_MAX_LENGTH} characters.`,
        localName
      );
    }

    if (!LOCAL_NAME_START_PATTERN.test(localName)) {
      return new QualifiedNameValidationError(
        'QUALIFIED_NAME_INVALID_LOCAL_NAME_START',
        `Local name "${localName}" must start with an ASCII letter [a-zA-Z].`,
        localName
      );
    }

    if (!LOCAL_NAME_FULL_PATTERN.test(localName)) {
      return new QualifiedNameValidationError(
        'QUALIFIED_NAME_INVALID_LOCAL_NAME_CHARACTER',
        `Local name "${localName}" contains invalid characters. Only ASCII letters, digits, and underscores are permitted.`,
        localName
      );
    }

    return null;
  }

  /**
   * Returns the immutable Namespace component.
   */
  public get namespace(): Namespace {
    return this.ns;
  }

  /**
   * Returns the validated local element name component.
   */
  public get localName(): string {
    return this.local;
  }

  /**
   * Value equality comparison.
   * Compares Namespace value equality and local name ordinal equality.
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof QualifiedName)) {
      return false;
    }

    return this.ns.equals(other.ns) && this.local === other.local;
  }

  /**
   * Returns canonical string representation (`${namespace}.${localName}`).
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
