/**
 * @file index.ts
 * @module @ecosystem/semantic-kernel
 *
 * Public elements subsystem barrel.
 */

export {
  type SemanticElement,
  type CreateSemanticElementParams,
  isSemanticElement,
  createSemanticElement,
  SemanticElementValidationError,
  type SemanticElementErrorCode,
  SEMANTIC_ELEMENT_ERROR_CODES,
} from './semantic-element.js';
