/**
 * @file authoring-loader-index.ts
 * @module @ecosystem/model-core/authoring
 */

export {
  MODEL_SOURCE_FORMATS,
  type ModelSourceFormat,
  isModelSourceFormat,
  normalizeModelSourceFormat,
} from './model-source-format.js';

export {
  type ModelSource,
  isModelSource,
  ensureModelSource,
} from './model-source.js';
export {
  type ModelLoadRequest,
  isModelLoadRequest,
} from './model-load-request.js';
export {
  type ModelLoadResult,
  createModelLoadSuccess,
  createModelLoadFailure,
} from './model-load-result.js';
export {
  type ModelDocumentParser,
  type ModelDocumentParseResult,
} from './model-document-parser.js';
export { JsonModelParser } from './json-model-parser.js';
export { YamlModelParser } from './yaml-model-parser.js';
export {
  MODEL_LOADER_DIAGNOSTIC_CODES,
  type ModelLoaderDiagnosticCode,
  ModelLoader,
  modelLoader,
  loadModel,
} from './model-loader.js';

export {
  MODEL_SOURCE_MAX_LENGTH,
  MODEL_SOURCE_MAX_DEPTH,
  MODEL_SOURCE_MAX_NODES,
} from './parser-limits.js';
