/**
 * @file constraint-coherence-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Constraint Coherence and Contradiction Rule.
 *
 * Verifies that constraints within a FieldConstraintSet are internally consistent:
 * - No duplicate singleton constraint kinds.
 * - MIN_LENGTH does not exceed MAX_LENGTH.
 * - MIN_VALUE does not exceed MAX_VALUE (evaluated with exact numeric comparison).
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';
import {
  FieldConstraintKinds,
  type MinLengthConstraint,
  type MaxLengthConstraint,
  type MinValueConstraint,
  type MaxValueConstraint,
} from '../../constraints/index.js';
import {
  compareExactIntegers,
  compareExactDecimals,
} from '../../constraints/field-constraint.js';

export const constraintCoherenceRule: TypeValidationRule = Object.freeze({
  id: 'RULE-CONSTRAINT-COHERENCE',
  name: 'Field Constraint Coherence Rule',
  description:
    'Verifies internal coherence of constraint sets, detecting contradictory bounds and duplicate singleton kinds.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_DUPLICATE_KIND,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_CONTRADICTORY_BOUNDS,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { fieldConstraints } = input;

    if (fieldConstraints === undefined || fieldConstraints.length === 0) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < fieldConstraints.length; i++) {
      const constraintSet = fieldConstraints[i];
      const seenKinds = new Set<string>();

      let minLength: MinLengthConstraint | undefined;
      let maxLength: MaxLengthConstraint | undefined;
      let minValue: MinValueConstraint | undefined;
      let maxValue: MaxValueConstraint | undefined;

      for (let j = 0; j < constraintSet.constraints.length; j++) {
        const c = constraintSet.constraints[j];

        // 1. Duplicate constraint kind check
        if (seenKinds.has(c.kind)) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_DUPLICATE_KIND,
              severity: DiagnosticSeverities.ERROR,
              message: `Duplicate constraint kind '${c.kind}' detected for field ID '${constraintSet.fieldId.toString()}'.`,
              location: {
                elementId: constraintSet.fieldId,
                modelPath: Object.freeze([
                  'fieldConstraints',
                  i.toString(),
                  'constraints',
                  j.toString(),
                  'kind',
                ]),
              },
              details: {
                duplicateKind: c.kind,
              },
            }),
          );
        } else {
          seenKinds.add(c.kind);
        }

        if (c.kind === FieldConstraintKinds.MIN_LENGTH) {
          minLength = c as MinLengthConstraint;
        } else if (c.kind === FieldConstraintKinds.MAX_LENGTH) {
          maxLength = c as MaxLengthConstraint;
        } else if (c.kind === FieldConstraintKinds.MIN_VALUE) {
          minValue = c as MinValueConstraint;
        } else if (c.kind === FieldConstraintKinds.MAX_VALUE) {
          maxValue = c as MaxValueConstraint;
        }
      }

      // 2. Contradictory length bounds
      if (minLength && maxLength && minLength.minimum > maxLength.maximum) {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_CONTRADICTORY_BOUNDS,
            severity: DiagnosticSeverities.ERROR,
            message: `Contradictory length bounds for field ID '${constraintSet.fieldId.toString()}': MIN_LENGTH (${minLength.minimum}) exceeds MAX_LENGTH (${maxLength.maximum}).`,
            location: {
              elementId: constraintSet.fieldId,
              modelPath: Object.freeze(['fieldConstraints', i.toString()]),
            },
            details: {
              minimumLength: minLength.minimum,
              maximumLength: maxLength.maximum,
            },
          }),
        );
      }

      // 3. Contradictory numeric bounds
      if (minValue && maxValue) {
        let isContradictory = false;
        let comparisonDetails = '';

        if (minValue.valueType !== maxValue.valueType) {
          isContradictory = true;
          comparisonDetails = `ValueType mismatch: MIN_VALUE is '${minValue.valueType}' vs MAX_VALUE '${maxValue.valueType}'.`;
        } else {
          let cmp: number;
          if (minValue.valueType === 'INTEGER') {
            cmp = compareExactIntegers(minValue.minimum, maxValue.maximum);
          } else {
            cmp = compareExactDecimals(minValue.minimum, maxValue.maximum);
          }
          if (cmp > 0) {
            isContradictory = true;
            comparisonDetails = `MIN_VALUE (${minValue.minimum}) exceeds MAX_VALUE (${maxValue.maximum}).`;
          }
        }

        if (isContradictory) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.CONSTRAINT_CONTRADICTORY_BOUNDS,
              severity: DiagnosticSeverities.ERROR,
              message: `Contradictory numeric bounds for field ID '${constraintSet.fieldId.toString()}': ${comparisonDetails}`,
              location: {
                elementId: constraintSet.fieldId,
                modelPath: Object.freeze(['fieldConstraints', i.toString()]),
              },
              details: {
                minimumValue: minValue.minimum,
                maximumValue: maxValue.maximum,
              },
            }),
          );
        }
      }
    }

    return Object.freeze(diagnostics);
  },
});
