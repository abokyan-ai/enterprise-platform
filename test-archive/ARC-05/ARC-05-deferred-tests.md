# ARC-05 — Deferred Test Specification

Task: ARC-05 — Platform CLI Skeleton

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
- ARC-04

---

## 1. Executive Summary & Deferral Rationale

In strict accordance with the mandatory testing policy for **ARC-05 — Platform CLI Skeleton**, no automated tests (`*.spec.ts`, `*.test.ts`) were written or executed, nor were any test runners (`vitest`, `jest`, `nx test`) invoked.

All required verification cases across the 22 categories (A through V) are cataloged in this specification archive. These test scenarios define the exact contract, routing, option parsing, error handling, security, and boundary requirements that will be automated and verified during the scheduled test harness integration phase.

---

## 2. Test Execution Metrics Dashboard

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Defined Test Scenarios** | 66 | 66 | Complete |
| **Automated Test Files Created** | 0 | 0 | Invariant Preserved |
| **Test Suites Executed** | 0 | 0 | Deferred |
| **Passed Automated Tests** | 0 | 0 | N/A |
| **Failed Automated Tests** | 0 | 0 | N/A |
| **Overall Execution Status** | — | — | `NOT_RUN — DEFERRED` |

---

## 3. Catalog of Deferred Verification Scenarios (Categories A through V)

### A. CLI Executable
- **ARC-05-T001:** Valid executable entry point `dist/main.js` can be executed by Node.js with valid shebang `#!/usr/bin/env node`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T002:** Invoking entry point with empty arguments defaults to displaying CLI help and exits with code `0`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T003:** Execution functions reliably in non-interactive CI terminal environments without requiring TTY or interactive prompts. Status: `NOT_RUN — DEFERRED`.

### B. Command Registry
- **ARC-05-T004:** Single valid command (`help`) registers successfully in `PlatformCliCommandRegistry`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T005:** Multiple commands (`help`, `version`) register deterministically with alphabetical enumeration. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T006:** Registering a command with duplicate name throws descriptive Error and prevents registration. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T007:** Registering a command with invalid name (containing uppercase letters or symbols) is rejected. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T008:** Command aliases register without collision with existing command names or aliases. Status: `NOT_RUN — DEFERRED`.

### C. Command Router
- **ARC-05-T009:** Router dispatches known command name to its registered handler. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T010:** Router detects unknown command name, emits `CLI_UNKNOWN_COMMAND` diagnostic, suggests `--help`, and returns exit code `2`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T011:** Router does not perform fuzzy matching or execute approximate command names automatically. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T012:** Router does not execute arbitrary shell commands from parsed command names. Status: `NOT_RUN — DEFERRED`.

### D. Argument Parsing
- **ARC-05-T013:** Parser identifies `--help` and `-h` flags as global help requests. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T014:** Parser identifies `--version` and `-v` flags as global version requests. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T015:** Parser identifies `--json` flag and toggles format to JSON. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T016:** Parser identifies `--verbose` flag and toggles verbose diagnostic logging. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T017:** Parser rejects unknown options (e.g., `--foo`) and returns exit code `2` with `CLI_UNKNOWN_OPTION`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T018:** Parser separates command name from subsequent positional command arguments cleanly. Status: `NOT_RUN — DEFERRED`.

### E. Help
- **ARC-05-T019:** `ecosystem --help` displays CLI title, version, usage, commands, and global options. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T020:** `ecosystem help` produces identical output to `ecosystem --help`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T021:** Help output enumerates only registered, implemented commands; zero placeholder commands appear. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T022:** `ecosystem help help` displays detailed help for the help command itself. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T023:** `ecosystem help unknown-command` returns error diagnostic with exit code `2`. Status: `NOT_RUN — DEFERRED`.

### F. Version
- **ARC-05-T024:** `ecosystem --version` outputs package version string `ecosystem v0.1.0`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T025:** `ecosystem version` outputs package version string matching `package.json`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T026:** Version command does not derive version numbers dynamically from system date or unverified git commits. Status: `NOT_RUN — DEFERRED`.

### G. Execution Context
- **ARC-05-T027:** `PlatformCliExecutionContext` contains valid current working directory (`cwd`). Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T028:** Execution context provides immutable `config` object. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T029:** Execution context provides `output` abstraction isolating streams from raw global process. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T030:** CLI execution context carries zero business authority and cannot be confused with runtime `ExecutionContext`. Status: `NOT_RUN — DEFERRED`.

### H. Configuration
- **ARC-05-T031:** `resolveCliConfig` returns valid frozen configuration object with defaults. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T032:** Configuration options prioritize explicit argument flags over defaults. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T033:** Configuration contains zero backend secrets, database connection strings, or cloud tokens. Status: `NOT_RUN — DEFERRED`.

### I. Results
- **ARC-05-T034:** Successful command returns result object with `status: "SUCCEEDED"` and `exitCode: 0`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T035:** Failed command returns result object with `status: "FAILED"` and `exitCode: 1` or `2`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T036:** Incomplete command returns result object with `status: "INCOMPLETE"` and `exitCode: 3`. Status: `NOT_RUN — DEFERRED`.

### J. Exit Codes
- **ARC-05-T037:** Successful execution sets `process.exitCode = 0`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T038:** Internal command execution error sets `process.exitCode = 1`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T039:** Unknown option or command sets `process.exitCode = 2`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T040:** Missing capability or unmet prerequisite sets `process.exitCode = 3`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T041:** Configuration failure sets `process.exitCode = 4`. Status: `NOT_RUN — DEFERRED`.

### K. Output
- **ARC-05-T042:** Successful command text outputs to standard output stream (`stdout`). Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T043:** Error messages and diagnostics output to standard error stream (`stderr`). Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T044:** When `--json` is specified, valid JSON is written without interleaved debug strings. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T045:** Raw internal stack traces are suppressed by default in normal output mode. Status: `NOT_RUN — DEFERRED`.

### L. Error Handling
- **ARC-05-T046:** Exception thrown inside command handler is trapped by router and converted into `CLI_INTERNAL_ERROR`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T047:** Uncaught exception in main entry point is trapped by top-level boundary and exits with code `1`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T048:** Fatal errors write clean diagnostic message to `stderr` without hanging the process. Status: `NOT_RUN — DEFERRED`.

### M. Async Execution
- **ARC-05-T049:** Asynchronous command returning Promise is awaited before process exit code is evaluated. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T050:** Asynchronous command rejection is caught and mapped to failure exit code. Status: `NOT_RUN — DEFERRED`.

### N. Nx Integration
- **ARC-05-T051:** Nx recognizes `platform-cli` with project tags `["layer:tool", "scope:platform", "runtime:node", "framework:none"]`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T052:** `npx nx run platform-cli:typecheck` runs successfully across the CLI codebase. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T053:** `npx nx run platform-cli:build` compiles TypeScript sources into `dist/tools/platform-cli`. Status: `NOT_RUN — DEFERRED`.

### O. pnpm Integration
- **ARC-05-T054:** `package.json` contains valid package name `@ecosystem/platform-cli` and `bin` entry `ecosystem`. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T055:** Root `package.json` includes `pnpm cli` and `pnpm cli:build` shortcut scripts. Status: `NOT_RUN — DEFERRED`.

### P. Module Compatibility
- **ARC-05-T056:** CLI compiles cleanly to ESM modules compatible with Node 24 runtime environment. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T057:** TypeScript declaration files (`.d.ts`) and source maps are generated for public exports. Status: `NOT_RUN — DEFERRED`.

### Q. Architecture Boundaries
- **ARC-05-T058:** CLI contains zero imports of `@nestjs/core`, `@nestjs/common`, or any backend framework. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T059:** CLI contains zero imports of `@angular/*`, `primeng`, or frontend libraries. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T060:** Semantic Kernel and Model Core have zero dependencies on Platform CLI. Status: `NOT_RUN — DEFERRED`.

### R. Security
- **ARC-05-T061:** Parsed arguments are never passed to `eval()` or `Function()` constructors. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T062:** Commands are never dynamically imported from arbitrary filesystem directories or user inputs. Status: `NOT_RUN — DEFERRED`.

### S. Determinism
- **ARC-05-T063:** Help command outputs registered commands in identical alphabetical order across all runs. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T064:** Exit codes and diagnostics are deterministic given identical command inputs. Status: `NOT_RUN — DEFERRED`.

### T. Documentation & Decisions
- **ARC-05-T065:** `docs/developer-tools/platform-cli.md` accurately documents invocation, commands, and exit codes. Status: `NOT_RUN — DEFERRED`.
- **ARC-05-T066:** `docs/adr/ADR-008-framework-independent-platform-cli.md` documents architectural justification. Status: `NOT_RUN — DEFERRED`.

---

## 4. Verification Schedule & Reactivation Criteria

Automated execution of these test cases will be enabled during the dedicated platform verification and integration test suite phase.
