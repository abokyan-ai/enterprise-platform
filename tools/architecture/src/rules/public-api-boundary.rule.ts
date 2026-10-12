/**
 * @file public-api-boundary.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Enforces Public API discipline and eliminates deep internal package imports:
 * - Subpath imports into package internals (@ecosystem/<pkg>/src/*, @ecosystem/<pkg>/dist/*) are prohibited.
 * - Cross-project relative imports that escape package root boundaries are prohibited.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';

export class PublicApiBoundaryRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_PUBLIC_API_BOUNDARY';
  public readonly name = 'Public API & Deep Import Confinement';
  public readonly description =
    'Restricts cross-package consumption to declared public exports and forbids deep internal imports.';
  public readonly category = 'PUBLIC_API';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    for (const project of context.evidence.projects) {
      const imports = context.evidence.sourceImports[project.name] || [];

      for (const imp of imports) {
        // Check 1: Forbidden deep subpath imports: @ecosystem/<pkg>/src/* or dist/*
        if (/@ecosystem\/[^/]+\/(src|dist)\//.test(imp.specifier)) {
          findings.push({
            ruleId: this.id,
            code: 'FORBIDDEN_DEEP_IMPORT',
            severity: 'ERROR',
            sourceProject: project.name,
            targetDependency: imp.specifier,
            sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
            message: `Illegal deep import: Subpath import into internal source/dist tree is forbidden ('${imp.specifier}').`,
            remediation:
              'Import exclusively through the root package export or approved subpath entry points.',
          });
        }

        // Check 2: Forbidden cross-package relative traversal escaping project boundary
        if (
          imp.specifier.startsWith('../') &&
          (imp.specifier.includes('/platform/') ||
            imp.specifier.includes('/adapters/') ||
            imp.specifier.includes('/apps/'))
        ) {
          findings.push({
            ruleId: this.id,
            code: 'FORBIDDEN_CROSS_PACKAGE_RELATIVE_IMPORT',
            severity: 'ERROR',
            sourceProject: project.name,
            targetDependency: imp.specifier,
            sourceLocation: `${imp.relativeFilePath}:${imp.lineNumber}`,
            message: `Illegal cross-package relative import: Bypassing package boundary with relative path ('${imp.specifier}').`,
            remediation:
              'Use the published workspace package alias (e.g. @ecosystem/semantic-kernel) instead of relative paths.',
          });
        }
      }
    }

    return Object.freeze(findings);
  }
}
