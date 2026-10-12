# Platform Bootstrap & Application Composition Architecture (ARC-04)

> **Document Version:** 1.0.0  
> **Status:** Approved Architectural Specification  
> **Milestone:** `VS-00: Architecture Skeleton & Contract Harness`  
> **Task Identity:** `ARC-04 — Platform Bootstrap`  
> **Audience:** Platform Architects, Core Systems Engineers, Application Integrators

---

## 1. Executive Overview

`ARC-04 — Platform Bootstrap` establishes the production-grade application composition roots, validated configuration engine, lifecycle management pipeline, observability probes, and decoupled frontend/backend communication pathways for the **Model-Driven Enterprise Ecosystem Platform**.

In accordance with the foundational architecture constitution (`AGENTS.md`), platform business semantics and meta-models remain strictly decoupled from host runtime frameworks. Framework implementations—specifically **NestJS** for backend modular monolith hosting and **Angular** with **PrimeNG** for presentation studio hosting—operate exclusively within application edge boundaries (`apps/api` and `apps/studio`), consuming platform contracts from `@ecosystem/platform-contracts` without leaking framework dependencies into Platform Core packages (`@ecosystem/semantic-kernel`, `@ecosystem/model-core`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        apps/studio (Frontend)                          │
│   • Angular 19 Standalone Bootstrap (bootstrapApplication)             │
│   • FrontendConfig contract (apiBaseUrl: '/api', environment)          │
│   • PlatformInfoService (HttpClient consuming @ecosystem/contracts)    │
│   • Resilient Offline Fallback (handles backend connection failure)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         apps/api (Backend)                             │
│   • NestJS 12 Composition Root (NestFactory.create)                    │
│   • Validated PlatformBackendConfig (Fail-fast at bootstrap)           │
│   • ApplicationLifecycleService (STARTING ──► READY ──► STOPPING...)  │
│   • Health Endpoints (GET /health [Liveness], GET /ready [Readiness])  │
│   • Platform Info Endpoint (GET /platform/info [Contracts Conformance])│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Depends strictly on
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               adapters/shared/platform-contracts                       │
│   • Canonical Wire Contracts (ApiResponse, HealthStatus, Info)        │
│   • Universal Runtime & Framework-Agnostic Purity                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Independent of
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   platform/kernel/semantic-kernel                      │
│   • Pure TypeScript Semantic Primitives, Zero Framework Coupling       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Host Bootstrap (`apps/api`)

### 2.1 Composition Root & Bootstrap Sequence
The backend host composition root is encapsulated in [`apps/api/src/main.ts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/api/src/main.ts). It enforces an explicit, deterministic 7-step startup sequence:

1. **Configuration Resolution & Validation:**  
   Resolves environment variables and validates types and invariants via `validateBackendConfig()`. If invalid, startup aborts immediately before initializing DI containers.
2. **Lifecycle State Transition (`STARTING`):**  
   The application initializes the host lifecycle manager, marking operational state as `STARTING`.
3. **Application Context Composition:**  
   Initializes `NestFactory.create(AppModule, { logger, abortOnError: true })` with global prefix routing (`/api`).
4. **Security & Transport Setup:**  
   Enables CORS policies based on validated origins and configures JSON body parsers with explicit payload limits.
5. **Graceful Shutdown Interceptors:**  
   Hooks `SIGTERM`, `SIGINT`, and unhandled process rejections to trigger controlled application teardown.
6. **Port Binding & Network Activation:**  
   Binds to the configured host interface and port.
7. **Lifecycle State Transition (`READY`):**  
   Transitions operational state to `READY`. The host is now eligible to receive traffic.

### 2.2 Configuration Management & Strict Validation
All backend host configuration is governed by [`PlatformBackendConfig`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/api/src/app/config/backend-config.contract.ts) and validated ahead-of-execution by [`validateBackendConfig`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/api/src/app/config/backend-config.validator.ts).

#### Validation Invariants:
- **Port:** Integer between `1024` and `65535`.
- **Host:** Non-empty valid hostname or IPv4 binding (`0.0.0.0`, `127.0.0.1`, `localhost`).
- **Environment:** Strictly constrained to `'development' | 'staging' | 'production' | 'test'`.
- **Global API Prefix:** Normalized without trailing slashes.
- **CORS Allowed Origins:** Explicit array of allowed URLs; wildcards (`*`) are disallowed in production mode.

If any invariant fails, a descriptive `PlatformConfigurationError` is thrown containing all aggregated failure reasons, terminating the process with exit code `1`.

### 2.3 Operational Lifecycle & Graceful Shutdown
Host operational status is managed as a finite state machine via [`ApplicationLifecycleService`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/api/src/app/lifecycle/application-lifecycle.service.ts):

| Operational State | Description | Liveness Probe | Readiness Probe |
| :--- | :--- | :--- | :--- |
| `STARTING` | NestJS container initializing; dependencies wiring. | `200 OK` (ALIVE) | `503 Service Unavailable` |
| `READY` | Host fully bound and ready to process incoming requests. | `200 OK` (ALIVE) | `200 OK` (READY) |
| `STOPPING` | Teardown initiated (SIGTERM/SIGINT); draining requests. | `200 OK` (ALIVE) | `503 Service Unavailable` |
| `STOPPED` | Teardown complete; process terminating. | `503 Service Unavailable` | `503 Service Unavailable` |

When a termination signal (`SIGTERM` or `SIGINT`) is trapped:
1. State switches to `STOPPING` (causing load balancers to cease forwarding new traffic).
2. Existing in-flight requests complete within a configurable shutdown grace period (default 5000ms).
3. Database connections, message consumers, and caches are gracefully disconnected.
4. State transitions to `STOPPED` and the process exits cleanly with code `0`.

---

## 3. Observability & Health Probes

The backend exposes two standard orchestrator probes under `/api/health`:

### 3.1 Liveness Probe (`GET /api/health`)
- **Purpose:** Verifies that the Node.js process event loop is alive and responding.
- **Response Format:**
  ```json
  {
    "status": "UP",
    "timestamp": "2026-10-12T15:30:00.000Z",
    "uptimeSeconds": 142.5
  }
  ```
- **HTTP Status:** `200 OK` when alive; `503 Service Unavailable` if deadlocked or stopping.

### 3.2 Readiness Probe (`GET /api/health/ready`)
- **Purpose:** Verifies that the host application is in the `READY` state and capable of servicing requests.
- **Response Format:**
  ```json
  {
    "status": "READY",
    "operationalState": "READY",
    "timestamp": "2026-10-12T15:30:00.000Z",
    "uptimeSeconds": 142.5
  }
  ```
- **HTTP Status:** `200 OK` when `READY`; `503 Service Unavailable` during startup or shutdown.

---

## 4. Platform Contracts & Vertical Slice Integration

### 4.1 Canonical Contract Boundary (`@ecosystem/platform-contracts`)
The shared package [`adapters/shared/platform-contracts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/adapters/shared/platform-contracts) provides universal, framework-agnostic wire contracts:
- `ApiResponse<T>`: Standard response envelope with `success`, `data`, `error`, and `timestamp`.
- `PlatformInfoResponse`: Metadata contract detailing platform title, version, environment, status, and uptime.
- `HealthStatus`: Normalized health payload definitions.

### 4.2 Platform Information Endpoint (`GET /api/platform/info`)
Implemented in [`apps/api/src/app/platform-info/platform-info.controller.ts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/api/src/app/platform-info/platform-info.controller.ts), this endpoint returns runtime platform metadata conforming to `PlatformInfoResponse`.

---

## 5. Frontend Host Bootstrap (`apps/studio`)

### 5.1 Standalone Angular Architecture
`apps/studio` is configured using **Angular 19 Standalone Components**, eliminating legacy `NgModule` boilerplate:
- **Root Entry:** [`apps/studio/src/main.ts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/studio/src/main.ts) invokes `bootstrapApplication(AppComponent, appConfig)`.
- **Application Configuration:** [`apps/studio/src/app/app.config.ts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/studio/src/app/app.config.ts) provides `provideZoneChangeDetection`, `provideRouter(routes)`, and `provideHttpClient()`.
- **Frontend Configuration:** [`apps/studio/src/app/config/frontend-config.ts`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/studio/src/app/config/frontend-config.ts) stores client environment parameters (`apiBaseUrl`, `environment`, `appName`).

### 5.2 Decoupled Resilience & Offline Fallback
The frontend presentation shell communicates with the backend via [`PlatformInfoService`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/studio/src/app/services/platform-info.service.ts).
- If the backend host is offline or returning errors, the service catches the HTTP error and returns a controlled `PlatformInfoState` with an actionable error description.
- The Studio shell ([`AppComponent`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/apps/studio/src/app/app.component.ts)) gracefully indicates offline status with instructions on how to boot the backend, preventing application crashes or unhandled promise rejections.

---

## 6. Architectural Boundary Verification

The platform bootstrap implementation was validated against the automated architecture fitness harness ([`tools/architecture/check-dependency-rules.mjs`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/tools/architecture/check-dependency-rules.mjs) and [`tools/architecture/dist/cli.js`](file:///c:/Users/Azman/Documents/app/angular/enterprise-platform/tools/architecture/dist/cli.js)):

1. **Semantic Kernel Independence:** `@ecosystem/semantic-kernel` contains **zero** imports of `@nestjs/*`, `@angular/*`, or any application host code.
2. **Framework Confinement:** Framework modules exist solely within `apps/api` and `apps/studio`.
3. **Public API Boundaries:** Both applications import shared structures exclusively via the public package `@ecosystem/platform-contracts`.
4. **Project Graph Purity:** 0 circular dependencies detected across all workspace projects.
