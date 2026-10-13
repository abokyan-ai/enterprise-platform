/**
 * @file constraint-applicability-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Constraint Applicability Rule.
 *
 * Verifies that declarative FieldConstraints are applicable to the declared value
 * type of their associated field:
 * - Primitive constraints must match the TYPE-04 applicability matrix for PrimitiveType.
 * - Primitive constraints are strictly rejected when attached to authored TypeReferences.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';
import { isConstraintApplicableToPrimitive } from '../../constraints/field-constraint.js';

export const constraintApplicabilityRule: TypeValidationRule = Object.freeze({
  id: 'RULE-CONSTRAINT-APPLICABILITY',
  name: 'Field Constraint Applicability Rule',
  description:
    'Verifies that field constraints match the declared primitive type and are not attached to referenced types.',
  diagnosticCodes: Object.freeze([TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_INAPPLICABLE]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { dataFacet, fieldConstraints } = input;

    if (
      dataFacet === undefined ||
      fieldConstraints === undefined ||
      fieldConstraints.length === 0
    ) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < fieldConstraints.length; i++) {
      const constraintSet = fieldConstraints[i];
      const field = dataFacet.fields.find((f) => f.id.equals(constraintSet.fieldId));

      if (!field) {
        // Unassociated fields are handled by constraintAssociationRule
        continue;
      }

      if (field.valueType.by === 'reference') {
        // Referenced authored types cannot receive primitive constraints
        for (let j = 0; j < constraintSet.constraints.length; j++) {
          const constraint = constraintSet.constraints[j];
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_INAPPLICABLE,
              severity: DiagnosticSeverities.ERROR,
              message: `Constraint '${constraint.kind}' is inapplicable to field '${field.qualifiedName.toString()}': primitive constraints cannot be applied to referenced authored types.`,
              location: {
                elementId: field.id,
                qualifiedName: field.qualifiedName,
                contextRef: field.contextRef,
                modelPath: Object.freeze([
                  'fieldConstraints',
                  i.toString(),
                  'constraints',
                  j.toString(),
                ]),
              },
              details: {
                constraintKind: constraint.kind,
                fieldTypeVariant: 'reference',
              },
            }),
          );
        }
        continue;
      }

      // Primitive field type checks
      const primitiveType = field.valueType.primitiveType;
      for (let j = 0; j < constraintSet.constraints.length; j++) {
        const constraint = constraintSet.constraints[j];
        if (!isConstraintApplicableToPrimitive(constraint, primitiveType)) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_INAPPLICABLE,
              severity: DiagnosticSeverities.ERROR,
              message: `Constraint '${constraint.kind}' is not applicable to field '${field.qualifiedName.toString()}' with primitive type '${primitiveType}'.`,
              location: {
                elementId: field.id,
                qualifiedName: field.qualifiedName,
                contextRef: field.contextRef,
                modelPath: Object.freeze([
                  'fieldConstraints',
                  i.toString(),
                  'constraints',
                  j.toString(),
                ]),
              },
              details: {
                constraintKind: constraint.kind,
                primitiveType,
              },
            }),
          );
        }
      }
    }

    return Object.freeze(diagnostics);
  },
});
