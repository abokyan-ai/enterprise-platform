/**
 * @file cli-command.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Contract for extensible CLI command handlers.
 */

import type { PlatformCliExecutionContext } from './cli-context.contract.js';
import type { PlatformCliCommandResult } from './cli-result.contract.js';

export interface PlatformCliCommand {
  readonly name: string;
  readonly description: string;
  readonly usage?: string;
  readonly aliases?: readonly string[];

  execute(
    context: PlatformCliExecutionContext,
    args: readonly string[]
  ): Promise<PlatformCliCommandResult>;
}
