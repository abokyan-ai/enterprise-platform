/**
 * @file authoring-diagnostic-codes.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Canonical Diagnostic Codes for Authoring Model Schema.
 *
 * Defines machine-readable diagnostic codes conforming strictly to the SK-11
 * DiagnosticCode canonical grammar (`/^[A-Z][A-Z0-9]*(_[A-Z][A-Z0-9]*)*$/`).
 */

import {
  type Diagnostic,
  type DiagnosticDetails,
  type DiagnosticLocation,
  createDiagnostic,
  DiagnosticCode,
  DiagnosticSeverities,
} from '@ecosystem/semantic-kernel';

/**
 * Machine-readable diagnostic codes emitted by authoring schema validation.
 */
export const AUTHORING_DIAGNOSTIC_CODES = {
  /** Document schema version is not supported by this runtime */
  UNSUPPORTED_SCHEMA_VERSION: 'AUTHORING_UNSUPPORTED_SCHEMA_VERSION',

  /** Root document is missing or not a non-null, non-array object */
  INVALID_ROOT: 'AUTHORING_INVALID_ROOT',

  /** A mandatory structural property is missing or undefined */
  MISSING_REQUIRED_PROPERTY: 'AUTHORING_MISSING_REQUIRED_PROPERTY',

  /** A property value violates its expected primitive or structural type */
  INVALID_PROPERTY_TYPE: 'AUTHORING_INVALID_PROPERTY_TYPE',

  /** A declaration entry within declarations collection is structurally invalid */
  INVALID_DECLARATION: 'AUTHORING_INVALID_DECLARATION',

  /** Declaration kind discriminator is unknown or not supported */
  INVALID_DECLARATION_KIND: 'AUTHORING_INVALID_DECLARATION_KIND',

  /** A collection property (e.g. declarations, fields) is not a valid array */
  INVALID_COLLECTION: 'AUTHORING_INVALID_COLLECTION',

  /** An unrecognized property was detected in strict validation mode */
  UNKNOWN_PROPERTY: 'AUTHORING_UNKNOWN_PROPERTY',

  /** Duplicate declaration with identical exact identity and exact version */
  DUPLICATE_DECLARATION: 'AUTHORING_DUPLICATE_DECLARATION',

  /** Type reference structural shape is invalid or malformed */
  INVALID_REFERENCE_SHAPE: 'AUTHORING_INVALID_REFERENCE_SHAPE',
} as const;

export type AuthoringDiagnosticCode =
  (typeof AUTHORING_DIAGNOSTIC_CODES)[keyof typeof AUTHORING_DIAGNOSTIC_CODES];

/**
 * Creates an immutable SK-11 Diagnostic object for an authoring schema condition.
 *
 * @param code The canonical authoring diagnostic code.
 * @param message Human-readable descriptive explanation.
 * @param details Optional structured contextual metadata.
 * @param location Optional source position / location.
 * @returns Fully validated, frozen SK-11 Diagnostic instance.
 */
export function createAuthoringDiagnostic(
  code: AuthoringDiagnosticCode,
  message: string,
  details?: DiagnosticDetails,
  location?: DiagnosticLocation,
): Diagnostic {
  return createDiagnostic({
    code: DiagnosticCode.parse(code),
    severity: DiagnosticSeverities.ERROR,
    message,
    details,
    location,
  });
}
