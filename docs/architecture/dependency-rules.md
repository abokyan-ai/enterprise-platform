# Architecture Dependency Rules & Boundary Policy

> **Status:** Active Authoritative Policy  
> **Milestone:** ARC-02 — Dependency Rules  
> **Authority:** Non-negotiable Platform Architecture Policy  
> **Target System:** Model-Driven Enterprise Ecosystem Platform  

---

## 1. Architecture Overview

The **Model-Driven Enterprise Ecosystem Platform** enforces a strict architectural principle:

> **Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

Business semantics remain decoupled from runtime engines, databases, and UI presentation frameworks:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Adapters                       │
│           (Angular, PrimeNG, Mobile, CLI, REST APIs)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Runtime Engine                        │
│         (Execution, Context, Actions, Events, State)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ consumes
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Semantic IR & Runtime Artifacts (Contracts)       │
└──────────────────────────────▲──────────────────────────────┘
                               │ produced by
┌──────────────────────────────┴──────────────────────────────┐
│                     Compiler Subsystem                      │
│         (Parsing, Validation, Lowering, IR Generation)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Canonical Model                          │
│               (Normalized Semantic Elements)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Semantic Meta-Model Kernel                  │
│       (Primitives, Identity, TypeRef, Diagnostics)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Actual Project Inventory

The existing workspace hosts three foundational libraries:

| Project Name | Path | Architectural Zone | Description |
|---|---|---|---|
| `semantic-kernel` | `platform/kernel/semantic-kernel` | `layer:kernel` | Pure TypeScript irreducible primitives, identity (`SemanticId`), diagnostic contracts. Zero dependencies. |
| `model-core` | `platform/model/model-core` | `layer:model` | Canonical semantic meta-model definitions (`TypeDefinition`, `FieldDefinition`). |
| `platform-contracts` | `adapters/shared/platform-contracts` | `layer:contracts` | Frontend-safe, framework-agnostic shared contracts between frontend and backend hosts. |

*(Note: Future architectural zones such as `compiler-core`, `runtime-core`, `experience-model`, `apps/api`, and `apps/studio` will be added in subsequent vertical slices following the same strict boundaries).*

---

## 3. Dependency Matrix

The allowed import directions are strictly unidirectional:

| Source Layer | Allowed Dependencies | Prohibited Dependencies |
|---|---|---|
| **Semantic Kernel** (`layer:kernel`) | *None* (Zero platform dependencies) | Model Core, Compiler, Runtime, Adapters, Apps, NestJS, Angular, PrimeNG, Node HTTP/DB |
| **Model Core** (`layer:model`) | `semantic-kernel` (`layer:kernel`) | Compiler, Runtime, Adapters, Apps, NestJS, Angular, PrimeNG, Database |
| **Compiler Core** (`layer:compiler`) | `model-core`, `semantic-kernel` | Runtime implementation, NestJS, Angular, PrimeNG, Database |
| **Runtime Core** (`layer:runtime`) | `platform-contracts`, `semantic-kernel` | Model authoring APIs, Compiler internals, NestJS, Angular, PrimeNG |
| **Platform Contracts** (`layer:contracts`) | *None* (Pure data contracts) | NestJS, Angular, PrimeNG, Node-only internals, Runtime internals |
| **NestJS Adapters** (`framework:nestjs`) | `platform-contracts`, platform ports | Angular, PrimeNG, Application internals |
| **Angular Adapters** (`framework:angular`) | `platform-contracts`, frontend ports | NestJS, Node-only modules, Server database drivers |

---

## 4. Nx Tag Taxonomy

Every project in the monorepo must declare an explicit, orthogonal set of tags across three dimensions:

### Layer Dimension (`layer:*`)
- `layer:kernel`: Irreducible semantic primitives (Pure TypeScript, zero dependencies).
- `layer:model`: Canonical model authoring definitions.
- `layer:compiler`: Compilation, validation, lowering, and Semantic IR generation.
- `layer:runtime`: Dynamic execution, dispatch, and state management.
- `layer:contracts`: Shared frontend-safe data transfer contracts.
- `layer:adapter`: Technology-specific ports and adapters.
- `layer:application`: Application hosts (`apps/api`, `apps/studio`).
- `layer:tool`: Workspace developer tooling and verification scripts.

### Scope Dimension (`scope:*`)
- `scope:platform`: Core platform modules.
- `scope:shared`: Contracts shared between client and server.
- `scope:backend`: Backend-only services.
- `scope:frontend`: Frontend-only presentation components.

### Runtime Environment Dimension (`runtime:*`)
- `runtime:universal`: Compatible with both Node.js and Browser environments.
- `runtime:node`: Requires Node.js runtime (server-only).
- `runtime:browser`: Requires Browser DOM / Web API runtime.

### Framework Dimension (`framework:*`)
- `framework:none`: Pure TypeScript (zero framework coupling).
- `framework:nestjs`: Coupled to NestJS dependency injection and decorators.
- `framework:angular`: Coupled to Angular framework and PrimeNG.

---

## 5. Framework Isolation Policies

1. **Platform Core Independence:**
   - Under no circumstances may `@nestjs/*`, `@angular/*`, or `primeng/*` be imported into `platform/**`.
   - Domain interfaces must never extend framework base classes.
   - Decorators from NestJS (`@Injectable()`, `@Controller()`) and Angular (`@Component()`, `@Inject()`) are strictly forbidden in platform packages.

2. **Frontend/Backend Separation:**
   - Angular applications and adapters must never import backend packages, NestJS controllers, server database drivers, or Node-only built-in modules (`fs`, `child_process`, `net`).
   - Communication between frontend and backend occurs exclusively over network boundaries (HTTP REST APIs) using frontend-safe data contracts defined in `@ecosystem/platform-contracts`.

---

## 6. Public API Rules & Package Exports

1. **Controlled Entry Points:**
   - Every library exports functionality exclusively through its root entry point (`index.ts`) as configured in `package.json` `exports`.
   - Example (Allowed):
     ```typescript
     import { SemanticId, createSemanticId } from '@ecosystem/semantic-kernel';
     ```

2. **Prohibited Deep Imports:**
   - Deep subpath imports into private source files are strictly forbidden:
     ```typescript
     // ❌ FORBIDDEN: Deep source file import
     import { SemanticId } from '@ecosystem/semantic-kernel/src/semantic-id';

     // ❌ FORBIDDEN: Deep dist import
     import { SemanticId } from '@ecosystem/semantic-kernel/dist/src/semantic-id';

     // ❌ FORBIDDEN: Relative path traverse into another package
     import { SemanticId } from '../../../platform/kernel/semantic-kernel/src/semantic-id';
     ```

3. **Package Manifest Specification:**
   - Each workspace package defines an explicit `exports` map:
     ```json
     "exports": {
       ".": {
         "types": "./src/index.d.ts",
         "import": "./src/index.js",
         "default": "./src/index.js"
       }
     }
     ```

---

## 7. Type-Only Import Policy

- **Constitutional Invariant:** In TypeScript, `import type` creates an architectural dependency.
- Type-only imports are subject to the **exact same dependency rules** as runtime value imports.
- An illegal dependency direction (such as `semantic-kernel` importing a type from `model-core`) cannot be bypassed using `import type`.
- Re-exporting types across layer boundaries must conform to the allowed direction.

---

## 8. Circular Dependency Policy

- Project-level circular dependencies (`A -> B -> A`) are strictly prohibited in the Nx project graph.
- Module-level circular dependencies within a project (circular barrel exports) are prohibited.
- Circularity must be resolved through Dependency Inversion (Ports and Adapters) or extracting shared contracts into lower-layer packages.

---

## 9. Enforcement Mechanisms & Tool Configuration

Architecture rules are enforced through multiple redundant verification layers:

1. **Nx Module Boundaries (`@nx/enforce-module-boundaries`):**
   - Configured in `eslint.config.mjs`.
   - Uses `depConstraints` mapping `sourceTag` to `onlyDependOnLibsWithTags` and `notDependOnLibsWithTags`.

2. **ESLint Restricted Imports (`no-restricted-imports`):**
   - Configured in `eslint.config.mjs`.
   - Blocks framework imports (`@nestjs/*`, `@angular/*`, `primeng/*`) in `platform/**`.
   - Blocks deep internal imports (`@ecosystem/*/src/*`, `@ecosystem/*/dist/*`).

3. **Architecture Fitness Test Engine (`tools/architecture/check-dependency-rules.mjs`):**
   - Standalone zero-dependency node script verifying tag coverage, import directions, deep imports, and Nx graph cycles.
   - Emits structured diagnostic reports identifying source, target, rule, location, and remediation.

4. **TypeScript Compiler Project References (`tsc -b`):**
   - Configured via `tsconfig.lib.json` project references.
   - Enforces strict compilation order and declaration type resolution.

---

## 10. Verification Commands

| Command | Purpose |
|---|---|
| `pnpm run build` | Builds all workspace libraries via Nx (`nx run-many --target=build --all`) |
| `pnpm run typecheck` | Typechecks all libraries with dependency ordering (`nx run-many --target=typecheck --all`) |
| `pnpm run test:architecture` | Executes the architecture fitness test engine |
| `pnpm run graph` | Generates and verifies the Nx project dependency graph |

---

## 11. Exception Procedure

1. Platform architecture rules are non-negotiable defaults.
2. If an exceptional circumstance requires a temporary boundary exemption:
   - The exemption must be documented in this file under "Active Exceptions".
   - It must specify: Source Project, Target Dependency, Technical Rationale, Architecture Owner, and Expiration / Removal Milestone.
   - It must be narrowly scoped to specific files, never applied globally (`allow-all` is prohibited).
   - Under no circumstances may `semantic-kernel` receive a framework dependency exemption.

---

## 12. Known Limitations & Future Horizons

1. **Compiler & Runtime Implementation:** Currently pending implementation in milestone VS-01 / VS-02. Their boundary contracts and tags are specified and reserved.
2. **ESLint Package Installation:** ESLint plugins are currently managed via the root flat config and will be executed fully once npm packages are linked. The standalone architecture engine (`tools/architecture/check-dependency-rules.mjs`) provides active, passing verification in all environments.
