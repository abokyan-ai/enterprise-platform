/**
 * @file version-ref.ts
 * @module @ecosystem/semantic-kernel
 *
 * Explicit SemVer representation for semantic model versioning.
 * Semantic models, interfaces, and artifacts support explicit version declarations.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero framework dependencies.
 */

import {
  SemanticVersion,
  SemanticVersionValidationError,
  SEMANTIC_VERSION_ERROR_CODES,
  SEMANTIC_VERSION_MAX_LENGTH,
} from './versioning/semantic-version.js';

/**
 * Legacy structural view retained for ARC-01 consumers.
 * SemanticVersion owns exact parsing, resource bounds, and precedence.
 */
export interface VersionRef {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease?: string;
  readonly build?: string;
}

/**
 * Parses a SemVer string into a VersionRef.
 * Throws SemanticVersionValidationError for invalid or unsupported input.
 */
export function parseVersion(semver: string): VersionRef {
  const version = SemanticVersion.parse(semver);
  return Object.freeze({
    major: version.major,
    minor: version.minor,
    patch: version.patch,
    prerelease:
      version.prerelease.length > 0 ? version.prerelease.join('.') : undefined,
    build:
      version.buildMetadata.length > 0
        ? version.buildMetadata.join('.')
        : undefined,
  });
}

/**
 * Serializes a VersionRef back to its canonical SemVer string form.
 */
export function formatVersion(ref: VersionRef): string {
  return fromLegacyView(ref).toString();
}

/**
 * Compares two VersionRefs.
 * Returns -1 / 0 / 1 for SemVer precedence, including prerelease ordering.
 * Build metadata is ignored for precedence; this is not exact equality.
 */
export function compareVersions(a: VersionRef, b: VersionRef): number {
  return fromLegacyView(a).comparePrecedence(fromLegacyView(b));
}

function isSafeCoreNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    !Object.is(value, -0)
  );
}

/** Validate numeric fields before rendering; never coerce caller objects. */
function fromLegacyView(ref: VersionRef): SemanticVersion {
  if (typeof ref !== 'object' || ref === null) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.INVALID_COMPONENT,
      'VersionRef must provide valid numeric version components.',
    );
  }
  const major: unknown = ref.major;
  const minor: unknown = ref.minor;
  const patch: unknown = ref.patch;
  if (
    !isSafeCoreNumber(major) ||
    !isSafeCoreNumber(minor) ||
    !isSafeCoreNumber(patch)
  ) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.INVALID_COMPONENT,
      'VersionRef components must be nonnegative safe integers.',
    );
  }

  const prerelease: unknown = ref.prerelease;
  const build: unknown = ref.build;
  if (prerelease !== undefined && typeof prerelease !== 'string') {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.INVALID_PRERELEASE,
      'VersionRef prerelease must be a string when present.',
    );
  }
  if (build !== undefined && typeof build !== 'string') {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.INVALID_BUILD_METADATA,
      'VersionRef build metadata must be a string when present.',
    );
  }
  if (
    (prerelease !== undefined &&
      prerelease.length > SEMANTIC_VERSION_MAX_LENGTH) ||
    (build !== undefined && build.length > SEMANTIC_VERSION_MAX_LENGTH)
  ) {
    throw new SemanticVersionValidationError(
      SEMANTIC_VERSION_ERROR_CODES.TOO_LONG,
      'VersionRef metadata exceeds the exact version resource bound.',
    );
  }
  const raw =
    `${major}.${minor}.${patch}` +
    (prerelease === undefined ? '' : `-${prerelease}`) +
    (build === undefined ? '' : `+${build}`);
  return SemanticVersion.parse(raw);
}
