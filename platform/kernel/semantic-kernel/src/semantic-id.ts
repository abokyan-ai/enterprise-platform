/**
 * @file semantic-id.ts
 * @module @ecosystem/semantic-kernel
 *
 * Stable, platform-independent semantic identity.
 * A SemanticId is immutable and independent of any persistence, HTTP, or framework.
 *
 * Architecture: layer:kernel — ZERO external dependencies allowed.
 */

/**
 * A branded string type ensuring semantic identities are not mixed with arbitrary strings.
 */
export type SemanticId = string & { readonly _brand: 'SemanticId' };

/**
 * Creates a validated SemanticId from a raw string.
 * Format: `<namespace>:<localName>` e.g. `ecosystem.types:CustomerOrder`
 */
export function createSemanticId(raw: string): SemanticId {
  if (!raw || raw.trim().length === 0) {
    throw new SemanticKernelError(
      `SemanticId cannot be empty`,
      'INVALID_SEMANTIC_ID',
    );
  }
  return raw.trim() as SemanticId;
}

/**
 * Checks if a value is a valid SemanticId.
 */
export function isSemanticId(value: unknown): value is SemanticId {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Base error class for Semantic Kernel violations.
 */
export class SemanticKernelError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'SemanticKernelError';
    this.code = code;
  }
}
