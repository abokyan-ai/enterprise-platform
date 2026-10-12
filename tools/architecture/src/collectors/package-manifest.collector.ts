/**
 * @file package-manifest.collector.ts
 * @module @ecosystem/architecture-harness/collectors
 *
 * Discovers and inspects package.json manifests across workspace projects.
 * Extracts public exports maps and declared package dependencies.
 * Pure TypeScript, read-only.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ArchitectureProjectNode } from '../contracts/harness.contract.js';

export interface DiscoveredPackageManifests {
  readonly packageExports: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly packageDependencies: Readonly<Record<string, Readonly<Record<string, string>>>>;
  readonly packageManifestsAvailable: boolean;
}

export class PackageManifestCollector {
  constructor(private readonly workspaceRoot: string) {}

  public collect(projects: readonly ArchitectureProjectNode[]): DiscoveredPackageManifests {
    const exportsMap: Record<string, Record<string, unknown>> = {};
    const depsMap: Record<string, Record<string, string>> = {};

    try {
      for (const project of projects) {
        const pkgJsonPath = join(project.root, 'package.json');
        if (existsSync(pkgJsonPath)) {
          try {
            const raw = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
            const pkgName = typeof raw.name === 'string' ? raw.name : project.name;

            if (raw.exports && typeof raw.exports === 'object') {
              exportsMap[pkgName] = raw.exports;
            } else {
              exportsMap[pkgName] = { '.': './src/index.ts' };
            }

            const declaredDeps: Record<string, string> = {
              ...(typeof raw.dependencies === 'object' ? raw.dependencies : {}),
              ...(typeof raw.peerDependencies === 'object' ? raw.peerDependencies : {}),
            };
            depsMap[pkgName] = declaredDeps;
          } catch {
            exportsMap[project.name] = {};
            depsMap[project.name] = {};
          }
        }
      }

      return {
        packageExports: Object.freeze(exportsMap),
        packageDependencies: Object.freeze(depsMap),
        packageManifestsAvailable: true,
      };
    } catch {
      return {
        packageExports: Object.freeze({}),
        packageDependencies: Object.freeze({}),
        packageManifestsAvailable: false,
      };
    }
  }
}
