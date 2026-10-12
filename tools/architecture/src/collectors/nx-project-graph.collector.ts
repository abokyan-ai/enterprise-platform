/**
 * @file nx-project-graph.collector.ts
 * @module @ecosystem/architecture-harness/collectors
 *
 * Discovers and collects project nodes and dependencies across the Nx workspace.
 * Pure TypeScript, non-destructive, read-only inspection.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { ArchitectureProjectNode } from '../contracts/harness.contract.js';

export interface DiscoveredProjectGraph {
  readonly projects: readonly ArchitectureProjectNode[];
  readonly dependencies: Readonly<Record<string, readonly string[]>>;
  readonly projectGraphAvailable: boolean;
  readonly graphExtractionError?: string;
}

export class NxProjectGraphCollector {
  constructor(private readonly workspaceRoot: string) {}

  public collect(): DiscoveredProjectGraph {
    try {
      const projects = this.findProjects(this.workspaceRoot);

      if (projects.length === 0) {
        return {
          projects: [],
          dependencies: {},
          projectGraphAvailable: false,
          graphExtractionError: 'No project.json files discovered in workspace',
        };
      }

      // Sort deterministically by project name
      projects.sort((a, b) => a.name.localeCompare(b.name));

      // Attempt to read dependencies from graph.json if present
      const dependencies = this.loadDependenciesFromGraphJson(projects);

      return {
        projects,
        dependencies,
        projectGraphAvailable: true,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        projects: [],
        dependencies: {},
        projectGraphAvailable: false,
        graphExtractionError: `Failed to collect Nx project graph: ${message}`,
      };
    }
  }

  private findProjects(dir: string, projects: ArchitectureProjectNode[] = []): ArchitectureProjectNode[] {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (['node_modules', 'dist', '.git', 'tmp', '.nx', '.vscode'].includes(entry)) {
        continue;
      }
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        const projectJsonPath = join(fullPath, 'project.json');
        if (existsSync(projectJsonPath)) {
          try {
            const raw = JSON.parse(readFileSync(projectJsonPath, 'utf8'));
            const name = typeof raw.name === 'string' ? raw.name : entry;
            const projectType = raw.projectType === 'application' ? 'application' : 'library';
            const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : [];
            const relativeRoot = relative(this.workspaceRoot, fullPath).replace(/\\/g, '/');
            const sourceRoot = typeof raw.sourceRoot === 'string' ? raw.sourceRoot : undefined;
            const manifestPath = existsSync(join(fullPath, 'package.json'))
              ? relative(this.workspaceRoot, join(fullPath, 'package.json')).replace(/\\/g, '/')
              : undefined;

            projects.push({
              name,
              root: fullPath,
              relativeRoot,
              projectType,
              tags: Object.freeze(tags),
              sourceRoot,
              manifestPath,
              declaredDependencies: [],
            });
          } catch {
            // Unparseable project.json will be flagged during validation
          }
        } else {
          this.findProjects(fullPath, projects);
        }
      }
    }
    return projects;
  }

  private loadDependenciesFromGraphJson(
    projects: readonly ArchitectureProjectNode[]
  ): Record<string, readonly string[]> {
    const depsRecord: Record<string, string[]> = {};
    for (const p of projects) {
      depsRecord[p.name] = [];
    }

    const graphJsonPath = join(this.workspaceRoot, 'graph.json');
    if (existsSync(graphJsonPath)) {
      try {
        const content = JSON.parse(readFileSync(graphJsonPath, 'utf8'));
        const graphDeps = content.graph?.dependencies || {};
        for (const [source, edges] of Object.entries(graphDeps)) {
          if (Array.isArray(edges)) {
            depsRecord[source] = edges
              .map((e: { target?: string }) => e.target)
              .filter((t): t is string => typeof t === 'string');
          }
        }
      } catch {
        // Fall back to empty dependencies if graph.json is corrupt
      }
    }

    const readonlyDeps: Record<string, readonly string[]> = {};
    for (const [k, v] of Object.entries(depsRecord)) {
      readonlyDeps[k] = Object.freeze([...v].sort());
    }
    return Object.freeze(readonlyDeps);
  }
}
