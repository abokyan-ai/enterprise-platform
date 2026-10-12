# ARC-04 — Platform Bootstrap
## Model-Driven Enterprise Ecosystem Platform Architecture
### A. Repository Architecture & Platform Foundation
### Mandatory Stack: TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx

---

## 1. Role and Mission

Act as a Principal Software Architect, NestJS Platform Architect, Angular Enterprise Architect, TypeScript Monorepo Architect, Application Lifecycle Engineer, and Clean Architecture Specialist.

Your assignment is:

**ARC-04 — Platform Bootstrap**

Implement the foundational application bootstrap and composition architecture for the platform established by:

- ARC-01 — Repository Architecture.
- ARC-02 — Dependency Rules.
- ARC-03 — Architecture Fitness Test Harness.

The central objective is:

> Establish reliable, explicit, environment-aware startup and shutdown mechanisms for the NestJS backend and Angular Studio, with validated configuration, controlled dependency composition, coherent operational readiness, and strict separation between framework-specific hosting and Pure TypeScript Platform Core.

This task must turn the existing repository into a properly composed platform application without introducing future domain features.

Implement production-quality bootstrap functionality.

Do not rebuild the monorepo.

Do not implement a semantic compiler or runtime engine as part of startup.

Do not introduce a production authentication system, database infrastructure, or distributed orchestration.

**Do not create or execute automated tests. Create exactly one Markdown archive of deferred verification scenarios.**

---

# 2. Authoritative Architecture

The project is:

**Model-Driven Enterprise Ecosystem Platform Architecture**

Expanded vision:

**A Composable, Model-Driven Enterprise Ecosystem Platform based on a Unified Semantic Meta-Model, with a Metadata-Compiled Runtime, Clean-Core Extension Model, and AI-Native Execution Architecture.**

Preserve the principle:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

The conceptual layers remain:

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

This represents conceptual processing flow, not TypeScript import direction.

The bootstrap layer must follow ARC-02's actual dependency matrix.

**Application hosts compose capabilities; they do not define semantic meaning.**

---

# 3. Mandatory Technology Stack

Use:

### Backend

- Node.js.
- TypeScript.
- NestJS.
- NestJS REST APIs.
- NestJS Dependency Injection.
- Modular Monolith.
- Ports and Adapters.
- Clean Architecture.

### Frontend

- Angular.
- TypeScript.
- PrimeNG.
- PrimeIcons where required.
- Angular Router.
- Angular standalone components.
- Angular Signals where appropriate.
- Angular HttpClient.
- Angular Reactive Forms where needed.

### Monorepo

- pnpm Workspaces.
- Nx.
- ESLint.
- Prettier.
- TypeScript Project References where appropriate.
- Vitest as the established testing framework.

Do not introduce:

```text
Python
Django
Django REST Framework
React
Vue
Next.js
Standalone Express Backend
Alternative Monorepo Tooling
```

Preserve the existing compatible framework and tooling versions.

Do not perform unrelated major dependency upgrades.

---

# 4. Mandatory Repository Inspection

Before implementation, inspect the actual repository.

Inspect:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
nx.json
tsconfig.base.json
eslint.config.mjs
```

Inspect actual applications:

```text
apps/api
apps/studio
```

Inspect:

```text
platform/
adapters/
tools/
tests/
docs/
```

Identify:

1. Existing NestJS bootstrap entry point.
2. Existing NestJS root module.
3. Existing backend adapter modules.
4. Existing Angular bootstrap entry point.
5. Existing Angular application configuration.
6. Existing Angular routes.
7. Existing PrimeNG configuration.
8. Existing environment configuration.
9. Existing Platform Information endpoint.
10. Existing Angular-to-NestJS integration.
11. Existing Nx project targets.
12. ARC-02 dependency restrictions.
13. ARC-03 architecture fitness integration.
14. Existing logging conventions.
15. Existing lifecycle and readiness mechanisms.

Do not assume illustrative paths represent actual files.

Reuse existing implementations wherever possible.

Do not replace working ARC-01 functionality unnecessarily.

---

# 5. Bootstrap Responsibilities

Define Platform Bootstrap as the coordination of:

```text
Application Configuration
        ↓
Configuration Validation
        ↓
Application Composition
        ↓
Adapter Initialization
        ↓
Application Host Startup
        ↓
Operational Readiness
        ↓
Controlled Shutdown
```

Bootstrap does not own:

```text
Semantic Meaning
Canonical Model Construction
Compiler Behavior
Runtime Business Execution
Persistent Business State
Business Authorization Policies
```

Do not turn bootstrap into an application service that implements platform domain semantics.

---

# 6. Primary Objectives

Implement:

1. NestJS backend bootstrap.
2. Explicit backend application composition root.
3. Validated backend configuration.
4. Minimal typed platform runtime configuration.
5. Controlled dependency initialization.
6. Startup failure handling.
7. Application lifecycle hooks.
8. Controlled shutdown.
9. Minimal health and readiness semantics.
10. Consistent API routing configuration.
11. Existing Platform Information endpoint integration.
12. Angular standalone bootstrap.
13. Angular application provider composition.
14. Angular Router initialization.
15. PrimeNG initialization.
16. Angular HttpClient integration.
17. Environment-aware frontend API configuration.
18. Backend/frontend startup separation.
19. Nx/pnpm developer commands.
20. Architecture boundary preservation.
21. Deferred verification documentation.

Do not introduce unrelated capabilities.

---

# 7. Backend Bootstrap Architecture

The backend must use NestJS as its application host.

Preserve:

```text
Node.js Process
        ↓
NestJS Bootstrap Entry Point
        ↓
NestJS Root Module
        ↓
Application / Adapter Composition
        ↓
Platform Public Contracts
```

NestJS must remain outside Semantic Kernel and Model Core.

Do not embed domain logic in `main.ts`.

Do not import platform internal implementation files through deep relative paths.

Do not use the NestJS root module as a shared semantic contract.

---

# 8. Backend Bootstrap Entry Point

Inspect the existing backend entry point.

Usually:

```text
apps/api/src/main.ts
```

Adapt to actual repository structure.

Implement a small, explicit bootstrap function.

Conceptually:

```typescript
async function bootstrap(): Promise<void> {
  const config = loadAndValidateApplicationConfig();

  const app = await NestFactory.create(
    AppModule,
    createNestApplicationOptions(config),
  );

  configureApplication(app, config);

  await app.listen(config.port, config.host);
}
```

This is illustrative, not a requirement to introduce these exact helper names.

Requirements:

- Explicit configuration loading.
- Configuration validation before binding network listeners.
- Centralized application setup.
- Predictable startup sequence.
- Controlled error reporting.
- No hidden business execution.
- No unhandled bootstrap promise rejection.

Do not create multiple competing bootstrap entry points.

---

# 9. NestJS Composition Root

Maintain a clear composition root.

Usually:

```text
apps/api/src/app/
```

or the existing approved location.

Its responsibilities:

- Import approved NestJS integration modules.
- Register application providers.
- Wire port interfaces to available implementations.
- Configure runtime-specific application services.
- Compose the HTTP application.

Do not declare Semantic Kernel classes as NestJS providers merely to make them accessible.

Do not introduce framework decorators into pure TypeScript contracts.

Do not create modules for nonexistent platform capabilities.

---

# 10. Modular Monolith Composition

Preserve:

**Modular Monolith First.**

NestJS modules should correspond to real hosting or integration responsibilities.

Do not generate empty modules for:

```text
Compiler
Runtime
Persistence
Query
Actions
Events
Policies
AI
```

unless actual code already requires composition.

Do not initialize conceptual future services.

Do not create microservices.

Do not introduce a message broker.

Do not split the platform into networked services.

---

# 11. Backend Configuration Contract

Introduce or reuse a typed backend configuration contract.

Suggested conceptual name:

**PlatformBackendConfig**

Potential fields:

```typescript
interface PlatformBackendConfig {
  readonly host: string;
  readonly port: number;
  readonly environment: 'development' | 'test' | 'production';
  readonly apiPrefix: string;
}
```

This is illustrative.

Adapt to existing repository contracts.

Only add fields genuinely needed for current bootstrap.

Do not create a universal application settings dictionary.

Do not place database secrets into a shared frontend contract.

Do not embed environment variables into Semantic Kernel.

---

# 12. Configuration Source

Backend configuration may originate from:

- Environment variables.
- Existing approved configuration files.
- Trusted deployment configuration.

Read environment variables at the backend host boundary.

Do not access `process.env` throughout Platform Core.

Do not treat user-authored semantic metadata as backend host configuration.

Do not invent a remote configuration service.

If the repository already uses a compatible NestJS configuration mechanism, reuse it.

Do not introduce a second configuration framework.

---

# 13. Configuration Validation

Validate configuration before starting the backend listener.

Check applicable values:

- Valid port integer.
- Supported host value.
- Supported environment.
- Valid API prefix.
- Safe defaults for local development.
- Required production settings.

Do not silently accept malformed ports.

Do not silently convert arbitrary strings into supported environment names.

Do not hide invalid configuration behind fallback values.

Use a narrow typed parser/validator.

Do not create a custom general-purpose schema-validation framework.

---

# 14. Configuration Fail-Closed Behavior

When mandatory configuration is invalid:

```text
Invalid Configuration
        ↓
Bootstrap Failure
        ↓
No Listening Application
```

Do not report successful startup.

Do not bind a fallback public interface silently.

Do not print sensitive configuration values.

Provide actionable safe error messages.

Do not retry indefinitely.

---

# 15. Environment Profiles

Support the actual environment profiles required by the existing repository.

Likely:

```text
development
test
production
```

Do not invent many deployment environments.

Development defaults must not silently become unsafe production defaults.

Do not enable debugging functionality in production merely because the development profile supports it.

Do not infer environment from an arbitrary HTTP request.

---

# 16. Backend Application Setup

Centralize relevant NestJS application setup:

- API prefix, when established.
- CORS policy, when needed for Angular Studio connectivity.
- Request validation integration, where already required.
- Existing exception handling.
- Existing logging.
- Shutdown hooks.

Do not install global pipes or interceptors that unexpectedly change existing API contracts.

Do not introduce a generic authorization guard without an existing security system.

Do not create broad application middleware merely to make bootstrap appear comprehensive.

---

# 17. HTTP API Prefix

Use the existing API prefix convention.

If none exists, introduce a minimal consistent prefix only when justified.

Do not duplicate prefixes across controllers and global application setup.

Preserve existing Platform Information endpoint accessibility or update its frontend client consistently.

Do not introduce breaking API route changes unnecessarily.

---

# 18. CORS Configuration

Configure CORS only for actual browser-to-backend integration needs.

Requirements:

- Explicit allowed origins.
- Environment-sensitive configuration.
- No unnecessary production wildcard.
- No automatic credential allowance for arbitrary origins.
- Compatible Angular Studio development configuration.

Do not treat CORS as authentication.

Do not invent production origin values.

Document deployment-specific configuration requirements.

---

# 19. Backend Logging

Use the existing NestJS logging infrastructure.

Provide useful startup information such as:

```text
Application Starting
Configuration Accepted
HTTP Listener Ready
Application Shutdown
```

Do not log:

- Secrets.
- Tokens.
- Full environment variables.
- Private credentials.
- Sensitive runtime state.

Do not create a new observability platform.

Do not introduce external logging infrastructure.

---

# 20. Startup Error Handling

Handle expected bootstrap failures at the application boundary.

Examples:

- Invalid configuration.
- Missing required provider.
- Failed module initialization.
- Listener binding failure.
- Unsupported host setting.

Do not swallow exceptions.

Do not convert startup errors into HTTP success responses.

Do not retry forever.

Preserve nonzero process failure semantics for fatal startup errors.

Do not claim startup succeeded before the HTTP listener has bound successfully.

---

# 21. Startup Lifecycle

Make the lifecycle explicit:

```text
UNINITIALIZED
        ↓
CONFIGURING
        ↓
INITIALIZING
        ↓
LISTENING
        ↓
READY
```

On failure:

```text
FAILED
```

These labels are conceptual.

Do not introduce a complex state machine unless operationally needed.

Do not create global mutable flags accessible throughout platform code.

If readiness state is required, keep it in a small backend-host-owned provider.

---

# 22. Shutdown Lifecycle

Use NestJS-supported lifecycle hooks.

Requirements:

- Support normal shutdown signals where appropriate.
- Stop accepting new requests through the framework's supported mechanism.
- Close initialized resources.
- Avoid creating duplicate signal handlers.
- Preserve platform application boundaries.
- Report shutdown failures safely.

Do not invent distributed draining protocols.

Do not implement a Kubernetes operator.

Do not introduce infrastructure resources that do not exist.

---

# 23. Health Endpoint

Provide or preserve a minimal health endpoint.

Suggested route:

```text
GET /health
```

or the established repository convention.

Health should describe whether the backend process is responsive.

Do not expose:

- Environment secrets.
- Internal dependency graph.
- Database credentials.
- Private infrastructure endpoints.
- Sensitive runtime metadata.

Do not implement a comprehensive monitoring API.

---

# 24. Health Versus Readiness

Distinguish:

```text
Liveness
    → The host process can respond.

Readiness
    → The host is ready to handle its currently supported requests.
```

Do not conflate the two.

A responsive process may still be unready if mandatory initialization is incomplete.

A readiness endpoint may be useful:

```text
GET /ready
```

but implement it only if the existing application architecture justifies it.

Do not create a fake readiness result that always returns success despite known mandatory initialization failure.

Do not claim future Compiler, Runtime, or Database capabilities are ready when they are not implemented.

---

# 25. Readiness Scope

For ARC-04, readiness should cover only currently implemented host capabilities.

Possible prerequisites:

- Valid configuration.
- Initialized NestJS application.
- Registered current application providers.
- Available existing Platform Information integration.

Do not require readiness of nonexistent future services.

Do not automatically perform external network calls.

Do not invent database checks without a database adapter.

Use explicit supported readiness criteria.

---

# 26. Platform Information Endpoint

Preserve the ARC-01 reference endpoint.

Conceptually:

```json
{
  "platform": "Model-Driven Enterprise Ecosystem",
  "architecture": "Modular Monolith",
  "semanticCore": "Pure TypeScript"
}
```

Use the actual existing response contract.

Do not add sensitive runtime data.

Do not turn Platform Information into a full management API.

The endpoint must remain available through the approved NestJS application composition.

---

# 27. Angular Studio Bootstrap

Use Angular standalone application bootstrapping.

Prefer the existing Angular entry point.

Usually:

```text
apps/studio/src/main.ts
```

Conceptually:

```typescript
bootstrapApplication(AppComponent, appConfig);
```

Adapt to the installed Angular version.

Do not introduce `AppModule` solely to reproduce an older Angular architecture.

Do not replace Angular with React or Vue.

Do not move Semantic Core into frontend application bootstrapping.

---

# 28. Angular Application Configuration

Centralize Angular providers through the established standalone configuration.

Typical responsibilities:

- Router.
- HttpClient.
- PrimeNG.
- Error presentation where already needed.
- Existing frontend integration providers.

Do not initialize backend services in Angular.

Do not import NestJS providers.

Do not duplicate the same provider configuration across multiple bootstrap paths.

Preserve the existing Angular application shell.

---

# 29. Angular Router

Use Angular Router.

Preserve existing route definitions.

Do not create a large feature-route hierarchy for nonexistent future modules.

Do not introduce ERP pages.

Do not implement semantic model editors.

Do not create routes for Compiler, Runtime, Packages, or AI features unless already supported.

A simple Studio shell and existing reference view are sufficient.

---

# 30. PrimeNG Bootstrap

Preserve PrimeNG as the primary UI component library.

Inspect the installed PrimeNG version.

Configure the theme using the API supported by that version.

Ensure PrimeNG integration remains in frontend presentation layers.

Do not import PrimeNG into:

```text
Semantic Kernel
Model Core
Compiler Core
Runtime Core
Experience Model
```

Do not introduce competing UI component libraries.

Do not redesign the Studio UI unnecessarily.

---

# 31. PrimeIcons

Use PrimeIcons where the current UI genuinely needs icons.

Do not introduce an unrelated icon framework.

Do not import PrimeIcons into Platform Core.

Preserve compatibility with the installed Angular and PrimeNG versions.

---

# 32. Angular HttpClient

Use Angular HttpClient for backend connectivity.

Configure it through the supported Angular standalone provider API.

Do not use NestJS DTO classes directly in the frontend.

Do not place HTTP requests inside semantic kernel contracts.

Use frontend-safe response contracts.

Do not create an unrestricted generic API client when the existing Platform Information integration suffices.

---

# 33. Frontend API Configuration

Introduce or reuse typed frontend environment configuration.

It may include:

```text
API Base URL
Application Display Name
Supported Frontend Runtime Flags
```

Only include necessary values.

Do not expose backend secrets through Angular environment files.

Do not include database credentials.

Do not use backend `process.env` directly in browser source.

Do not invent a complex runtime configuration server.

---

# 34. Frontend/Backend Connectivity

Preserve the reference flow:

```text
Angular Studio
        ↓
Angular HttpClient
        ↓
NestJS REST API
        ↓
Approved Application Adapter
        ↓
Platform Public Contract
```

Use environment-appropriate API routing.

If the repository already supports a development proxy, reuse it.

Do not hardcode a production backend URL into frontend source.

Do not introduce a service mesh or API gateway.

---

# 35. Frontend Startup Failure Behavior

Angular application bootstrap errors must not be silently ignored.

Preserve framework-supported error handling.

Do not create an infinite reload loop.

Do not expose raw secrets or backend stack traces to the browser.

Do not make frontend initialization depend on unavailable future platform capabilities.

If the Platform Information endpoint is temporarily unavailable, present a controlled connectivity state rather than claiming backend readiness.

Do not confuse frontend shell rendering with successful backend connectivity.

---

# 36. Backend and Frontend Lifecycle Independence

NestJS API and Angular Studio are separate runnable applications.

Preserve:

```text
apps/api
    → Backend Host.

apps/studio
    → Frontend Host.
```

Each must have its own valid bootstrap.

Do not require Angular to start inside the NestJS process.

Do not require NestJS to import Angular source files.

Do not create circular application dependencies.

Development tooling may launch both through Nx/pnpm orchestration without merging their runtime architectures.

---

# 37. Dependency Injection

NestJS Dependency Injection belongs to application and integration layers.

Use it for:

- Controller wiring.
- Existing application services.
- Adapter bindings.
- Host configuration providers.
- Current operational services.

Pure TypeScript Platform Core must remain independent.

Do not add `@Injectable()` to Semantic Kernel classes.

Do not add NestJS Module decorators to Model Core.

Do not introduce service locator patterns into domain contracts.

---

# 38. Port and Adapter Composition

Where existing platform services expose ports, bind them in the application composition root.

Conceptually:

```text
Pure TypeScript Port
        ↑
Concrete Adapter
        ↑
NestJS Composition Root
```

Do not make ports import adapters.

Do not create fake adapters for future Persistence or Runtime services.

Do not register dummy providers merely to make modules compile.

If an actual required adapter is unavailable, surface the integration gap.

Do not fabricate successful service readiness.

---

# 39. Configuration Ownership

Keep configuration responsibilities separate.

```text
Backend Host Configuration
    → NestJS application boundary.

Frontend Configuration
    → Angular application boundary.

Semantic Definitions
    → Platform semantic packages.

Compiler Configuration
    → Future compiler application integration.

Runtime Execution Configuration
    → Future approved runtime boundary.
```

Do not create one universal configuration object containing all platform concerns.

Do not move environment parsing into Semantic Kernel.

---

# 40. Platform Bootstrap Contract

If a reusable bootstrap abstraction is justified, introduce a narrow host-owned contract.

Suggested conceptual names:

```text
PlatformBootstrapOptions
PlatformBootstrapResult
PlatformBootstrapFailure
```

Avoid introducing abstractions merely to wrap one line of NestJS startup.

Bootstrap orchestration may remain ordinary application-host functions.

Do not create a pure domain `PlatformBootstrap` service that imports NestJS and Angular.

Do not introduce a framework-independent bootstrap engine without a real consumer.

---

# 41. Operational Status

Where startup status needs to be represented, use a minimal typed contract.

Distinguish:

```text
STARTING
READY
FAILED
STOPPING
STOPPED
```

Only represent states actually tracked.

Do not fabricate readiness based on elapsed time.

Do not set READY before required current initialization succeeds.

Do not turn these host lifecycle states into SemanticElementKinds.

Do not persist them in a database.

---

# 42. Bootstrap Idempotency

Avoid accidental duplicate initialization within one application-host lifecycle.

Examples:

- Duplicate listener binding.
- Duplicate lifecycle hook registration.
- Duplicate frontend provider registration.
- Repeated initialization of the same host-owned resource.

Do not promise distributed idempotency.

Do not implement process coordination.

Prefer existing NestJS and Angular lifecycle conventions.

---

# 43. Environment Variable Safety

Avoid leaking configuration.

Do not log:

```text
Passwords
Tokens
Connection Secrets
Private Keys
Full Environment Dumps
```

Validate types explicitly.

Do not rely on JavaScript truthiness for security-sensitive Boolean settings.

Do not assume every nonempty string represents `true`.

Do not silently promote development values to production settings.

---

# 44. Configuration Error Reporting

Use controlled application-host error reporting.

A configuration error should identify:

- Invalid configuration field.
- Supported value shape.
- Relevant application host.
- Safe remediation information.

Do not print the actual value if it is sensitive.

Do not include raw private environment contents.

Do not create a new platform-wide Runtime Error Model solely for bootstrap.

Bootstrap errors remain appropriate to the application-host boundary.

---

# 45. Architecture Dependency Preservation

Apply ARC-02 rules.

Forbidden:

```text
semantic-kernel → NestJS
model-core → Angular
compiler-core → PrimeNG
runtime-core → NestJS adapters
experience-model → PrimeNG
```

Also forbid:

```text
platform core → apps/api
platform core → apps/studio
```

Application hosts consume approved public APIs.

Do not use private deep imports merely to wire dependencies.

Do not weaken ESLint/Nx rules to make bootstrap work.

---

# 46. ARC-03 Harness Preservation

Preserve the architecture fitness harness established by ARC-03.

New bootstrap code must comply with its declared rules.

Do not modify the harness to ignore invalid backend/frontend imports.

Do not create architecture exceptions for convenience.

Do not duplicate the dependency policy.

Do not claim architecture fitness tests passed unless they were executed.

Under this task's deferred testing policy, document future verification scenarios instead of running tests.

---

# 47. pnpm and Nx Developer Experience

Preserve the existing monorepo.

Provide functional scripts for current application workflows.

Expected command surfaces may include:

```bash
pnpm dev:api
pnpm dev:studio
pnpm build
pnpm lint
pnpm typecheck
```

Adapt actual commands to existing Nx project targets.

Do not introduce fake scripts.

Do not reference nonexistent projects.

Do not replace pnpm with npm or Yarn.

Do not rewrite the workspace configuration unnecessarily.

---

# 48. Local Development Configuration

Support practical local development.

Requirements:

- Predictable API host/port.
- Angular development server configuration.
- Appropriate development API connectivity.
- Local CORS or proxy configuration.
- Clear environment variable documentation.

Do not assume production infrastructure exists.

Do not introduce Docker Compose unless already required by the existing repository.

Do not create Kubernetes manifests.

Do not add a database merely to demonstrate startup.

---

# 49. Production Bootstrap Boundaries

Prepare bootstrap logic for production-safe operation without deploying production infrastructure.

Requirements:

- Validated required configuration.
- No development-only permissive defaults.
- Controlled error messages.
- Supported shutdown hooks.
- No sensitive configuration logging.
- Explicit listener binding.

Do not create deployment pipelines.

Do not implement infrastructure-as-code.

Do not introduce a production secrets manager.

Do not claim production readiness based solely on successful local startup.

---

# 50. Backend Health Response

Keep health output minimal.

Conceptually:

```json
{
  "status": "ok"
}
```

Use actual existing response conventions.

Do not expose internal service inventories unnecessarily.

Do not claim that future semantic compiler/runtime/persistence systems are healthy.

Do not embed full process environment details.

---

# 51. Backend Readiness Response

If readiness is implemented, use explicit current-capability prerequisites.

Conceptually:

```json
{
  "status": "ready"
}
```

This is illustrative.

Do not report ready if mandatory initialization failed.

Do not require nonexistent future services.

Do not create fake dependency probes that always succeed.

Readiness must be truthful within the declared scope.

---

# 52. Minimal Backend Composition Example

A valid conceptual composition:

```text
AppModule
    ├── PlatformInformationModule
    └── Current Host Configuration
```

Add actual existing modules as necessary.

Do not create modules for conceptual future components.

Do not add:

```text
SemanticCompilerModule
RuntimeExecutionModule
PersistenceModule
EventBusModule
PolicyEngineModule
AIAgentModule
```

without real implemented functionality.

---

# 53. Minimal Angular Composition Example

A valid conceptual Angular setup:

```text
bootstrapApplication
    ↓
Application Providers
    ├── Router
    ├── HttpClient
    └── PrimeNG
    ↓
App Shell
    ↓
Platform Information View
```

Preserve the existing application.

Do not implement a dynamic experience renderer.

Do not implement ERP screens.

Do not create a complex state-management framework merely for bootstrap.

---

# 54. Security Boundaries

Bootstrap must not accidentally introduce privileged behavior.

Do not:

- Expose secrets through health endpoints.
- Allow arbitrary CORS origins with credentials in production.
- Trust client-supplied application configuration.
- Disable authentication that already exists.
- Execute model-authored startup scripts.
- Dynamically load arbitrary modules from request input.
- Create administrative endpoints without authorization.
- Log raw confidential settings.

Do not implement a full security platform.

Preserve existing authentication and authorization mechanisms.

---

# 55. Logging and Diagnostics

Use controlled operational diagnostics for startup.

Distinguish:

```text
Configuration Failure
Module Initialization Failure
Listener Failure
Readiness Failure
Shutdown Failure
Frontend Connectivity Failure
```

Do not classify backend bootstrap failures as Semantic Model validation errors.

Do not create a competing Semantic Kernel diagnostics system.

Use application-host logging conventions.

---

# 56. Resource Ownership

Clearly identify which host owns each initialized resource.

Examples:

```text
NestJS HTTP Listener
    → Backend Host.

NestJS Providers
    → NestJS Application Container.

Angular Providers
    → Angular Application.

PrimeNG Theme Configuration
    → Angular Presentation Layer.
```

Do not place host-owned lifecycle handles in Semantic Kernel.

Do not create a global mutable resource registry.

Do not initialize a resource twice through separate bootstrap paths.

---

# 57. Startup Ordering

Ensure startup operations occur in a justified order.

Backend:

```text
Read Configuration
        ↓
Validate Configuration
        ↓
Create NestJS Application
        ↓
Apply Host Configuration
        ↓
Initialize Available Providers
        ↓
Start Listener
        ↓
Report Readiness
```

Frontend:

```text
Load Frontend Configuration
        ↓
Configure Angular Providers
        ↓
Configure Router / HttpClient / PrimeNG
        ↓
Bootstrap Angular Application
        ↓
Render App Shell
        ↓
Connect to Backend
```

Do not require backend connectivity to be misrepresented as guaranteed at frontend bundle-load time.

Do not mark the backend ready before required initialization.

---

# 58. Bootstrap Failure Cleanup

If startup fails after some resources have initialized:

- Close available initialized resources where supported.
- Avoid leaving duplicate process listeners.
- Preserve the original failure reason.
- Report cleanup failures safely.
- Ensure fatal backend bootstrap failure produces an unsuccessful process outcome.

Do not implement a generalized transaction rollback framework.

Do not claim full recovery when cleanup is incomplete.

---

# 59. Platform Information Contract

The ARC-01 reference vertical slice should continue using an explicit frontend-safe data contract.

Do not import NestJS Controller types into Angular.

Do not turn the transport DTO into CanonicalModel.

Keep the Platform Information response small and stable.

Do not introduce semantic identity or runtime execution features into the response merely to demonstrate integration.

---

# 60. Documentation

Update relevant actual documentation.

Suggested files:

```text
docs/architecture/platform-bootstrap.md
docs/architecture/repository-architecture.md
```

Create only appropriate new documents.

Document:

1. Backend bootstrap entry point.
2. NestJS composition root.
3. Configuration fields.
4. Environment profiles.
5. Startup ordering.
6. Shutdown behavior.
7. Health/readiness definitions.
8. Angular bootstrap.
9. PrimeNG initialization.
10. HttpClient configuration.
11. API connectivity.
12. Local development commands.
13. Architecture dependency boundaries.
14. Known limitations.

Do not document unimplemented capabilities as available.

---

# 61. Architecture Decision Records

Review the existing ARC-01 ADRs:

```text
ADR-001 — TypeScript Monorepo
ADR-002 — Modular Monolith First
ADR-003 — Pure TypeScript Semantic Core
ADR-004 — NestJS Backend Host
ADR-005 — Angular + PrimeNG Studio
ADR-006 — Enforced Dependency Boundaries
```

Update ADR-004 or ADR-005 only when actual bootstrap decisions require clarification.

If a new significant decision is introduced, create an ADR following the repository's actual numbering conventions.

Do not duplicate existing decisions.

Do not create unnecessary ADR files.

---

# 62. Mini Platform Bootstrap Scenario

Use the established ARC-01 reference application.

## 62.1 Backend Startup

Given valid backend configuration:

```text
Host:
    127.0.0.1

Port:
    approved local development port

Environment:
    development
```

Expected intended behavior:

```text
Configuration Accepted
        ↓
NestJS Application Initialized
        ↓
HTTP Listener Started
        ↓
Current Host Ready
```

Do not hardcode an arbitrary port if the repository already defines one.

## 62.2 Backend Invalid Port

Given:

```text
PORT=not-a-number
```

Expected intended behavior:

```text
Configuration Validation Failure
        ↓
No Successful Listener
        ↓
Nonzero Startup Failure
```

Do not silently select a random alternate port.

## 62.3 Platform Information Endpoint

The existing endpoint returns the approved platform identity.

Example:

```json
{
  "platform": "Model-Driven Enterprise Ecosystem",
  "architecture": "Modular Monolith",
  "semanticCore": "Pure TypeScript"
}
```

Preserve actual existing contract values.

## 62.4 Angular Startup

Given compatible frontend configuration:

```text
Angular Standalone Bootstrap
        ↓
Router / HttpClient / PrimeNG
        ↓
Studio Application Shell
```

Expected intended behavior:

- Angular application initializes.
- PrimeNG remains configured.
- Existing Platform Information view remains available.

## 62.5 Backend Unavailable

When the backend cannot be reached:

- Angular shell must not claim backend connectivity.
- Existing API client must surface a controlled error.
- No sensitive backend details should be exposed.

## 62.6 Shutdown

When an approved shutdown signal occurs:

- NestJS uses supported shutdown hooks.
- Current host resources close appropriately.
- Shutdown failures remain observable.

These are design scenarios, not executed test results.

---

# 63. Explicit Non-Goals

Do not implement:

```text
New Semantic Kernel Concepts
Semantic Type System
Model Authoring
Canonicalization
Compiler Passes
Semantic IR
Runtime Artifact Loader
Runtime Model Registry
Semantic Instance Runtime
Runtime Execution Engine
Persistence Adapter
Query Engine
Action Dispatch
Event Bus
Workflow Engine
Policy Engine
AI Agent Runtime
Dynamic Angular Renderer
ERP Modules
Marketplace
Microservices
Kafka
Distributed Transactions
Kubernetes
Production Authentication System
Production Authorization Engine
Cloud Deployment Automation
```

Do not implement ARC-05 automatically.

---

# 64. Implementation Sequence

Perform the following steps.

### Phase 1 — Repository Inspection

1. Inspect actual ARC-01 through ARC-03 outputs.
2. Inspect installed NestJS and Angular versions.
3. Inspect existing backend bootstrap.
4. Inspect existing Angular bootstrap.
5. Inspect PrimeNG configuration.
6. Inspect Nx targets.
7. Identify existing configuration and lifecycle mechanisms.

### Phase 2 — Backend Configuration

8. Define minimal typed backend configuration.
9. Implement configuration loading.
10. Implement configuration validation.
11. Distinguish development and production defaults.
12. Implement controlled configuration errors.

### Phase 3 — Backend Composition

13. Refine the NestJS entry point.
14. Establish clear AppModule composition.
15. Register only implemented modules.
16. Configure API prefix and CORS where needed.
17. Preserve existing Platform Information endpoint.

### Phase 4 — Lifecycle

18. Implement startup ordering.
19. Implement controlled fatal startup failure handling.
20. Configure supported shutdown hooks.
21. Preserve or add minimal health/readiness contracts where justified.
22. Ensure readiness reflects actual current initialization.

### Phase 5 — Angular Studio

23. Refine standalone Angular bootstrap.
24. Centralize Angular providers.
25. Preserve Router.
26. Preserve HttpClient.
27. Preserve PrimeNG and compatible theme configuration.
28. Configure frontend API connectivity.
29. Preserve existing Studio shell.

### Phase 6 — Workspace Integration

30. Update relevant Nx targets or pnpm scripts.
31. Preserve valid package dependencies.
32. Comply with ARC-02 dependency rules.
33. Preserve ARC-03 architecture fitness integration.

### Phase 7 — Documentation

34. Update bootstrap documentation.
35. Reconcile applicable ADRs.
36. Document configuration and startup commands.

### Phase 8 — Deferred Verification

37. Create the required Markdown archive.
38. Document comprehensive future verification scenarios.
39. Do not create executable tests.
40. Do not execute automated tests.

### Phase 9 — Completion

41. Perform permitted static source inspection.
42. Perform permitted non-test typechecking or build analysis where appropriate.
43. Record actual outcomes.
44. Report limitations.
45. Stop after ARC-04.

---

# 65. Mandatory Deferred Test Archive

Testing is intentionally deferred.

**Do not create or execute automated tests.**

Create exactly one Markdown file for ARC-04 inside the actual working repository.

Required path:

```text
test-archive/
└── ARC-04/
    └── ARC-04-deferred-tests.md
```

Preserve all previous task archives.

If the file already exists, preserve existing scenarios and any genuine historical execution evidence.

Do not create other test archive files for ARC-04.

---

# 66. Deferred Archive Header

Use:

```markdown
# ARC-04 — Deferred Test Specification

Task: ARC-04 — Platform Bootstrap

Backend: NestJS / Node.js / TypeScript

Frontend: Angular / PrimeNG / TypeScript

Monorepo: pnpm Workspaces / Nx

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:
- ARC-01
- ARC-02
- ARC-03
```

---

# 67. Deferred Scenario Format

Each archived scenario must contain:

```text
Test ID
Scenario
Objective
Component
Prerequisites
Input / Setup
Expected Result
Expected Diagnostics
Acceptance Criteria
Execution Status
```

Use stable identifiers:

```text
ARC-04-T001
ARC-04-T002
ARC-04-T003
...
```

Mark all newly documented scenarios:

```text
NOT_RUN — DEFERRED
```

Do not include executable Vitest code.

---

# 68. Mandatory Deferred Verification Categories

## A. Backend Bootstrap

- Valid startup configuration.
- Invalid startup configuration.
- Missing required configuration.
- Successful NestJS construction.
- Provider initialization failure.
- Duplicate bootstrap prevention.
- No hidden domain execution.

## B. Backend Configuration

- Valid port.
- Noninteger port.
- Out-of-range port.
- Empty host.
- Invalid environment.
- Safe development defaults.
- Missing production settings.
- Safe configuration messages.

## C. Composition Root

- Current modules registered.
- Missing required provider.
- Duplicate provider.
- Port/adapter binding.
- No unused future module.
- No framework leakage into Semantic Kernel.

## D. HTTP Configuration

- Existing API prefix.
- Valid routing.
- Development CORS.
- Production CORS restriction.
- Credentials not enabled for arbitrary origins.
- Existing endpoint preserved.

## E. Startup Lifecycle

- Configuration stage.
- Initialization stage.
- Listener stage.
- Ready stage.
- Initialization failure.
- Listener failure.
- Cleanup after failure.

## F. Shutdown Lifecycle

- Supported shutdown signal.
- NestJS shutdown hooks.
- Resource closure.
- Duplicate signal registration.
- Shutdown error handling.
- No resource leakage.

## G. Health

- Responsive host.
- Unresponsive host.
- Minimal safe response.
- No credentials.
- No nonexistent component claims.

## H. Readiness

- Ready host.
- Initializing host.
- Failed required provider.
- No false READY.
- Liveness/readiness distinction.
- Actual current capabilities only.

## I. Angular Bootstrap

- Standalone application startup.
- Invalid Angular provider configuration.
- Router initialization.
- HttpClient initialization.
- No AppModule regression.
- Existing shell preserved.

## J. PrimeNG

- PrimeNG initialization.
- Compatible theme.
- PrimeNG component rendering.
- PrimeIcons integration.
- No PrimeNG in Pure TypeScript Core.

## K. Frontend API Configuration

- Valid API base URL.
- Invalid base URL.
- Development proxy.
- Production configuration.
- No backend secrets.
- No server-only environment imports.

## L. Frontend/Backend Integration

- Existing Platform Information request.
- Successful response.
- Backend unavailable.
- Backend error response.
- No NestJS DTO import in Angular.
- Frontend-safe contract preservation.

## M. Dependency Injection

- Valid NestJS provider binding.
- Missing provider.
- Duplicate provider.
- Port/adapter direction.
- No NestJS decorators in Core.

## N. Architecture Enforcement

- ARC-02 rules preserved.
- ARC-03 harness integration preserved.
- No deep private import.
- No project cycle.
- No frontend/backend implementation import.

## O. Workspace Commands

- Valid Nx project target.
- Valid pnpm script.
- API development command.
- Studio development command.
- Build.
- Lint.
- Typecheck.
- No fake always-success script.

## P. Security

- Safe CORS.
- No secret logging.
- No environment dump.
- No debug endpoint leakage.
- No arbitrary dynamic modules.
- No unauthenticated administrative endpoint.

## Q. Determinism and Reliability

- Predictable configuration.
- Controlled initialization order.
- No duplicate listeners.
- No hidden global bootstrap state.
- Clear fatal error reporting.
- Stable supported lifecycle behavior.

## R. Documentation

- Documented backend startup.
- Documented frontend startup.
- Documented environment variables.
- Documented health/readiness.
- Documented development commands.
- Accurate feature limitations.

## S. Reference Vertical Slice

- NestJS Platform Information endpoint.
- Angular HttpClient integration.
- PrimeNG Studio shell.
- Platform public contract.
- No new business domain behavior.

## T. Architectural Boundaries

- No Compiler execution.
- No Runtime execution.
- No persistence infrastructure.
- No database migrations.
- No business workflows.
- No AI agent execution.
- No microservices.
- No Kubernetes.
- No new authentication engine.

Document positive, negative, security, configuration, lifecycle, integration, and failure scenarios.

---

# 69. Automated Test Restrictions

Do not execute:

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

Do not modify existing automated test suites.

Do not run integration smoke-test scripts disguised as static checks.

Do not launch backend/frontend servers solely to execute deferred tests.

Permitted activities include:

- Static source inspection.
- Configuration inspection.
- TypeScript syntax checks.
- Non-test typechecking.
- Non-test linting.
- Non-test builds where appropriate.

Report any executed non-test commands accurately.

Do not claim endpoint availability or successful live startup unless it was actually verified through an explicitly permitted activity.

---

# 70. Required Deliverables

Produce:

1. Validated NestJS backend bootstrap.
2. Explicit backend composition root.
3. Typed backend configuration.
4. Configuration loading and validation.
5. Controlled startup failure handling.
6. Supported lifecycle hooks.
7. Controlled shutdown.
8. Minimal health endpoint or preservation of existing health functionality.
9. Truthful readiness mechanism where justified.
10. Consistent HTTP setup.
11. ARC-01 Platform Information endpoint preservation.
12. Angular standalone bootstrap.
13. Angular application configuration.
14. Angular Router integration.
15. Angular HttpClient configuration.
16. PrimeNG configuration.
17. Frontend API connectivity configuration.
18. Nx/pnpm command integration.
19. Architecture boundary compliance.
20. Bootstrap documentation.
21. Relevant ADR updates where justified.
22. `test-archive/ARC-04/ARC-04-deferred-tests.md`.
23. Completion report.

Implement production functionality rather than only interfaces or documentation.

Do not introduce unrelated application capabilities.

---

# 71. Acceptance Criteria

ARC-04 is implementation-complete when:

```text
[ ] Existing ARC-01 through ARC-03 repository inspected
[ ] Mandatory TypeScript stack preserved
[ ] NestJS remains backend host
[ ] Angular remains frontend framework
[ ] PrimeNG remains primary UI library
[ ] pnpm + Nx remain workspace tooling
[ ] Backend bootstrap entry point is explicit
[ ] Backend configuration is typed
[ ] Required configuration is validated
[ ] Invalid configuration fails startup
[ ] No unsafe silent production defaults exist
[ ] NestJS composition root is clear
[ ] Only implemented modules are registered
[ ] No domain logic is placed in main.ts
[ ] API routing setup is consistent
[ ] CORS policy is explicit where needed
[ ] Startup failures are handled safely
[ ] Shutdown hooks are configured where appropriate
[ ] Health status is minimal and safe
[ ] Readiness describes current implemented capabilities
[ ] No false readiness claims are introduced
[ ] Platform Information endpoint remains available by contract
[ ] Angular standalone bootstrap is preserved
[ ] Angular providers are centrally configured
[ ] Angular Router is configured
[ ] Angular HttpClient is configured
[ ] PrimeNG theme integration is preserved
[ ] PrimeIcons remain compatible where used
[ ] Existing Studio shell is preserved
[ ] Backend/frontend configurations are separated
[ ] Frontend does not contain backend secrets
[ ] Existing frontend/backend vertical slice is preserved
[ ] NestJS dependencies remain outside Platform Core
[ ] Angular dependencies remain outside Platform Core
[ ] PrimeNG dependencies remain outside Experience Semantics
[ ] ARC-02 dependency constraints remain intact
[ ] ARC-03 architecture harness remains intact
[ ] No forbidden deep imports are introduced
[ ] No unrelated future modules are introduced
[ ] No database migrations are introduced
[ ] No microservices are created
[ ] Documentation is updated
[ ] Deferred verification scenarios are archived
[ ] No automated tests are created
[ ] No automated tests are executed
```

These criteria describe implementation requirements, not executed-test evidence.

---

# 72. Completion Report

After implementation, provide:

## A. Implemented Components

List the actual backend bootstrap, configuration, composition, lifecycle, health/readiness, Angular bootstrap, and integration components.

## B. Modified Files

List every created or modified file.

## C. Architectural Decisions

Explain:

- Backend bootstrap design.
- NestJS composition root.
- Configuration ownership.
- Environment validation.
- Startup failure behavior.
- Shutdown semantics.
- Health versus readiness.
- Angular standalone bootstrap.
- PrimeNG configuration.
- Frontend/backend connectivity.
- Dependency boundary preservation.

## D. Workspace Integration

List actual pnpm scripts and Nx targets.

Do not document nonexistent commands.

## E. Static Verification

Report actual non-test command outcomes:

```text
Typecheck: PASS / FAIL / NOT_RUN
Lint: PASS / FAIL / NOT_RUN
Build: PASS / FAIL / NOT_RUN
Backend Live Startup: NOT_RUN unless explicitly permitted and executed
Frontend Live Startup: NOT_RUN unless explicitly permitted and executed
Automated Tests: NOT_RUN — DEFERRED
```

Do not claim success without evidence.

## F. Deferred Test Archive

Report:

```text
Archive:
test-archive/ARC-04/ARC-04-deferred-tests.md

New Tests Implemented:
0

Tests Executed:
0

Status:
NOT_RUN — DEFERRED
```

Include the actual number of scenarios documented.

## G. Risks and Limitations

Identify:

- Unverified live startup.
- Unverified browser rendering.
- Missing deployment-specific configuration.
- Unavailable lifecycle dependencies.
- Deferred API integration testing.
- Known architectural integration gaps.

## H. Next Stage

Stop after ARC-04.

Do not implement ARC-05 automatically.

---

# 73. Final Architectural Guardrail

ARC-04 answers:

> How can the platform reliably initialize its NestJS backend and Angular Studio, validate application configuration, compose current platform capabilities, expose truthful operational readiness, and handle startup and shutdown without allowing framework-specific hosting concerns to leak into the semantic foundation?

It does not answer:

- How semantic elements are modeled.
- How canonical models are constructed.
- How compiler passes are executed.
- How runtime artifacts are loaded.
- How semantic instances execute.
- How persistence is implemented.
- How semantic queries are evaluated.
- How business workflows run.
- How production infrastructure is deployed.

Preserve:

```text
ARC-01 — Repository Architecture
        ↓
ARC-02 — Dependency Rules
        ↓
ARC-03 — Architecture Fitness Test Harness
        ↓
ARC-04 — Platform Bootstrap
        ├── NestJS Backend Host
        │   ├── Validated Configuration
        │   ├── Explicit Composition Root
        │   ├── Controlled Startup
        │   ├── Safe HTTP Setup
        │   ├── Health / Readiness
        │   └── Controlled Shutdown
        │
        ├── Angular Studio
        │   ├── Standalone Bootstrap
        │   ├── Router
        │   ├── HttpClient
        │   ├── PrimeNG
        │   └── Backend Connectivity
        │
        └── Nx / pnpm Application Commands
```

Maintain:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

Use exclusively the established technology stack:

**TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx + ESLint + Prettier + Vitest.**

Keep Platform Core as Pure TypeScript.

Do not introduce Python, Django, or Django REST Framework.

Do not weaken ARC-02 dependency rules or bypass ARC-03 architecture enforcement.

Do not implement semantic compilation, runtime execution, database persistence, AI agents, or unrelated future capabilities.

Do not create or execute automated tests.

Create the mandatory deferred-test Markdown archive inside the repository.

Report only what was actually implemented and verified.

**Complete ARC-04 and stop.**