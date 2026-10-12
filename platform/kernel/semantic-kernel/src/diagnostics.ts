/**
 * @file diagnostics.ts
 * @module @ecosystem/semantic-kernel
 *
 * Standard validation error, warning, diagnostic, and location reporting interfaces.
 * These are used by the Compiler and Model validation layers.
 *
 * Architecture: layer:kernel — Pure TypeScript, zero framework dependencies.
 */

/**
 * Severity level of a diagnostic message.
 */
export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

/**
 * Source location within a model artifact or file.
 */
export interface DiagnosticLocation {
  readonly file?: string;
  readonly line?: number;
  readonly column?: number;
  readonly length?: number;
}

/**
 * A single diagnostic message produced during model validation or compilation.
 */
export interface Diagnostic {
  readonly severity: DiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly location?: DiagnosticLocation;
  readonly source?: string;
}

/**
 * A collection of diagnostics produced by a validation or compilation pass.
 */
export interface DiagnosticResult {
  readonly diagnostics: ReadonlyArray<Diagnostic>;
  readonly hasErrors: boolean;
  readonly hasWarnings: boolean;
}

/**
 * Creates a DiagnosticResult from a list of diagnostics.
 */
export function createDiagnosticResult(diagnostics: Diagnostic[]): DiagnosticResult {
  return {
    diagnostics: Object.freeze([...diagnostics]),
    hasErrors: diagnostics.some((d) => d.severity === 'error'),
    hasWarnings: diagnostics.some((d) => d.severity === 'warning'),
  };
}

/**
 * Creates an empty (no-issue) DiagnosticResult.
 */
export function emptyDiagnosticResult(): DiagnosticResult {
  return {
    diagnostics: [],
    hasErrors: false,
    hasWarnings: false,
  };
}
