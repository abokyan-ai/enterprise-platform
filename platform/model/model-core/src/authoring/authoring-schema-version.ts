/**
 * @file authoring-schema-version.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Authoring Schema Version Contract.
 *
 * Defines the formal version contract identifying the structural format rules
 * used to interpret an authored model document.
 *
 * Architectural Invariants:
 * 1. Schema Version ≠ Semantic Version:
 *    AuthoringSchemaVersion identifies the document format rules, NOT the
 *    business definition version of an authored TypeDefinition (SK-07),
 *    NOT a compiler version, and NOT a runtime artifact version.
 * 2. Deterministic Versioning:
 *    Initial supported version is exactly '1.0.0'.
 * 3. Rejection of Silent Evolution:
 *    Unsupported schema versions must be rejected explicitly without silent
 *    migration, compatibility negotiation, or format guessing.
 * 4. Pure TypeScript:
 *    Zero external framework dependencies. Universal portability.
 */

/**
 * The canonical initial authoring schema format version.
 */
export const AUTHORING_SCHEMA_VERSION = '1.0.0' as const;

/**
 * Readonly list of all currently supported authoring schema versions.
 */
export const SUPPORTED_AUTHORING_SCHEMA_VERSIONS = Object.freeze([
  AUTHORING_SCHEMA_VERSION,
] as const);

/**
 * Type-level representation of supported authoring schema versions.
 */
export type AuthoringSchemaVersion = typeof AUTHORING_SCHEMA_VERSION;

/**
 * Type guard verifying whether a candidate value conforms to a supported AuthoringSchemaVersion.
 *
 * @param value Candidate value to test.
 * @returns True if value is exactly a supported AuthoringSchemaVersion string.
 */
export function isAuthoringSchemaVersion(
  value: unknown,
): value is AuthoringSchemaVersion {
  return (
    typeof value === 'string' &&
    (SUPPORTED_AUTHORING_SCHEMA_VERSIONS as readonly string[]).includes(value)
  );
}
