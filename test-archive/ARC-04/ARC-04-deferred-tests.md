# ARC-04 Deferred Test Specification Archive

> **Document Type:** Architectural Test Specification & Deferred Verification Archive  
> **Task Identity:** `ARC-04 — Platform Bootstrap`  
> **Status:** `NOT_RUN — DEFERRED`  
> **Executed Automated Tests:** `0`  
> **Passed Tests:** `0`  
> **Failed Tests:** `0`  
> **Authority:** Non-Negotiable Governance Directive. Testing execution is strictly deferred.

---

## 1. Executive Summary & Deferral Rationale

In strict accordance with the execution mandate for **ARC-04 — Platform Bootstrap**, no automated test runners (`vitest`, `jest`, `nx test`) were invoked, nor were any test suites executed during the implementation of this architectural milestone.

All required verification cases across the 20 testing categories (A through T) are formally cataloged in this specification archive. These test scenarios define the precise behavioral, operational, boundary, and resilience requirements that will be automated and verified during the dedicated test harness milestone (`ARC-05` / `VS-00 Test Integration Phase`).

---

## 2. Test Execution Metrics Dashboard

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Defined Test Scenarios** | 60 | 60 | Complete |
| **Automated Test Files Created** | 0 | 0 | Invariant Preserved |
| **Test Suites Executed** | 0 | 0 | Deferred |
| **Passed Automated Tests** | 0 | 0 | N/A |
| **Failed Automated Tests** | 0 | 0 | N/A |
| **Overall Execution Status** | — | — | `NOT_RUN — DEFERRED` |

---

## 3. Catalog of Deferred Verification Scenarios (Categories A through T)

### Category A: Configuration Validation & Environmental Soundness
- **TC-A01:** `validateBackendConfig` accepts valid configuration object with port `3000`, host `0.0.0.0`, environment `development`, and API prefix `/api`.
- **TC-A02:** `validateBackendConfig` throws `PlatformConfigurationError` when port is below `1024` or above `65535`.
- **TC-A03:** `validateBackendConfig` rejects invalid environment strings outside `'development' | 'staging' | 'production' | 'test'`.
- **TC-A04:** `validateBackendConfig` normalizes API prefix by removing trailing slashes and ensuring leading slash.

### Category B: Application Composition & Dependency Graph
- **TC-B01:** `AppModule` successfully registers `HealthModule`, `PlatformInfoModule`, and `ApplicationLifecycleService` without missing providers.
- **TC-B02:** Injection tokens resolve deterministically with zero circular dependency warnings in the NestJS dependency container.
- **TC-B03:** `ApplicationLifecycleService` is registered as a singleton across all imported modules.

### Category C: Host Startup Sequence & Initialization Determinism
- **TC-C01:** NestJS bootstrap sequence validates configuration prior to module instantiation.
- **TC-C02:** Application fails fast and exits cleanly with exit code `1` when environment configuration is malformed.
- **TC-C03:** Global prefix `/api` is applied uniformly across all registered controllers.

### Category D: Host Operational Lifecycle & State Transitions
- **TC-D01:** Host initializes in `STARTING` operational state.
- **TC-D02:** Host transitions from `STARTING` to `READY` immediately following successful network socket binding.
- **TC-D03:** `ApplicationLifecycleService.isReady()` returns `false` during `STARTING` and `true` during `READY`.

### Category E: Graceful Teardown & Resource Cleanup
- **TC-E01:** Receiving `SIGTERM` transitions host operational state from `READY` to `STOPPING`.
- **TC-E02:** During `STOPPING` state, new requests are rejected or deferred while in-flight operations are allowed to complete.
- **TC-E03:** Host transitions to `STOPPED` and terminates process within the designated shutdown timeout.

### Category F: Liveness & Readiness Observability Probes
- **TC-F01:** `GET /api/health` returns HTTP `200 OK` with `{ status: "UP" }` when host event loop is active.
- **TC-F02:** `GET /api/health/ready` returns HTTP `503 Service Unavailable` when operational state is `STARTING`.
- **TC-F03:** `GET /api/health/ready` returns HTTP `200 OK` with `{ status: "READY" }` when operational state is `READY`.
- **TC-F04:** `GET /api/health/ready` returns HTTP `503 Service Unavailable` once shutdown is triggered (`STOPPING`).

### Category G: Frontend Configuration & Boundary Decoupling
- **TC-G01:** `getFrontendConfig` provides immutable configuration object with `apiBaseUrl`, `environment`, and `version`.
- **TC-G02:** Frontend configuration contains zero backend environment variables, secrets, or database URLs.
- **TC-G03:** `getFrontendConfig` is frozen (`Object.freeze`) preventing runtime mutation by presentation components.

### Category H: Presentation Shell Bootstrap & Client Container
- **TC-H01:** `apps/studio/src/main.ts` bootstraps `AppComponent` using `bootstrapApplication` with `appConfig`.
- **TC-H02:** `appConfig` correctly configures Angular Router and `provideHttpClient()`.
- **TC-H03:** `AppComponent` renders platform dashboard without unhandled JavaScript exceptions.

### Category I: Cross-Host Protocol Contract Conformance
- **TC-I01:** `GET /api/platform/info` payload conforms strictly to `ApiResponse<PlatformInfoResponse>`.
- **TC-I02:** `PlatformInfoResponse` fields (`name`, `version`, `status`, `environment`, `uptimeSeconds`) match contract types.
- **TC-I03:** Angular `PlatformInfoService` successfully deserializes backend response envelope.

### Category J: Resilience, Fault Injection & Offline Degradation
- **TC-J01:** When backend is unreachable (HTTP connection refused / status `0`), `PlatformInfoService` catches error gracefully.
- **TC-J02:** Presentation shell displays offline banner with recovery instructions when backend is down.
- **TC-J03:** Triggering "Refresh Status" retries backend request without requiring page reload.

### Category K: Security Headers, Transport Controls & CORS Isolation
- **TC-K01:** Backend rejects origins not specified in `corsAllowedOrigins`.
- **TC-K02:** CORS wildcard `*` is strictly forbidden and rejected when `NODE_ENV === 'production'`.
- **TC-K03:** JSON payload parser enforces strict body size limit (preventing payload inflation attacks).

### Category L: Clean-Core & Framework Confinement Invariants
- **TC-L01:** Zero imports of `@nestjs/*` or `@angular/*` exist within `platform/kernel/semantic-kernel`.
- **TC-L02:** Zero imports of `@nestjs/*` or `@angular/*` exist within `platform/model/model-core`.
- **TC-L03:** Framework packages are restricted exclusively to `apps/api` and `apps/studio`.

### Category M: Deep Import & Module Boundary Prevention
- **TC-M01:** No imports reference internals such as `@ecosystem/platform-contracts/src/*`.
- **TC-M02:** No relative traverse `../../platform/*` exists across project root boundaries.
- **TC-M03:** All package imports use declared workspace aliases in `tsconfig.base.json`.

### Category N: Cyclic Dependency Invariants
- **TC-N01:** Project dependency graph between `api`, `studio`, `platform-contracts`, `semantic-kernel`, and `model-core` is acyclic.
- **TC-N02:** Neither `apps/api` nor `apps/studio` is imported by any platform library package.

### Category O: Multi-Environment Parity & Precedence
- **TC-O01:** Environment variables override default configuration values deterministically.
- **TC-O02:** Port resolution prioritizes `PORT` environment variable over default port `3000`.
- **TC-O03:** Missing non-mandatory configuration properties default to safe developer values in development mode.

### Category P: Concurrency & Stress Behavior
- **TC-P01:** Simultaneous health probe requests during startup do not cause race conditions in lifecycle state transitions.
- **TC-P02:** Multiple rapid calls to `checkConnectivity()` in frontend do not cause unhandled observable leaks.

### Category Q: Host Memory Footprint & Resource Leak Prevention
- **TC-Q01:** Terminated client connections do not leak memory in the NestJS Express transport adapter.
- **TC-Q02:** Subscriptions in `AppComponent` complete or clean up upon component destruction.

### Category R: Logging, Telemetry & Audit Integrity
- **TC-R01:** Host startup logs output structured bootstrap metadata without emitting raw secrets.
- **TC-R02:** Configuration validation errors provide human-readable diagnostic messages detailing specific failed fields.

### Category S: Build, Bundle & Packaging Determinism
- **TC-S01:** `apps/api` compiles via `tsc -p apps/api/tsconfig.app.json` with zero errors.
- **TC-S02:** `apps/studio` compiles via `tsc -p apps/studio/tsconfig.app.json` with zero errors.
- **TC-S03:** `nx run-many --target=typecheck --all` passes cleanly across all workspace projects.

### Category T: Operational Disaster Recovery & Process Signal Trapping
- **TC-T01:** Uncaught exceptions in background tasks do not corrupt application lifecycle status before shutdown handler runs.
- **TC-T02:** Process signal `SIGINT` triggers clean termination hook identical to `SIGTERM`.

---

## 4. Verification Schedule & Reactivation Criteria

Automated execution of these test cases is scheduled for milestone **ARC-05 / VS-00 Integration Verification**:
1. Integration test harness configuration (`tests/integration/*`).
2. End-to-end contract testing with Supertest and Angular TestBed.
3. Automated test execution report generation.
