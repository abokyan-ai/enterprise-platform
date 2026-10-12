/**
 * @file evidence.collector.ts
 * @module @ecosystem/architecture-harness/collectors
 *
 * Unified Evidence Collector coordinating project graph, manifests, and source imports.
 * Produces an immutable ArchitectureFitnessContext snapshot for rule evaluation.
 */

import type {
  ArchitectureFitnessContext,
  ArchitectureFitnessRequest,
  ArchitectureWorkspaceEvidence,
} from '../contracts/harness.contract.js';
import { NxProjectGraphCollector } from './nx-project-graph.collector.js';
import { PackageManifestCollector } from './package-manifest.collector.js';
import { SourceImportCollector } from './source-import.collector.js';

export class EvidenceCollector {
  constructor(private readonly workspaceRoot: string) {}

  public collectContext(request: ArchitectureFitnessRequest): ArchitectureFitnessContext {
    const graphCollector = new NxProjectGraphCollector(this.workspaceRoot);
    const graph = graphCollector.collect();

    const manifestCollector = new PackageManifestCollector(this.workspaceRoot);
    const manifests = manifestCollector.collect(graph.projects);

    const importCollector = new SourceImportCollector(this.workspaceRoot);
    const imports = importCollector.collect(graph.projects);

    const evidence: ArchitectureWorkspaceEvidence = {
      projects: graph.projects,
      dependencies: graph.dependencies,
      packageExports: manifests.packageExports,
      sourceImports: imports.sourceImports,
      projectGraphAvailable: graph.projectGraphAvailable,
      graphExtractionError: graph.graphExtractionError,
    };

    const context: ArchitectureFitnessContext = {
      workspaceRoot: this.workspaceRoot,
      evidence: Object.freeze(evidence),
      request,
      capabilities: {
        nxGraphAvailable: graph.projectGraphAvailable,
        sourceAstAvailable: imports.sourceAstAvailable,
        packageManifestsAvailable: manifests.packageManifestsAvailable,
        eslintIntegrationAvailable: false, // Programmatic ESLint reported accurately
      },
    };

    return Object.freeze(context);
  }
}
