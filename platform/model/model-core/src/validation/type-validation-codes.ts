/**
 * @file type-validation-codes.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: Canonical Diagnostic Codes for Type Validation Rules.
 *
 * Defines machine-readable, stable diagnostic codes emitted by semantic type
 * validation rules in Model Core.
 *
 * Invariants:
 * - Conforms strictly to SK-11 DiagnosticCode canonical grammar:
 *   - Format: segment ("_" segment)*
 *   - Segment: [A-Z][A-Z0-9]*
 *   - Total length: 2 to 64 characters
 *   - Segments: 1 to 8 segments
 * - Stable identifiers: independent of display message text or UI language.
 */

export const TYPE_VALIDATION_DIAGNOSTIC_CODES = {
  /** TypeDefinition kind classification is not SemanticElementKinds.TYPE */
  KIND_MISMATCH: 'TYPE_VALIDATION_KIND_MISMATCH',

  /** DataFacet owner element ID does not match the TypeDefinition element ID */
  DATA_FACET_OWNER_ID_MISMATCH: 'TYPE_VALIDATION_DATA_FACET_OWNER_ID_MISMATCH',

  /** DataFacet owner version does not match the TypeDefinition exact version */
  DATA_FACET_OWNER_VERSION_MISMATCH: 'TYPE_VALIDATION_DATA_FACET_OWNER_VERSION_MISMATCH',

  /** FieldDefinition owner element ID does not match the containing TypeDefinition element ID */
  FIELD_OWNER_ID_MISMATCH: 'TYPE_VALIDATION_FIELD_OWNER_ID_MISMATCH',

  /** FieldDefinition owner version does not match the containing TypeDefinition version snapshot */
  FIELD_OWNER_VERSION_MISMATCH: 'TYPE_VALIDATION_FIELD_OWNER_VERSION_MISMATCH',

  /** Multiple fields share the same SemanticElementId within a DataFacet */
  DUPLICATE_FIELD_ID: 'TYPE_VALIDATION_DUPLICATE_FIELD_ID',

  /** Multiple fields share the same QualifiedName / local name within a DataFacet */
  DUPLICATE_FIELD_NAME: 'TYPE_VALIDATION_DUPLICATE_FIELD_NAME',

  /** Field declared value-type has an invalid or unparseable type descriptor */
  FIELD_TYPE_INVALID: 'TYPE_VALIDATION_FIELD_TYPE_INVALID',

  /** FieldConstraintSet owner reference does not match the TypeDefinition */
  CONSTRAINT_OWNER_MISMATCH: 'TYPE_VALIDATION_CONSTRAINT_OWNER_MISMATCH',

  /** FieldConstraintSet targets a field that does not exist in the available DataFacet */
  CONSTRAINT_UNASSOCIATED_FIELD: 'TYPE_VALIDATION_CONSTRAINT_UNASSOCIATED_FIELD',

  /** Field constraint is not applicable to the field's declared primitive or referenced type */
  CONSTRAINT_INAPPLICABLE: 'TYPE_VALIDATION_CONSTRAINT_INAPPLICABLE',

  /** Field constraints contain contradictory boundary declarations (e.g. min > max) */
  CONSTRAINT_CONTRADICTORY_BOUNDS: 'TYPE_VALIDATION_CONSTRAINT_CONTRADICTORY_BOUNDS',

  /** Field constraint set contains duplicate singleton constraint kinds */
  CONSTRAINT_DUPLICATE_KIND: 'TYPE_VALIDATION_CONSTRAINT_DUPLICATE_KIND',

  /** Named TypeReference lacks an explicit SemanticContextRef */
  REFERENCE_CONTEXT_MISSING: 'TYPE_VALIDATION_REFERENCE_CONTEXT_MISSING',
} as const;

export type TypeValidationDiagnosticCode =
  (typeof TYPE_VALIDATION_DIAGNOSTIC_CODES)[keyof typeof TYPE_VALIDATION_DIAGNOSTIC_CODES];
