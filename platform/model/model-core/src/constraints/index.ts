/**
 * @file index.ts
 * @module @ecosystem/model-core/constraints
 *
 * Internal barrel for the TYPE-04 field constraints subsystem.
 * Consumers must import from the root @ecosystem/model-core barrel.
 */

export {
  FieldConstraintKinds,
  type FieldConstraintKind,
  isFieldConstraintKind,
  STRING_LENGTH_METRIC,
  type StringLengthMetric,
} from './field-constraint-kind.js';

export {
  FIELD_CONSTRAINT_ERROR_CODES,
  type FieldConstraintErrorCode,
  FieldConstraintValidationError,
  type MinLengthConstraint,
  type MaxLengthConstraint,
  type MinValueConstraint,
  type MaxValueConstraint,
  type PrecisionScaleConstraint,
  type FieldConstraint,
  type FieldConstraintJSON,
  type FieldConstraintParseResult,
  type NumericBoundParams,
  createMinLengthConstraint,
  createMaxLengthConstraint,
  createMinValueConstraint,
  createMaxValueConstraint,
  createPrecisionScaleConstraint,
  isMinLengthConstraint,
  isMaxLengthConstraint,
  isMinValueConstraint,
  isMaxValueConstraint,
  isPrecisionScaleConstraint,
  isFieldConstraint,
  isConstraintApplicableToPrimitive,
  validateConstraintApplicability,
  equalsFieldConstraint,
  compareExactIntegers,
  compareExactDecimals,
  serializeFieldConstraint,
  parseFieldConstraint,
  tryParseFieldConstraint,
} from './field-constraint.js';

export {
  type FieldConstraintSet,
  type CreateFieldConstraintSetParams,
  type FieldConstraintSetJSON,
  type FieldConstraintSetParseResult,
  createFieldConstraintSet,
  createFieldConstraintSetForField,
  isFieldConstraintSet,
  sameFieldConstraintSet,
  serializeFieldConstraintSet,
  parseFieldConstraintSet,
  tryParseFieldConstraintSet,
} from './field-constraint-set.js';
