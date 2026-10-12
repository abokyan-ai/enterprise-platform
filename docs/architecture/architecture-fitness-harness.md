# Architecture Fitness Test Harness & Verification Infrastructure

> **Document ID:** ARCH-SPEC-003  
> **Milestone:** ARC-03 — Architecture Fitness Test Harness  
> **Status:** Active Platform Specification  
> **Layer:** Tools & Governance (`layer:tool`)  
> **Target:** Model-Driven Enterprise Ecosystem Platform  

---

## 1. Executive Summary & Purpose

The **Architecture Fitness Test Harness** is an automated, deterministic verification system designed to evaluate and enforce the architectural constitution defined in `AGENTS.md` and the dependency rules established in `ARC-02`.

Rather than treating architecture documentation as passive prose, the harness provides executable developer tooling and governance infrastructure to:
- Inspect the physical and logical Nx workspace graph.
- Collect factual evidence from package manifests and TypeScript source ASTs.
- Evaluate declared architectural invariants against the authoritative ARC-02 policy.
- Detect illegal dependency directions, framework leakage into pure platform cores, deep internal imports, and graph cycles.
- Emit structured, actionable findings with deterministic ordering.
- Distinguish conclusively between `PASS`, `FAIL`, and `INCOMPLETE` verification states.

The harness adheres to the platform principle:  
**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

---

## 2. Architectural Boundary & Relationship to ARC-02

The harness maintains strict separation of concerns:
- **ARC-02 (Dependency Rules):** Defines the authoritative architectural policy, the layer dependency matrix, the project taxonomy tags, and ESLint boundaries. ARC-02 owns policy definition.
- **ARC-03 (Fitness Harness):** Evaluates compliance with ARC-02 policy by collecting real workspace evidence and executing fitness rules. ARC-03 **does not create a competing dependency policy**.
- **Platform Core Isolation:** The harness is strictly developer tooling (`layer:tool`). It does not run in production, does not instantiate NestJS application modules, does not bootstrap Angular Studio, and is **never imported by Platform Core**.

```text
Actual TypeScript Monorepo
        │
        ├── Nx Project Configurations (project.json)
        ├── pnpm Workspace Manifests (package.json)
        ├── Source Code Imports & Re-exports
        └── ARC-02 Authoritative Policy Projection
                    ↓
        ARC-03 Architecture Fitness Harness
                    │
                    ├── Evidence Collectors
                    │     ├── NxProjectGraphCollector
                    │     ├── PackageManifestCollector
                    │     └── SourceImportCollector
                    │
                    ├── Fitness Rules
                    │     ├── ARCH_PROJECT_CLASSIFICATION
                    │     ├── ARCH_DEPENDENCY_DIRECTION
                    │     ├── ARCH_FRAMEWORK_ISOLATION
                    │     ├── ARCH_FRONTEND_BACKEND_ISOLATION
                    │     ├── ARCH_PUBLIC_API_BOUNDARY
                    │     ├── ARCH_CIRCULAR_DEPENDENCY
                    │     └── ARCH_WORKSPACE_INTEGRITY
                    │
                    └── Report Generators
                          ├── ConsoleReporter (Human)
                          └── JsonReporter (Machine)
                    ↓
        Evaluation Outcome: PASS | FAIL | INCOMPLETE
```

---

## 3. Harness Architecture & Components

The harness is implemented in Pure TypeScript under `tools/architecture/` with zero runtime framework dependencies:

```text
tools/architecture/
├── project.json                      # Nx project definition (layer:tool)
├── package.json                      # Package manifest (@ecosystem/architecture-harness)
├── tsconfig.lib.json                 # Pure TypeScript compiler options
├── check-dependency-rules.mjs        # ARC-02 baseline validation script
└── src/
    ├── contracts/
    │   ├── harness.contract.ts       # Typed harness interfaces, findings, and statuses
    │   ├── policy.contract.ts        # Typed projection of ARC-02 policy matrix
    │   └── index.ts
    ├── collectors/
    │   ├── nx-project-graph.collector.ts   # Workspace project discovery and graph edges
    │   ├── package-manifest.collector.ts   # Manifest exports and package dependencies
    │   ├── source-import.collector.ts      # Static, dynamic, and type-only import parser
    │   ├── evidence.collector.ts           # Unified evidence snapshot aggregator
    │   └── index.ts
    ├── rules/
    │   ├── project-classification.rule.ts  # ARCH_PROJECT_CLASSIFICATION
    │   ├── dependency-direction.rule.ts    # ARCH_DEPENDENCY_DIRECTION
    │   ├── framework-isolation.rule.ts     # ARCH_FRAMEWORK_ISOLATION
    │   ├── frontend-backend-isolation.rule.ts # ARCH_FRONTEND_BACKEND_ISOLATION
    │   ├── public-api-boundary.rule.ts     # ARCH_PUBLIC_API_BOUNDARY
    │   ├── circular-dependency.rule.ts     # ARCH_CIRCULAR_DEPENDENCY
    │   ├── workspace-integrity.rule.ts     # ARCH_WORKSPACE_INTEGRITY
    │   ├── rule-registry.ts                # Static trusted rule registry
    │   └── index.ts
    ├── reporting/
    │   ├── console-reporter.ts       # Actionable human-readable terminal output
    │   ├── json-reporter.ts          # Structured schema-compliant JSON report
    │   └── index.ts
    ├── architecture-fitness-harness.ts # Primary orchestrator
    ├── cli.ts                        # CLI entry point with process exit codes
    └── index.ts                      # Programmatic barrel export
```

---

## 4. Supported Fitness Rules & IDs

The harness executes 7 deterministic architecture fitness rules managed via `RuleRegistry`:

| Rule ID | Category | Description | Primary Evidence Source |
|---|---|---|---|
| `ARCH_PROJECT_CLASSIFICATION` | `CLASSIFICATION` | Validates that every project has valid, non-empty, unambiguous tags (`layer:*`, `scope:*`, `runtime:*`, `framework:*`). Rejects untagged projects, conflicting runtimes, and escape hatch tags. | `project.json` files |
| `ARCH_DEPENDENCY_DIRECTION` | `DEPENDENCY_DIRECTION` | Enforces the unidirectional layer matrix: Kernel has zero upward dependencies; Model depends only on Kernel; Compiler depends on Model/Kernel; Runtime depends on Kernel/Contracts. Covers runtime and type-only imports. | Source imports + Nx projects |
| `ARCH_FRAMEWORK_ISOLATION` | `FRAMEWORK_ISOLATION` | Verifies that Pure TypeScript core (`layer:kernel`, `layer:model`, `layer:contracts`, `layer:compiler`, `layer:runtime`) has zero dependencies on NestJS, Angular, PrimeNG, Express, or ORMs. | Source imports |
| `ARCH_FRONTEND_BACKEND_ISOLATION` | `TIER_ISOLATION` | Prevents cross-tier leakage: frontend projects cannot import `@nestjs/*` or Node.js runtime APIs; backend projects cannot import `@angular/*` or PrimeNG presentation components. | Source imports + project tags |
| `ARCH_PUBLIC_API_BOUNDARY` | `PUBLIC_API` | Enforces public API boundaries: rejects deep subpath imports into internals (`@ecosystem/*/src/*`, `@ecosystem/*/dist/*`) and relative imports traversing across project roots. | Source imports |
| `ARCH_CIRCULAR_DEPENDENCY` | `GRAPH_TOPOLOGY` | Detects cycles between workspace projects using DFS cycle detection with canonical cycle rotation to prevent duplicate reports. | Nx graph / source edges |
| `ARCH_WORKSPACE_INTEGRITY` | `WORKSPACE_INTEGRITY` | Ensures all workspace project names are unique, project directory roots exist on disk, and package manifests are internally consistent. | Workspace filesystem + manifests |

---

## 5. Finding Structure & Determinism

All violations are captured as strongly-typed, immutable `ArchitectureFitnessFinding` objects:

```typescript
export interface ArchitectureFitnessFinding {
  readonly ruleId: string;
  readonly code: string;
  readonly severity: 'ERROR' | 'WARNING' | 'INFO';
  readonly sourceProject?: string;
  readonly targetDependency?: string;
  readonly sourceLocation?: string;
  readonly message: string;
  readonly remediation: string;
}
```

Findings are sorted deterministically before reporting using a 4-level sorting key:
1. `severity` (ERROR first, then WARNING, then INFO)
2. `sourceProject` (alphabetical ascending)
3. `ruleId` (alphabetical ascending)
4. `sourceLocation` (alphabetical ascending)

---

## 6. Result Status & Exit Code Semantics

The harness explicitly distinguishes between completion and compliance:

```text
       ┌───────────────────────────────┐
       │   Are there ERROR findings?   │
       └───────────────┬───────────────┘
                       │
              YES ─────┴───── NO
               │               │
               ▼               ▼
         Status: FAIL    ┌───────────────────────────────────┐
         Exit Code: 1    │ Is evidence missing or any rule   │
                         │ uncompleted / unsupported?        │
                         └─────────────┬─────────────────────┘
                                       │
                              YES ─────┴───── NO
                               │               │
                               ▼               ▼
                        Status: INCOMPLETE   Status: PASS
                        Exit Code: 2         Exit Code: 0
```

### The "No False PASS" Principle
A passing result (`PASS`, exit code 0) **requires 100% completion** of all requested mandatory rules on factual evidence. If evidence collection fails, if an unparseable project exists, or if an unsupported rule ID is requested, the harness reports `INCOMPLETE` (exit code 2) rather than a false `PASS`.

---

## 7. CLI Usage & Nx Integration

The harness provides a CLI entry point runnable via Node.js or Nx:

```bash
# Direct CLI invocation with strip-types
node --experimental-strip-types tools/architecture/src/cli.ts

# With JSON output
node --experimental-strip-types tools/architecture/src/cli.ts --format=json

# Evaluating specific rules
node --experimental-strip-types tools/architecture/src/cli.ts --rules=ARCH_PROJECT_CLASSIFICATION,ARCH_FRAMEWORK_ISOLATION

# Using npm/pnpm script
pnpm architecture:check

# Using Nx target
nx run architecture-harness:check
```

---

## 8. Positive & Negative Verification Strategy (Future Vitest Harness)

The harness core is designed as pure TypeScript functions decoupled from CLI process state. In future authorized testing milestones, Vitest fixtures can evaluate:
- **Positive Scenarios:** Legitimate Model-to-Kernel imports pass; approved framework usage in adapters passes.
- **Negative Scenarios:** Kernel importing NestJS triggers `FORBIDDEN_FRAMEWORK_DEPENDENCY`; cyclic dependencies trigger `CIRCULAR_PROJECT_DEPENDENCY`.
- **Incomplete Scenarios:** Missing workspace files trigger `INCOMPLETE`.

All scenarios for future test execution are cataloged in `test-archive/ARC-03/ARC-03-deferred-tests.md`.
