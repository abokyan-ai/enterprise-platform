/**
 * @file rule-registry.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Fixed, trusted registry of architecture fitness rules.
 * Does not allow arbitrary dynamic plugin script loading.
 */

import type { ArchitectureFitnessRule } from '../contracts/harness.contract.js';
import { CircularDependencyRule } from './circular-dependency.rule.js';
import { DependencyDirectionRule } from './dependency-direction.rule.js';
import { FrameworkIsolationRule } from './framework-isolation.rule.js';
import { FrontendBackendIsolationRule } from './frontend-backend-isolation.rule.js';
import { ProjectClassificationRule } from './project-classification.rule.js';
import { PublicApiBoundaryRule } from './public-api-boundary.rule.js';
import { WorkspaceIntegrityRule } from './workspace-integrity.rule.js';

export class RuleRegistry {
  private static readonly RULES: readonly ArchitectureFitnessRule[] = Object.freeze([
    new ProjectClassificationRule(),
    new DependencyDirectionRule(),
    new FrameworkIsolationRule(),
    new FrontendBackendIsolationRule(),
    new PublicApiBoundaryRule(),
    new CircularDependencyRule(),
    new WorkspaceIntegrityRule(),
  ]);

  public static getAllRules(): readonly ArchitectureFitnessRule[] {
    return RuleRegistry.RULES;
  }

  public static getRule(id: string): ArchitectureFitnessRule | undefined {
    return RuleRegistry.RULES.find((r) => r.id === id);
  }

  public static getSupportedRuleIds(): readonly string[] {
    return Object.freeze(RuleRegistry.RULES.map((r) => r.id).sort());
  }
}
