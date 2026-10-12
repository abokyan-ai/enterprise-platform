/**
 * @file cli.ts
 * @module @ecosystem/platform-cli
 *
 * Core execution coordinator for the Platform CLI.
 * Wires configuration, outputs, registry, router, and built-in commands.
 */

import { PlatformCliCommandRegistry } from './registry/command-registry.js';
import { PlatformCliCommandRouter } from './router/command-router.js';
import { HelpCommand } from './commands/help.command.js';
import { VersionCommand } from './commands/version.command.js';
import { DefaultPlatformCliOutput } from './output/default-output.js';
import { resolveCliConfig } from './configuration/cli-config-resolver.js';
import { parseCliArguments } from './parsing/argument-parser.js';
import type { PlatformCliOutput } from './contracts/cli-output.contract.js';
import type { PlatformCliExecutionContext } from './contracts/cli-context.contract.js';

export async function runPlatformCli(
  rawArgs: readonly string[],
  customOutput?: PlatformCliOutput
): Promise<number> {
  const output = customOutput ?? new DefaultPlatformCliOutput();

  // Initial flag inspection for format / verbosity
  const parsed = parseCliArguments(rawArgs);
  const format = parsed.isJson ? 'json' : 'text';
  const verbose = parsed.isVerbose;

  const config = resolveCliConfig({
    format,
    verbose,
  });

  const registry = new PlatformCliCommandRegistry();

  // Explicit registration of built-in commands
  registry.register(new HelpCommand(registry));
  registry.register(new VersionCommand());

  const router = new PlatformCliCommandRouter(registry);

  const context: PlatformCliExecutionContext = {
    cwd: process.cwd(),
    output,
    config,
  };

  const result = await router.route(rawArgs, context);

  if (format === 'json') {
    const jsonOutput = JSON.stringify(
      {
        status: result.status,
        exitCode: result.exitCode,
        output: result.output,
        diagnostics: result.diagnostics,
        data: result.data,
      },
      null,
      2
    );
    if (result.exitCode === 0) {
      output.write(jsonOutput);
    } else {
      output.writeError(jsonOutput);
    }
  } else {
    if (result.output) {
      if (result.exitCode === 0) {
        output.write(result.output);
      } else {
        output.writeError(result.output);
      }
    }

    if (verbose && result.diagnostics.length > 0) {
      for (const diag of result.diagnostics) {
        output.writeError(
          `[${diag.severity.toUpperCase()}] ${diag.code}: ${diag.message}`
        );
      }
    }
  }

  process.exitCode = result.exitCode;
  return result.exitCode;
}
