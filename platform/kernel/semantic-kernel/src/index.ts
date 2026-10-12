/**
 * @public
 * Public API barrel for @ecosystem/semantic-kernel
 *
 * This is the ONLY entry point for consumers of this library.
 * Deep imports into src/ internals are prohibited.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero platform dependencies.
 */

// ─── Identity ─────────────────────────────────────────────────────────────────
export {
  type SemanticId,
  createSemanticId,
  isSemanticId,
  SemanticKernelError,
} from './semantic-id.js';

// ─── Element Contract ─────────────────────────────────────────────────────────
export {
  type SemanticElementKind,
  type SemanticElementMetadata,
  type SemanticElement,
  isSemanticElement,
} from './semantic-element.js';

// ─── Version Reference ────────────────────────────────────────────────────────
export {
  type VersionRef,
  parseVersion,
  formatVersion,
  compareVersions,
} from './version-ref.js';

// ─── Diagnostics ──────────────────────────────────────────────────────────────
export {
  type DiagnosticSeverity,
  type DiagnosticLocation,
  type Diagnostic,
  type DiagnosticResult,
  createDiagnosticResult,
  emptyDiagnosticResult,
} from './diagnostics.js';

/**
 * Platform metadata constant — read-only kernel identity.
 * This is NOT a runtime service; it is a static compile-time declaration.
 */
export const KERNEL_VERSION = '0.1.0' as const;
export const PLATFORM_NAME = 'Model-Driven Enterprise Ecosystem Platform' as const;
