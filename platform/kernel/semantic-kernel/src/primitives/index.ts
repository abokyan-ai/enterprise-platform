/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel/primitives
 *
 * Internal barrel for the SK-09 primitives subsystem.
 * Consumers must import from the root @ecosystem/semantic-kernel barrel.
 */

// ─── Primitive Type ───────────────────────────────────────────────────────────
export {
  PrimitiveTypes,
  type PrimitiveType,
  PRIMITIVE_TYPE_ERROR_CODES,
  type PrimitiveTypeErrorCode,
  PrimitiveTypeValidationError,
  isPrimitiveType,
  parsePrimitiveType,
} from './primitive-type.js';

// ─── Primitive Value ──────────────────────────────────────────────────────────
export {
  // Resource bounds
  STRING_MAX_LENGTH,
  INTEGER_MAX_DIGITS,
  DECIMAL_MAX_TOTAL_DIGITS,
  DECIMAL_MAX_FRACTION_DIGITS,

  // Error infrastructure
  PRIMITIVE_VALUE_ERROR_CODES,
  type PrimitiveValueErrorCode,
  PrimitiveValueValidationError,

  // Value type
  type PrimitiveValue,
  type PrimitiveValueJSON,
  type PrimitiveValidationResult,

  // Validation
  validatePrimitiveValue,

  // Construction
  createPrimitiveValue,
  createIntegerValueFromSafeNumber,

  // Equality
  equalsPrimitiveValue,

  // Serialization
  serializePrimitiveValue,

  // Deserialization
  parsePrimitiveValue,

  // Type narrowing helpers
  isStringValue,
  isBooleanValue,
  isIntegerValue,
  isDecimalValue,
  isDateValue,
  isTimeValue,
  isDatetimeValue,
} from './primitive-value.js';
