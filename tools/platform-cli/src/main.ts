#!/usr/bin/env node
/**
 * @file main.ts
 * @module @ecosystem/platform-cli
 *
 * Executable entry point for the Platform CLI binary (`ecosystem`).
 * Handles top-level process arguments and uncaught error boundaries.
 */

import { runPlatformCli } from './cli.js';

async function main(): Promise<void> {
  try {
    const rawArgs = process.argv.slice(2);
    const exitCode = await runPlatformCli(rawArgs);
    process.exitCode = exitCode;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`FATAL CLI ERROR: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
