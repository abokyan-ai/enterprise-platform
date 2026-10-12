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

export {
  SemanticElementKinds,
  type SemanticElementKind,
  isSemanticElementKind,
  parseSemanticElementKind,
  SemanticElementKindValidationError,
  type SemanticElementKindErrorCode,
  SEMANTIC_ELEMENT_KIND_ERROR_CODES,
} from './semantic-element-kind.js';
