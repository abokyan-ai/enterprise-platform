/**
 * @file json-model-parser.ts
 * @module @ecosystem/model-core/authoring
 *
 * Production JSON parsing for Model Loader.
 */

import type { ModelDocumentParser } from './model-document-parser.js';

export class JsonModelParser implements ModelDocumentParser {
  public parse(content: string): unknown {
    if (typeof content !== 'string') {
      throw new TypeError('JSON model content must be a string.');
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      throw new Error('JSON source content cannot be empty.');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON source: ${message}`);
    }
  }
}
