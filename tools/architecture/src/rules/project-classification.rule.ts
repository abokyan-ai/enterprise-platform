/**
 * @file project-classification.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Evaluates that all projects declare valid, non-empty, and compliant architectural tags.
 * Rejects untagged projects, missing layer tags, conflicting runtimes, and escape hatch tags.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';
import { ARCHITECTURE_TAG_TAXONOMY } from '../contracts/policy.contract.js';

export class ProjectClassificationRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_PROJECT_CLASSIFICATION';
  public readonly name = 'Project Tag Taxonomy & Classification';
  public readonly description =
    'Verifies that every workspace project declares unambiguous, non-contradictory architectural tags.';
  public readonly category = 'CLASSIFICATION';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    if (!context.evidence.projectGraphAvailable) {
      findings.push({
        ruleId: this.id,
        code: 'EVIDENCE_UNAVAILABLE',
        severity: 'ERROR',
        message: context.evidence.graphExtractionError || 'Project graph evidence is unavailable.',
        remediation: 'Ensure Nx workspace project configuration and project.json files are present.',
      });
      return Object.freeze(findings);
    }

    for (const project of context.evidence.projects) {
      // 1. Check if project has tags
      if (!project.tags || project.tags.length === 0) {
        findings.push({
          ruleId: this.id,
          code: 'UNTAGGED_PROJECT',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Project '${project.name}' does not declare any architectural tags.`,
          remediation:
            'Assign required tags conforming to ARCH-02 taxonomy (e.g. layer:kernel, scope:platform, runtime:universal, framework:none).',
        });
        continue;
      }

      // 2. Check for required layer:* tag
      const layerTags = project.tags.filter((t) => t.startsWith('layer:'));
      if (layerTags.length === 0) {
        findings.push({
          ruleId: this.id,
          code: 'MISSING_LAYER_TAG',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Project '${project.name}' is missing a mandatory 'layer:*' tag.`,
          remediation: `Assign an approved layer tag: [${ARCHITECTURE_TAG_TAXONOMY.validLayers.join(', ')}].`,
        });
      } else if (layerTags.length > 1) {
        findings.push({
          ruleId: this.id,
          code: 'MULTIPLE_LAYER_TAGS',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Project '${project.name}' declares multiple layer tags: [${layerTags.join(', ')}].`,
          remediation: 'A project must belong to exactly one architectural layer.',
        });
      } else {
        const layerTag = layerTags[0];
        if (!ARCHITECTURE_TAG_TAXONOMY.validLayers.includes(layerTag)) {
          findings.push({
            ruleId: this.id,
            code: 'INVALID_LAYER_TAG',
            severity: 'ERROR',
            sourceProject: project.name,
            sourceLocation: `${project.relativeRoot}/project.json`,
            message: `Project '${project.name}' has unapproved layer tag '${layerTag}'.`,
            remediation: `Use an approved layer tag: [${ARCHITECTURE_TAG_TAXONOMY.validLayers.join(', ')}].`,
          });
        }
      }

      // 3. Check for conflicting runtime tags
      const runtimeTags = project.tags.filter((t) => t.startsWith('runtime:'));
      if (runtimeTags.length > 1) {
        findings.push({
          ruleId: this.id,
          code: 'CONFLICTING_RUNTIME_TAGS',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Project '${project.name}' declares mutually exclusive runtime tags: [${runtimeTags.join(', ')}].`,
          remediation: 'Choose a single runtime tag (runtime:universal, runtime:node, or runtime:browser).',
        });
      }

      // 4. Reject escape hatch tags
      const escapeTags = project.tags.filter((t) =>
        ['allow-all', 'layer:shared', 'scope:all', 'bypass-rules'].includes(t)
      );
      if (escapeTags.length > 0) {
        findings.push({
          ruleId: this.id,
          code: 'PROHIBITED_ESCAPE_TAG',
          severity: 'ERROR',
          sourceProject: project.name,
          sourceLocation: `${project.relativeRoot}/project.json`,
          message: `Project '${project.name}' declares prohibited bypass tag(s): [${escapeTags.join(', ')}].`,
          remediation: 'Remove generic escape tags; map the project into the explicit architectural taxonomy.',
        });
      }
    }

    return Object.freeze(findings);
  }
}
