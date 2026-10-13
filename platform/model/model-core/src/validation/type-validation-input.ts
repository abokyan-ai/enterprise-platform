/**
 * @file type-validation-input.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: Narrow TypeValidationInput Contract and Input Validation.
 *
 * Defines the strongly typed, immutable input structure consumed by the
 * Type Validation Rules engine.
 *
 * Invariants:
 * 1. Narrow Contract: Encapsulates an authored TypeDefinition and optional
 *    supporting declarations (DataFacet, FieldConstraintSets).
 * 2. Immutable: All properties and arrays are strictly readonly.
 * 3. Trusted Boundary: Verifies that inputs conform to authentic Model Core contracts.
 * 4. Missing ≠ Null ≠ Value: Omitted optional declarations are undefined, not null.
 */

import { type TypeDefinition, isTypeDefinition } from '../types/type-definition.js';
import { type DataFacet, isDataFacet } from '../facets/data-facet.js';
import {
  type FieldConstraintSet,
  isFieldConstraintSet,
} from '../constraints/field-constraint-set.js';
import { SemanticKernelError } from '@ecosystem/semantic-kernel';

/**
 * Input contract for validating an authored TypeDefinition.
 */
export interface TypeValidationInput {
  /** The authored TypeDefinition under validation */
  readonly typeDefinition: TypeDefinition;

  /** Optional DataFacet declaring the type's structural fields */
  readonly dataFacet?: DataFacet;

  /** Optional FieldConstraintSets declaring field-level semantic restrictions */
  readonly fieldConstraints?: readonly FieldConstraintSet[];
}

/**
 * Dedicated error thrown when TypeValidationInput violates construction boundaries.
 */
export class TypeValidationInputError extends SemanticKernelError {
  constructor(message: string) {
    super(message, 'TYPE_VALIDATION_INVALID_INPUT');
    this.name = 'TypeValidationInputError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Validates and normalizes raw candidate inputs into a frozen TypeValidationInput.
 *
 * @param candidate Untrusted input object.
 * @returns Frozen, validated TypeValidationInput.
 * @throws TypeValidationInputError if input structure is malformed.
 */
export function validateTypeValidationInput(candidate: unknown): TypeValidationInput {
  if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new TypeValidationInputError('TypeValidationInput must be a non-null object.');
  }

  const record = candidate as Record<string, unknown>;

  if (!('typeDefinition' in record) || record['typeDefinition'] === undefined) {
    throw new TypeValidationInputError('TypeValidationInput requires a "typeDefinition" property.');
  }

  if (!isTypeDefinition(record['typeDefinition'])) {
    throw new TypeValidationInputError(
      'TypeValidationInput "typeDefinition" must be an authentic TypeDefinition instance.',
    );
  }

  const typeDefinition = record['typeDefinition'];

  let dataFacet: DataFacet | undefined;
  if ('dataFacet' in record && record['dataFacet'] !== undefined) {
    if (!isDataFacet(record['dataFacet'])) {
      throw new TypeValidationInputError(
        'TypeValidationInput "dataFacet" must be an authentic DataFacet instance when supplied.',
      );
    }
    dataFacet = record['dataFacet'];
  }

  let fieldConstraints: readonly FieldConstraintSet[] | undefined;
  if ('fieldConstraints' in record && record['fieldConstraints'] !== undefined) {
    const rawList = record['fieldConstraints'];
    if (!Array.isArray(rawList)) {
      throw new TypeValidationInputError(
        'TypeValidationInput "fieldConstraints" must be an array when supplied.',
      );
    }

    const validatedConstraints: FieldConstraintSet[] = [];
    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!isFieldConstraintSet(item)) {
        throw new TypeValidationInputError(
          `TypeValidationInput fieldConstraints[${i}] must be an authentic FieldConstraintSet instance.`,
        );
      }
      validatedConstraints.push(item);
    }
    fieldConstraints = Object.freeze(validatedConstraints);
  }

  return Object.freeze({
    typeDefinition,
    ...(dataFacet !== undefined ? { dataFacet } : {}),
    ...(fieldConstraints !== undefined ? { fieldConstraints } : {}),
  });
}

/**
 * Type guard verifying whether candidate conforms to TypeValidationInput.
 */
export function isTypeValidationInput(value: unknown): value is TypeValidationInput {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (!isTypeDefinition(record['typeDefinition'])) {
    return false;
  }
  if ('dataFacet' in record && record['dataFacet'] !== undefined) {
    if (!isDataFacet(record['dataFacet'])) return false;
  }
  if ('fieldConstraints' in record && record['fieldConstraints'] !== undefined) {
    if (!Array.isArray(record['fieldConstraints'])) return false;
    for (const item of record['fieldConstraints']) {
      if (!isFieldConstraintSet(item)) return false;
    }
  }
  return true;
}
