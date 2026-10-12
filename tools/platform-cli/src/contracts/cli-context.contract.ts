/**
 * @file cli-context.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Operational context provided to command handlers during CLI execution.
 * Distinct from runtime ExecutionContext or semantic scope.
 */

import type { PlatformCliConfig } from './cli-config.contract.js';
import type { PlatformCliOutput } from './cli-output.contract.js';

export interface PlatformCliExecutionContext {
  readonly cwd: string;
  readonly output: PlatformCliOutput;
  readonly config: PlatformCliConfig;
}
