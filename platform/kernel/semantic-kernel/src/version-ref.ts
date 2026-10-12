/**
 * @file version-ref.ts
 * @module @ecosystem/semantic-kernel
 *
 * Explicit SemVer representation for semantic model versioning.
 * Semantic models, interfaces, and artifacts support explicit version declarations.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero framework dependencies.
 */

/**
 * A validated Semantic Version reference.
 * Follows SemVer 2.0: MAJOR.MINOR.PATCH[-prerelease][+build]
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
 * Throws SemanticKernelError on invalid format.
 */
export function parseVersion(semver: string): VersionRef {
  const match = semver.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/,
  );
  if (!match) {
    throw new Error(`Invalid SemVer string: "${semver}"`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    build: match[5],
  };
}

/**
 * Serializes a VersionRef back to its canonical SemVer string form.
 */
export function formatVersion(ref: VersionRef): string {
  let v = `${ref.major}.${ref.minor}.${ref.patch}`;
  if (ref.prerelease) v += `-${ref.prerelease}`;
  if (ref.build) v += `+${ref.build}`;
  return v;
}

/**
 * Compares two VersionRefs.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareVersions(a: VersionRef, b: VersionRef): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}
