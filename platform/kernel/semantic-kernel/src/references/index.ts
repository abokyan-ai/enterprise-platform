/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel/references
 *
 * Internal barrel for the SK-08 references subsystem.
 * Consumers must import from the root @ecosystem/semantic-kernel barrel.
 */
export {
  // Error infrastructure
  ELEMENT_REF_ERROR_CODES,
  ElementRefValidationError,
  type ElementRefErrorCode,

  // Reference variant types
  type ElementIdRef,
  type ElementNameRef,
  type ElementRef,

  // JSON wire types
  type ElementIdRefJSON,
  type ElementNameRefJSON,
  type ElementRefJSON,

  // Factory functions
  createElementIdRef,
  createElementNameRef,

  // Equality
  equalsElementRef,

  // SK-07 conversion
  toElementVersionRef,

  // Serialization
  serializeElementRef,

  // Deserialization / parsing
  parseElementRef,

  // Type narrowing helpers
  isElementIdRef,
  isElementNameRef,

  // Diagnostic rendering (NOT canonical interchange)
  describeElementRef,
} from './element-ref.js';
