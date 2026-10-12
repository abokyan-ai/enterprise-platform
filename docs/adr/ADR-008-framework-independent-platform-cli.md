# ADR-008: Framework-Independent Platform CLI as Developer Tooling

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Software Architect, TypeScript CLI Architect, Developer Experience Specialist  
> **Consulted:** AGENTS.md Constitution, ARC-01, ARC-02, ARC-03, ARC-04, ARC-05  

---

## Context

In ARC-04, the platform established application hosts:
1. `apps/api` hosting the NestJS Modular Monolith backend.
2. `apps/studio` hosting the Angular 19 Standalone presentation shell.

With ARC-05, we must introduce the official command-line interface (`ecosystem`) for developers and automated workflows. A critical architectural fork emerges:
- **Option A (Framework-Hosted CLI):** Bootstrap the CLI on top of NestJS (`NestFactory` or Nest Commander) or an Angular CLI wrapper.
- **Option B (Framework-Independent CLI Tooling):** Implement a dedicated, lightweight, pure Node.js/TypeScript CLI application located within the developer tooling boundary (`layer:tool`).

Option A would introduce heavy coupling: running simple commands like `ecosystem --help` or `ecosystem --version` would require resolving NestJS DI containers, initializing database connection providers, loading HTTP listeners, or pulling Angular client bundles. This violates the Clean-Core and Clean-Boundary principles established in `AGENTS.md`.

---

## Decision

We establish the **Platform CLI** (`@ecosystem/platform-cli`) under `tools/platform-cli` as a **framework-independent, pure Node.js/TypeScript developer tooling application**:

1. **Layer Classification (`layer:tool`):**
   - Classified as developer tooling with tags `["layer:tool", "scope:platform", "runtime:node", "framework:none"]`.
   - Never depends on or bootstraps NestJS, Angular, PrimeNG, Express, or database ORMs.
   - Platform Core packages (`layer:kernel`, `layer:model`, `layer:compiler`, `layer:runtime`) must **never depend on or import the CLI**.

2. **Explicit Command Registration:**
   - Command handlers implement the `PlatformCliCommand` interface and are registered deterministically in an in-memory `PlatformCliCommandRegistry`.
   - Dynamic directory scanning, untrusted arbitrary imports, and reflection-based command loading are strictly prohibited.

3. **No Fake Future Commands:**
   - Only real, operational commands (`help`, `version`) are registered in this milestone.
   - Future platform capabilities (compilation, runtime execution, model validation) must **never be simulated** through placeholder commands that print fake success messages.

4. **Dedicated Tooling Execution Context:**
   - The CLI defines `PlatformCliExecutionContext` strictly for operational developer tooling (`cwd`, `output`, `config`).
   - It is completely distinct from runtime business `ExecutionContext` (`RUN-05`) and carries zero business transaction authority.

5. **Centralized Exit Code Mapping:**
   - Process termination exit codes are strictly mapped at the executable entry boundary (`main.ts`):
     - `0`: Success
     - `1`: Command execution failure / internal error
     - `2`: Invalid usage / unknown options or commands
     - `3`: Missing prerequisite or unsupported capability
     - `4`: Configuration or workspace error

---

## Consequences

### Positive
- **Instant Startup:** Invoking `ecosystem --help` or `ecosystem --version` executes in milliseconds with zero framework overhead.
- **Strict Boundary Integrity:** Eliminates framework leakage into developer tooling, preserving ARC-02 and ARC-03 invariants.
- **Deterministic Predictability:** Alphabetical ordering, duplicate command rejection, and safe exception wrapping guarantee rock-solid stability in CI and terminal environments.
- **Clean Extensibility:** Future platform commands integrate seamlessly through explicit command adapters consuming public platform contracts.

### Negative / Trade-offs
- Commands that eventually require communication with the backend API must do so via HTTP client adapters rather than in-process direct service calls.
