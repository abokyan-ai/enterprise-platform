# ADR-007: Executable Architecture Fitness Test Harness & Evidence-Based Verification

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Software Architect, Nx Architecture Governance Engineer  
> **Consulted:** AGENTS.md Constitution, ARC-01, ARC-02, ARC-03  

---

## Context

In ARC-02, we established the platform's architectural policy, layer dependency matrix, and tag taxonomy. However, passive policy documentation and standard linting tools alone are insufficient to guarantee architectural invariants across an evolving enterprise platform:
1. Standard linters do not understand whole-workspace project graph topology or deep cycles.
2. Standard test runners lack architectural awareness of layer boundaries, tier isolation (browser vs. node), and taxonomy completeness.
3. Silent failures can occur if checks pass simply because files or graph configurations failed to load.
4. Framework-based testing harnesses (e.g. relying on NestJS or Angular test runners) create circular coupling, pulling runtime frameworks into developer governance tools.

We need an extensible, deterministic, pure TypeScript architecture fitness verification harness that consumes actual repository evidence, evaluates invariants against ARC-02 policy, and produces actionable findings without introducing runtime framework bloat.

---

## Decision

We establish the **Architecture Fitness Test Harness** (`@ecosystem/architecture-harness`) under `tools/architecture`:

1. **Pure TypeScript Developer Tooling (`layer:tool`):**
   - The harness is implemented in Pure TypeScript with zero runtime framework dependencies.
   - It is strictly developer tooling; it never runs in production and is never imported by Platform Core (`layer:kernel`, `layer:model`, `layer:compiler`, `layer:runtime`).

2. **Decoupled 3-Stage Pipeline:**
   - **Evidence Collection:** `NxProjectGraphCollector`, `PackageManifestCollector`, and `SourceImportCollector` gather factual evidence from the filesystem, manifests, and source code.
   - **Pure Rule Evaluation:** Rules (`ARCH_PROJECT_CLASSIFICATION`, `ARCH_DEPENDENCY_DIRECTION`, `ARCH_FRAMEWORK_ISOLATION`, `ARCH_FRONTEND_BACKEND_ISOLATION`, `ARCH_PUBLIC_API_BOUNDARY`, `ARCH_CIRCULAR_DEPENDENCY`, `ARCH_WORKSPACE_INTEGRITY`) evaluate evidence deterministically against the authoritative ARC-02 policy.
   - **Structured Reporting:** `ConsoleReporter` and `JsonReporter` format results into actionable human- and machine-readable output.

3. **No False PASS Principle:**
   - The harness explicitly tracks completeness. If project graph evidence is missing or if requested rules cannot be evaluated, the harness returns `INCOMPLETE` (exit code 2) rather than a false `PASS`.

4. **Deterministic Finding Aggregation:**
   - Findings are sorted deterministically by severity (ERROR > WARNING > INFO), source project, rule ID, and source location.

5. **Reuse of ARC-02 Authoritative Policy:**
   - The harness projects the exact ARC-02 layer dependency matrix and tag taxonomy. It does not introduce a competing policy engine or separate policy DSL.

---

## Consequences

### Positive
- **Guaranteed Architecture Invariants:** Violations of layer boundaries, framework leakage into Pure TypeScript core, deep imports, and cycles are detected automatically.
- **Actionable Developer Feedback:** Violations include precise file line locations, violated architectural principles, and clear remediation guidance.
- **Future Testability:** The pure TypeScript evaluation engine can be directly exercised by future automated Vitest fixtures without filesystem mutation.
- **Zero Framework Leakage:** Developer tooling cannot leak NestJS or Angular dependencies into the core.

### Negative / Trade-offs
- **Tooling Maintenance:** Changes to ARC-02 policy require corresponding updates to the harness's policy projection.
- **AST Parsing Overhead:** Source import collection performs regex/AST parsing of TypeScript files across all workspace projects during full evaluations.
