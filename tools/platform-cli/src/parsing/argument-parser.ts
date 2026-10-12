/**
 * @file argument-parser.ts
 * @module @ecosystem/platform-cli/parsing
 *
 * Safe argument parser distinguishing global flags, commands, and arguments.
 * Rejects unknown options with explicit diagnostics.
 */

export interface ParsedCliInvocation {
  readonly isHelp: boolean;
  readonly isVersion: boolean;
  readonly isJson: boolean;
  readonly isVerbose: boolean;
  readonly commandName?: string;
  readonly commandArgs: readonly string[];
  readonly unknownOptions: readonly string[];
}

export function parseCliArguments(rawArgs: readonly string[]): ParsedCliInvocation {
  let isHelp = false;
  let isVersion = false;
  let isJson = false;
  let isVerbose = false;
  let commandName: string | undefined = undefined;
  const commandArgs: string[] = [];
  const unknownOptions: string[] = [];

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];

    if (arg === '--help' || arg === '-h') {
      isHelp = true;
    } else if (arg === '--version' || arg === '-v') {
      isVersion = true;
    } else if (arg === '--json') {
      isJson = true;
    } else if (arg === '--verbose') {
      isVerbose = true;
    } else if (arg.startsWith('-')) {
      unknownOptions.push(arg);
    } else {
      if (commandName === undefined) {
        commandName = arg;
      } else {
        commandArgs.push(arg);
      }
    }
  }

  return {
    isHelp,
    isVersion,
    isJson,
    isVerbose,
    commandName,
    commandArgs,
    unknownOptions,
  };
}
