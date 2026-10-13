/**
 * @file field-uniqueness-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Identity and Naming Uniqueness Rule.
 *
 * Verifies that within an authored DataFacet, no two FieldDefinitions share the
 * same SemanticElementId or canonical QualifiedName.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const fieldUniquenessRule: TypeValidationRule = Object.freeze({
  id: 'RULE-FIELD-UNIQUENESS',
  name: 'Field Identity and Naming Uniqueness Rule',
  description:
    'Verifies that all FieldDefinitions within a DataFacet possess unique SemanticElementIds and QualifiedNames.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.DUPLICATE_FIELD_ID,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.DUPLICATE_FIELD_NAME,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { dataFacet } = input;

    if (dataFacet === undefined || dataFacet.fields.length <= 1) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    for (let i = 0; i < dataFacet.fields.length; i++) {
      const field = dataFacet.fields[i];
      const idStr = field.id.toString();
      const qnameStr = field.qualifiedName.toString();

      // 1. Identity uniqueness
      if (seenIds.has(idStr)) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.DUPLICATE_FIELD_ID,
            severity: DiagnosticSeverities.ERROR,
            message: `Duplicate FieldDefinition SemanticElementId '${idStr}' detected in DataFacet.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'id']),
            },
            details: {
              duplicateFieldId: idStr,
              fieldIndex: i,
            },
          }),
        );
      } else {
        seenIds.add(idStr);
      }

      // 2. QualifiedName uniqueness (case-sensitive)
      if (seenNames.has(qnameStr)) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.DUPLICATE_FIELD_NAME,
            severity: DiagnosticSeverities.ERROR,
            message: `Duplicate FieldDefinition QualifiedName '${qnameStr}' detected in DataFacet.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'qualifiedName']),
            },
            details: {
              duplicateQualifiedName: qnameStr,
              fieldIndex: i,
            },
          }),
        );
      } else {
        seenNames.add(qnameStr);
      }
    }

    return Object.freeze(diagnostics);
  },
});
