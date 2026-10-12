/**
 * SK-07: Immutable exact semantic definition versions.
 * Strict SemVer 2.0.0 syntax with explicit resource and numeric bounds.
 * Pure TypeScript; no resolution, compatibility analysis, or runtime behavior.
 */
import { SemanticKernelError } from '../semantic-id.js';

export const SEMANTIC_VERSION_MAX_LENGTH = 256;
export const SEMANTIC_VERSION_MAX_IDENTIFIER_LENGTH = 64;
export const SEMANTIC_VERSION_MAX_PRERELEASE_IDENTIFIERS = 16;
export const SEMANTIC_VERSION_MAX_BUILD_IDENTIFIERS = 16;
export const SEMANTIC_VERSION_MAX_COMPONENT = Number.MAX_SAFE_INTEGER;

export const SEMANTIC_VERSION_ERROR_CODES = Object.freeze({
  NON_STRING: 'SEMANTIC_VERSION_NON_STRING',
  EMPTY: 'SEMANTIC_VERSION_EMPTY',
  WHITESPACE: 'SEMANTIC_VERSION_WHITESPACE',
  TOO_LONG: 'SEMANTIC_VERSION_TOO_LONG',
  INVALID_FORMAT: 'SEMANTIC_VERSION_INVALID_FORMAT',
  INVALID_COMPONENT: 'SEMANTIC_VERSION_INVALID_COMPONENT',
  UNSAFE_COMPONENT: 'SEMANTIC_VERSION_UNSAFE_COMPONENT',
  INVALID_PRERELEASE: 'SEMANTIC_VERSION_INVALID_PRERELEASE',
  INVALID_BUILD_METADATA: 'SEMANTIC_VERSION_INVALID_BUILD_METADATA',
  IDENTIFIER_TOO_LONG: 'SEMANTIC_VERSION_IDENTIFIER_TOO_LONG',
  TOO_MANY_IDENTIFIERS: 'SEMANTIC_VERSION_TOO_MANY_IDENTIFIERS',
  INVALID_COMPARISON: 'SEMANTIC_VERSION_INVALID_COMPARISON',
} as const);

export type SemanticVersionErrorCode =
  (typeof SEMANTIC_VERSION_ERROR_CODES)[keyof typeof SEMANTIC_VERSION_ERROR_CODES];

export class SemanticVersionValidationError extends SemanticKernelError {
  public override readonly code: SemanticVersionErrorCode;

  public constructor(code: SemanticVersionErrorCode, message: string) {
    super(message, code);
    this.name = 'SemanticVersionValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type SemanticVersionParseResult =
  | { readonly ok: true; readonly value: SemanticVersion }
  | { readonly ok: false; readonly error: SemanticVersionValidationError };

const CORE_COMPONENT_PATTERN = /^(?:0|[1-9][0-9]*)$/;
const IDENTIFIER_PATTERN = /^[0-9A-Za-z-]+$/;
const NUMERIC_IDENTIFIER_PATTERN = /^[0-9]+$/;
const MAX_COMPONENT_TEXT = String(SEMANTIC_VERSION_MAX_COMPONENT);

/** Compare canonical unsigned decimal strings without converting to Number. */
function compareNumericText(left: string, right: string): -1 | 0 | 1 {
  if (left.length !== right.length) return left.length < right.length ? -1 : 1;
  return left === right ? 0 : left < right ? -1 : 1;
}

function parseCoreComponent(value: string): number {
  if (!CORE_COMPONENT_PATTERN.test(value)) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.INVALID_COMPONENT,
      'Version components must be nonnegative decimal integers without leading zeroes.',
    );
  }
  if (compareNumericText(value, MAX_COMPONENT_TEXT) > 0) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.UNSAFE_COMPONENT,
      `Version components must not exceed ${SEMANTIC_VERSION_MAX_COMPONENT}.`,
    );
  }
  // Range and canonical integer syntax were checked before numeric conversion.
  return Number(value);
}

function parseIdentifiers(
  value: string | undefined,
  concern: 'prerelease' | 'build',
): readonly string[] {
  if (value === undefined) return [];

  const identifiers = value.split('.');
  const maxCount =
    concern === 'prerelease'
      ? SEMANTIC_VERSION_MAX_PRERELEASE_IDENTIFIERS
      : SEMANTIC_VERSION_MAX_BUILD_IDENTIFIERS;
  if (identifiers.length > maxCount) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.TOO_MANY_IDENTIFIERS,
      `The ${concern} identifier count must not exceed ${maxCount}.`,
    );
  }

  for (const identifier of identifiers) {
    if (identifier.length > SEMANTIC_VERSION_MAX_IDENTIFIER_LENGTH) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.IDENTIFIER_TOO_LONG,
        `Version identifiers must not exceed ${SEMANTIC_VERSION_MAX_IDENTIFIER_LENGTH} characters.`,
      );
    }
    if (!IDENTIFIER_PATTERN.test(identifier)) {
      throw new SemanticVersionValidationError(
        concern === 'prerelease'
          ? SEMANTIC_VERSION_ERROR_CODES.INVALID_PRERELEASE
          : SEMANTIC_VERSION_ERROR_CODES.INVALID_BUILD_METADATA,
        `The ${concern} identifiers must be nonempty ASCII alphanumeric or hyphen strings.`,
      );
    }
    if (
      concern === 'prerelease' &&
      NUMERIC_IDENTIFIER_PATTERN.test(identifier) &&
      identifier.length > 1 &&
      identifier.startsWith('0')
    ) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.INVALID_PRERELEASE,
        'Numeric prerelease identifiers must not contain leading zeroes.',
      );
    }
  }
  return identifiers;
}

/**
 * An exact semantic definition version, independent of its element identity.
 * Core components use safe integers. Identifier spelling and metadata are kept
 * exactly as supplied; arrays and the value object are frozen.
 */
export class SemanticVersion {
  public readonly prerelease: readonly string[];
  public readonly buildMetadata: readonly string[];

  private constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly patch: number,
    prerelease: readonly string[],
    buildMetadata: readonly string[],
    private readonly canonicalValue: string,
  ) {
    this.prerelease = Object.freeze([...prerelease]);
    this.buildMetadata = Object.freeze([...buildMetadata]);
    Object.freeze(this);
  }

  /** Parse one exact version; never trim, coerce, select, or normalize input. */
  public static parse(value: unknown): SemanticVersion {
    if (typeof value !== 'string') {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.NON_STRING,
        'SemanticVersion input must be a string primitive.',
      );
    }
    if (value.length === 0) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.EMPTY,
        'SemanticVersion cannot be empty.',
      );
    }
    // Bound work before scanning, splitting, or allocating identifier arrays.
    if (value.length > SEMANTIC_VERSION_MAX_LENGTH) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.TOO_LONG,
        `SemanticVersion must not exceed ${SEMANTIC_VERSION_MAX_LENGTH} characters.`,
      );
    }
    if (/\s/.test(value)) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.WHITESPACE,
        'SemanticVersion must not contain whitespace.',
      );
    }

    const buildSeparator = value.indexOf('+');
    if (buildSeparator !== value.lastIndexOf('+')) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.INVALID_FORMAT,
        'SemanticVersion may contain only one build metadata separator.',
      );
    }
    const versionPart =
      buildSeparator === -1 ? value : value.slice(0, buildSeparator);
    const rawBuild =
      buildSeparator === -1 ? undefined : value.slice(buildSeparator + 1);
    const prereleaseSeparator = versionPart.indexOf('-');
    const core =
      prereleaseSeparator === -1
        ? versionPart
        : versionPart.slice(0, prereleaseSeparator);
    const rawPrerelease =
      prereleaseSeparator === -1
        ? undefined
        : versionPart.slice(prereleaseSeparator + 1);
    const components = core.split('.');
    if (components.length !== 3) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.INVALID_FORMAT,
        'SemanticVersion requires exactly major.minor.patch.',
      );
    }

    const major = parseCoreComponent(components[0]);
    const minor = parseCoreComponent(components[1]);
    const patch = parseCoreComponent(components[2]);
    const prerelease = parseIdentifiers(rawPrerelease, 'prerelease');
    const buildMetadata = parseIdentifiers(rawBuild, 'build');
    return new SemanticVersion(
      major,
      minor,
      patch,
      prerelease,
      buildMetadata,
      value,
    );
  }

  /** Non-throwing validation result for ordinary input failures. */
  public static tryParse(value: unknown): SemanticVersionParseResult {
    try {
      return { ok: true, value: SemanticVersion.parse(value) };
    } catch (error) {
      if (error instanceof SemanticVersionValidationError) {
        return { ok: false, error };
      }
      throw error;
    }
  }

  /** Guard for a raw canonical version string, not for class instances. */
  public static isValid(value: unknown): value is string {
    return SemanticVersion.tryParse(value).ok;
  }

  /** Full representation equality, including case and build metadata. */
  public equals(other: unknown): boolean {
    return (
      other instanceof SemanticVersion &&
      this.canonicalValue === other.canonicalValue
    );
  }

  /** SemVer precedence, normalized to -1 / 0 / 1; build metadata is ignored. */
  public comparePrecedence(other: SemanticVersion): -1 | 0 | 1 {
    if (!(other instanceof SemanticVersion)) {
      throw new SemanticVersionValidationError(
        SEMANTIC_VERSION_ERROR_CODES.INVALID_COMPARISON,
        'Version precedence comparison requires a SemanticVersion instance.',
      );
    }
    if (this.major !== other.major) return this.major < other.major ? -1 : 1;
    if (this.minor !== other.minor) return this.minor < other.minor ? -1 : 1;
    if (this.patch !== other.patch) return this.patch < other.patch ? -1 : 1;

    if (this.prerelease.length === 0)
      return other.prerelease.length === 0 ? 0 : 1;
    if (other.prerelease.length === 0) return -1;

    const sharedCount = Math.min(
      this.prerelease.length,
      other.prerelease.length,
    );
    for (let index = 0; index < sharedCount; index++) {
      const left = this.prerelease[index];
      const right = other.prerelease[index];
      if (left === right) continue;

      const leftNumeric = NUMERIC_IDENTIFIER_PATTERN.test(left);
      const rightNumeric = NUMERIC_IDENTIFIER_PATTERN.test(right);
      if (leftNumeric && rightNumeric) return compareNumericText(left, right);
      if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
      // Valid identifiers are ASCII; ordinal comparison is locale independent.
      return left < right ? -1 : 1;
    }
    return this.prerelease.length === other.prerelease.length
      ? 0
      : this.prerelease.length < other.prerelease.length
        ? -1
        : 1;
  }

  public toString(): string {
    return this.canonicalValue;
  }

  public toJSON(): string {
    return this.canonicalValue;
  }
}
