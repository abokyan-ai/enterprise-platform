/**
 * @file constraint-association-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Constraint Association Rule.
 *
 * Verifies that supplied FieldConstraintSets belong to the exact TypeDefinition
 * under validation and identify a locally available FieldDefinition within the
 * supplied DataFacet.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const constraintAssociationRule: TypeValidationRule = Object.freeze({
  id: 'RULE-CONSTRAINT-ASSOCIATION',
  name: 'Field Constraint Association Rule',
  description:
    'Verifies that declared FieldConstraintSets belong to the validated type and associate with local fields.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_OWNER_MISMATCH,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_UNASSOCIATED_FIELD,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { typeDefinition, dataFacet, fieldConstraints } = input;

    if (fieldConstraints === undefined || fieldConstraints.length === 0) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < fieldConstraints.length; i++) {
      const constraintSet = fieldConstraints[i];

      // 1. Owner consistency check (exact element ID and version snapshot)
      const ownerIdMatches = constraintSet.ownerType.elementId.equals(typeDefinition.id);
      const ownerVersionMatches = constraintSet.ownerType.version.equals(typeDefinition.version);

      if (!ownerIdMatches || !ownerVersionMatches) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_OWNER_MISMATCH,
            severity: DiagnosticSeverities.ERROR,
            message: `FieldConstraintSet for field '${constraintSet.fieldId.toString()}' owner '${constraintSet.ownerType.toString()}' does not match validated TypeDefinition '${typeDefinition.toElementVersionRef().toString()}'.`,
            location: {
              elementId: constraintSet.fieldId,
              modelPath: Object.freeze(['fieldConstraints', i.toString(), 'ownerType']),
            },
            details: {
              fieldId: constraintSet.fieldId.toString(),
              expectedOwner: typeDefinition.toElementVersionRef().toString(),
              actualOwner: constraintSet.ownerType.toString(),
            },
          }),
        );
      }

      // 2. Field existence check within available DataFacet
      if (dataFacet !== undefined) {
        const matchingField = dataFacet.fields.find((f) => f.id.equals(constraintSet.fieldId));
        if (!matchingField) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_UNASSOCIATED_FIELD,
              severity: DiagnosticSeverities.ERROR,
              message: `FieldConstraintSet references field ID '${constraintSet.fieldId.toString()}' which does not exist in the supplied DataFacet.`,
              location: {
                elementId: constraintSet.fieldId,
                modelPath: Object.freeze(['fieldConstraints', i.toString(), 'fieldId']),
              },
              details: {
                unassociatedFieldId: constraintSet.fieldId.toString(),
              },
            }),
          );
        }
      }
    }

    return Object.freeze(diagnostics);
  },
});
