/**
 * @file index.ts
 * @module @ecosystem/model-core/authoring
 *
 * MOD-01: Authoring Model Schema Subsystem Barrel.
 *
 * Pure TypeScript Model Core subsystem defining the structural schema for
 * authored model documents without loaders, canonicalization, or runtime execution.
 */

// Schema Version
export {
  AUTHORING_SCHEMA_VERSION,
  SUPPORTED_AUTHORING_SCHEMA_VERSIONS,
  type AuthoringSchemaVersion,
  isAuthoringSchemaVersion,
} from './authoring-schema-version.js';

// Diagnostics
export {
  AUTHORING_DIAGNOSTIC_CODES,
  type AuthoringDiagnosticCode,
  createAuthoringDiagnostic,
} from './authoring-diagnostic-codes.js';

// Declaration Types
export {
  type AuthoringTypeDeclaration,
  type AuthoringTypeDeclarationJSON,
  type AuthoringTypeDefinition,
  type AuthoringFieldDefinition,
  type AuthoringDataFacet,
  type AuthoringFieldConstraint,
  type AuthoringTypeReference,
  isAuthoringTypeDeclaration,
  isAuthoringTypeDefinition,
} from './authoring-type.js';

// Elements
export {
  type AuthoringElementKind,
  type AuthoringElement,
  type AuthoringElementJSON,
  isAuthoringElement,
} from './authoring-element.js';

// Document Root
export {
  AUTHORING_DOCUMENT_ERROR_CODES,
  type AuthoringDocumentErrorCode,
  AuthoringDocumentValidationError,
  type AuthoringDocument,
  type AuthoringDocumentJSON,
  type AuthoringDocumentInput,
  type AuthoringModel,
  type AuthoringModelJSON,
  type AuthoringDocumentParseResult,
  createAuthoringDocument,
  serializeAuthoringDocument,
  parseAuthoringDocument,
  tryParseAuthoringDocument,
  isAuthoringDocument,
  validateAuthoringDocumentStructure,
} from './authoring-document.js';
