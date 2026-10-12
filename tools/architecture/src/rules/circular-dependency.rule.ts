/**
 * @file circular-dependency.rule.ts
 * @module @ecosystem/architecture-harness/rules
 *
 * Detects cyclic dependencies between workspace projects using deterministic DFS.
 * Normalizes cycle representations to prevent duplicate reporting of rotated cycle paths.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessFinding,
  ArchitectureFitnessRule,
} from '../contracts/harness.contract.js';

export class CircularDependencyRule implements ArchitectureFitnessRule {
  public readonly id = 'ARCH_CIRCULAR_DEPENDENCY';
  public readonly name = 'Circular Project Dependency Prevention';
  public readonly description =
    'Verifies that the workspace project graph forms a Directed Acyclic Graph (DAG) with zero cyclic dependencies.';
  public readonly category = 'GRAPH_TOPOLOGY';

  public evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[] {
    const findings: ArchitectureFitnessFinding[] = [];

    // Build project adjacency map from both graph evidence and source imports
    const adjacency: Record<string, Set<string>> = {};
    for (const project of context.evidence.projects) {
      adjacency[project.name] = new Set<string>();
    }

    // 1. Incorporate graph.dependencies if present
    for (const [source, targets] of Object.entries(context.evidence.dependencies)) {
      if (!adjacency[source]) {
        adjacency[source] = new Set<string>();
      }
      for (const target of targets) {
        if (target !== source && context.evidence.projects.some((p) => p.name === target)) {
          adjacency[source].add(target);
        }
      }
    }

    // 2. Incorporate discovered inter-workspace source imports
    for (const project of context.evidence.projects) {
      const imports = context.evidence.sourceImports[project.name] || [];
      for (const imp of imports) {
        if (imp.specifier.startsWith('@ecosystem/')) {
          const targetPkg = imp.specifier.replace('@ecosystem/', '').split('/')[0];
          if (targetPkg !== project.name && context.evidence.projects.some((p) => p.name === targetPkg)) {
            adjacency[project.name].add(targetPkg);
          }
        }
      }
    }

    // 3. DFS Cycle Detection
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const foundCycles: string[][] = [];

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = Array.from(adjacency[node] || []).sort();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          const cycleStartIndex = path.indexOf(neighbor);
          if (cycleStartIndex !== -1) {
            const rawCycle = path.slice(cycleStartIndex);
            foundCycles.push(rawCycle);
          }
        }
      }

      recStack.delete(node);
    };

    const sortedNodes = Object.keys(adjacency).sort();
    for (const node of sortedNodes) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    // 4. Normalize and deduplicate cycles
    const normalizedCycleSignatures = new Set<string>();

    for (const cycle of foundCycles) {
      const canonical = this.canonicalizeCycle(cycle);
      const signature = canonical.join(' -> ');

      if (!normalizedCycleSignatures.has(signature)) {
        normalizedCycleSignatures.add(signature);
        findings.push({
          ruleId: this.id,
          code: 'CIRCULAR_PROJECT_DEPENDENCY',
          severity: 'ERROR',
          sourceProject: canonical[0],
          targetDependency: `${signature} -> ${canonical[0]}`,
          sourceLocation: 'Workspace Dependency Graph',
          message: `Circular dependency detected: ${signature} -> ${canonical[0]}`,
          remediation:
            'Break cycle by inverting dependency, introducing an asynchronous event, or extracting a shared port contract.',
        });
      }
    }

    return Object.freeze(findings);
  }

  /**
   * Normalizes a cycle by rotating it so the lexicographically smallest element is first.
   */
  private canonicalizeCycle(cycle: readonly string[]): string[] {
    if (cycle.length <= 1) return [...cycle];
    let minIndex = 0;
    for (let i = 1; i < cycle.length; i++) {
      if (cycle[i].localeCompare(cycle[minIndex]) < 0) {
        minIndex = i;
      }
    }
    return [...cycle.slice(minIndex), ...cycle.slice(0, minIndex)];
  }
}
