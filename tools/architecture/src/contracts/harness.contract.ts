/**
 * @file harness.contract.ts
 * @module @ecosystem/architecture-harness/contracts
 *
 * Core typed contracts for the Architecture Fitness Test Harness.
 * Adheres to AGENTS.md Constitution and ARC-03 specification.
 * Pure TypeScript, zero framework coupling.
 */

export type ArchitectureFindingSeverity = 'ERROR' | 'WARNING' | 'INFO';

export type ArchitectureFitnessStatus = 'PASS' | 'FAIL' | 'INCOMPLETE';

export type ArchitectureReportFormat = 'text' | 'json';

/**
 * An individual, structured finding emitted by an architecture fitness rule.
 * Deterministic and actionable.
 */
export interface ArchitectureFitnessFinding {
  /** Stable rule identifier (e.g. ARCH_KERNEL_INDEPENDENCE). */
  readonly ruleId: string;
  /** Stable machine finding code (e.g. FORBIDDEN_FRAMEWORK_DEPENDENCY). */
  readonly code: string;
  /** Severity of the finding. Architectural violations are ERROR. */
  readonly severity: ArchitectureFindingSeverity;
  /** Name of the project where the violation originated. */
  readonly sourceProject?: string;
  /** Target project or dependency causing the violation. */
  readonly targetDependency?: string;
  /** Repository-relative path to the offending file and line (e.g. platform/kernel/...:12). */
  readonly sourceLocation?: string;
  /** Human-readable explanation of why this violates the platform architecture. */
  readonly message: string;
  /** Actionable guidance on how to remediate the violation according to platform contracts. */
  readonly remediation: string;
}

/**
 * A normalized, discovered workspace project node.
 */
export interface ArchitectureProjectNode {
  readonly name: string;
  readonly root: string;
  readonly relativeRoot: string;
  readonly projectType: 'library' | 'application';
  readonly tags: readonly string[];
  readonly sourceRoot?: string;
  readonly manifestPath?: string;
  readonly declaredDependencies: readonly string[];
}

/**
 * Raw evidence collected from TypeScript source files within a project.
 */
export interface ArchitectureSourceImport {
  readonly specifier: string;
  readonly lineNumber: number;
  readonly isTypeOnly: boolean;
  readonly isDynamic: boolean;
  readonly rawStatement: string;
  readonly relativeFilePath: string;
}

/**
 * Discovered workspace evidence package.
 */
export interface ArchitectureWorkspaceEvidence {
  readonly projects: readonly ArchitectureProjectNode[];
  readonly dependencies: Readonly<Record<string, readonly string[]>>;
  readonly packageExports: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly sourceImports: Readonly<Record<string, readonly ArchitectureSourceImport[]>>;
  readonly projectGraphAvailable: boolean;
  readonly graphExtractionError?: string;
}

/**
 * Execution request provided to the harness.
 */
export interface ArchitectureFitnessRequest {
  /** Absolute path to workspace root. */
  readonly workspaceRoot: string;
  /** Optional subset of rule IDs to evaluate. If omitted, all rules evaluate. */
  readonly selectedRuleIds?: readonly string[];
  /** Desired output format. Defaults to 'text'. */
  readonly outputFormat?: ArchitectureReportFormat;
}

/**
 * Evaluation context passed to each architecture fitness rule.
 * Immutable snapshot of repository evidence and policy.
 */
export interface ArchitectureFitnessContext {
  readonly workspaceRoot: string;
  readonly evidence: ArchitectureWorkspaceEvidence;
  readonly request: ArchitectureFitnessRequest;
  /** Capability flags indicating which analyzers were successfully loaded. */
  readonly capabilities: {
    readonly nxGraphAvailable: boolean;
    readonly sourceAstAvailable: boolean;
    readonly packageManifestsAvailable: boolean;
    readonly eslintIntegrationAvailable: boolean;
  };
}

/**
 * Contract for an individual architecture fitness rule evaluator.
 */
export interface ArchitectureFitnessRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;

  /**
   * Evaluates the rule against the collected evidence context.
   * Returns deterministic list of findings. If required evidence is missing,
   * emits an INCOMPLETE finding rather than a silent pass.
   */
  evaluate(context: ArchitectureFitnessContext): readonly ArchitectureFitnessFinding[];
}

/**
 * Summary metrics of rule coverage and execution.
 */
export interface ArchitectureVerificationCoverage {
  readonly requestedRuleCount: number;
  readonly evaluatedRuleCount: number;
  readonly skippedRuleCount: number;
  readonly unsupportedRuleCount: number;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
}

/**
 * Aggregated result of architecture fitness evaluation.
 */
export interface ArchitectureFitnessResult {
  readonly status: ArchitectureFitnessStatus;
  readonly findings: readonly ArchitectureFitnessFinding[];
  readonly coverage: ArchitectureVerificationCoverage;
  readonly exitCode: number;
  readonly evaluatedRuleIds: readonly string[];
  readonly uncompletedRuleIds: readonly string[];
}

/**
 * Rendered human- and machine-readable report.
 */
export interface ArchitectureFitnessReport {
  readonly result: ArchitectureFitnessResult;
  readonly renderedText: string;
  readonly renderedJson?: string;
}

/**
 * Primary harness interface for architecture verification.
 */
export interface ArchitectureFitnessHarness {
  evaluate(request: ArchitectureFitnessRequest): Promise<ArchitectureFitnessResult>;
  generateReport(result: ArchitectureFitnessResult, format?: ArchitectureReportFormat): ArchitectureFitnessReport;
}
