# Platform CLI Architecture & Developer Tooling Guide

> **Document Version:** 1.0.0  
> **Status:** Approved Architectural Specification  
> **Milestone:** `VS-00: Architecture Skeleton & Contract Harness`  
> **Task Identity:** `ARC-05 — Platform CLI Skeleton`  
> **Package:** `@ecosystem/platform-cli`  
> **Binary Name:** `ecosystem`  
> **Audience:** Contributing Engineers, Platform Architects, DevOps Engineers

---

## 1. Purpose & Scope

The **Platform CLI** (`@ecosystem/platform-cli`) provides the official, framework-independent command-line interface for developers and operators of the **Model-Driven Enterprise Ecosystem Platform**.

In strict adherence to the Architecture Constitution (`AGENTS.md`) and dependency boundaries (`ARC-02`), the Platform CLI operates within the developer tooling layer (`layer:tool`). It provides a lightweight, deterministic command runner without coupling to runtime presentation or backend hosting engines. In particular:
- Running ordinary CLI commands **never initializes NestJS** or boots an HTTP server.
- The CLI **never imports or initializes Angular or PrimeNG**.
- The CLI **never mutates semantic models or simulates runtime execution** before those capabilities are genuinely implemented.

---

## 2. Binary Identity & Invocation

- **Binary Name:** `ecosystem`
- **Package:** `@ecosystem/platform-cli`
- **Executable Location:** `tools/platform-cli/dist/main.js`

### Invocation Methods:

```bash
# Via workspace pnpm script
pnpm cli [command] [options]

# Via Nx task runner
npx nx run platform-cli:run -- [command] [options]

# Via Node.js directly
node tools/platform-cli/dist/main.js [command] [options]
```

---

## 3. Available Built-In Commands

The CLI skeleton implements only real, operational commands. Unimplemented future platform capabilities are never exposed as placeholder commands.

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`help`** | `ecosystem help [command]` | Displays CLI help, lists registered commands, or provides details for a specific command. |
| **`version`** | `ecosystem version` | Outputs the official package version (`v0.1.0`) from package metadata. |

---

## 4. Supported Global Options

Global options can be supplied to any command or used independently:

| Option | Shorthand | Description |
| :--- | :--- | :--- |
| `--help` | `-h` | Displays CLI help information and exits with code `0`. |
| `--version` | `-v` | Displays the CLI binary version and exits with code `0`. |
| `--json` | — | Emits machine-readable, structured JSON output to `stdout` or `stderr`. |
| `--verbose` | — | Emits detailed diagnostic traces to `stderr` upon failure. |

> [!NOTE]
> Any unrecognized option (e.g., `--unknown-flag`) is explicitly rejected with exit code `2` (`INVALID_USAGE`) and a `CLI_UNKNOWN_OPTION` diagnostic.

---

## 5. Architectural Contracts & Layered Design

```
Terminal Invocation
        │
        ▼
[ main.ts ] ──► Safe top-level exception boundary
        │
        ▼
[ cli.ts (runPlatformCli) ]
        ├── resolveCliConfig()
        ├── PlatformCliCommandRegistry (Explicit registration)
        └── PlatformCliCommandRouter (Argument parsing & routing)
                │
        ┌───────┴───────────────────────┐
        ▼                               ▼
[ HelpCommand ]                 [ VersionCommand ]
        │                               │
        └───────────────┬───────────────┘
                        ▼
         PlatformCliCommandResult
         (Status, ExitCode, Output, Diagnostics)
```

### Core Contracts (`tools/platform-cli/src/contracts/`):
- **`PlatformCliCommand`:** Formal interface defining `name`, `description`, optional `usage` / `aliases`, and `execute(context, args)`.
- **`PlatformCliCommandRegistry`:** In-memory registry ensuring deterministic alphabetical ordering and preventing duplicate command or alias registrations.
- **`PlatformCliCommandRouter`:** Validates global options, detects unknown commands, and dispatches to registered handlers within a safe exception boundary.
- **`PlatformCliExecutionContext`:** Operational execution context containing `cwd`, `output`, and `config`. Distinct from runtime business `ExecutionContext`.
- **`PlatformCliOutput`:** Controlled stream abstraction isolating `write` (stdout) and `writeError` (stderr).
- **`PlatformCliCommandResult`:** Standardized return payload with `status` (`SUCCEEDED` | `FAILED` | `INCOMPLETE`), `exitCode`, `output`, `diagnostics`, and optional `data`.

---

## 6. Exit Codes

The Platform CLI adheres to a deterministic, centralized exit-code policy:

| Code | Name | Description |
| :---: | :--- | :--- |
| **0** | `SUCCESS` | Command completed successfully. |
| **1** | `COMMAND_FAILURE` | Command handler failed or uncaught fatal runtime exception occurred. |
| **2** | `INVALID_USAGE` | Invalid arguments, unknown options, or unknown command specified. |
| **3** | `UNSUPPORTED_OR_MISSING_PREREQUISITE` | Requested platform capability is missing or prerequisite unmet. |
| **4** | `CONFIGURATION_FAILURE` | Invalid configuration or workspace context. |

---

## 7. Diagnostics Specification

When an error occurs, the CLI produces structured diagnostics:

```json
{
  "code": "CLI_UNKNOWN_COMMAND",
  "message": "Unknown command \"deploy\". Use \"ecosystem --help\" to see available commands.",
  "severity": "error",
  "commandName": "deploy"
}
```

### Diagnostic Codes:
- `CLI_INVALID_ARGUMENT`: Argument value validation failed.
- `CLI_UNKNOWN_OPTION`: Unrecognized flag passed.
- `CLI_UNKNOWN_COMMAND`: Unregistered command name invoked.
- `CLI_DUPLICATE_COMMAND`: Duplicate registration detected.
- `CLI_INVALID_CONFIGURATION`: Configuration parsing failure.
- `CLI_WORKSPACE_NOT_FOUND`: Workspace root resolution failure.
- `CLI_COMMAND_FAILED`: Execution error within handler.
- `CLI_UNSUPPORTED_CAPABILITY`: Prerequisite platform capability not yet present.
- `CLI_INTERNAL_ERROR`: Unexpected internal exception trapped.

---

## 8. Nx and pnpm Monorepo Integration

The CLI is integrated into the workspace via standard tooling:
- **Nx Project Definition:** `tools/platform-cli/project.json`
- **Build Target:** `npx nx build platform-cli` (compiles to `tools/platform-cli/dist`)
- **Typecheck Target:** `npx nx run platform-cli:typecheck`
- **Run Target:** `npx nx run platform-cli:run -- <args>`
- **pnpm Convenience Scripts:**
  - `pnpm cli <args>`
  - `pnpm cli:build`

---

## 9. Extension Model for Future Platform Commands

Future platform capabilities (e.g., model validation, compilation, runtime execution) must integrate into the CLI exclusively via **explicit command adapters** and **public platform contracts**:

1. Implement `PlatformCliCommand` in a dedicated command adapter file under `tools/platform-cli/src/commands/`.
2. Import only public package entry points (e.g., `@ecosystem/platform-contracts`, `@ecosystem/architecture-harness`).
3. Register the new command explicitly in `runPlatformCli()` inside `tools/platform-cli/src/cli.ts`.
4. Never introduce fake placeholder commands that simulate compilation or execution without real underlying implementations.
