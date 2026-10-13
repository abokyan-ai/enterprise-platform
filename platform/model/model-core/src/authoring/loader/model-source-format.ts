/**
 * @file model-source-format.ts
 * @module @ecosystem/model-core/authoring
 *
 * Supported source formats for the Pure TypeScript Model Loader.
 */

export const MODEL_SOURCE_FORMATS = Object.freeze(['json', 'yaml'] as const);

export type ModelSourceFormat = (typeof MODEL_SOURCE_FORMATS)[number];

export function isModelSourceFormat(value: unknown): value is ModelSourceFormat {
  return typeof value === 'string' && (MODEL_SOURCE_FORMATS as readonly string[]).includes(value);
}

export function normalizeModelSourceFormat(value: unknown): ModelSourceFormat {
  if (typeof value !== 'string') {
    throw new TypeError('Model source format must be a string value.');
  }

  const normalized = value.trim().toLowerCase();
  switch (normalized) {
    case 'json':
      return 'json';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      throw new Error(`Unsupported model source format '${value}'. Supported formats are: json, yaml.`);
  }
}
