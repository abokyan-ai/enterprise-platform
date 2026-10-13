/**
 * @file index.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: Type Validation Rules Module Barrel.
 *
 * Exports the authoritative validation entry point, rule contracts,
 * diagnostic codes, and result types.
 */

export {
  TYPE_VALIDATION_DIAGNOSTIC_CODES,
  type TypeValidationDiagnosticCode,
} from './type-validation-codes.js';

export {
  type TypeValidationInput,
  TypeValidationInputError,
  validateTypeValidationInput,
  isTypeValidationInput,
} from './type-validation-input.js';

export {
  type TypeValidationCoverage,
  type TypeValidationResult,
  type CreateTypeValidationResultParams,
  createTypeValidationResult,
} from './type-validation-result.js';

export { type TypeValidationRule } from './type-validation-rule.js';

export {
  validateTypeDefinition,
  type ValidateTypeDefinitionOptions,
} from './validate-type-definition.js';

export {
  STANDARD_TYPE_VALIDATION_RULES,
  typeClassificationRule,
  dataFacetOwnerRule,
  fieldOwnerRule,
  fieldUniquenessRule,
  fieldTypeRule,
  constraintAssociationRule,
  constraintApplicabilityRule,
  constraintCoherenceRule,
} from './rules/index.js';
