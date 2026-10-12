/**
 * @file dependency-direction.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Verifies that inter-project imports adhere strictly to the AUTHORITATIVE_LAYER_MATRIX.
 * Ensures Pure Semantic Core is never coupled to higher platform layers.
 * Type-only imports are subject to the exact same architectural restrictions as runtime imports.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';
import { AUTHORITATIVE_LAYER_MATRIX } from '../contracts/policy.contract.js';

export class DependencyDirectionRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_DEPENDENCY_DIRECTION';
  public readonly name = 'Layer Dependency Direction';
  public readonly description =
    'Enforces unidirectional dependency flow across platform layers according to ARC-02 policy.';
  public readonly category = 'DEPENDENCY_DIRECTION';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    if (!context.evidence.projectGraphAvailable) {
      findings.push({
        ruleId: this.id,
        code: 'EVIDENCE_UNAVAILABLE',
        severity: 'ERROR',
        message: 'Cannot evaluate dependency directions because project graph evidence is missing.',
        remediation: 'Ensure Nx workspace project configuration is intact.',
      });
      return Object.freeze(findings);
    }

    for (const project of context.evidence.projects) {
      const layerTag = project.tags.find((t) => t.startsWith('layer:'));
      if (!layerTag) {
        continue; // Handled by ProjectClassificationRule
      }

      const layerPolicy = AUTHORITATIVE_LAYER_MATRIX[layerTag];
      if (!layerPolicy) {
        continue;
      }

      const imports = context.evidence.sourceImports[project.name] || [];

      for (const imp of imports) {
        if (!imp.specifier.startsWith('@ecosystem/')) {
          continue;
        }

        // Extract target package name: @ecosystem/<name>[/...] -> <name>
        const targetPackage = imp.specifier.replace('@ecosystem/', '').split('/')[0];

        // Self-import is allowed or handled by deep import rule
        if (targetPackage === project.name) {
          continue;
        }

        // Find target project in evidence to determine its layer
        const targetProject = context.evidence.projects.find((p) => p.name === targetPackage);
        const targetLayer = targetProject?.tags.find((t) => t.startsWith('layer:'));

        const isAllowedByLayer = targetLayer && layerPolicy.allowedLayers.includes(targetLayer);
        const isAllowedByProject =
          layerPolicy.allowedProjects && layerPolicy.allowedProjects.includes(targetPackage);

        if (!isAllowedByLayer && !isAllowedByProject) {
          findings.push({
            ruleId: this.id,
            code: 'FORBIDDEN_DEPENDENCY_DIRECTION',
            severity: 'ERROR',
            sourceProject: project.name,
            targetDependency: imp.specifier,
            sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
            message: `Illegal dependency: Project '${project.name}' (${layerTag}) cannot import '${imp.specifier}' (${targetLayer || 'unknown layer'}).`,
            remediation: `Allowed layers for ${layerTag}: [${layerPolicy.allowedLayers.join(', ') || 'NONE'}]. Invert dependency or extract a shared contract.`,
          });
        }
      }
    }

    return Object.freeze(findings);
  }
}
