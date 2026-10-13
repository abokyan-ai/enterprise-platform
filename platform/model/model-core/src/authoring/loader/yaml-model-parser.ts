/**
 * @file yaml-model-parser.ts
 * @module @ecosystem/model-core/authoring
 *
 * Safe YAML parsing for explicitly supplied source content.
 */

import { parseAllDocuments } from 'yaml';
import type { ModelDocumentParser } from './model-document-parser.js';

export class YamlModelParser implements ModelDocumentParser {
  public parse(content: string): unknown {
    if (typeof content !== 'string') {
      throw new TypeError('YAML model content must be a string.');
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      throw new Error('YAML source content cannot be empty.');
    }

    const documents = parseAllDocuments(content, {
      uniqueKeys: true,
      merge: false,
      prettyErrors: true,
      strict: true,
    });

    if (documents.length !== 1) {
      throw new Error('Model source must contain exactly one YAML document.');
    }

    const document = documents[0];
    if (document.errors.length > 0) {
      const firstError = document.errors[0];
      throw new Error(`Invalid YAML source: ${firstError.message}`);
    }

    const value = document.toJS();
    if (value === undefined) {
      throw new Error('YAML source did not produce a document value.');
    }

    return value;
  }
}
