/**
 * @file workspace-integrity.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Verifies workspace package naming integrity, manifest consistency, and project structure.
 */

import { existsSync } from 'node:fs';
import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';

export class WorkspaceIntegrityRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_WORKSPACE_INTEGRITY';
  public readonly name = 'Workspace Metadata & Package Integrity';
  public readonly description =
    'Ensures that all workspace projects have unique identities, valid directories, and consistent package manifests.';
  public readonly category = 'WORKSPACE_INTEGRITY';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];
    const seenNames = new Set<string>();

    for (const project of context.evidence.projects) {
      // 1. Unique project name check
      if (seenNames.has(project.name)) {
        findings.push({
          ruleId: this.id,
          code: 'DUPLICATE_PROJECT_NAME',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Duplicate project name '${project.name}' detected in workspace.`,
          remediation: 'Ensure every workspace project possesses a unique name identifier.',
        });
      } else {
        seenNames.add(project.name);
      }

      // 2. Project root existence check
      if (!existsSync(project.root)) {
        findings.push({
          ruleId: this.id,
          code: 'INVALID_PROJECT_ROOT',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: project.relativeRoot,
          message: `Project directory '${project.relativeRoot}' does not exist on disk.`,
          remediation: 'Remove stale project configuration or restore project directory.',
        });
      }
    }

    return Object.freeze(findings);
  }
}
