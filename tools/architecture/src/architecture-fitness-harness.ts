/**
 * @file architecture-fitness-harness.ts
 * @module @ecosystem/architecture-harness
 *
 * Primary orchestrator implementing the ArchitectureFitnessHarness contract.
 * Collects workspace evidence, evaluates architecture fitness rules deterministically,
 * tracks completeness, and generates human- and machine-readable reports.
 */

import type {
  ArchitectureFitnessFinding,
  ArchitectureFitnessHarness as IArchitectureFitnessHarness,
  ArchitectureFitnessReport,
  ArchitectureFitnessRequest,
  ArchitectureFitnessResult,
  ArchitectureFitnessStatus,
  ArchitectureReportFormat,
  ArchitectureVerificationCoverage,
} from './contracts/harness.contract.js';
import { EvidenceCollector } from './collectors/evidence.collector.js';
import { RuleRegistry } from './rules/rule-registry.js';
import { ConsoleReporter } from './reporting/console-reporter.js';
import { JsonReporter } from './reporting/json-reporter.js';

export class ArchitectureFitnessHarness implements IArchitectureFitnessHarness {
  public async evaluate(request: ArchitectureFitnessRequest): Promise<ArchitectureFitnessResult> {
    const collector = new EvidenceCollector(request.workspaceRoot);
    const context = collector.collectContext(request);

    const allRules = RuleRegistry.getAllRules();
    const supportedRuleIds = RuleRegistry.getSupportedRuleIds();

    const selectedIds = request.selectedRuleIds && request.selectedRuleIds.length > 0
      ? request.selectedRuleIds
      : supportedRuleIds;

    const evaluatedRuleIds: string[] = [];
    const uncompletedRuleIds: string[] = [];
    const findings: ArchitectureFitnessFinding[] = [];

    let unsupportedCount = 0;

    for (const ruleId of selectedIds) {
      const rule = RuleRegistry.getRule(ruleId);
      if (!rule) {
        unsupportedCount++;
        uncompletedRuleIds.push(ruleId);
        findings.push({
          ruleId,
          code: 'UNSUPPORTED_RULE',
          severity: 'ERROR',
          message: `Requested rule ID '${ruleId}' is not registered in the fitness harness.`,
          remediation: `Select from supported rules: [${supportedRuleIds.join(', ')}].`,
        });
        continue;
      }

      if (!context.evidence.projectGraphAvailable) {
        uncompletedRuleIds.push(ruleId);
        findings.push({
          ruleId: rule.id,
          code: 'EVIDENCE_COLLECTION_FAILED',
          severity: 'ERROR',
          message: `Cannot evaluate rule '${rule.id}': Project graph evidence was unavailable.`,
          remediation: 'Verify workspace integrity and ensure project.json files exist.',
        });
        continue;
      }

      evaluatedRuleIds.push(rule.id);
      const ruleFindings = rule.evaluate(context);
      findings.push(...ruleFindings);
    }

    // Sort findings deterministically
    const sortedFindings = this.sortFindings(findings);

    // Compute metrics
    const errorCount = sortedFindings.filter((f) => f.severity === 'ERROR').length;
    const warningCount = sortedFindings.filter((f) => f.severity === 'WARNING').length;
    const infoCount = sortedFindings.filter((f) => f.severity === 'INFO').length;

    const coverage: ArchitectureVerificationCoverage = {
      requestedRuleCount: selectedIds.length,
      evaluatedRuleCount: evaluatedRuleIds.length,
      skippedRuleCount: allRules.length - evaluatedRuleIds.length,
      unsupportedRuleCount: unsupportedCount,
      errorCount,
      warningCount,
      infoCount,
    };

    // Determine status with strict precedence: FAIL > INCOMPLETE > PASS
    let status: ArchitectureFitnessStatus;
    let exitCode: number;

    if (errorCount > 0) {
      status = 'FAIL';
      exitCode = 1;
    } else if (uncompletedRuleIds.length > 0 || !context.evidence.projectGraphAvailable) {
      status = 'INCOMPLETE';
      exitCode = 2;
    } else {
      status = 'PASS';
      exitCode = 0;
    }

    return Object.freeze({
      status,
      findings: Object.freeze(sortedFindings),
      coverage: Object.freeze(coverage),
      exitCode,
      evaluatedRuleIds: Object.freeze(evaluatedRuleIds.sort()),
      uncompletedRuleIds: Object.freeze(uncompletedRuleIds.sort()),
    });
  }

  public generateReport(
    result: ArchitectureFitnessResult,
    format: ArchitectureReportFormat = 'text'
  ): ArchitectureFitnessReport {
    const renderedText = ConsoleReporter.render(result);
    const renderedJson = format === 'json' ? JsonReporter.render(result) : undefined;

    return Object.freeze({
      result,
      renderedText,
      renderedJson,
    });
  }

  private sortFindings(findings: readonly ArchitectureFitnessFinding[]): ArchitectureFitnessFinding[] {
    const severityWeight: Record<string, number> = { ERROR: 0, WARNING: 1, INFO: 2 };

    return [...findings].sort((a, b) => {
      const sevDiff = (severityWeight[a.severity] ?? 9) - (severityWeight[b.severity] ?? 9);
      if (sevDiff !== 0) return sevDiff;

      const projA = a.sourceProject ?? '';
      const projB = b.sourceProject ?? '';
      const projDiff = projA.localeCompare(projB);
      if (projDiff !== 0) return projDiff;

      const ruleDiff = a.ruleId.localeCompare(b.ruleId);
      if (ruleDiff !== 0) return ruleDiff;

      const locA = a.sourceLocation ?? '';
      const locB = b.sourceLocation ?? '';
      return locA.localeCompare(locB);
    });
  }
}
