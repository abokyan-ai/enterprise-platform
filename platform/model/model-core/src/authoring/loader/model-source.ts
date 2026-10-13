/**
 * @file model-source.ts
 * @module @ecosystem/model-core/authoring
 *
 * Explicit source representation consumed by the Model Loader.
 * The caller owns acquisition; the loader does not read files or the network.
 */

import type { ModelSourceFormat } from './model-source-format.js';

export interface ModelSource {
  readonly content: string;
  readonly format: ModelSourceFormat;
  readonly sourceId?: string;
}

export function isModelSource(value: unknown): value is ModelSource {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['content'] === 'string' &&
    typeof candidate['format'] === 'string' &&
    (candidate['sourceId'] === undefined || typeof candidate['sourceId'] === 'string')
  );
}

export function ensureModelSource(value: unknown): ModelSource {
  if (!isModelSource(value)) {
    throw new TypeError('ModelSource must be a non-null object with string content and format.');
  }

  if (value.content.trim().length === 0) {
    throw new TypeError('ModelSource content cannot be empty or whitespace-only.');
  }

  return Object.freeze({
    content: value.content,
    format: value.format,
    ...(value.sourceId !== undefined ? { sourceId: value.sourceId } : {}),
  });
}
