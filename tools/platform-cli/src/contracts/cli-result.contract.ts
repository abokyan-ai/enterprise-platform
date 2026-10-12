/**
 * @file cli-result.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Deterministic command execution result model.
 */

import type { PlatformCliDiagnostic } from './cli-diagnostic.contract.js';

export type PlatformCliCommandStatus = 'SUCCEEDED' | 'FAILED' | 'INCOMPLETE';

export interface PlatformCliCommandResult {
  readonly status: PlatformCliCommandStatus;
  readonly exitCode: number;
  readonly output?: string;
  readonly diagnostics: readonly PlatformCliDiagnostic[];
  readonly data?: unknown;
}
