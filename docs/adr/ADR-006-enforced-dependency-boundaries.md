# ADR-006: Enforced Architectural Dependency Boundaries & Governance

> **Status:** Accepted  
> **Date:** 2026-10-12  
> **Deciders:** Principal Software Architect, Nx Governance Engineer  
> **Consulted:** AGENTS.md Constitution, ARC-01, ARC-02  

---

## Context

In complex enterprise platforms, modular systems frequently degrade over time into tightly coupled monoliths or tangled dependency graphs. Developers inadvertently:
1. Import framework code (`@nestjs/*`, `@angular/*`, `primeng/*`) into core business logic and semantic models.
2. Introduce circular project dependencies (`A -> B -> A`).
3. Bypass package entry points through deep relative imports into private implementation files.
4. Use `import type` as an escape hatch to reference internal types from higher architectural layers.

To maintain a composable, model-driven enterprise platform over a multi-year horizon, dependency direction must be deterministic, automated, and mathematically verifiable across the repository.

---

## Decision

We establish an authoritative, multi-layered dependency boundary governance system across the TypeScript Monorepo:

1. **Tag-Based Dependency Enforcement:**
   - Every workspace project is classified across four orthogonal dimensions:
     - `layer:*` (`kernel`, `model`, `compiler`, `runtime`, `contracts`, `adapter`, `application`, `tool`)
     - `scope:*` (`platform`, `shared`, `backend`, `frontend`)
     - `runtime:*` (`universal`, `node`, `browser`)
     - `framework:*` (`none`, `nestjs`, `angular`)
   - Nx module boundary constraints (`@nx/enforce-module-boundaries`) enforce unidirectional dependencies based on these tags.

2. **Semantic Core Isolation:**
   - `Semantic Kernel` is pure TypeScript with ZERO platform or framework dependencies.
   - `Model Core` depends strictly and only on `Semantic Kernel`.
   - Framework implementations (`@nestjs/*`, `@angular/*`, `primeng/*`) are strictly quarantined within adapters and application hosts.

3. **Public API Contract Enforcement:**
   - Inter-package communication occurs exclusively through published package entry points declared in `package.json` `exports` and `index.ts`.
   - Deep imports into internal files (`@ecosystem/*/src/*`, `@ecosystem/*/dist/*`) and cross-package relative file paths are strictly prohibited via ESLint `no-restricted-imports` and the architecture fitness engine.

4. **Type-Only Import Equivalence:**
   - Type imports (`import type`) are treated as architectural dependencies identical to value imports. They cannot cross prohibited layer boundaries.

5. **Automated Fitness Verification Engine:**
   - A dedicated zero-dependency architecture validation engine (`tools/architecture/check-dependency-rules.mjs`) executes as part of `pnpm run test:architecture` to guarantee that all boundary rules, tag coverage, and cycle prohibitions are verified in CI/CD and local environments.

---

## Consequences

### Positive
- **Clean Core Preservation:** Business semantics remain 100% decoupled from web frameworks, databases, and UI libraries.
- **Independent Buildability:** Libraries can be compiled, typechecked, and packaged independently.
- **Zero Circularities:** Project cycles are impossible to introduce undetected.
- **Deterministic Refactoring:** Clear boundaries ensure internal refactoring inside a library does not break external consumers.

### Negative / Trade-offs
- **Strict Discipline Required:** Developers cannot create convenience imports across layers without explicit architectural review.
- **Contract Overhead:** Shared data contracts must be explicitly designed and placed in `platform-contracts` rather than shared ad-hoc.
