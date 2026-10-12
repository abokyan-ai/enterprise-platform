# ARC-02 — Dependency Rules
## Model-Driven Enterprise Ecosystem Platform Architecture
### A. Repository Architecture & Platform Foundation
### Mandatory Technology Stack: TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx

---

## 1. Role and Mission

You are acting as a:

**Principal Software Architect + TypeScript Monorepo Architect + NestJS Platform Architect + Angular Enterprise Architect + Nx Architecture Governance Engineer + Modular Systems Designer.**

Your assignment is:

**ARC-02 — Dependency Rules**

Implement a complete, enforceable dependency-governance system for the existing repository established by **ARC-01 — Repository Architecture**.

The architectural objective is:

> Enforce the platform's dependency direction at the repository, project, package, import, framework, and public-contract boundaries, ensuring that the Semantic Kernel remains independent, Model Core remains stable, Compiler and Runtime remain properly separated, and technology-specific frameworks remain confined to adapters and application hosts.

This task is not merely about adding ESLint configuration.

It must establish a coherent dependency policy that developers cannot accidentally bypass through TypeScript imports, path aliases, package subpaths, type-only imports, or indirect project dependencies.

Implement production-quality architecture enforcement inside the actual repository.

Do not rebuild ARC-01.

Do not create unrelated semantic features.

Do not create empty packages solely to demonstrate a dependency rule.

---

## 2. Authoritative Platform Vision

The project is:

**Model-Driven Enterprise Ecosystem Platform Architecture**

Expanded vision:

**A Composable, Model-Driven Enterprise Ecosystem Platform based on a Unified Semantic Meta-Model, with a Metadata-Compiled Runtime, Clean-Core Extension Model, and AI-Native Execution Architecture.**

The governing architectural principle is:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

Preserve the conceptual platform structure:

```text
Enterprise / Ecosystem Reality
            ↓
Semantic World
            ↓
Compilation / Build World
            ↓
Control Plane
            ↓
Runtime / Execution World
```

This diagram is a conceptual processing flow.

It does not define source-code dependency direction.

Define dependencies according to the explicit architecture dependency matrix.

---

## 3. Mandatory Technology Stack

Use the following technologies.

### Backend

- Node.js
- TypeScript
- NestJS
- NestJS REST APIs where required
- NestJS Dependency Injection at application/adapter boundaries
- Modular Monolith Architecture
- Clean Architecture
- Ports and Adapters

### Frontend

- Angular
- TypeScript
- PrimeNG
- PrimeIcons where required
- Angular Router
- Angular Standalone Components
- Angular Signals where appropriate
- Angular Reactive Forms
- Angular HttpClient

### Repository and Tooling

- pnpm Workspaces
- Nx
- ESLint
- Prettier
- TypeScript Project References where appropriate
- Vitest where appropriate
- Architecture Fitness Tests
- Nx Project Graph

Do not substitute:

- Python
- Django
- Django REST Framework
- React
- Vue
- Next.js
- Standalone Express backend
- An alternative monorepo manager

Preserve the tool versions established in ARC-01 unless a narrowly justified compatibility change is required.

---

## 4. Mandatory Architectural Rules

Enforce these rules:

1. Platform Core must remain Pure TypeScript.
2. Semantic Kernel must not depend on higher platform layers.
3. Model Core may depend on Semantic Kernel but not Compiler or Runtime implementations.
4. Compiler Core must not depend on Runtime implementations.
5. Runtime Core must not depend on Model Authoring APIs.
6. Experience semantics must not depend on Angular or PrimeNG.
7. NestJS must remain within backend hosts and adapters.
8. Angular and PrimeNG must remain within frontend hosts and adapters.
9. Frontend applications must not import backend implementation internals.
10. Infrastructure implementations must depend on stable ports, never the reverse.
11. Inter-package access must use approved public APIs.
12. Circular project dependencies must be prohibited.
13. Type-only imports must follow the same architectural rules as runtime imports.
14. Shared contracts must have explicit architectural ownership.
15. Dependency exceptions must be narrow, documented, and justified.

The central rule is:

> Inner semantic layers must not depend on infrastructure, frameworks, runtime engines, frontend technologies, databases, or deployment technologies.

---

## 5. Repository Inspection

Before implementation, inspect the existing repository.

Inspect:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
nx.json
tsconfig.base.json
eslint.config.mjs
.prettierrc.json
```

Inspect the actual project structure:

```text
apps/
platform/
adapters/
tools/
tests/
docs/
```

Identify:

- Existing Nx projects.
- pnpm workspace packages.
- Project names.
- Public package exports.
- Existing import aliases.
- TypeScript configuration.
- ESLint flat configuration.
- Existing architecture rules.
- Current project dependencies.
- Existing cycles.
- Framework leakage.
- Deep imports.
- Existing architecture-test infrastructure.

Do not assume every conceptual directory described in ARC-01 exists physically.

Implement rules for actual projects.

Document future conceptual zones separately.

---

## 6. Dependency Policy Source of Truth

Establish one authoritative architecture policy.

Recommended location:

```text
docs/architecture/dependency-rules.md
```

If this file already exists, update it.

Do not replace existing decisions without reviewing them.

Document:

- Architectural zones.
- Dependency direction.
- Allowed dependencies.
- Forbidden dependencies.
- Public APIs.
- Framework isolation.
- Nx tags.
- Deep-import rules.
- Type-only imports.
- Cycle restrictions.
- Enforcement commands.
- Exception procedure.

All automated enforcement mechanisms must implement this same policy.

Do not maintain contradictory policy definitions.

---

## 7. Architectural Zones

Use a controlled architectural classification.

Suggested project zones:

```text
semantic-kernel
model-core
compiler-core
runtime-core
experience-model
package-model
evolution
control-plane
backend-adapter
frontend-adapter
backend-application
frontend-application
frontend-safe-contract
developer-tooling
architecture-tests
```

Only assign zones to actual projects.

Do not create projects merely to populate the classification.

Each actual project must have one coherent architectural role.

If a project legitimately serves multiple roles, analyze whether its responsibilities should be separated.

Do not attach permissive tags to bypass dependency checks.

---

## 8. Dependency Matrix

Implement the following baseline:

| Project Layer | Allowed Dependencies |
|---|---|
| Semantic Kernel | No higher platform layers or framework implementations |
| Model Core | Semantic Kernel |
| Compiler Core | Model Core, Semantic Kernel, approved compiler contracts |
| Runtime Core | Stable compiled contracts, approved Kernel contracts |
| Experience Model | Approved semantic/model contracts |
| Package Model | Approved semantic/model contracts |
| Evolution | Explicit stable model/versioning contracts |
| Control Plane | Stable platform contracts and management ports |
| NestJS Adapters | NestJS and approved platform public APIs |
| Angular Adapters | Angular, PrimeNG and frontend-safe contracts |
| API Application | NestJS modules/adapters and approved composition APIs |
| Studio Application | Angular adapters and frontend-safe contracts |
| Developer Tools | Explicit required tooling and public platform APIs |

This is a baseline, not permission for arbitrary dependencies among projects in the same category.

Document all additional approved dependencies.

---

## 9. Semantic Kernel Isolation

The Semantic Kernel is the most stable platform foundation.

Prohibit dependencies on:

```text
Compiler
Runtime
Model Authoring Implementations
Control Plane Implementations
NestJS
Angular
PrimeNG
Database
ORM
HTTP Frameworks
Infrastructure Adapters
Application Hosts
```

Examples of forbidden imports:

```typescript
import { Injectable } from '@nestjs/common';
import { Component } from '@angular/core';
```

Do not permit these imports inside Semantic Kernel.

Also prohibit type-only imports from higher layers.

Semantic Kernel must remain independently buildable as a Pure TypeScript library.

---

## 10. Model Core Dependency Rules

Model Core may consume Semantic Kernel through its approved public exports.

Allowed:

```typescript
import type { SemanticElementId } from '@ecosystem/semantic-kernel';
```

Forbidden:

```typescript
import type { RuntimeModelRegistry } from '@ecosystem/runtime-core';
```

Also forbid:

- NestJS decorators.
- Angular components.
- PrimeNG.
- Database models.
- Compiler services.
- Runtime execution services.
- Application-host bootstrap modules.

The Model Core defines semantic meaning independently of implementation technologies.

---

## 11. Compiler Core Dependency Rules

Compiler Core may depend on:

```text
Semantic Kernel
Model Core
Compiler-Owned Pure TypeScript Contracts
Approved Pure TypeScript Utilities
```

It must not depend on:

```text
Runtime Engine Implementation
NestJS Controllers
Angular Components
PrimeNG
Database Adapters
HTTP DTOs
Application Hosts
```

The Compiler is responsible for transforming validated canonical models into supported intermediate representations and artifacts.

Runtime implementation details must not control compiler semantics.

---

## 12. Runtime Core Dependency Rules

Runtime Core must consume supported resolved artifact contracts.

It must not directly consume raw authoring metadata through authoring APIs.

Forbidden:

```text
Model Authoring Controllers
Authoring DTOs
Compiler Orchestration Services
NestJS Application Modules
Angular Components
PrimeNG Components
Database Adapter Internals
```

Where compiled contracts are shared between Compiler and Runtime, use explicit stable contract ownership.

Do not expose Compiler private implementation files to Runtime.

Do not create a shared god library.

---

## 13. Experience Model Independence

Experience Model represents technology-neutral presentation meaning.

Preserve the conceptual pipeline:

```text
Experience Definition
        ↓
Presentation IR
        ↓
Angular Renderer
        ↓
PrimeNG Components
```

Do not import Angular or PrimeNG into Experience Model.

Forbidden:

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
```

These dependencies belong to Angular presentation implementations.

---

## 14. NestJS Framework Boundary

NestJS may appear inside:

```text
apps/api
adapters/backend/nestjs
```

or equivalent actual backend hosting projects.

Permitted responsibilities:

- Controllers.
- Modules.
- Dependency Injection.
- HTTP DTO mapping.
- Authentication integration.
- Exception handling.
- Configuration composition.
- Application bootstrap.

Do not import NestJS decorators into Pure TypeScript Platform Core.

Do not require domain contracts to extend NestJS framework classes.

Do not make Platform Core aware of NestJS provider tokens defined in application hosts.

---

## 15. Angular Framework Boundary

Angular may appear inside:

```text
apps/studio
adapters/frontend/angular
```

or equivalent actual frontend projects.

PrimeNG belongs to these presentation layers.

Do not import Angular or PrimeNG inside:

```text
Semantic Kernel
Model Core
Compiler Core
Runtime Core
Experience Model
```

Angular Studio must not import backend-only packages, NestJS implementations, database clients, or Node-only runtime infrastructure.

Use explicit frontend-safe contracts.

---

## 16. Frontend-Safe Contracts

Shared frontend/backend contract packages must contain only suitable data contracts.

They must not depend on:

- NestJS.
- Angular implementation details.
- PrimeNG.
- Node-only modules.
- Database adapters.
- Compiler execution internals.
- Runtime execution internals.

Do not move all domain semantics into one frontend-safe package.

A shared contract package must have clear ownership.

**Shared does not mean Kernel.**

---

## 17. Ports and Adapters

Preserve dependency inversion.

```text
Application Service
        ↓
Port Interface

Infrastructure Adapter
        ── implements ──▶ Port Interface
```

Port interfaces belong to stable owning modules.

Infrastructure adapters may depend on ports.

Ports must not import adapters.

Prohibit reverse dependencies through both direct imports and transitive project dependencies where required by the architecture matrix.

Do not introduce actual database adapters during ARC-02.

---

## 18. Package Public APIs

Require every actual workspace library to expose controlled public entry points.

Allowed:

```typescript
import { SemanticElementId } from '@ecosystem/semantic-kernel';
```

Forbidden:

```typescript
import { SemanticElementId } from
  '../../../platform/kernel/semantic-kernel/src/internal/semantic-element-id';
```

Also forbid:

```typescript
import { SemanticElementId } from
  '@ecosystem/semantic-kernel/src/internal/semantic-element-id';
```

Use actual package names discovered in the repository.

Do not assume illustrative package names exist.

Do not export every implementation file merely to make imports pass.

---

## 19. Package Exports Enforcement

Inspect each actual package's `package.json`.

Use explicit `exports` maps where supported by the existing build system.

Example:

```json
{
  "name": "@ecosystem/semantic-kernel",
  "exports": {
    ".": "./dist/index.js"
  }
}
```

Adapt this example to the actual ESM/CJS/TypeScript configuration.

Ensure type declarations and runtime exports resolve correctly.

Do not add incompatible export paths.

Do not use wildcard exports that expose all internal source files.

Preserve appropriate public subpath exports when explicitly approved.

---

## 20. TypeScript Path Alias Restrictions

Inspect `tsconfig.base.json`.

Do not allow broad aliases that expose internal files.

Avoid:

```json
{
  "paths": {
    "@ecosystem/*": ["platform/*/src/*"]
  }
}
```

Prefer aliases to public package entry points only.

Do not treat path aliases as a replacement for architecture enforcement.

Check that aliases do not bypass Nx boundaries.

---

## 21. Type-Only Import Rules

Type-only imports remain architectural dependencies.

For example:

```typescript
import type { InternalRuntimeState }
  from '@ecosystem/runtime-core/internal';
```

must be rejected when the importing package is not authorized to consume that internal contract.

Apply rules to:

- `import`.
- `import type`.
- `export from`.
- `export type from`.
- Dynamic imports.
- Supported CommonJS imports.
- TypeScript import-equals declarations where present.

Do not limit checking to ordinary runtime imports.

---

## 22. Nx Tag Taxonomy

Configure tags for actual Nx projects.

Suggested taxonomy:

```text
layer:kernel
layer:model
layer:compiler
layer:runtime
layer:experience
layer:adapter
layer:application
layer:tool

runtime:universal
runtime:node
runtime:browser

framework:none
framework:nestjs
framework:angular
```

Add a narrowly scoped tag only when required.

Each tag must have documented semantics.

Do not use `shared` or `common` as unrestricted permission tags.

Do not create overlapping tags that contradict the dependency matrix.

---

## 23. Nx Module Boundary Enforcement

Configure the Nx module-boundary ESLint rule compatible with the installed Nx version.

Enforce:

- Kernel independence.
- Model-to-Kernel direction.
- Compiler-to-Model/Kernel direction.
- Runtime implementation separation.
- Experience Model framework independence.
- Backend/frontend separation.
- Infrastructure-to-port direction.
- Circular dependency restrictions.

Inspect the installed Nx API and configuration format.

Do not copy outdated configuration blindly.

Do not disable boundary checks globally.

---

## 24. ESLint Import Restrictions

Use compatible ESLint rules to cover boundaries not fully enforced by Nx.

Requirements:

- Block framework imports inside Platform Core.
- Block backend-only imports inside Angular.
- Block unapproved deep imports.
- Block forbidden workspace package references.
- Block unauthorized package subpaths.
- Account for type-only imports.

Prefer existing installed plugins where possible.

Avoid duplicate contradictory rules.

Do not add dependencies without architectural justification.

---

## 25. External Dependency Restrictions

Rules must cover external dependencies as well as Nx project edges.

Examples:

```text
Semantic Kernel → @nestjs/common : Forbidden
Model Core → @angular/core : Forbidden
Compiler Core → primeng : Forbidden
Experience Model → primeng : Forbidden
Angular Studio → @nestjs/core : Forbidden
Angular Studio → server database drivers : Forbidden
```

Also inspect Node built-in module usage in browser-safe packages.

Do not ban suitable pure TypeScript utilities indiscriminately.

---

## 26. Circular Dependency Prevention

Detect project-level circular dependencies.

Forbidden examples:

```text
kernel → model → kernel
compiler → runtime → compiler
platform → adapter → platform
```

Use Nx graph analysis and existing architecture tools.

Do not assume TypeScript compilation detects every cycle.

Distinguish project cycles from import cycles inside a single project.

Both matter, but their enforcement tools may differ.

---

## 27. Internal Import Cycle Detection

Inspect whether existing ESLint or architecture tooling detects intra-project cycles.

Where coverage is missing, add focused checks.

Prioritize:

- Circular barrel exports.
- Cyclic domain modules.
- Cyclic application services.
- Cyclic adapter dependencies.
- NestJS provider/module dependency cycles.

Do not add a heavyweight graph engine without need.

Avoid architecture exceptions hiding real cycles.

---

## 28. Transitive Dependency Risks

Analyze indirect dependencies.

Example:

```text
semantic-kernel
       ↓
utility-package
       ↓
NestJS
```

This violates framework independence even if Semantic Kernel never directly imports NestJS.

Where practical, enforce or audit relevant transitive dependency paths.

Document tool limitations accurately.

Do not claim complete transitive enforcement when only direct imports are inspected.

Do not introduce a full software supply-chain security system.

---

## 29. Architecture Policy Exceptions

Establish a documented exception process.

Each exception must identify:

- Source project.
- Target dependency.
- Reason.
- Architectural owner.
- Scope.
- Expected removal condition.

Do not permit:

```text
allow-all
ignore-all
disable architecture rules globally
```

Do not allow Semantic Kernel framework dependencies as exceptions.

Do not make exceptions permanent without review.

Prefer fixing the dependency direction.

---

## 30. Existing Violation Audit

Audit the current ARC-01 repository.

Identify:

- Forbidden imports.
- Deep imports.
- Circular projects.
- Framework leakage.
- Incorrect project tags.
- Missing public entry points.
- Incorrect package dependency declarations.
- Broad path aliases.
- Browser/server boundary violations.

Separate pre-existing violations from changes introduced during ARC-02.

Correct them where they fall within task scope.

Do not hide violations by weakening the dependency matrix.

---

## 31. Architecture Fitness Checks

Extend the existing architecture verification infrastructure.

Required scenarios:

1. Kernel importing NestJS must fail.
2. Kernel importing Runtime must fail.
3. Model importing Compiler must fail.
4. Compiler importing Runtime implementation must fail.
5. Runtime importing Model Authoring implementation must fail.
6. Experience Model importing PrimeNG must fail.
7. Angular Studio importing NestJS implementation must fail.
8. Cross-package internal deep import must fail.
9. Prohibited type-only import must fail.
10. Project-level cycle must fail.
11. Authorized public imports must succeed.

Use isolated fixtures or a safe validation approach.

Do not corrupt production source files to demonstrate failure.

Do not leave invalid test imports in production code.

---

## 32. Architecture Check Execution Policy

Preserve the current repository's established testing instructions.

If the project follows a deferred automated-testing policy:

- Do not create automated tests.
- Do not execute automated tests.
- Document scenarios in the required archive.
- Implement real architecture enforcement in configuration and tooling.
- Report tests as `NOT_RUN — DEFERRED`.

If ARC-01's executable-test policy remains authoritative and no later explicit restriction exists, follow that policy and record actual results.

Never claim a check passed without executing it.

Do not present lint-configuration presence as equivalent to a demonstrated negative fixture.

---

## 33. Architecture Check Commands

Provide working commands using pnpm and Nx.

Expected command surfaces include:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:architecture
```

Adapt scripts to actual projects and installed tools.

Do not add scripts that exit successfully without performing checks.

Do not reference nonexistent Nx targets.

Do not invent passing results.

---

## 34. Policy Validation Failures

Architecture checks must fail clearly.

For a forbidden import, diagnostics should identify:

```text
Source Project
Target Dependency
Violated Architectural Rule
Import Location
Suggested Public Contract / Allowed Direction
```

Use the available tooling output.

Do not build a redundant diagnostic framework merely to change the formatting.

Do not swallow process exit codes.

Do not downgrade forbidden dependencies to warnings unless the policy expressly permits it.

---

## 35. Project Tag Coverage

All existing relevant Nx projects must have sufficient tags to evaluate the dependency rules.

Identify untagged projects.

Do not silently exempt them.

Avoid assigning every project a generic `layer:shared` tag.

Document how a new project must receive tags before architecture validation can pass.

Enforce missing-tag detection where the installed tools support it or through a narrow supplemental check.

---

## 36. Public Contract Ownership

A public contract must have a clear owner.

Examples:

```text
Semantic Identity → Semantic Kernel
CanonicalModel → Model Core
Compiled Artifact Contract → Approved Compiler/Runtime Boundary
Runtime Definition → Runtime Core
HTTP DTO → NestJS Adapter
Presentation Model → Angular Adapter
```

Do not place all shared contracts in the Kernel.

Do not create a broad `@ecosystem/shared` package to bypass import restrictions.

Do not expose private implementation details as public types unnecessarily.

---

## 37. NestJS Application Composition

Preserve:

```text
apps/api
```

as the NestJS application host.

Application-level Dependency Injection must consume approved platform ports and public APIs.

Do not import platform internal source files directly.

Do not move NestJS Module decorators into pure domain packages.

Do not reorganize the application host unless necessary to correct a dependency violation.

---

## 38. Angular Studio Preservation

Preserve:

```text
apps/studio
```

as the Angular Studio application.

Maintain:

- Angular standalone setup.
- Angular Router.
- PrimeNG configuration.
- PrimeIcons where used.
- Existing Platform Information integration.
- Existing frontend-safe contracts.

Do not replace Angular with React or another framework.

Do not implement unrelated UI features.

---

## 39. ARC-01 Vertical Slice Preservation

Preserve:

```text
Angular Studio
       ↓ HTTP
NestJS API
       ↓
Application Service / Adapter
       ↓
Platform Public Contract
```

Architecture enforcement must permit this valid integration.

Do not force Angular to import NestJS Controller classes.

Do not duplicate semantic logic in the UI.

Do not replace real public contracts with internal deep imports.

---

## 40. Package Dependency Hygiene

Audit each actual workspace package.

Ensure imports match declared package dependencies.

Use appropriate pnpm workspace version references.

Do not rely on accidental dependency hoisting.

Do not add all platform packages as dependencies of every project.

Do not introduce phantom dependencies.

Preserve independent project buildability.

---

## 41. Nx Project Graph Audit

Inspect the actual Nx graph.

Record:

- Project nodes.
- Dependency edges.
- Project tags.
- Circular dependencies.
- Invalid edges.
- Projects lacking classification.
- Unexpected implicit dependencies.

Do not assume a visually clean graph guarantees deep-import safety.

Supplement with import restrictions where necessary.

Do not invent project nodes for future modules.

---

## 42. Build and TypeScript Consistency

Architecture configuration must not unnecessarily break TypeScript resolution.

Inspect:

```text
tsconfig.base.json
Project tsconfig files
Project references
Package exports
Build output configuration
Module resolution mode
```

Ensure public imports resolve consistently.

Avoid incompatible ESM/CJS assumptions.

Do not add TypeScript aliases pointing to private package internals.

Do not bypass errors with broad `skipLibCheck` or `any` conversions merely to satisfy imports.

---

## 43. Formatting and Configuration Quality

Preserve ESLint flat config if already established.

Use Prettier conventions.

Keep Nx and ESLint configuration readable and maintainable.

Avoid duplicated configuration blocks.

Do not use global unrestricted ignores.

Do not disable important rules repository-wide because of a single offending package.

Every exception must be narrowly justified.

---

## 44. Security and Framework Isolation

Dependency governance is also a security boundary.

Prevent:

- Node-only implementations entering browser bundles.
- Backend secrets becoming frontend imports.
- ORM and database packages leaking into Semantic Core.
- Privileged backend services being imported by UI packages.
- Framework-specific dependency injection leaking into domain contracts.

Do not claim architecture rules replace runtime authentication, authorization, or data-security controls.

They complement those systems.

---

## 45. Documentation

Update or create:

```text
docs/architecture/dependency-rules.md
```

Include:

1. Architecture overview.
2. Actual project inventory.
3. Dependency matrix.
4. Nx tags.
5. Framework restrictions.
6. Public API rules.
7. Deep-import examples.
8. Circular dependency policy.
9. Type-only import policy.
10. Frontend-safe boundary.
11. Tool enforcement.
12. Verification commands.
13. Exception procedure.
14. Known limitations.

Use actual repository names.

Do not document nonexistent packages as implemented.

---

## 46. Architecture Decision Records

Review the ARC-01 ADRs:

```text
ADR-001 — TypeScript Monorepo
ADR-002 — Modular Monolith First
ADR-003 — Pure TypeScript Semantic Core
ADR-004 — NestJS Backend Host
ADR-005 — Angular + PrimeNG Studio
ADR-006 — Enforced Dependency Boundaries
```

Update ADR-006 as needed.

Do not create a conflicting duplicate.

Add a new ADR only if ARC-02 introduces a genuinely new significant architecture decision.

Preserve existing documentation.

---

## 47. Deferred Test Archive

Maintain the same no-automated-testing workflow used in the other task prompts if that restriction is currently in force for this project.

Create one Markdown file:

```text
test-archive/
└── ARC-02/
    └── ARC-02-deferred-tests.md
```

Do not remove existing archives.

Do not create executable test files under a deferred-testing policy.

Each scenario must include:

```text
Test ID
Objective
Prerequisites
Input / Setup
Expected Result
Expected Diagnostics
Acceptance Criteria
Status
```

Use:

```text
ARC-02-T001
ARC-02-T002
ARC-02-T003
...
```

Set:

```text
NOT_RUN — DEFERRED
```

### Mandatory Scenario Categories

**Architecture Zones**

- Correct tagging.
- Missing tags.
- Conflicting tags.
- Unknown project zone.

**Kernel Independence**

- Forbidden NestJS import.
- Forbidden Angular import.
- Forbidden Runtime import.
- Allowed pure TypeScript dependency.

**Model Core**

- Allowed Kernel import.
- Forbidden Compiler import.
- Forbidden Runtime import.
- Forbidden database import.

**Compiler Core**

- Allowed Kernel/Model imports.
- Forbidden Runtime implementation import.
- Forbidden NestJS and Angular imports.

**Runtime Core**

- Approved compiled-contract import.
- Forbidden authoring API import.
- Forbidden database adapter import.
- Forbidden NestJS dependency.

**Experience Model**

- Allowed semantic contract.
- Forbidden Angular Component.
- Forbidden PrimeNG component.

**Frontend/Backend Isolation**

- Angular imports frontend-safe contracts.
- Angular imports NestJS.
- Angular imports server-only package.
- Node-only dependency enters browser package.

**Public APIs**

- Approved root export.
- Approved public subpath.
- Forbidden `/src/internal/` import.
- Cross-project relative deep import.
- Alias-based private import.

**Type-Only Imports**

- Allowed public type.
- Forbidden internal type.
- Forbidden cross-layer reexport.
- Dynamic import bypass.

**Cycles**

- Kernel/Model cycle.
- Compiler/Runtime cycle.
- Platform/Adapter cycle.
- Internal barrel cycle.

**Tool Integration**

- Nx boundary configuration.
- ESLint import restrictions.
- Package exports.
- Project graph.
- TypeScript resolution.
- pnpm workspace declarations.

**Verification Reliability**

- Forbidden import produces failure.
- Allowed import succeeds.
- Exit codes preserved.
- Fixtures isolated.
- No production source corruption.

**Architecture Preservation**

- Existing NestJS API.
- Existing Angular Studio.
- PrimeNG integration.
- ARC-01 vertical slice.
- Modular Monolith boundaries.

**Security**

- No browser import of backend secrets.
- No Semantic Core framework leakage.
- No internal implementation exposure.
- No global wildcard bypass.

Do not claim any deferred scenario has passed.

---

## 48. Test Execution Restrictions

If the project follows the mandatory deferred-test policy, do not execute:

```text
vitest
pnpm test
pnpm test:architecture
nx test
```

Do not create:

```text
*.spec.ts
*.test.ts
```

Do not execute manual test scripts disguised as static analysis.

Source inspection and non-test build, lint, and typecheck checks may be performed if permitted.

Record:

```text
New Tests Implemented: 0
Tests Executed: 0
```

Do not claim a forbidden-import fixture was successfully exercised if it was not executed.

If the repository explicitly requires executable architecture tests under ARC-01 and no deferred-testing restriction applies, preserve those requirements and report actual results honestly.

---

## 49. Execution Sequence

Perform:

1. Inspect the actual ARC-01 repository.
2. Inspect installed Nx, TypeScript, ESLint, Node, and pnpm versions.
3. Identify all actual workspace projects.
4. Analyze package dependency declarations.
5. Inspect Nx project tags.
6. Identify current forbidden dependencies.
7. Identify deep imports.
8. Identify framework leakage.
9. Inspect circular dependencies.
10. Define the final dependency policy.
11. Configure Nx enforcement.
12. Configure ESLint restrictions.
13. Correct package exports.
14. Restrict TypeScript aliases.
15. Add missing cycle detection where necessary.
16. Fix in-scope existing violations.
17. Update architecture documentation.
18. Reconcile ADR-006.
19. Document deferred verification scenarios.
20. Run permitted non-test static checks.
21. Report actual work and remaining gaps.

Do not implement unrelated platform tasks.

---

## 50. Acceptance Criteria

ARC-02 is complete when:

```text
[ ] ARC-01 repository is inspected
[ ] Mandatory TypeScript stack is preserved
[ ] NestJS remains backend host
[ ] Angular remains frontend framework
[ ] PrimeNG remains UI component library
[ ] pnpm + Nx remain monorepo tooling
[ ] Architectural dependency matrix is documented
[ ] Existing projects are classified correctly
[ ] Nx project tags are applied
[ ] Kernel independence is enforced
[ ] Model dependency direction is enforced
[ ] Compiler/Runtime boundaries are enforced
[ ] Experience Model remains framework-neutral
[ ] NestJS framework isolation is enforced
[ ] Angular/PrimeNG isolation is enforced
[ ] Frontend/backend imports are controlled
[ ] Type-only imports obey rules
[ ] Cross-package internal imports are restricted
[ ] Public package exports are controlled
[ ] TypeScript aliases do not expose internals
[ ] Circular dependency checks exist
[ ] Existing violations are identified
[ ] In-scope violations are corrected
[ ] No unrestricted architecture exemptions exist
[ ] Existing ARC-01 applications are preserved
[ ] ARC-01 vertical slice is preserved
[ ] Existing PrimeNG integration is preserved
[ ] Documentation is updated
[ ] ADR-006 is reconciled
[ ] Required deferred scenarios are documented if testing is deferred
[ ] Verification outcomes are reported accurately
[ ] No unrelated modules are implemented
```

Do not mark checks as passed unless they were actually verified.

---

## 51. Required Completion Report

Provide the final implementation report with the following sections.

### Implemented Architecture Rules

Describe the policies actually enforced.

### Actual Project Inventory

List actual project names, paths, tags, and allowed dependencies.

### Dependency Matrix

Show final allowed import directions.

### Tool Configuration

Explain Nx, ESLint, TypeScript, and package-export changes.

### Violations Found

List forbidden imports, cycles, deep imports, and other violations discovered.

### Violations Fixed

Describe concrete changes.

### Remaining Limitations

Identify unenforced boundaries or existing violations requiring later work.

### Files Created or Modified

Provide the complete list.

### Verification

Report:

```text
Build: PASS / FAIL / NOT_RUN
Lint: PASS / FAIL / NOT_RUN
Typecheck: PASS / FAIL / NOT_RUN
Architecture Checks: PASS / FAIL / NOT_RUN
Tests Executed: 0, if deferred
```

Use actual results only.

### Deferred Test Archive

If testing is deferred:

```text
Archive:
test-archive/ARC-02/ARC-02-deferred-tests.md

New Tests Implemented:
0

Tests Executed:
0

Status:
NOT_RUN — DEFERRED
```

Report the actual number of documented scenarios.

### Final Architectural Decisions

Explain why the resulting enforcement is sufficient for existing projects and where future enforcement needs remain.

---

## 52. Final Architectural Guardrail

ARC-02 answers:

> How can the TypeScript Monorepo enforce correct architectural dependency direction so that semantic meaning remains isolated from technology-specific implementations, compiler and runtime dependencies remain controlled, and applications consume platform functionality only through approved public contracts?

It does not answer:

- How semantic elements are defined.
- How canonical models are produced.
- How runtime artifacts are compiled.
- How actions execute.
- How database records are stored.
- How semantic queries run.
- How dynamic Angular renderers work.
- How packages and extensions are installed.

Preserve the target structure:

```text
Pure TypeScript Semantic Kernel
            ↑
Pure TypeScript Model Core
            ↑
Approved Compiler and Runtime Consumers

Technology-Specific Adapters
    ├── NestJS Backend
    └── Angular + PrimeNG Frontend

Application Hosts
    ├── apps/api
    └── apps/studio
```

The arrows indicate architectural dependency relationships, not a requirement to create placeholder modules.

Maintain:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

Use exclusively the established stack:

**TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx.**

Do not introduce Python, Django, or Django REST Framework.

Do not weaken dependency rules to accommodate invalid imports.

Do not create a shared god library.

Do not create empty architectural projects.

Do not implement future capabilities early.

Produce real architecture enforcement, preserve the ARC-01 repository, and report verification results accurately.

**Complete ARC-02 and stop.**