/**
 * @file framework-isolation.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Verifies framework isolation across Platform Core layers.
 * Pure TypeScript layers (Kernel, Model, Compiler, Runtime, Contracts) must NEVER
 * import NestJS, Angular, PrimeNG, Express, ORM, or database frameworks.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';
import { AUTHORITATIVE_LAYER_MATRIX } from '../contracts/policy.contract.js';

export class FrameworkIsolationRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_FRAMEWORK_ISOLATION';
  public readonly name = 'Framework Isolation in Platform Core';
  public readonly description =
    'Ensures that Pure TypeScript platform layers remain zero-dependency and isolated from web/backend frameworks.';
  public readonly category = 'FRAMEWORK_ISOLATION';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    for (const project of context.evidence.projects) {
      const layerTag = project.tags.find((t) => t.startsWith('layer:'));
      if (!layerTag) {
        continue;
      }

      const layerPolicy = AUTHORITATIVE_LAYER_MATRIX[layerTag];
      if (!layerPolicy || !layerPolicy.forbiddenFrameworks || layerPolicy.forbiddenFrameworks.length === 0) {
        continue;
      }

      const imports = context.evidence.sourceImports[project.name] || [];

      for (const imp of imports) {
        for (const framework of layerPolicy.forbiddenFrameworks) {
          if (framework.pattern.test(imp.specifier)) {
            findings.push({
              ruleId: this.id,
              code: 'FORBIDDEN_FRAMEWORK_DEPENDENCY',
              severity: 'ERROR',
              sourceProject: project.name,
              targetDependency: imp.specifier,
              sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
              message: `Forbidden framework dependency: '${framework.name}' imported inside '${project.name}' (${layerTag}).`,
              remediation:
                'Remove framework import. Platform Core must remain Pure TypeScript. Decouple logic via clean ports and adapters.',
            });
          }
        }
      }
    }

    return Object.freeze(findings);
  }
}
