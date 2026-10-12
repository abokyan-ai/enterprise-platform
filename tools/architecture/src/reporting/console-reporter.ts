/**
 * @file console-reporter.ts
 * @module @ecosystem/architecture-harness/reporting
 *
 * Formats ArchitectureFitnessResult into a human-readable CLI report.
 * Actionable, structured, and deterministic.
 */

import type {
  ArchitectureFitnessFinding,
  ArchitectureFitnessResult,
} from '../contracts/harness.contract.js';

export class ConsoleReporter {
  public static render(result: ArchitectureFitnessResult): string {
    const lines: string[] = [];

    lines.push('╔═══════════════════════════════════════════════════════════════════════════╗');
    lines.push('║ ARC-03 — Architecture Fitness Verification Harness                        ║');
    lines.push('║ Model-Driven Enterprise Ecosystem Platform Architecture                   ║');
    lines.push('╚═══════════════════════════════════════════════════════════════════════════╝\n');

    lines.push(`Final Status: ${result.status} (Exit Code: ${result.exitCode})`);
    lines.push(`Rules Evaluated:   ${result.coverage.evaluatedRuleCount} / ${result.coverage.requestedRuleCount}`);
    if (result.coverage.unsupportedRuleCount > 0) {
      lines.push(`Unsupported Rules: ${result.coverage.unsupportedRuleCount}`);
    }
    if (result.uncompletedRuleIds.length > 0) {
      lines.push(`Uncompleted Rules: [${result.uncompletedRuleIds.join(', ')}]`);
    }
    lines.push(`Findings Summary:  ${result.coverage.errorCount} Error(s), ${result.coverage.warningCount} Warning(s), ${result.coverage.infoCount} Info\n`);

    lines.push('── Evaluated Architecture Rules ──────────────────────────────────────────');
    for (const ruleId of result.evaluatedRuleIds) {
      const ruleFindings = result.findings.filter((f) => f.ruleId === ruleId);
      const icon = ruleFindings.length === 0 ? 'PASS' : 'FAIL';
      lines.push(`  [${icon}] ${ruleId.padEnd(35)} (${ruleFindings.length} issue(s))`);
    }
    lines.push('');

    if (result.findings.length > 0) {
      lines.push('── Architecture Findings ──────────────────────────────────────────────────');
      result.findings.forEach((f: ArchitectureFitnessFinding, idx: number) => {
        lines.push(`[Finding ${idx + 1}] [${f.severity}] ${f.ruleId} :: ${f.code}`);
        if (f.sourceProject) {
          lines.push(`  Source Project:    ${f.sourceProject}`);
        }
        if (f.targetDependency) {
          lines.push(`  Target Dependency: ${f.targetDependency}`);
        }
        if (f.sourceLocation) {
          lines.push(`  Location:          ${f.sourceLocation}`);
        }
        lines.push(`  Violation:         ${f.message}`);
        lines.push(`  Remediation:       ${f.remediation}\n`);
      });
    }

    lines.push('═══════════════════════════════════════════════════════════════════════════');
    if (result.status === 'PASS') {
      lines.push('✅ ARCHITECTURE VERIFICATION PASSED — All architectural invariants preserved.');
    } else if (result.status === 'FAIL') {
      lines.push(`❌ ARCHITECTURE VERIFICATION FAILED — ${result.coverage.errorCount} architectural violation(s) detected.`);
    } else {
      lines.push('⚠️ ARCHITECTURE VERIFICATION INCOMPLETE — Prerequisites or evidence missing.');
    }
    lines.push('═══════════════════════════════════════════════════════════════════════════\n');

    return lines.join('\n');
  }
}
