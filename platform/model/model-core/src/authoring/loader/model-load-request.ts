/**
 * @file model-load-request.ts
 * @module @ecosystem/model-core/authoring
 *
 * Explicit input contract for ModelLoader.
 */

import type { ModelSource } from './model-source.js';

export interface ModelLoadRequest {
  readonly source: ModelSource;
}

export function isModelLoadRequest(value: unknown): value is ModelLoadRequest {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'source' in value;
}
