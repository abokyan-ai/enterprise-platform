/**
 * @file type-classification-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: TypeDefinition Classification Rule.
 *
 * Verifies that an authored TypeDefinition carries the canonical
 * SemanticElementKinds.TYPE ('type') classification.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  SemanticElementKinds,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const typeClassificationRule: TypeValidationRule = Object.freeze({
  id: 'RULE-TYPE-CLASSIFICATION',
  name: 'Type Classification Invariant Rule',
  description: 'Verifies that the TypeDefinition canonical kind equals SemanticElementKinds.TYPE.',
  diagnosticCodes: Object.freeze([TYPE_VALIDATION_DIAGNOSTIC_CODES.KIND_MISMATCH]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { typeDefinition } = input;

    if (typeDefinition.kind !== SemanticElementKinds.TYPE) {
      return Object.freeze([
        createDiagnostic({
          code: TYPE_VALIDATION_DIAGNOSTIC_CODES.KIND_MISMATCH,
          severity: DiagnosticSeverities.ERROR,
          message: `TypeDefinition '${typeDefinition.qualifiedName.toString()}' has invalid classification kind '${String(typeDefinition.kind)}'. Expected '${SemanticElementKinds.TYPE}'.`,
          location: {
            elementId: typeDefinition.id,
            qualifiedName: typeDefinition.qualifiedName,
            contextRef: typeDefinition.contextRef,
            modelPath: Object.freeze(['kind']),
          },
          details: {
            expectedKind: SemanticElementKinds.TYPE,
            actualKind: String(typeDefinition.kind),
          },
        }),
      ]);
    }

    return Object.freeze([]);
  },
});
