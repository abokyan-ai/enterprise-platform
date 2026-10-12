# ARC-05 — Platform CLI Skeleton
## Model-Driven Enterprise Ecosystem Platform Architecture
### A. Repository Architecture & Platform Foundation
### Mandatory Technology Stack: TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx

---

## 1. Role and Mission

Act as a Principal Software Architect, TypeScript CLI Architect, Nx Monorepo Engineer, Developer Experience Architect, and Clean Architecture Specialist.

Your assignment is:

**ARC-05 — Platform CLI Skeleton**

Implement the foundational, production-quality skeleton of the platform's official command-line interface within the existing repository established by:

- ARC-01 — Repository Architecture.
- ARC-02 — Dependency Rules.
- ARC-03 — Architecture Fitness Test Harness.
- ARC-04 — Platform Bootstrap.

The central objective is:

> Establish a reliable, typed, extensible, framework-independent Platform CLI that supports command registration, argument parsing, help, version information, structured diagnostics, predictable exit codes, and explicit future command integration without prematurely implementing semantic modeling, compilation, runtime execution, persistence, or deployment capabilities.

The CLI must be a real executable application.

It must not be a collection of placeholder functions.

It must not become a second backend application host.

It must not implement domain behavior directly inside command handlers.

**Implement production code in the actual repository. Do not create or execute automated tests. Create exactly one Markdown archive containing deferred verification scenarios.**

---

# 2. Authoritative Platform Vision

The platform is:

**Model-Driven Enterprise Ecosystem Platform Architecture**

Expanded vision:

**A Composable, Model-Driven Enterprise Ecosystem Platform based on a Unified Semantic Meta-Model, with a Metadata-Compiled Runtime, Clean-Core Extension Model, and AI-Native Execution Architecture.**

Preserve:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

The conceptual platform flow is:

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

The Platform CLI belongs to developer tooling.

It may eventually invoke approved platform application capabilities, but it must not become the owner of semantic meaning.

Preserve:

```text
CLI
    → Developer-facing command interface.

Semantic Kernel
    → Semantic identity and foundational contracts.

Model Core
    → Semantic definitions.

Compiler Core
    → Compilation capabilities.

Runtime Core
    → Runtime execution capabilities.

NestJS
    → Backend application hosting.

Angular + PrimeNG
    → Frontend presentation.
```

Do not reverse these dependencies.

---

# 3. Mandatory Technology Stack

Use the technologies established in ARC-01.

## CLI Implementation

- TypeScript.
- Node.js.
- pnpm Workspaces.
- Nx.
- Existing TypeScript build tooling.

## Backend

- NestJS.
- TypeScript.
- Node.js.
- REST APIs through NestJS when required.
- Modular Monolith.
- Ports and Adapters.

## Frontend

- Angular.
- PrimeNG.
- PrimeIcons where needed.
- Angular Router.
- Angular standalone components.
- Angular HttpClient.

## Development Tooling

- ESLint.
- Prettier.
- Vitest for future authorized tests.
- Architecture Fitness Harness.
- TypeScript Project References where useful.

Do not introduce Python, Django, or Django REST Framework.

Do not replace Nx or pnpm.

Do not introduce a new monorepo manager.

Do not require Angular or NestJS bootstrapping to execute ordinary CLI commands.

---

# 4. Mandatory Repository Inspection

Before implementation, inspect:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
nx.json
tsconfig.base.json
eslint.config.mjs
```

Inspect actual existing paths:

```text
apps/
platform/
adapters/
tools/
tests/
docs/
```

Especially inspect:

- Existing developer tooling.
- Existing command-line scripts.
- Nx executors and targets.
- Existing architecture check CLI.
- Existing package exports.
- Existing logging conventions.
- Existing application configuration.
- Existing error-handling conventions.
- Existing source/build module format.
- Supported Node.js version.
- Installed TypeScript tooling.
- Existing CLI dependencies, if any.

Do not assume that `/tools/cli` already exists.

Do not duplicate an existing command router.

Do not rebuild ARC-01.

---

# 5. Architectural Position

The intended architecture is:

```text
Terminal / Developer
        ↓
Platform CLI Executable
        ├── Argument Parsing
        ├── Command Registry
        ├── Command Routing
        ├── Execution Context
        ├── Configuration
        ├── Help / Version
        ├── Diagnostics
        └── Exit Codes
        ↓
Approved CLI Command Adapter
        ↓
Explicit Platform Public Contract
        ↓
Implemented Platform Application Capability
```

ARC-05 implements the upper CLI infrastructure.

It does not automatically implement every future platform command.

If a future platform capability does not yet exist, do not fabricate it.

---

# 6. Primary Objectives

Implement:

1. Executable Platform CLI package or application.
2. Stable CLI binary name.
3. CLI main entry point.
4. Command contract.
5. Command registry.
6. Command router.
7. Argument parsing.
8. Help command.
9. Version command.
10. Typed CLI execution context.
11. CLI configuration contract.
12. Consistent command results.
13. Structured CLI diagnostics.
14. Exit-code mapping.
15. Safe exception boundary.
16. Controlled output abstraction.
17. Synchronous/asynchronous command support.
18. Explicit command registration.
19. Nx/pnpm integration.
20. Architectural dependency compliance.
21. CLI usage documentation.
22. Deferred verification archive.

Do not implement future compiler or runtime commands.

---

# 7. CLI Application Ownership

Place the CLI in the appropriate existing tooling boundary.

Suggested location:

```text
tools/
└── platform-cli/
    ├── src/
    │   ├── cli.ts
    │   ├── main.ts
    │   ├── contracts/
    │   ├── commands/
    │   ├── registry/
    │   ├── parsing/
    │   ├── reporting/
    │   └── configuration/
    ├── package.json
    ├── project.json
    └── tsconfig.json
```

This structure is illustrative.

Use the smallest practical project structure.

Do not create empty directories.

If the repository already has an established `tools/cli` project, extend it instead.

Do not create a second application architecture merely for the CLI.

---

# 8. CLI Binary Identity

Choose one stable executable identity consistent with existing repository naming.

Suggested:

```bash
ecosystem
```

or:

```bash
ecosystem-cli
```

Inspect existing naming conventions first.

Do not register several competing aliases without a real need.

The binary should be runnable through the workspace's existing pnpm/Nx tooling.

A future packaged release may expose the same binary through the package's `bin` field.

Do not publish an npm package during ARC-05.

---

# 9. CLI Entry Point

Implement a small, explicit entry point.

Conceptually:

```typescript
#!/usr/bin/env node

import { runPlatformCli } from './cli.js';

void runPlatformCli(process.argv.slice(2));
```

Adapt imports to the actual module format.

The entry point must:

- Receive command-line arguments.
- Construct trusted CLI infrastructure.
- Invoke the command router.
- Produce the final output.
- Set the appropriate process exit code.
- Handle unexpected errors safely.

Do not place compiler logic in the entry point.

Do not initialize NestJS.

Do not start an HTTP server.

Do not access databases.

---

# 10. Command Contract

Introduce:

**PlatformCliCommand**

Conceptually:

```typescript
export interface PlatformCliCommand {
  readonly name: string;
  readonly description: string;

  execute(
    context: PlatformCliExecutionContext,
    args: readonly string[],
  ): Promise<PlatformCliCommandResult>;
}
```

This is illustrative.

Adapt the contract to repository conventions.

Commands must have stable identities.

Commands must return controlled results.

Do not require commands to call `process.exit()`.

Do not allow every command to parse global CLI arguments independently.

Do not make command implementations depend on Angular components.

---

# 11. Command Registry

Introduce:

**PlatformCliCommandRegistry**

Its responsibilities:

- Register supported commands explicitly.
- Reject duplicate command names.
- Resolve known commands.
- Enumerate commands for help.
- Preserve deterministic ordering.
- Reject invalid command definitions.

Do not scan arbitrary workspace directories and execute discovered files.

Do not dynamically import untrusted command modules.

Do not create an unrestricted plugin loader.

Use explicit registration in the composition root.

---

# 12. Command Routing

Introduce:

**PlatformCliCommandRouter**

Conceptually:

```text
Command-Line Arguments
        ↓
Parse Global Options
        ↓
Identify Command
        ↓
Resolve Registered Handler
        ↓
Validate Command Arguments
        ↓
Execute Handler
        ↓
Normalize Result
        ↓
Produce Output and Exit Code
```

Unknown commands must produce an actionable error.

Do not silently fall back to a different command.

Do not interpret arbitrary unknown input as a future compiler command.

Do not execute shell commands from command names.

---

# 13. Global CLI Options

Support a minimal set of genuinely useful global options.

Recommended:

```text
--help
-h

--version
-v
```

Optionally:

```text
--json
--quiet
```

only if properly implemented.

Do not introduce dozens of options prematurely.

Do not claim support for an option unless the parser and output behavior actually implement it.

Do not silently ignore unknown global options.

---

# 14. Argument Parsing

Use a reliable argument parser.

Prefer a compatible, already installed library or the Node.js built-in argument parsing facilities supported by the repository's Node version.

Avoid a custom parser when a supported existing mechanism is sufficient.

The parser must distinguish:

- Global options.
- Command names.
- Command-specific arguments.
- Missing required values.
- Unknown options.
- Invalid option combinations.

Do not evaluate arbitrary argument strings as code.

Do not interpolate command input into shell commands.

---

# 15. Help Command

Provide usable help output.

Expected conceptual invocation:

```bash
ecosystem --help
```

Example:

```text
Model-Driven Enterprise Ecosystem CLI

Usage:
  ecosystem <command> [options]

Commands:
  help       Show CLI help
  version    Show CLI version

Options:
  -h, --help       Show help
  -v, --version    Show version
```

Use actual registered commands.

Do not advertise unimplemented compiler, model, runtime, or deployment commands as available.

The help output must come from the command registry or a consistent command metadata source.

Do not maintain contradictory duplicated command lists.

---

# 16. Version Command

Provide:

```bash
ecosystem --version
```

and/or:

```bash
ecosystem version
```

Use the actual CLI package version.

Do not hardcode an arbitrary release version.

If package metadata is unavailable, fail explicitly or follow an approved development-version convention.

Do not derive the version from the current date.

Do not display unsupported platform capability versions.

Distinguish:

```text
CLI Package Version
    ≠
Semantic Model Version
    ≠
Runtime Artifact Version
    ≠
Platform Deployment Version
```

---

# 17. Unknown Command Handling

Example:

```bash
ecosystem unknown-command
```

Expected:

```text
Unknown command: unknown-command
```

Accompany the message with an appropriate help suggestion.

Use a nonzero exit code.

Do not invoke a similarly named command automatically.

Do not implement fuzzy command execution.

Suggestions may be informational only.

---

# 18. Command Execution Context

Introduce:

**PlatformCliExecutionContext**

Conceptually:

```typescript
export interface PlatformCliExecutionContext {
  readonly cwd: string;
  readonly output: PlatformCliOutput;
  readonly config: PlatformCliConfig;
}
```

Use actual types and repository conventions.

The context may include:

- Working directory.
- Explicit CLI configuration.
- Controlled output interface.
- Approved command services.

Do not confuse this with RUN-05 Runtime ExecutionContext.

The CLI context is an operational developer-tooling context.

It does not grant runtime business authority.

It must not contain unrestricted mutable process state.

---

# 19. CLI Context Versus Runtime Context

Preserve:

```text
PlatformCliExecutionContext
    → Developer tooling invocation.

Runtime ExecutionContext
    → Runtime operation boundary.

SemanticContextRef
    → Semantic meaning scope.
```

These are separate concepts.

Do not reuse a runtime execution-context class as a generic CLI context.

Do not make CLI invocation automatically activate a runtime model.

Do not treat a local terminal user as authorized to execute every future platform action.

---

# 20. CLI Configuration

Introduce:

**PlatformCliConfig**

or reuse an existing compatible configuration contract.

Potential configuration:

```text
Workspace Root
Output Format
Diagnostic Verbosity
```

Only implement fields genuinely required today.

Do not create a universal platform configuration object.

Do not import NestJS application configuration into the CLI.

Do not duplicate semantic model configuration.

Do not put database credentials into CLI defaults.

---

# 21. Configuration Precedence

If the CLI accepts configuration from multiple sources, define explicit precedence.

Possible sources:

```text
Explicit CLI Arguments
Environment Variables
Approved Workspace Configuration
Built-in Safe Defaults
```

Implement only sources currently required.

Do not silently read arbitrary configuration files.

Do not introduce an undocumented configuration search hierarchy.

Do not treat untrusted workspace content as executable code.

---

# 22. Workspace Awareness

The CLI should operate predictably inside the pnpm/Nx monorepo.

Use actual workspace conventions.

If workspace-root discovery is needed:

- Prefer supported Nx/pnpm mechanisms.
- Validate detected paths.
- Avoid unbounded ancestor searching.
- Do not assume every invocation starts from the repository root.
- Report missing workspace context explicitly.

Do not silently create a new workspace.

Do not rewrite `nx.json`.

Do not run `pnpm install` as an implicit startup step.

---

# 23. Output Abstraction

Introduce a narrow output contract.

Suggested:

**PlatformCliOutput**

Conceptually:

```typescript
export interface PlatformCliOutput {
  write(message: string): void;
  writeError(message: string): void;
}
```

Use an appropriately named stream/output interface.

Avoid injecting raw `process` throughout command implementations.

Do not create a general-purpose terminal UI framework.

Do not require interactive terminal support for ordinary commands.

---

# 24. Standard Output and Standard Error

Follow conventional CLI behavior.

Use stdout for:

- Help.
- Version.
- Successful command output.
- Machine-readable successful output.

Use stderr for:

- Invalid arguments.
- Unknown commands.
- Operation failures.
- Unexpected exceptions.

Do not mix debug logs into machine-readable stdout.

Do not print stack traces by default.

Do not expose secrets.

---

# 25. CLI Command Result

Introduce:

**PlatformCliCommandResult**

Suggested statuses:

```text
SUCCEEDED
FAILED
INCOMPLETE
```

Alternatively, reuse a compatible existing result model.

The result should include:

```text
Status
Optional Output
Structured Diagnostics
```

Do not use a Boolean result for every possible command outcome.

Do not confuse command execution success with semantic model validity.

Do not return SUCCEEDED when the command's mandatory capability is unavailable.

---

# 26. Exit Code Model

Define stable exit codes.

Suggested mapping:

```text
0 — Successful Command
1 — Command Failure
2 — Invalid Usage or Arguments
3 — Missing Prerequisite / Unsupported Capability
4 — Configuration Failure
```

These values are illustrative.

Follow existing conventions if they are already established.

Document the actual mapping.

Do not let individual command implementations assign unrelated arbitrary exit codes.

Do not call `process.exit()` deep inside command handlers.

Prefer setting `process.exitCode` at the executable boundary.

---

# 27. CLI Diagnostics

Introduce or reuse a lightweight CLI diagnostic contract.

Suggested conceptual fields:

```text
Diagnostic Code
Message
Severity
Command Name
Relevant Argument
```

Do not introduce a competing Semantic Kernel diagnostic hierarchy.

Use SK-11-inspired conventions only where compatible.

CLI argument errors do not need to become SemanticElements.

Do not classify an unknown command as a compiler error.

Do not fabricate source locations.

---

# 28. Diagnostic Categories

Support common CLI infrastructure failures:

```text
CLI_INVALID_ARGUMENT
CLI_UNKNOWN_OPTION
CLI_UNKNOWN_COMMAND
CLI_DUPLICATE_COMMAND
CLI_INVALID_CONFIGURATION
CLI_WORKSPACE_NOT_FOUND
CLI_COMMAND_FAILED
CLI_UNSUPPORTED_CAPABILITY
CLI_INTERNAL_ERROR
```

Reuse actual repository conventions.

Do not create a global error catalog for unimplemented platform capabilities.

Do not derive diagnostic codes from user input.

---

# 29. Unexpected Error Boundary

Unexpected errors must be handled at the CLI entry point.

Requirements:

- Convert unexpected failures into a controlled command failure.
- Produce a safe message.
- Preserve a nonzero exit code.
- Avoid printing sensitive internal data.
- Do not swallow failures.
- Do not represent unexpected exceptions as successful command results.

Do not use broad exception swallowing inside every command.

Do not automatically retry commands.

Do not implement a generic error recovery engine.

---

# 30. Synchronous and Asynchronous Commands

Support command handlers that may eventually perform asynchronous work.

Use an asynchronous execution contract.

Do not create separate incompatible sync and async command systems.

A synchronous handler may return an already resolved result through an approved adapter.

Do not start background work implicitly.

Do not detach unresolved command promises.

The CLI process should complete only after its explicitly invoked command finishes.

---

# 31. Deterministic Command Registration

Given the same explicit command registrations, the CLI must expose the same command set and help ordering.

Do not use filesystem enumeration order to determine command priorities.

Do not register commands through untrusted directory discovery.

Do not silently overwrite duplicate names.

Do not depend on object property insertion accidents.

Use a stable ordering policy.

---

# 32. Command Naming

Use clear, stable command names.

Examples:

```text
help
version
```

Reserve future command namespaces conceptually:

```text
model
compile
runtime
package
workspace
```

Do not register these as operational commands until real capabilities exist.

Do not create handlers that falsely report successful compilation or execution.

Do not introduce ambiguous aliases.

---

# 33. No Fake Future Commands

Forbidden examples:

```bash
ecosystem compile
ecosystem deploy
ecosystem runtime start
ecosystem model validate
```

when the actual services do not exist.

Do not implement handlers that merely print:

```text
Compilation completed successfully
```

without a compiler.

Do not simulate runtime execution.

Do not silently create placeholder artifacts.

Do not represent unimplemented capabilities as successful commands.

A future command may be described as planned in documentation but must not appear as executable functionality.

---

# 34. Optional Architecture Command Integration

ARC-03 established the Architecture Fitness Test Harness.

If the actual repository exposes a stable public programmatic interface, an explicit CLI command may delegate to it.

Conceptually:

```bash
ecosystem architecture check
```

This integration is optional and must be justified by existing contracts.

Requirements:

- Reuse the actual ARC-03 harness.
- Do not duplicate architecture rules.
- Preserve PASS/FAIL/INCOMPLETE semantics.
- Preserve nonzero failure exit codes.
- Do not fabricate architecture evidence.
- Do not silently run the check during ordinary CLI startup.

If a reliable integration contract does not exist, leave this command unregistered and document the missing prerequisite.

Under this task's deferred-testing policy, do not execute the architecture check.

---

# 35. Command Composition

Register commands explicitly in the CLI composition root.

Conceptually:

```typescript
const commands = [
  createHelpCommand(),
  createVersionCommand(),
];
```

Actual implementation may use a different pattern.

Do not use NestJS Dependency Injection solely for command registration.

Do not introduce decorators for commands without a compelling existing convention.

Keep command infrastructure framework-independent.

---

# 36. Dependency Inversion

The CLI may depend on approved public platform contracts.

Platform Core must not depend on the CLI.

Preserve:

```text
CLI Adapter
      ↓
Platform Application Contract
      ↓
Pure TypeScript Platform Capability
```

Do not reverse this dependency.

Do not import CLI command types into Semantic Kernel.

Do not place command-line parsing inside Model Core.

Do not expose `process.argv` to Compiler Core.

---

# 37. Nx Integration

Register the CLI as an actual Nx project or target following existing workspace conventions.

Possible commands:

```bash
pnpm nx run platform-cli:build
pnpm nx run platform-cli:run
```

These are illustrative.

Use actual project names and targets.

Do not add scripts referencing nonexistent projects.

Do not create duplicate Nx tooling projects without a real need.

Ensure the CLI build output matches the repository's TypeScript module format.

---

# 38. pnpm Integration

Add practical workspace scripts where justified.

Examples:

```json
{
  "scripts": {
    "cli": "nx run platform-cli:run",
    "cli:build": "nx run platform-cli:build"
  }
}
```

Adapt to actual project configuration.

Do not use fake scripts that always return success.

Do not execute unrelated tasks from the CLI startup path.

Do not replace existing pnpm scripts.

---

# 39. CLI Packaging

Configure package metadata if the CLI is a distinct workspace package.

Potential fields:

```json
{
  "name": "@ecosystem/platform-cli",
  "private": true,
  "bin": {
    "ecosystem": "./dist/main.js"
  }
}
```

This is illustrative.

Use the actual output location.

Ensure the built entry point contains a compatible executable shebang.

Do not point the `bin` field to a nonexistent file.

Do not publish the CLI package.

Do not add npm publishing infrastructure.

---

# 40. ESM/CJS Compatibility

Inspect actual repository module conventions.

Consider:

- Node.js version.
- TypeScript module target.
- Module resolution.
- Package type.
- Build output.
- Executable imports.
- Source-to-dist paths.

Do not copy ESM import examples blindly into a CommonJS package.

Do not introduce incompatible relative import extensions.

Do not change the whole workspace module system to simplify CLI construction.

---

# 41. Platform Bootstrap Separation

ARC-04 established NestJS and Angular bootstrap.

The Platform CLI is separate.

Preserve:

```text
apps/api
    → NestJS application host.

apps/studio
    → Angular frontend host.

tools/platform-cli
    → Node.js developer tooling.
```

Do not start NestJS when running `ecosystem --help`.

Do not initialize Angular when running `ecosystem --version`.

Do not create an HTTP listener from the CLI skeleton.

Do not import application bootstrap implementations unnecessarily.

---

# 42. Architecture Rule Compliance

ARC-02 governs dependency directions.

ARC-03 supplies architecture fitness infrastructure.

The CLI must comply with both.

Do not:

- Import private files from Semantic Kernel.
- Import NestJS application internals without an approved boundary.
- Import Angular components.
- Introduce a cycle between CLI and platform packages.
- Modify Nx tags to bypass an invalid dependency.

If existing architecture rules require a developer-tooling tag, reuse or add the appropriate classification.

Do not classify the CLI as Semantic Kernel.

---

# 43. CLI and Angular Studio

The CLI is not a frontend application.

Do not use:

```text
Angular
PrimeNG
PrimeIcons
Angular Router
Angular HttpClient
```

inside the Node.js CLI.

These technologies remain mandatory for the platform's frontend but are not dependencies of every platform tool.

Do not build a browser-based terminal UI in ARC-05.

---

# 44. CLI and NestJS

NestJS remains the backend host technology.

A lightweight CLI should not require NestJS application initialization.

Do not introduce `NestFactory` to run help/version commands.

Do not create a duplicate NestJS root module for the CLI.

Future CLI operations may communicate with an existing NestJS API through an explicit client adapter if a later task requires it.

That is out of scope for ARC-05.

---

# 45. CLI Security

Treat command-line inputs and workspace files as untrusted data.

Do not:

- Execute arbitrary shell commands from parsed arguments.
- Use `eval()` or `Function()`.
- Dynamically import arbitrary user-selected modules.
- Load executable configuration from untrusted locations.
- Include secrets in error output.
- Print all environment variables.
- Follow unsafe workspace paths without validation.
- Create filesystem artifacts without an explicit command.

Do not invent an authentication system.

Do not implement credential storage.

---

# 46. Filesystem Boundaries

Help and version commands should not mutate the filesystem.

Workspace discovery must be read-only.

Do not create configuration files merely by invoking the CLI.

Do not run package installation automatically.

Do not create a hidden user cache unless an existing approved CLI convention requires it.

If future commands need filesystem writes, those commands must define their own explicit policies.

---

# 47. Machine-Readable Output

Optional JSON output may be supported if implemented consistently.

Conceptually:

```bash
ecosystem --json version
```

A machine-readable result should contain stable fields.

Do not mix progress logs with JSON stdout.

Do not make arbitrary JavaScript objects serializable through unsafe reflection.

Do not invent a universal JSON-RPC protocol.

If JSON output is not implemented, reject `--json` rather than silently ignoring it.

---

# 48. Interactive Mode

Do not implement interactive mode.

Do not create a wizard framework.

Do not depend on terminal prompts for ordinary commands.

Do not create TUI dashboards.

The initial CLI should work in noninteractive terminal and CI environments.

Interactive developer workflows may be added through future explicit tasks.

---

# 49. Terminal Portability

Support the operating systems established by the repository's development environment.

Use Node.js path utilities.

Avoid hardcoded Unix-only paths where unnecessary.

Do not assume Bash is available for command routing.

Do not embed shell-specific command execution in the TypeScript core.

Ensure output works without terminal color support.

Do not require an interactive TTY.

---

# 50. Resource and Output Limits

Protect the CLI from unbounded processing.

For the skeleton:

- Limit unreasonable argument counts where needed.
- Avoid unbounded diagnostic collections.
- Avoid dumping entire configuration objects.
- Bound help and error suggestions.
- Avoid recursive command alias resolution.

Do not implement a general resource scheduler.

Do not introduce distributed cancellation.

---

# 51. CLI Version Source

Version output must use a legitimate source of truth.

Prefer:

- CLI package metadata.
- Approved generated build metadata.
- Existing workspace release metadata.

Do not invent a version number.

Do not hardcode the current date.

Do not use semantic model version identifiers as CLI package versions.

Do not claim the entire platform shares one version unless the repository explicitly defines that release model.

---

# 52. Documentation

Create or update an appropriate CLI document.

Suggested location:

```text
docs/developer-tools/platform-cli.md
```

Use the repository's actual documentation structure.

Document:

1. Purpose.
2. Supported commands.
3. CLI binary name.
4. Invocation syntax.
5. Help behavior.
6. Version behavior.
7. Global options.
8. Command registration.
9. Result statuses.
10. Exit codes.
11. Output conventions.
12. Configuration.
13. Nx/pnpm integration.
14. Architecture boundaries.
15. Future extension requirements.
16. Known limitations.

Do not document future commands as implemented.

---

# 53. Architecture Decision Records

Inspect the existing ARC-01 through ARC-04 ADRs.

Do not create duplicate decisions.

If CLI architecture introduces a genuine significant decision, create an ADR using the existing numbering conventions.

Suggested decision subject:

**Framework-Independent Platform CLI as Developer Tooling.**

Explain:

- Why the CLI uses Node.js and TypeScript.
- Why ordinary commands do not initialize NestJS.
- Why commands delegate through public contracts.
- Why registration is explicit.
- Why future capabilities are not implemented as placeholders.

Do not create unnecessary ADR files.

---

# 54. Mini CLI Scenarios

Use the real project identity.

## 54.1 Help

Input:

```bash
ecosystem --help
```

Expected behavior:

- Display CLI identity.
- Display available implemented commands.
- Display supported global options.
- Exit successfully.

Do not display nonexistent commands as available.

## 54.2 Version

Input:

```bash
ecosystem --version
```

Expected behavior:

- Read the actual CLI version.
- Display it using the documented format.
- Exit successfully.

Do not invent platform deployment version.

## 54.3 Unknown Command

Input:

```bash
ecosystem not-a-command
```

Expected behavior:

- Produce a controlled unknown-command diagnostic.
- Suggest help.
- Return nonzero exit code.

Do not silently execute another command.

## 54.4 Unknown Option

Input:

```bash
ecosystem --unknown-option
```

Expected behavior:

- Produce an invalid-option diagnostic.
- Return a usage-error exit code.

Do not ignore the option.

## 54.5 Duplicate Registration

Two command handlers attempt to register the same command name.

Expected behavior:

- Registration conflict.
- No last-write-wins.
- Deterministic diagnostic.

## 54.6 Architecture Check Integration

If the actual ARC-03 harness exposes an approved public API, a future CLI command may delegate to it.

Do not fabricate this integration.

Do not invoke architecture fitness checks during CLI bootstrap.

## 54.7 No Domain Side Effects

Calling help or version must not:

- Compile models.
- Load runtime artifacts.
- Register runtime definitions.
- Persist semantic instances.
- Emit Events.
- Execute Actions.
- Start NestJS.
- Start Angular.
- Change repository source files.

These are intended verification scenarios, not executed results.

---

# 55. Explicit Non-Goals

Do not implement:

```text
Semantic Kernel Features
Semantic Type Definitions
Model Parsing
Canonicalization
Compiler Execution
Semantic IR Generation
Runtime Artifact Generation
Runtime Artifact Loader
Runtime Model Registry
Semantic Instance Runtime
Runtime Validation
Runtime Execution Context
Database Persistence
Query Engine
Action Dispatch
Event Emission
Workflow Execution
Policy Engine
Package Marketplace
Extension Installation
Model Migration
Production Deployment
Cloud Infrastructure
Authentication System
Credential Storage
Interactive Wizard Framework
TUI Dashboard
Angular-Based CLI
NestJS CLI Application Host
AI Agent Execution
```

Do not implement ARC-06 automatically.

---

# 56. Implementation Sequence

Perform the following steps.

### Phase 1 — Repository Inspection

1. Inspect ARC-01 through ARC-04 outputs.
2. Inspect existing tooling packages.
3. Inspect Node.js and TypeScript versions.
4. Inspect existing command-line conventions.
5. Inspect Nx and pnpm targets.
6. Identify existing logging and diagnostics.

### Phase 2 — CLI Contracts

7. Define PlatformCliCommand.
8. Define PlatformCliCommandResult.
9. Define PlatformCliExecutionContext.
10. Define PlatformCliConfig.
11. Define CLI diagnostic and output interfaces.
12. Define exit-code policy.

### Phase 3 — Command Infrastructure

13. Implement command registry.
14. Implement duplicate detection.
15. Implement command router.
16. Implement argument parsing.
17. Implement explicit command registration.
18. Implement unknown-command behavior.

### Phase 4 — Built-In Commands

19. Implement help.
20. Implement version.
21. Implement supported global options.
22. Implement consistent formatting.

### Phase 5 — Executable Integration

23. Implement Node.js entry point.
24. Configure package metadata.
25. Configure binary output.
26. Integrate with Nx.
27. Integrate with pnpm scripts.
28. Preserve workspace compatibility.

### Phase 6 — Architecture

29. Confirm dependency direction.
30. Preserve ARC-02 restrictions.
31. Preserve ARC-03 harness.
32. Keep NestJS and Angular outside CLI core.
33. Avoid private deep imports.

### Phase 7 — Documentation

34. Document CLI commands.
35. Document extension conventions.
36. Document exit codes.
37. Record genuine architecture decisions.

### Phase 8 — Deferred Verification

38. Create mandatory deferred-test Markdown archive.
39. Document positive and negative scenarios.
40. Do not create automated tests.
41. Do not execute automated tests.

### Phase 9 — Completion

42. Inspect implemented source.
43. Perform permitted static checks.
44. Report actual results.
45. Identify unsupported assumptions.
46. Stop after ARC-05.

---

# 57. Mandatory Deferred Test Archive

Testing is intentionally deferred.

**Do not create or execute automated tests.**

Create exactly one Markdown document for ARC-05 inside the working repository.

Required path:

```text
test-archive/
└── ARC-05/
    └── ARC-05-deferred-tests.md
```

Preserve all previous task archives.

If the document already exists, preserve its previous scenarios and genuine historical execution evidence.

Do not create additional test archive files for ARC-05.

---

# 58. Deferred Archive Header

Use:

```markdown
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
```

---

# 59. Deferred Scenario Format

Every scenario must include:

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

Use stable sequential IDs:

```text
ARC-05-T001
ARC-05-T002
ARC-05-T003
...
```

Mark every newly documented scenario:

```text
NOT_RUN — DEFERRED
```

Do not include runnable test implementations.

---

# 60. Mandatory Deferred Verification Categories

## A. CLI Executable

- Valid executable entry point.
- Invalid entry point configuration.
- Missing built output.
- Compatible Node.js module loading.
- Valid shebang.
- Noninteractive invocation.

## B. Command Registry

- Single valid command registration.
- Multiple commands.
- Duplicate name.
- Invalid name.
- Unknown command.
- Stable ordering.
- No arbitrary dynamic import.

## C. Command Router

- Known command.
- Unknown command.
- Missing command.
- Nested command if supported.
- Correct handler resolution.
- No implicit fallback.
- No shell execution.

## D. Argument Parsing

- Valid global flag.
- Unknown flag.
- Missing value.
- Invalid combination.
- Repeated flag.
- Positional arguments.
- Quoted argument behavior.
- Excessive argument count.

## E. Help

- Global help.
- Help alias.
- Actual command enumeration.
- Stable output.
- No nonexistent commands.
- No side effects.

## F. Version

- Global version option.
- Version command.
- Real package version.
- Missing metadata.
- Invalid version source.
- No date-derived version.

## G. Execution Context

- Valid CLI context.
- Working directory.
- Output interface.
- Configuration.
- No runtime ExecutionContext confusion.
- No mutable global invocation state.

## H. Configuration

- Valid explicit configuration.
- Invalid configuration.
- Workspace discovery.
- Missing workspace.
- Config precedence.
- No secret leakage.
- No executable untrusted configuration.

## I. Results

- SUCCEEDED.
- FAILED.
- INCOMPLETE.
- Invalid result.
- Structured diagnostics.
- No success on missing capability.

## J. Exit Codes

- Successful command.
- Unknown command.
- Invalid usage.
- Unsupported capability.
- Configuration failure.
- Unexpected internal failure.
- No zero exit on known failure.

## K. Output

- Success stdout.
- Error stderr.
- Help formatting.
- Version formatting.
- No raw stack traces.
- JSON if implemented.
- No mixed logs in machine-readable output.

## L. Error Handling

- Expected command failure.
- Unexpected exception.
- Safe internal error.
- Rejected invalid command.
- No swallowed failure.
- No automatic retry.

## M. Async Execution

- Asynchronous successful command.
- Asynchronous rejected command.
- Awaited completion.
- No detached background process.
- No premature process exit.

## N. Nx Integration

- Valid CLI Nx project.
- Valid build target.
- Valid run target.
- Correct source/output paths.
- Existing project preservation.
- No nonexistent target.

## O. pnpm Integration

- Valid workspace package.
- Correct `bin` metadata.
- Valid pnpm script.
- No accidental dependency hoisting.
- No package publication.
- No automatic install.

## P. Module Compatibility

- Existing ESM/CJS mode.
- TypeScript compile output.
- Relative import resolution.
- Package export correctness.
- Executable output path.

## Q. Architecture Boundaries

- CLI does not import Angular.
- CLI does not import PrimeNG.
- CLI does not bootstrap NestJS.
- Platform Core does not import CLI.
- CLI uses public package APIs.
- No project dependency cycle.
- No private deep import.

## R. Security

- No `eval()`.
- No arbitrary shell injection.
- No dynamic loading of untrusted commands.
- No arbitrary executable workspace config.
- No credential leakage.
- No uncontrolled filesystem writes.
- Safe path handling.

## S. Determinism

- Stable command list.
- Stable help order.
- Stable diagnostic codes.
- Stable exit-code mapping.
- No random command resolution.
- No filesystem-order dependency.

## T. Documentation

- Correct supported command list.
- CLI usage.
- Exit codes.
- Configuration precedence.
- Workspace invocation.
- Extension instructions.
- No invented future commands.

## U. Existing Platform Preservation

- NestJS API unchanged.
- Angular Studio unchanged.
- PrimeNG integration preserved.
- ARC-02 dependency rules preserved.
- ARC-03 fitness harness preserved.
- ARC-04 bootstrap preserved.

## V. Future Capability Boundaries

- No compiler command implementation.
- No runtime execution command.
- No persistence command.
- No deployment command.
- No package installation.
- No AI agent execution.
- No placeholder success handlers.

Document positive, negative, failure, security, portability, incomplete-capability, and architectural boundary scenarios.

---

# 61. Test Execution Restrictions

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

Do not execute manual CLI smoke tests disguised as static analysis.

Do not run help/version commands solely as deferred behavioral tests.

Permitted non-test activities include:

- Source inspection.
- Configuration inspection.
- TypeScript syntax checks.
- Typechecking.
- Non-test linting.
- Non-test building when necessary.

Report actual non-test checks separately.

Do not claim CLI command behavior has passed verification unless it was genuinely verified under an explicitly permitted policy.

---

# 62. Required Deliverables

Produce:

1. Actual executable Platform CLI package.
2. Stable CLI binary identity.
3. Node.js entry point.
4. PlatformCliCommand contract.
5. PlatformCliCommandRegistry.
6. PlatformCliCommandRouter.
7. Argument parser.
8. Help command.
9. Version command.
10. PlatformCliExecutionContext.
11. PlatformCliConfig.
12. PlatformCliOutput interface.
13. PlatformCliCommandResult.
14. Structured CLI diagnostics.
15. Exit-code mapping.
16. Unexpected-error boundary.
17. Explicit command composition.
18. Nx integration.
19. pnpm integration.
20. Compatible executable packaging.
21. Architecture boundary compliance.
22. CLI documentation.
23. Relevant ADR if justified.
24. `test-archive/ARC-05/ARC-05-deferred-tests.md`.
25. Completion report.

Implement production functionality rather than only interfaces and diagrams.

---

# 63. Acceptance Criteria

ARC-05 is implementation-complete when:

```text
[ ] Actual ARC-01 through ARC-04 repository inspected
[ ] Mandatory technology stack preserved
[ ] Platform CLI is implemented in TypeScript
[ ] CLI runs in Node.js without NestJS bootstrap
[ ] CLI does not initialize Angular
[ ] CLI has a real executable entry point
[ ] CLI binary identity is stable
[ ] Command contract is typed
[ ] Command registry is implemented
[ ] Duplicate commands are rejected
[ ] Command router is implemented
[ ] Argument parsing is implemented
[ ] Unknown command handling is explicit
[ ] Unknown options are rejected
[ ] Help is implemented
[ ] Help lists only actual registered commands
[ ] Version command uses real package metadata
[ ] CLI execution context is explicit
[ ] CLI context is distinct from runtime ExecutionContext
[ ] CLI configuration is typed
[ ] Output abstraction is implemented
[ ] stdout and stderr are handled consistently
[ ] Command result statuses are explicit
[ ] Exit-code policy is centralized
[ ] Known failures produce nonzero exit codes
[ ] Unexpected errors have safe handling
[ ] Async command execution is awaited
[ ] Command registration is deterministic
[ ] No arbitrary dynamic command loading occurs
[ ] No fake future commands are introduced
[ ] CLI does not compile semantic models
[ ] CLI does not execute runtime business behavior
[ ] CLI does not persist business state
[ ] CLI does not emit business events
[ ] Nx project/target integration exists
[ ] pnpm workspace integration exists
[ ] Executable packaging matches actual build output
[ ] ARC-02 dependency rules are preserved
[ ] ARC-03 harness is preserved
[ ] ARC-04 platform bootstrap is preserved
[ ] No forbidden deep imports are introduced
[ ] No project dependency cycles are introduced
[ ] No unrelated framework is introduced
[ ] CLI documentation is provided
[ ] test-archive/ARC-05/ exists
[ ] ARC-05-deferred-tests.md exists
[ ] Deferred verification scenarios are documented
[ ] No automated tests are created
[ ] No automated tests are executed
```

These are implementation expectations, not executed test results.

---

# 64. Completion Report

After implementation, provide:

### Implemented CLI Components

List actual:

- Entry point.
- Registry.
- Router.
- Parser.
- Commands.
- Configuration.
- Output adapters.
- Diagnostic handling.
- Exit-code mapping.

### Repository Integration

Describe:

- Nx project and targets.
- pnpm package and scripts.
- Binary packaging.
- TypeScript module compatibility.

### Architectural Decisions

Explain:

- Why the CLI remains independent of NestJS startup.
- Why commands register explicitly.
- Why CLI results are distinct from runtime results.
- How future commands integrate through public contracts.
- Why no placeholder future commands were added.

### Modified Files

List all actual created or modified files.

### Static Verification

Report actual outcomes:

```text
Typecheck: PASS / FAIL / NOT_RUN
Lint: PASS / FAIL / NOT_RUN
Build: PASS / FAIL / NOT_RUN
CLI Behavioral Tests: NOT_RUN — DEFERRED
```

Do not fabricate successful execution.

### Deferred Test Archive

Report:

```text
Archive:
test-archive/ARC-05/ARC-05-deferred-tests.md

New Tests Implemented:
0

Tests Executed:
0

Status:
NOT_RUN — DEFERRED
```

Include the actual number of documented deferred scenarios.

### Risks and Limitations

Identify:

- Unverified executable behavior.
- Unverified Windows/macOS compatibility.
- Existing build configuration limitations.
- Missing architecture harness integration.
- Deferred future command capabilities.

### Next Stage

Stop after ARC-05.

Do not implement ARC-06 automatically.

---

# 65. Final Architectural Guardrail

ARC-05 answers:

> How can the platform provide a stable, executable, extensible, developer-facing CLI entry point that handles commands, arguments, configuration, diagnostics, and exit codes without coupling platform semantics to terminal tooling or implementing future platform capabilities prematurely?

It does not answer:

- How semantic models are authored.
- How canonical models are built.
- How compiler passes run.
- How runtime artifacts load.
- How business instances are persisted.
- How semantic queries execute.
- How packages are installed.
- How workflows execute.
- How models are deployed.

Preserve:

```text
ARC-01 — Repository Architecture
        ↓
ARC-02 — Dependency Rules
        ↓
ARC-03 — Architecture Fitness Test Harness
        ↓
ARC-04 — Platform Bootstrap
        ↓
ARC-05 — Platform CLI Skeleton
        ├── Node.js Executable
        ├── Command Registry
        ├── Argument Parser
        ├── Command Router
        ├── Help / Version
        ├── CLI Configuration
        ├── Output and Diagnostics
        ├── Exit Codes
        └── Explicit Extension Contracts
        ↓
Future Approved Developer Commands
```

Maintain:

**Semantic Core, Mechanical Runtime, Framework-Based Adapters.**

Use the established technology stack:

**TypeScript + NestJS + Angular + PrimeNG + pnpm + Nx + ESLint + Prettier + Vitest.**

Keep Platform Core as Pure TypeScript.

Do not introduce Python, Django, or Django REST Framework.

Do not weaken dependency boundaries or create circular imports.

Do not implement fake compiler, runtime, persistence, package, or deployment commands.

Do not create or execute automated tests.

Create the mandatory deferred-test Markdown archive.

Report only actual implementation and verification results.

**Complete ARC-05 and stop.**