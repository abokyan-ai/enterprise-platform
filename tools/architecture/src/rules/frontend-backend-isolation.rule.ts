/**
 * @file frontend-backend-isolation.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Verifies strict tier isolation:
 * - Frontend projects (scope:frontend / runtime:browser) cannot import backend modules (@nestjs/*, Node APIs).
 * - Backend projects (scope:backend / runtime:node) cannot import browser presentation modules (@angular/*, primeng).
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';

export class FrontendBackendIsolationRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_FRONTEND_BACKEND_ISOLATION';
  public readonly name = 'Frontend and Backend Tier Separation';
  public readonly description =
    'Guarantees strict separation between browser presentation layers and backend runtime execution layers.';
  public readonly category = 'TIER_ISOLATION';

  private static readonly NODE_ONLY_PATTERNS = [
    /^node:/,
    /^(fs|path|child_process|cluster|os|crypto|stream|net|http|https|zlib)$/,
  ];

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    for (const project of context.evidence.projects) {
      const isFrontend =
        project.tags.includes('scope:frontend') || project.tags.includes('runtime:browser');
      const isBackend =
        project.tags.includes('scope:backend') || project.tags.includes('runtime:node');

      const imports = context.evidence.sourceImports[project.name] || [];

      for (const imp of imports) {
        // Frontend cannot import backend or Node modules
        if (isFrontend) {
          if (imp.specifier.startsWith('@nestjs/')) {
            findings.push({
              ruleId: this.id,
              code: 'FORBIDDEN_CROSS_TIER_DEPENDENCY',
              severity: 'ERROR',
              sourceProject: project.name,
              targetDependency: imp.specifier,
              sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
              message: `Frontend project '${project.name}' cannot import backend module '${imp.specifier}'.`,
              remediation:
                'Communicate with backend exclusively via HTTP/REST contracts, never via direct backend module imports.',
            });
          }

          for (const nodePattern of FrontendBackendIsolationRule.NODE_ONLY_PATTERNS) {
            if (nodePattern.test(imp.specifier)) {
              findings.push({
                ruleId: this.id,
                code: 'FORBIDDEN_NODE_API_IN_FRONTEND',
                severity: 'ERROR',
                sourceProject: project.name,
                targetDependency: imp.specifier,
                sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
                message: `Browser/Frontend project '${project.name}' cannot import Node.js runtime API '${imp.specifier}'.`,
                remediation: 'Use browser-compatible APIs or delegate filesystem/OS operations to backend services.',
              });
              break;
            }
          }
        }

        // Backend cannot import Angular/PrimeNG presentation
        if (isBackend && !isFrontend) {
          if (imp.specifier.startsWith('@angular/') || imp.specifier.startsWith('primeng')) {
            findings.push({
              ruleId: this.id,
              code: 'FORBIDDEN_CROSS_TIER_DEPENDENCY',
              severity: 'ERROR',
              sourceProject: project.name,
              targetDependency: imp.specifier,
              sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
              message: `Backend project '${project.name}' cannot import frontend presentation package '${imp.specifier}'.`,
              remediation:
                'Keep backend logic headless. Frontend components must not be imported into backend services.',
            });
          }
        }
      }
    }

    return Object.freeze(findings);
  }
}
