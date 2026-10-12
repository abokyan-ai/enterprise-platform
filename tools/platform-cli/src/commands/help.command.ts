/**
 * @file help.command.ts
 * @module @ecosystem/platform-cli/commands
 *
 * Built-in help command enumerating registered commands and global options.
 */

import type { PlatformCliCommand } from '../contracts/cli-command.contract.js';
import type { PlatformCliExecutionContext } from '../contracts/cli-context.contract.js';
import type { PlatformCliCommandResult } from '../contracts/cli-result.contract.js';
import { PlatformCliExitCode } from '../contracts/cli-exit-code.contract.js';
import type { PlatformCliCommandRegistry } from '../registry/command-registry.js';

export class HelpCommand implements PlatformCliCommand {
  public readonly name = 'help';
  public readonly description = 'Show CLI help information and list registered commands';
  public readonly usage = 'ecosystem help [command]';

  constructor(private readonly registry: PlatformCliCommandRegistry) {}

  public async execute(
    context: PlatformCliExecutionContext,
    args: readonly string[]
  ): Promise<PlatformCliCommandResult> {
    // If a specific command was requested for detailed help
    if (args.length > 0) {
      const targetName = args[0];
      const targetCommand = this.registry.get(targetName);

      if (!targetCommand) {
        const errorMsg = `Cannot display help for unknown command "${targetName}".`;
        return {
          status: 'FAILED',
          exitCode: PlatformCliExitCode.INVALID_USAGE,
          output: errorMsg,
          diagnostics: [
            {
              code: 'CLI_UNKNOWN_COMMAND',
              message: errorMsg,
              severity: 'error',
              commandName: targetName,
            },
          ],
        };
      }

      const lines = [
        `Command: ${targetCommand.name}`,
        `Description: ${targetCommand.description}`,
        `Usage: ${targetCommand.usage ?? `${context.config.binaryName} ${targetCommand.name}`}`,
      ];

      if (targetCommand.aliases && targetCommand.aliases.length > 0) {
        lines.push(`Aliases: ${targetCommand.aliases.join(', ')}`);
      }

      const text = lines.join('\n');
      return {
        status: 'SUCCEEDED',
        exitCode: PlatformCliExitCode.SUCCESS,
        output: text,
        diagnostics: [],
        data: {
          command: targetCommand.name,
          description: targetCommand.description,
          usage: targetCommand.usage,
          aliases: targetCommand.aliases,
        },
      };
    }

    // General CLI help
    const commands = this.registry.getAll();
    const lines = [
      `Model-Driven Enterprise Ecosystem Platform CLI (v${context.config.version})`,
      '',
      `Usage:`,
      `  ${context.config.binaryName} <command> [options]`,
      '',
      `Available Commands:`,
    ];

    const maxNameLen = Math.max(...commands.map((c) => c.name.length), 10);
    for (const cmd of commands) {
      lines.push(`  ${cmd.name.padEnd(maxNameLen + 2)} ${cmd.description}`);
    }

    lines.push('');
    lines.push(`Global Options:`);
    lines.push(`  -h, --help       Show CLI help information`);
    lines.push(`  -v, --version    Show CLI version`);
    lines.push(`      --json       Output response in structured JSON format`);
    lines.push(`      --verbose    Show verbose execution diagnostics`);

    const text = lines.join('\n');
    return {
      status: 'SUCCEEDED',
      exitCode: PlatformCliExitCode.SUCCESS,
      output: text,
      diagnostics: [],
      data: {
        binary: context.config.binaryName,
        version: context.config.version,
        commands: commands.map((c) => ({
          name: c.name,
          description: c.description,
          usage: c.usage,
        })),
      },
    };
  }
}
