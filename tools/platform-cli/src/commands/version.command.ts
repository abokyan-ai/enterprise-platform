/**
 * @file version.command.ts
 * @module @ecosystem/platform-cli/commands
 *
 * Built-in version command reporting package version metadata.
 */

import type { PlatformCliCommand } from '../contracts/cli-command.contract.js';
import type { PlatformCliExecutionContext } from '../contracts/cli-context.contract.js';
import type { PlatformCliCommandResult } from '../contracts/cli-result.contract.js';
import { PlatformCliExitCode } from '../contracts/cli-exit-code.contract.js';

export class VersionCommand implements PlatformCliCommand {
  public readonly name = 'version';
  public readonly description = 'Show CLI package version';
  public readonly usage = 'ecosystem version';

  public async execute(
    context: PlatformCliExecutionContext,
    _args: readonly string[]
  ): Promise<PlatformCliCommandResult> {
    const versionOutput = `${context.config.binaryName} v${context.config.version}`;

    return {
      status: 'SUCCEEDED',
      exitCode: PlatformCliExitCode.SUCCESS,
      output: versionOutput,
      diagnostics: [],
      data: {
        binary: context.config.binaryName,
        version: context.config.version,
      },
    };
  }
}
