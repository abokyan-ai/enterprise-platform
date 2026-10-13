/**
 * @file index.ts
 * @module @ecosystem/model-core/validation/rules
 *
 * Rules barrel and canonical rule suite for Type Validation.
 *
 * Deterministic Execution Order:
 * 1. TypeClassificationRule — Base element classification check.
 * 2. DataFacetOwnerRule — DataFacet owner identity and exact version consistency.
 * 3. FieldOwnerRule — Field ownership identity and exact version consistency.
 * 4. FieldUniquenessRule — Field identity and canonical qualified name uniqueness.
 * 5. FieldTypeRule — Value-type descriptor structure and reference context checks.
 * 6. ConstraintAssociationRule — Constraint owner matching and local field existence.
 * 7. ConstraintApplicabilityRule — Constraint primitive applicability and non-reference boundary.
 * 8. ConstraintCoherenceRule — Internal constraint set coherence and boundary contradictions.
 */

export { typeClassificationRule } from './type-classification-rule.js';
export { dataFacetOwnerRule } from './data-facet-owner-rule.js';
export { fieldOwnerRule } from './field-owner-rule.js';
export { fieldUniquenessRule } from './field-uniqueness-rule.js';
export { fieldTypeRule } from './field-type-rule.js';
export { constraintAssociationRule } from './constraint-association-rule.js';
export { constraintApplicabilityRule } from './constraint-applicability-rule.js';
export { constraintCoherenceRule } from './constraint-coherence-rule.js';

import { typeClassificationRule } from './type-classification-rule.js';
import { dataFacetOwnerRule } from './data-facet-owner-rule.js';
import { fieldOwnerRule } from './field-owner-rule.js';
import { fieldUniquenessRule } from './field-uniqueness-rule.js';
import { fieldTypeRule } from './field-type-rule.js';
import { constraintAssociationRule } from './constraint-association-rule.js';
import { constraintApplicabilityRule } from './constraint-applicability-rule.js';
import { constraintCoherenceRule } from './constraint-coherence-rule.js';
import { type TypeValidationRule } from '../type-validation-rule.js';

/**
 * The standard, immutable suite of Type Validation Rules executed in deterministic order.
 */
export const STANDARD_TYPE_VALIDATION_RULES: readonly TypeValidationRule[] = Object.freeze([
  typeClassificationRule,
  dataFacetOwnerRule,
  fieldOwnerRule,
  fieldUniquenessRule,
  fieldTypeRule,
  constraintAssociationRule,
  constraintApplicabilityRule,
  constraintCoherenceRule,
]);
