/**
 * @file field-type-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: Field Value Type Declaration Rule.
 *
 * Verifies that each declared FieldType is structurally coherent:
 * - Primitive fields declare recognized SK-09 PrimitiveType codes.
 * - Referenced fields declare authentic ElementRefs with explicit context references
 *   for named references.
 *
 * Invariant: Never performs target resolution or claims target existence.
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
  isPrimitiveType,
  isElementNameRef,
  isElementIdRef,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const fieldTypeRule: TypeValidationRule = Object.freeze({
  id: 'RULE-FIELD-TYPE-DECLARATION',
  name: 'Field Value-Type Declaration Rule',
  description:
    'Verifies that field value-type descriptors are structurally sound and retain required context boundaries.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.REFERENCE_CONTEXT_MISSING,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { dataFacet } = input;

    if (dataFacet === undefined || dataFacet.fields.length === 0) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < dataFacet.fields.length; i++) {
      const field = dataFacet.fields[i];
      const { valueType } = field;

      if (valueType === undefined || typeof valueType !== 'object') {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
            severity: DiagnosticSeverities.ERROR,
            message: `Field '${field.qualifiedName.toString()}' has invalid or missing valueType descriptor.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType']),
            },
          }),
        );
        continue;
      }

      if (valueType.by === 'primitive') {
        if (!isPrimitiveType(valueType.primitiveType)) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
              severity: DiagnosticSeverities.ERROR,
              message: `Field '${field.qualifiedName.toString()}' declares unrecognized primitive type '${String(valueType.primitiveType)}'.`,
              location: {
                elementId: field.id,
                qualifiedName: field.qualifiedName,
                contextRef: field.contextRef,
                modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType', 'primitiveType']),
              },
              details: {
                invalidPrimitiveType: String(valueType.primitiveType),
              },
            }),
          );
        }
      } else if (valueType.by === 'reference') {
        const typeRef = valueType.typeRef;
        if (!typeRef) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
              severity: DiagnosticSeverities.ERROR,
              message: `Field '${field.qualifiedName.toString()}' declares invalid or missing typeRef.`,
              location: {
                elementId: field.id,
                qualifiedName: field.qualifiedName,
                contextRef: field.contextRef,
                modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType', 'typeRef']),
              },
            }),
          );
        } else if (isElementNameRef(typeRef)) {
          // Named reference must carry explicit contextRef (Context Owns Meaning)
          const namedRef = typeRef as {
            readonly qualifiedName: { toString(): string };
            readonly contextRef?: unknown;
          };
          if (!namedRef.contextRef) {
            diagnostics.push(
              createDiagnostic({
                code: TYPE_VALIDATION_DIAGNOSTIC_CODES.REFERENCE_CONTEXT_MISSING,
                severity: DiagnosticSeverities.ERROR,
                message: `Field '${field.qualifiedName.toString()}' references type '${namedRef.qualifiedName.toString()}' without required SemanticContextRef.`,
                location: {
                  elementId: field.id,
                  qualifiedName: field.qualifiedName,
                  contextRef: field.contextRef,
                  modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType', 'typeRef', 'contextRef']),
                },
                details: {
                  referencedQualifiedName: namedRef.qualifiedName.toString(),
                },
              }),
            );
          }
        } else if (!isElementIdRef(typeRef)) {
          diagnostics.push(
            createDiagnostic({
              code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
              severity: DiagnosticSeverities.ERROR,
              message: `Field '${field.qualifiedName.toString()}' declares unparseable typeRef.`,
              location: {
                elementId: field.id,
                qualifiedName: field.qualifiedName,
                contextRef: field.contextRef,
                modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType', 'typeRef']),
              },
            }),
          );
        }
      } else {
        diagnostics.push(
          createDiagnostic({
            code: TYPE_VALIDATION_DIAGNOSTIC_CODES.FIELD_TYPE_INVALID,
            severity: DiagnosticSeverities.ERROR,
            message: `Field '${field.qualifiedName.toString()}' has unrecognized valueType variant: '${String((valueType as { by?: unknown }).by)}'.`,
            location: {
              elementId: field.id,
              qualifiedName: field.qualifiedName,
              contextRef: field.contextRef,
              modelPath: Object.freeze(['dataFacet', 'fields', i.toString(), 'valueType', 'by']),
            },
          }),
        );
      }
    }

    return Object.freeze(diagnostics);
  },
});
