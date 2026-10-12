#!/usr/bin/env node
/**
 * @file cli.ts
 * @module @ecosystem/architecture-harness
 *
 * Command-line entry point for the Architecture Fitness Verification Harness.
 * Evaluates architectural invariants and outputs deterministic reports.
 *
 * Exit Codes:
 * 0 → PASS (All rules evaluated and satisfied)
 * 1 → FAIL (Architectural violations detected)
 * 2 → INCOMPLETE / Configuration Error (Missing prerequisites or unsupported rules)
 */

import { resolve } from 'node:path';
import { ArchitectureFitnessHarness } from './architecture-fitness-harness.js';
import type {
  ArchitectureFitnessRequest,
  ArchitectureReportFormat,
} from './contracts/harness.contract.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  let workspaceRoot = resolve(process.cwd());
  let outputFormat: ArchitectureReportFormat = 'text';
  let selectedRuleIds: string[] | undefined = undefined;

  for (const arg of args) {
    if (arg.startsWith('--workspace=')) {
      workspaceRoot = resolve(arg.replace('--workspace=', ''));
    } else if (arg === '--json' || arg === '--format=json') {
      outputFormat = 'json';
    } else if (arg.startsWith('--rules=')) {
      selectedRuleIds = arg
        .replace('--rules=', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
ARC-03 Architecture Fitness Verification Harness CLI

Usage:
  node tools/architecture/src/cli.ts [options]

Options:
  --workspace=<path>    Path to workspace root (defaults to cwd)
  --rules=<ids>         Comma-separated list of rule IDs to evaluate
  --format=json|text    Output format (default: text)
  --json                Shorthand for --format=json
  --help, -h            Show this help message

Exit codes:
  0: PASS (All invariants satisfied)
  1: FAIL (Architectural violations detected)
  2: INCOMPLETE (Evidence missing or unsupported rules requested)
`);
      process.exit(0);
    }
  }

  const request: ArchitectureFitnessRequest = {
    workspaceRoot,
    selectedRuleIds,
    outputFormat,
  };

  try {
    const harness = new ArchitectureFitnessHarness();
    const result = await harness.evaluate(request);
    const report = harness.generateReport(result, outputFormat);

    if (outputFormat === 'json') {
      console.log(report.renderedJson ?? JSON.stringify(result, null, 2));
    } else {
      console.log(report.renderedText);
    }

    process.exit(result.exitCode);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`FATAL HARNESS ERROR: ${message}`);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error('Unhandled CLI Exception:', err);
  process.exit(2);
});
