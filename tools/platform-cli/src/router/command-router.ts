/**
 * @file command-router.ts
 * @module @ecosystem/platform-cli/router
 *
 * Command router resolving flags, commands, argument validation,
 * and wrapping execution in a safe exception boundary.
 */

import type { PlatformCliCommandRegistry } from '../registry/command-registry.js';
import type { PlatformCliExecutionContext } from '../contracts/cli-context.contract.js';
import type { PlatformCliCommandResult } from '../contracts/cli-result.contract.js';
import { PlatformCliExitCode } from '../contracts/cli-exit-code.contract.js';
import { parseCliArguments } from '../parsing/argument-parser.js';

export class PlatformCliCommandRouter {
  constructor(private readonly registry: PlatformCliCommandRegistry) {}

  public async route(
    rawArgs: readonly string[],
    context: PlatformCliExecutionContext
  ): Promise<PlatformCliCommandResult> {
    const parsed = parseCliArguments(rawArgs);

    // 1. Check for unknown/unsupported options
    if (parsed.unknownOptions.length > 0) {
      const unknownStr = parsed.unknownOptions.join(', ');
      const message = `Unknown option(s): ${unknownStr}. Use "${context.config.binaryName} --help" to view supported options.`;

      return {
        status: 'FAILED',
        exitCode: PlatformCliExitCode.INVALID_USAGE,
        output: message,
        diagnostics: parsed.unknownOptions.map((opt) => ({
          code: 'CLI_UNKNOWN_OPTION',
          message: `Option "${opt}" is not recognized.`,
          severity: 'error',
          argument: opt,
        })),
      };
    }

    // 2. Global --help / -h flag
    if (parsed.isHelp) {
      const helpCmd = this.registry.get('help');
      if (helpCmd) {
        const targetArg = parsed.commandName ? [parsed.commandName] : [];
        return helpCmd.execute(context, targetArg);
      }
    }

    // 3. Global --version / -v flag
    if (parsed.isVersion) {
      const versionCmd = this.registry.get('version');
      if (versionCmd) {
        return versionCmd.execute(context, []);
      }
    }

    // 4. Default to help if no command was provided
    if (!parsed.commandName) {
      const helpCmd = this.registry.get('help');
      if (helpCmd) {
        return helpCmd.execute(context, []);
      }
      return {
        status: 'FAILED',
        exitCode: PlatformCliExitCode.INVALID_USAGE,
        output: `No command specified. Use "${context.config.binaryName} --help" to view available commands.`,
        diagnostics: [],
      };
    }

    // 5. Resolve command from registry
    const command = this.registry.get(parsed.commandName);
    if (!command) {
      const message = `Unknown command "${parsed.commandName}". Use "${context.config.binaryName} --help" to see available commands.`;
      return {
        status: 'FAILED',
        exitCode: PlatformCliExitCode.INVALID_USAGE,
        output: message,
        diagnostics: [
          {
            code: 'CLI_UNKNOWN_COMMAND',
            message,
            severity: 'error',
            commandName: parsed.commandName,
          },
        ],
      };
    }

    // 6. Safe execution boundary
    try {
      return await command.execute(context, parsed.commandArgs);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        status: 'FAILED',
        exitCode: PlatformCliExitCode.COMMAND_FAILURE,
        output: `Command "${command.name}" encountered an unexpected error: ${errorMsg}`,
        diagnostics: [
          {
            code: 'CLI_INTERNAL_ERROR',
            message: errorMsg,
            severity: 'error',
            commandName: command.name,
          },
        ],
      };
    }
  }
}
