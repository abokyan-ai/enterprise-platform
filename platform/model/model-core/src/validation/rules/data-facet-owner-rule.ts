/**
 * @file data-facet-owner-rule.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * TYPE-06 Rule: DataFacet Owner Consistency Rule.
 *
 * Verifies that when a DataFacet is supplied, its ownerType matches the
 * TypeDefinition under validation in both stable identity (elementId) and
 * exact definition version (SemanticVersion.equalsExact).
 */

import {
  type Diagnostic,
  DiagnosticSeverities,
  createDiagnostic,
} from '@ecosystem/semantic-kernel';
import { type TypeValidationRule } from '../type-validation-rule.js';
import { type TypeValidationInput } from '../type-validation-input.js';
import { TYPE_VALIDATION_DIAGNOSTIC_CODES } from '../type-validation-codes.js';

export const dataFacetOwnerRule: TypeValidationRule = Object.freeze({
  id: 'RULE-DATA-FACET-OWNER',
  name: 'DataFacet Owner Consistency Rule',
  description:
    'Verifies that the supplied DataFacet belongs to the exact TypeDefinition snapshot being validated.',
  diagnosticCodes: Object.freeze([
    TYPE_VALIDATION_DIAGNOSTIC_CODES.DATA_FACET_OWNER_ID_MISMATCH,
    TYPE_VALIDATION_DIAGNOSTIC_CODES.DATA_FACET_OWNER_VERSION_MISMATCH,
  ]),

  validate(input: TypeValidationInput): readonly Diagnostic[] {
    const { typeDefinition, dataFacet } = input;

    if (dataFacet === undefined) {
      return Object.freeze([]);
    }

    const diagnostics: Diagnostic[] = [];

    // 1. Check stable identity (SemanticElementId)
    const facetOwnerId = dataFacet.ownerType.elementId;
    if (!facetOwnerId.equals(typeDefinition.id)) {
      diagnostics.push(
        createDiagnostic({
          code: TYPE_VALIDATION_DIAGNOSTIC_CODES.DATA_FACET_OWNER_ID_MISMATCH,
          severity: DiagnosticSeverities.ERROR,
          message: `DataFacet owner element ID '${facetOwnerId.toString()}' does not match TypeDefinition ID '${typeDefinition.id.toString()}'.`,
          location: {
            elementId: typeDefinition.id,
            qualifiedName: typeDefinition.qualifiedName,
            contextRef: typeDefinition.contextRef,
            modelPath: Object.freeze(['dataFacet', 'ownerType', 'elementId']),
          },
          details: {
            expectedOwnerId: typeDefinition.id.toString(),
            actualOwnerId: facetOwnerId.toString(),
          },
        }),
      );
    }

    // 2. Check exact definition version (SemanticVersion exact equality, including build metadata)
    const facetOwnerVersion = dataFacet.ownerType.version;
    if (!facetOwnerVersion.equals(typeDefinition.version)) {
      diagnostics.push(
        createDiagnostic({
          code: TYPE_VALIDATION_DIAGNOSTIC_CODES.DATA_FACET_OWNER_VERSION_MISMATCH,
          severity: DiagnosticSeverities.ERROR,
          message: `DataFacet owner version '${facetOwnerVersion.toString()}' does not match TypeDefinition version '${typeDefinition.version.toString()}'.`,
          location: {
            elementId: typeDefinition.id,
            qualifiedName: typeDefinition.qualifiedName,
            contextRef: typeDefinition.contextRef,
            modelPath: Object.freeze(['dataFacet', 'ownerType', 'version']),
          },
          details: {
            expectedOwnerVersion: typeDefinition.version.toString(),
            actualOwnerVersion: facetOwnerVersion.toString(),
          },
        }),
      );
    }

    return Object.freeze(diagnostics);
  },
});
