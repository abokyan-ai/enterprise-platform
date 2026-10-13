/**
 * @file field-owner-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Owner Consistency Rule.
 *
 * Verifies that all FieldDefinitions declared within an authored DataFacet
 * belong to the exact containing TypeDefinition snapshot.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const fieldOwnerRule: TypeValidationRule = Object.freeze({
  id: 'RULE-FIELD-OWNER',
  name: 'Field Owner Consistency Rule',
  description:
    'Verifies that every FieldDefinition in the DataFacet belongs to the exact TypeDefinition snapshot.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_OWNER_ID_MISMATCH,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_OWNER_VERSION_MISMATCH,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { typeDefinition, dataFacet } = input;

    if (dataFacet === undefined || dataFacet.fields.length === 0) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < dataFacet.fields.length; i++) {
      const field = dataFacet.fields[i];

      // 1. Check field owner element ID
      const fieldOwnerId = field.ownerType.elementId;
      if (!fieldOwnerId.equals(typeDefinition.id)) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_OWNER_ID_MISMATCH,
            severity: DiagnosticSeverities.ERROR,
            message: `Field '${field.qualifiedName.toString()}' owner element ID '${fieldOwnerId.toString()}' does not match containing TypeDefinition ID '${typeDefinition.id.toString()}'.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'ownerType', 'elementId']),
            },
            details: {
              fieldId: field.id.toString(),
              fieldQualifiedName: field.qualifiedName.toString(),
              expectedOwnerId: typeDefinition.id.toString(),
              actualOwnerId: fieldOwnerId.toString(),
            },
          }),
        );
      }

      // 2. Check field owner exact version
      const fieldOwnerVersion = field.ownerType.version;
      if (!fieldOwnerVersion.equals(typeDefinition.version)) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_OWNER_VERSION_MISMATCH,
            severity: DiagnosticSeverities.ERROR,
            message: `Field '${field.qualifiedName.toString()}' owner version '${fieldOwnerVersion.toString()}' does not match containing TypeDefinition version '${typeDefinition.version.toString()}'.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'ownerType', 'version']),
            },
            details: {
              fieldId: field.id.toString(),
              fieldQualifiedName: field.qualifiedName.toString(),
              expectedOwnerVersion: typeDefinition.version.toString(),
              actualOwnerVersion: fieldOwnerVersion.toString(),
            },
          }),
        );
      }
    }

    return Object.freeze(diagnostics);
  },
});
