/**
 * @file cli-diagnostic.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Lightweight, structured diagnostics for Platform CLI execution.
 */

export type PlatformCliDiagnosticSeverity = 'error' | 'warning' | 'info';

export type PlatformCliDiagnosticCode =
  | 'CLI_INVALID_ARGUMENT'
  | 'CLI_UNKNOWN_OPTION'
  | 'CLI_UNKNOWN_COMMAND'
  | 'CLI_DUPLICATE_COMMAND'
  | 'CLI_INVALID_CONFIGURATION'
  | 'CLI_WORKSPACE_NOT_FOUND'
  | 'CLI_COMMAND_FAILED'
  | 'CLI_UNSUPPORTED_CAPABILITY'
  | 'CLI_INTERNAL_ERROR';

export interface PlatformCliDiagnostic {
  readonly code: PlatformCliDiagnosticCode;
  readonly message: string;
  readonly severity: PlatformCliDiagnosticSeverity;
  readonly commandName?: string;
  readonly argument?: string;
}
