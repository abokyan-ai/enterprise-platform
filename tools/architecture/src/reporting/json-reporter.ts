/**
 * @file json-reporter.ts
 * @module @ecosystem/architecture-harness/reporting
 *
 * Formats ArchitectureFitnessResult into a machine-readable JSON structure.
 * Clean, typed, and deterministic.
 */

import type { ArchitectureFitnessResult } from '../contracts/harness.contract.js';

export class JsonReporter {
  public static render(result: ArchitectureFitnessResult): string {
    return JSON.stringify(
      {
        $schema: 'https://ecosystem.platform/schemas/architecture-fitness-report.json',
        status: result.status,
        exitCode: result.exitCode,
        coverage: result.coverage,
        evaluatedRuleIds: result.evaluatedRuleIds,
        uncompletedRuleIds: result.uncompletedRuleIds,
        findings: result.findings,
      },
      null,
      2
    );
  }
}
