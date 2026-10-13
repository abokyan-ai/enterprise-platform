/**
 * @file model-document-parser.ts
 * @module @ecosystem/model-core/authoring
 *
 * Syntax-level parser contract. The parser produces untrusted structured data;
 * structural validation remains the responsibility of MOD-01.
 */

export interface ModelDocumentParser {
  parse(content: string): unknown;
}
