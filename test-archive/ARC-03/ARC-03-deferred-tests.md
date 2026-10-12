# ARC-03 — Deferred Test Specification

Task: ARC-03 — Architecture Fitness Test Harness

Backend: NestJS / Node.js / TypeScript

Frontend: Angular / PrimeNG / TypeScript

Monorepo: pnpm Workspaces / Nx

Status: NOT_RUN — DEFERRED

New Tests Implemented: 0

Tests Executed: 0

Dependencies:
- ARC-01
- ARC-02

---

## Summary of Deferred Scenarios

| Category | Category Name | Scenarios | Status |
|---|---|---|---|
| A | Harness Construction | ARC-03-T001 – ARC-03-T006 (6) | NOT_RUN — DEFERRED |
| B | Nx Project Discovery | ARC-03-T007 – ARC-03-T012 (6) | NOT_RUN — DEFERRED |
| C | Project Classification | ARC-03-T013 – ARC-03-T018 (6) | NOT_RUN — DEFERRED |
| D | Dependency Direction | ARC-03-T019 – ARC-03-T024 (6) | NOT_RUN — DEFERRED |
| E | Framework Isolation | ARC-03-T025 – ARC-03-T031 (7) | NOT_RUN — DEFERRED |
| F | Frontend/Backend Separation | ARC-03-T032 – ARC-03-T037 (6) | NOT_RUN — DEFERRED |
| G | Public API & Deep Imports | ARC-03-T038 – ARC-03-T044 (7) | NOT_RUN — DEFERRED |
| H | Type-Only Imports | ARC-03-T045 – ARC-03-T050 (6) | NOT_RUN — DEFERRED |
| I | Circular Dependencies | ARC-03-T051 – ARC-03-T057 (7) | NOT_RUN — DEFERRED |
| J | Workspace Package Integrity | ARC-03-T058 – ARC-03-T063 (6) | NOT_RUN — DEFERRED |
| K | Evidence Collection | ARC-03-T064 – ARC-03-T070 (7) | NOT_RUN — DEFERRED |
| L | Fitness Results | ARC-03-T071 – ARC-03-T076 (6) | NOT_RUN — DEFERRED |
| M | Finding Structure | ARC-03-T077 – ARC-03-T082 (6) | NOT_RUN — DEFERRED |
| N | Determinism | ARC-03-T083 – ARC-03-T087 (5) | NOT_RUN — DEFERRED |
| O | CLI Behavior | ARC-03-T088 – ARC-03-T094 (7) | NOT_RUN — DEFERRED |
| P | Reporting | ARC-03-T095 – ARC-03-T099 (5) | NOT_RUN — DEFERRED |
| Q | Nx Integration | ARC-03-T100 – ARC-03-T104 (5) | NOT_RUN — DEFERRED |
| R | ESLint Integration | ARC-03-T105 – ARC-03-T109 (5) | NOT_RUN — DEFERRED |
| S | Policy Ownership | ARC-03-T110 – ARC-03-T114 (5) | NOT_RUN — DEFERRED |
| T | Architecture Preservation | ARC-03-T115 – ARC-03-T119 (5) | NOT_RUN — DEFERRED |
| U | Security | ARC-03-T120 – ARC-03-T124 (5) | NOT_RUN — DEFERRED |
| V | Architectural Boundaries | ARC-03-T125 – ARC-03-T130 (6) | NOT_RUN — DEFERRED |
| **Total** | **All 22 Categories** | **130 Scenarios** | **NOT_RUN — DEFERRED** |

---

## Category A — Harness Construction

### ARC-03-T001: Valid Harness Instantiation
- **Test ID:** ARC-03-T001
- **Scenario:** Instantiate `ArchitectureFitnessHarness` with default configuration.
- **Objective:** Verify that the harness instantiates cleanly without exceptions.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** TypeScript runtime available.
- **Input / Setup:** `const harness = new ArchitectureFitnessHarness();`
- **Expected Result:** PASS (Instance created with valid contract methods).
- **Expected Diagnostics:** Object conforms to `ArchitectureFitnessHarness` interface.
- **Acceptance Criteria:** `evaluate` and `generateReport` methods exist and are functions.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T002: Invalid Configuration Handling
- **Test ID:** ARC-03-T002
- **Scenario:** Execute harness with non-existent workspace root path.
- **Objective:** Ensure the harness safely handles missing filesystem paths without crashing.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Clean harness instance.
- **Input / Setup:** `harness.evaluate({ workspaceRoot: '/path/does/not/exist' })`
- **Expected Result:** INCOMPLETE (Status is INCOMPLETE, exitCode is 2).
- **Expected Diagnostics:** `EVIDENCE_UNAVAILABLE` finding emitted.
- **Acceptance Criteria:** No unhandled exceptions thrown; structured report returned.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T003: Missing Workspace Root
- **Test ID:** ARC-03-T003
- **Scenario:** Execute request with empty string as workspaceRoot.
- **Objective:** Reject invalid workspace root input immediately.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Clean harness instance.
- **Input / Setup:** `harness.evaluate({ workspaceRoot: '' })`
- **Expected Result:** INCOMPLETE (exitCode: 2).
- **Expected Diagnostics:** Diagnostic indicates invalid workspace root path.
- **Acceptance Criteria:** Returns non-zero exit status with actionable diagnostic.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T004: Invalid Selected Rule ID
- **Test ID:** ARC-03-T004
- **Scenario:** Request evaluation of a non-existent rule ID.
- **Objective:** Verify that unknown rule IDs generate an `UNSUPPORTED_RULE` finding and return INCOMPLETE.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Clean harness instance.
- **Input / Setup:** `harness.evaluate({ workspaceRoot, selectedRuleIds: ['NON_EXISTENT_RULE'] })`
- **Expected Result:** INCOMPLETE (exitCode: 2).
- **Expected Diagnostics:** Finding code `UNSUPPORTED_RULE` with supported rules listed.
- **Acceptance Criteria:** Unknown rule does not pass silently.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T005: Pure TypeScript Implementation Verification
- **Test ID:** ARC-03-T005
- **Scenario:** Inspect harness source code for third-party runtime framework dependencies.
- **Objective:** Ensure zero imports of `@nestjs/*`, `@angular/*`, `express`, or external runtime tools in harness.
- **Component:** `tools/architecture/src/**`
- **Prerequisites:** Static inspection tools.
- **Input / Setup:** Analyze imports in `tools/architecture/src/**/*.ts`.
- **Expected Result:** PASS (Zero framework imports).
- **Expected Diagnostics:** Harness depends strictly on standard Node.js APIs (`node:fs`, `node:path`).
- **Acceptance Criteria:** Pure TypeScript implementation.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T006: Framework Decoupling
- **Test ID:** ARC-03-T006
- **Scenario:** Verify harness does not require NestJS bootstrap or Angular rendering to execute.
- **Objective:** Confirm harness executes in headless pure Node.js environments.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Node.js runtime.
- **Input / Setup:** Execute `node --experimental-strip-types tools/architecture/src/cli.ts --help`.
- **Expected Result:** PASS (Help output printed, zero application bootstrap).
- **Expected Diagnostics:** Process exits cleanly with code 0.
- **Acceptance Criteria:** Standalone executable without framework container.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category B — Nx Project Discovery

### ARC-03-T007: Valid Project Graph Discovery
- **Test ID:** ARC-03-T007
- **Scenario:** Discover all project nodes in a valid Nx workspace.
- **Objective:** Verify that all `project.json` files are discovered and parsed.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Valid Nx workspace projects present.
- **Input / Setup:** `collector.collect()` in root workspace.
- **Expected Result:** PASS (All projects returned with correct names and roots).
- **Expected Diagnostics:** `projectGraphAvailable: true`.
- **Acceptance Criteria:** Discovers `semantic-kernel`, `model-core`, `platform-contracts`, `architecture-harness`.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T008: Empty Project Graph Handling
- **Test ID:** ARC-03-T008
- **Scenario:** Execute collector in an empty directory without projects.
- **Objective:** Verify that zero discovered projects produces INCOMPLETE rather than PASS.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Empty directory fixture.
- **Input / Setup:** `collector.collect()` in empty directory.
- **Expected Result:** INCOMPLETE (`projectGraphAvailable: false`).
- **Expected Diagnostics:** `No project.json files discovered in workspace`.
- **Acceptance Criteria:** `projectGraphAvailable` is false, graphExtractionError is populated.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T009: Missing Project Configuration Recovery
- **Test ID:** ARC-03-T009
- **Scenario:** Malformed JSON in a `project.json` file.
- **Objective:** Verify that corrupt `project.json` is safely handled without unhandled exception.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Workspace containing invalid JSON in `project.json`.
- **Input / Setup:** Run collector against malformed project fixture.
- **Expected Result:** Safe error capture; malformed project skipped from valid list.
- **Expected Diagnostics:** Collector catches JSON parse exception safely.
- **Acceptance Criteria:** Unhandled exception does not crash collector.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T010: Unknown Project Exclusion
- **Test ID:** ARC-03-T010
- **Scenario:** Request evaluation of a project name not in the project graph.
- **Objective:** Ensure unknown project names are not silently ignored as passing.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Discovered project graph.
- **Input / Setup:** Evaluate dependency referencing non-existent project `unknown-service`.
- **Expected Result:** FAIL (Unrecognized target project flagged).
- **Expected Diagnostics:** Diagnostic reports unknown target project.
- **Acceptance Criteria:** Unknown projects cannot be used to bypass rules.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T011: Unsupported Nx Graph Capability Graceful Fallback
- **Test ID:** ARC-03-T011
- **Scenario:** Absence of pre-generated `graph.json`.
- **Objective:** Verify collector gracefully falls back to source imports and filesystem nodes when `graph.json` is missing.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Workspace without `graph.json`.
- **Input / Setup:** Remove `graph.json` and run discovery.
- **Expected Result:** PASS (Projects discovered via filesystem; dependencies extracted from source).
- **Expected Diagnostics:** `projectGraphAvailable: true`.
- **Acceptance Criteria:** Collector succeeds even if Nx CLI graph cache is absent.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T012: Deterministic Project Inventory Ordering
- **Test ID:** ARC-03-T012
- **Scenario:** Collect projects multiple times across different operating systems.
- **Objective:** Verify that discovered projects are always sorted alphabetically by project name.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Multiple projects in workspace.
- **Input / Setup:** Invoke `collector.collect()` twice in succession.
- **Expected Result:** PASS (Identical array order: `architecture-harness`, `model-core`, `platform-contracts`, `semantic-kernel`).
- **Expected Diagnostics:** Deterministic alphabetical sorting.
- **Acceptance Criteria:** Array order is 100% deterministic.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category C — Project Classification

### ARC-03-T013: Valid Semantic Kernel Tag Compliance
- **Test ID:** ARC-03-T013
- **Scenario:** Inspect `semantic-kernel` project tags.
- **Objective:** Confirm `semantic-kernel` has valid `layer:kernel`, `scope:platform`, `runtime:universal`, `framework:none`.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Existing `platform/kernel/semantic-kernel/project.json`.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION` on existing workspace.
- **Expected Result:** PASS (Zero tag violations for `semantic-kernel`).
- **Expected Diagnostics:** All tags belong to approved taxonomy.
- **Acceptance Criteria:** Zero findings emitted for valid tags.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T014: Valid Model Core Tag Compliance
- **Test ID:** ARC-03-T014
- **Scenario:** Inspect `model-core` project tags.
- **Objective:** Confirm `model-core` has valid `layer:model`, `scope:platform`, `runtime:universal`, `framework:none`.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Existing `platform/model/model-core/project.json`.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION`.
- **Expected Result:** PASS (Zero tag violations for `model-core`).
- **Expected Diagnostics:** Tags validated against `ARCHITECTURE_TAG_TAXONOMY`.
- **Acceptance Criteria:** Zero findings emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T015: Rejection of Untagged Project
- **Test ID:** ARC-03-T015
- **Scenario:** Project fixture with empty tags array `tags: []`.
- **Objective:** Ensure untagged projects are rejected with finding code `UNTAGGED_PROJECT`.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Project fixture declaring no tags.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION` against untagged fixture.
- **Expected Result:** FAIL (Finding code `UNTAGGED_PROJECT`, severity ERROR).
- **Expected Diagnostics:** `Project '...' does not declare any architectural tags.`
- **Acceptance Criteria:** Generates ERROR finding and fails evaluation.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T016: Rejection of Conflicting Runtime Tags
- **Test ID:** ARC-03-T016
- **Scenario:** Project fixture declaring both `runtime:universal` and `runtime:node`.
- **Objective:** Detect mutually exclusive runtime classifications.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Project fixture with conflicting runtime tags.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION`.
- **Expected Result:** FAIL (Finding code `CONFLICTING_RUNTIME_TAGS`, severity ERROR).
- **Expected Diagnostics:** `declares mutually exclusive runtime tags`.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T017: Rejection of Unknown Architectural Layer
- **Test ID:** ARC-03-T017
- **Scenario:** Project fixture tagged with `layer:custom-layer`.
- **Objective:** Reject unapproved layer tags not in `ARCHITECTURE_TAG_TAXONOMY.validLayers`.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Fixture with unapproved layer tag.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION`.
- **Expected Result:** FAIL (Finding code `INVALID_LAYER_TAG`, severity ERROR).
- **Expected Diagnostics:** `has unapproved layer tag 'layer:custom-layer'`.
- **Acceptance Criteria:** Generates ERROR finding listing valid approved layers.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T018: Rejection of Prohibited Escape Tags
- **Test ID:** ARC-03-T018
- **Scenario:** Project fixture tagged with `allow-all` or `layer:shared`.
- **Objective:** Reject permission bypass and wildcard escape tags.
- **Component:** `ProjectClassificationRule`
- **Prerequisites:** Fixture with escape tag.
- **Input / Setup:** Evaluate `ARCH_PROJECT_CLASSIFICATION`.
- **Expected Result:** FAIL (Finding code `PROHIBITED_ESCAPE_TAG`, severity ERROR).
- **Expected Diagnostics:** `declares prohibited bypass tag(s)`.
- **Acceptance Criteria:** Wildcard tags strictly disallowed.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category D — Dependency Direction

### ARC-03-T019: Valid Model Core to Semantic Kernel Dependency
- **Test ID:** ARC-03-T019
- **Scenario:** `model-core` imports `@ecosystem/semantic-kernel`.
- **Objective:** Confirm valid downward dependency from Model to Kernel is accepted.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Standard workspace imports.
- **Input / Setup:** `import { createSemanticId } from '@ecosystem/semantic-kernel';` in `model-core`.
- **Expected Result:** PASS (Zero dependency direction findings).
- **Expected Diagnostics:** Allowed dependency per `AUTHORITATIVE_LAYER_MATRIX`.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T020: Forbidden Reverse Dependency (Kernel to Model)
- **Test ID:** ARC-03-T020
- **Scenario:** `semantic-kernel` attempts to import `@ecosystem/model-core`.
- **Objective:** Detect and reject illegal upward dependency from Kernel to Model Core.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Fixture import in `semantic-kernel`.
- **Input / Setup:** `import type { SemanticModel } from '@ecosystem/model-core';` in `semantic-kernel`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** `Illegal dependency: Project 'semantic-kernel' (layer:kernel) cannot import '@ecosystem/model-core'`.
- **Acceptance Criteria:** Kernel has zero allowed dependencies.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T021: Forbidden Model Core to Compiler Core Dependency
- **Test ID:** ARC-03-T021
- **Scenario:** `model-core` attempts to import `@ecosystem/compiler-core`.
- **Objective:** Ensure Model Core does not depend on Compiler Core.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Fixture import in `model-core`.
- **Input / Setup:** `import { compileModel } from '@ecosystem/compiler-core';` in `model-core`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** Model Core allowed layers: `['layer:kernel']`.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T022: Forbidden Compiler to Runtime Implementation Dependency
- **Test ID:** ARC-03-T022
- **Scenario:** `compiler-core` attempts to import `@ecosystem/runtime-core`.
- **Objective:** Ensure Compiler Core does not depend on Runtime Core implementation.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Fixture import in `compiler-core`.
- **Input / Setup:** `import { RuntimeEngine } from '@ecosystem/runtime-core';` in `compiler-core`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** Compiler Core cannot depend on Runtime Core.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T023: Forbidden Runtime Core to Model Authoring Dependency
- **Test ID:** ARC-03-T023
- **Scenario:** `runtime-core` attempts to import Model Authoring APIs from `model-core`.
- **Objective:** Ensure Runtime Core consumes only compiled artifacts and contracts, not authoring models.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Fixture import in `runtime-core`.
- **Input / Setup:** `import { ModelAuthoringService } from '@ecosystem/model-core';` in `runtime-core`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** Runtime Core cannot depend on Model Core.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T024: Forbidden Platform Core to Adapter Dependency
- **Test ID:** ARC-03-T024
- **Scenario:** Platform Core project imports an adapter package.
- **Objective:** Ensure Platform Core never depends on peripheral adapters.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Fixture import in `semantic-kernel`.
- **Input / Setup:** `import { RestAdapter } from '@ecosystem/adapter-rest';` in `semantic-kernel`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** Core cannot depend on adapters.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category E — Framework Isolation

### ARC-03-T025: Forbidden NestJS Import in Semantic Kernel
- **Test ID:** ARC-03-T025
- **Scenario:** `semantic-kernel` imports `@nestjs/common`.
- **Objective:** Reject NestJS imports in Semantic Kernel.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture import in `semantic-kernel/src/`.
- **Input / Setup:** `import { Injectable } from '@nestjs/common';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Forbidden framework dependency: 'NestJS (@nestjs/*)' imported inside 'semantic-kernel' (layer:kernel).`
- **Acceptance Criteria:** Kernel remains zero-dependency Pure TypeScript.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T026: Forbidden Angular Import in Semantic Kernel
- **Test ID:** ARC-03-T026
- **Scenario:** `semantic-kernel` imports `@angular/core`.
- **Objective:** Reject Angular presentation imports in Semantic Kernel.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture import in `semantic-kernel/src/`.
- **Input / Setup:** `import { Component } from '@angular/core';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Forbidden framework dependency: 'Angular (@angular/*)' imported inside 'semantic-kernel' (layer:kernel).`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T027: Forbidden PrimeNG Import in Model Core
- **Test ID:** ARC-03-T027
- **Scenario:** `model-core` imports `primeng/api`.
- **Objective:** Reject PrimeNG UI components in Model Core.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture import in `model-core/src/`.
- **Input / Setup:** `import { MessageService } from 'primeng/api';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Forbidden framework dependency: 'PrimeNG' imported inside 'model-core' (layer:model).`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T028: Forbidden Express Import in Compiler Core
- **Test ID:** ARC-03-T028
- **Scenario:** `compiler-core` imports `express`.
- **Objective:** Reject HTTP server framework in Compiler Core.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture import in `compiler-core`.
- **Input / Setup:** `import express from 'express';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Forbidden framework dependency: 'Express' imported inside 'compiler-core' (layer:compiler).`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T029: Forbidden TypeORM Import in Runtime Core
- **Test ID:** ARC-03-T029
- **Scenario:** `runtime-core` imports `typeorm`.
- **Objective:** Reject direct database ORM coupling in Runtime Core.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture import in `runtime-core`.
- **Input / Setup:** `import { Entity, PrimaryGeneratedColumn } from 'typeorm';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Forbidden framework dependency: 'TypeORM' imported inside 'runtime-core' (layer:runtime).`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T030: Allowed Framework Import in Approved Backend Adapter
- **Test ID:** ARC-03-T030
- **Scenario:** Backend adapter project (`layer:adapter`, `framework:nestjs`) imports `@nestjs/common`.
- **Objective:** Confirm framework is permitted inside approved adapter layer.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Adapter project tagged with `layer:adapter`.
- **Input / Setup:** `import { Controller } from '@nestjs/common';` in adapter project.
- **Expected Result:** PASS (Zero framework isolation findings for adapter).
- **Expected Diagnostics:** `layer:adapter` not in forbidden framework list for core.
- **Acceptance Criteria:** Framework allowed in adapters.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T031: Allowed PrimeNG Import in Approved Angular Frontend
- **Test ID:** ARC-03-T031
- **Scenario:** Frontend application (`layer:application`, `framework:angular`) imports `primeng/button`.
- **Objective:** Confirm PrimeNG is permitted inside approved Angular application presentation layer.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Frontend application project.
- **Input / Setup:** `import { ButtonModule } from 'primeng/button';` in application project.
- **Expected Result:** PASS (Zero framework isolation findings).
- **Expected Diagnostics:** Application layer allows UI presentation libraries.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category F — Frontend/Backend Separation

### ARC-03-T032: Allowed Shared Contract Import in Angular Frontend
- **Test ID:** ARC-03-T032
- **Scenario:** Frontend project imports `@ecosystem/platform-contracts`.
- **Objective:** Confirm frontend-safe contract package is accessible to frontend.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Frontend project tagged with `scope:frontend`.
- **Input / Setup:** `import type { ApiResponse } from '@ecosystem/platform-contracts';` in frontend.
- **Expected Result:** PASS (Zero cross-tier violations).
- **Expected Diagnostics:** Shared contracts are universal across tiers.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T033: Forbidden NestJS Import in Angular Frontend
- **Test ID:** ARC-03-T033
- **Scenario:** Frontend project imports `@nestjs/common`.
- **Objective:** Detect and reject backend NestJS module imported in browser tier.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Frontend project tagged `scope:frontend` or `runtime:browser`.
- **Input / Setup:** `import { Injectable } from '@nestjs/common';` in frontend project.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_CROSS_TIER_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Frontend project '...' cannot import backend module '@nestjs/common'.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T034: Forbidden Node.js Filesystem API in Angular Frontend
- **Test ID:** ARC-03-T034
- **Scenario:** Browser frontend imports `node:fs` or `fs`.
- **Objective:** Reject Node-only operating system APIs in browser frontend.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Project tagged with `runtime:browser`.
- **Input / Setup:** `import { readFileSync } from 'node:fs';` in frontend project.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_NODE_API_IN_FRONTEND`, severity ERROR).
- **Expected Diagnostics:** `Browser/Frontend project '...' cannot import Node.js runtime API 'node:fs'.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T035: Forbidden Child Process API in Angular Frontend
- **Test ID:** ARC-03-T035
- **Scenario:** Browser frontend imports `child_process`.
- **Objective:** Reject process execution APIs in browser tier.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Project tagged with `runtime:browser`.
- **Input / Setup:** `import { execSync } from 'child_process';` in frontend project.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_NODE_API_IN_FRONTEND`, severity ERROR).
- **Expected Diagnostics:** `Browser/Frontend project '...' cannot import Node.js runtime API 'child_process'.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T036: Forbidden Angular Import in Headless Backend Host
- **Test ID:** ARC-03-T036
- **Scenario:** Backend service project tagged `scope:backend` imports `@angular/core`.
- **Objective:** Ensure backend host never imports browser UI framework.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Backend service project.
- **Input / Setup:** `import { Component } from '@angular/core';` in backend service.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_CROSS_TIER_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Backend project '...' cannot import frontend presentation package '@angular/core'.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T037: Forbidden PrimeNG Import in Headless Backend Host
- **Test ID:** ARC-03-T037
- **Scenario:** Backend service tagged `scope:backend` imports `primeng/button`.
- **Objective:** Reject UI components in backend runtime.
- **Component:** `FrontendBackendIsolationRule`
- **Prerequisites:** Backend service project.
- **Input / Setup:** `import { ButtonModule } from 'primeng/button';` in backend service.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_CROSS_TIER_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Backend project '...' cannot import frontend presentation package 'primeng/button'.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category G — Public API & Deep Imports

### ARC-03-T038: Approved Root Package Entry Point Import
- **Test ID:** ARC-03-T038
- **Scenario:** Import exclusively from root package export `@ecosystem/semantic-kernel`.
- **Objective:** Confirm standard public barrel imports pass verification.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Valid public barrel export.
- **Input / Setup:** `import { createSemanticId } from '@ecosystem/semantic-kernel';`
- **Expected Result:** PASS (Zero deep import findings).
- **Expected Diagnostics:** Clean public import.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T039: Forbidden Subpath Deep Import into Package Source Tree
- **Test ID:** ARC-03-T039
- **Scenario:** Consumer imports from `@ecosystem/semantic-kernel/src/semantic-id.js`.
- **Objective:** Detect and reject deep subpath imports into internal `src/` directory.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Cross-package import.
- **Input / Setup:** `import { createSemanticId } from '@ecosystem/semantic-kernel/src/semantic-id.js';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEEP_IMPORT`, severity ERROR).
- **Expected Diagnostics:** `Illegal deep import: Subpath import into internal source/dist tree is forbidden.`
- **Acceptance Criteria:** Deep subpath import rejected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T040: Forbidden Subpath Deep Import into Package Dist Tree
- **Test ID:** ARC-03-T040
- **Scenario:** Consumer imports from `@ecosystem/semantic-kernel/dist/index.js`.
- **Objective:** Reject bypassing package entry point via internal build output path.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Cross-package import.
- **Input / Setup:** `import { createSemanticId } from '@ecosystem/semantic-kernel/dist/index.js';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEEP_IMPORT`, severity ERROR).
- **Expected Diagnostics:** `Subpath import into internal source/dist tree is forbidden.`
- **Acceptance Criteria:** Deep dist import rejected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T041: Forbidden Cross-Package Relative Import into Platform Core
- **Test ID:** ARC-03-T041
- **Scenario:** Consumer uses `../../platform/kernel/semantic-kernel/src/semantic-id` instead of package alias.
- **Objective:** Detect and reject relative filesystem traversal escaping project boundary.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** File located outside `semantic-kernel`.
- **Input / Setup:** `import { createSemanticId } from '../../platform/kernel/semantic-kernel/src/semantic-id';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_CROSS_PACKAGE_RELATIVE_IMPORT`, severity ERROR).
- **Expected Diagnostics:** `Illegal cross-package relative import: Bypassing package boundary with relative path.`
- **Acceptance Criteria:** Relative cross-project traversal rejected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T042: Forbidden Cross-Package Relative Import into Adapters
- **Test ID:** ARC-03-T042
- **Scenario:** Consumer uses `../../adapters/shared/platform-contracts/src/index` instead of package alias.
- **Objective:** Reject relative filesystem path traversing into adapters.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Cross-project import.
- **Input / Setup:** `import { ApiResponse } from '../../adapters/shared/platform-contracts/src/index';`
- **Expected Result:** FAIL (Finding code `FORBIDDEN_CROSS_PACKAGE_RELATIVE_IMPORT`, severity ERROR).
- **Expected Diagnostics:** `Bypassing package boundary with relative path.`
- **Acceptance Criteria:** Relative cross-package path rejected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T043: Allowed Intra-Package Relative Import
- **Test ID:** ARC-03-T043
- **Scenario:** File within `semantic-kernel/src/` imports `./semantic-element.js` relatively.
- **Objective:** Ensure intra-package relative imports inside the same package root pass cleanly.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Both files inside same package `semantic-kernel`.
- **Input / Setup:** `import { isSemanticId } from './semantic-id.js';` in `semantic-element.ts`.
- **Expected Result:** PASS (Zero deep import findings).
- **Expected Diagnostics:** Intra-package relative imports are valid.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T044: Package Manifest Exports Compliance
- **Test ID:** ARC-03-T044
- **Scenario:** Verify all workspace packages declare standard `exports` map with `.` and types.
- **Objective:** Ensure package manifests define unambiguous public API entry points.
- **Component:** `PackageManifestCollector`
- **Prerequisites:** Workspace project manifests.
- **Input / Setup:** Inspect collected `packageExports` across workspace.
- **Expected Result:** PASS (All packages define valid exports).
- **Expected Diagnostics:** Exports maps populated.
- **Acceptance Criteria:** Zero unmapped workspace packages.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category H — Type-Only Imports

### ARC-03-T045: Allowed Public Type Import
- **Test ID:** ARC-03-T045
- **Scenario:** `import type { SemanticId } from '@ecosystem/semantic-kernel';` in `model-core`.
- **Objective:** Confirm type-only import adhering to layer matrix passes verification.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Downward dependency (Model to Kernel).
- **Input / Setup:** Type-only import statement.
- **Expected Result:** PASS (Zero findings).
- **Expected Diagnostics:** Allowed dependency direction.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T046: Forbidden Type-Only Import Across Layer Boundary
- **Test ID:** ARC-03-T046
- **Scenario:** `import type { SemanticModel } from '@ecosystem/model-core';` inside `semantic-kernel`.
- **Objective:** Prove that `import type` is subject to the exact same boundary rules as runtime imports.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Upward dependency (Kernel to Model).
- **Input / Setup:** `import type { SemanticModel } from '@ecosystem/model-core';` in `semantic-kernel`.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_DEPENDENCY_DIRECTION`, severity ERROR).
- **Expected Diagnostics:** Illegal dependency direction regardless of `type` keyword.
- **Acceptance Criteria:** Type imports cannot bypass architectural boundaries.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T047: Forbidden Type-Only Framework Import in Kernel
- **Test ID:** ARC-03-T047
- **Scenario:** `import type { INestApplication } from '@nestjs/common';` inside `semantic-kernel`.
- **Objective:** Confirm `import type` of framework modules is rejected in Core.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Fixture in `semantic-kernel`.
- **Input / Setup:** Type-only import of NestJS interface.
- **Expected Result:** FAIL (Finding code `FORBIDDEN_FRAMEWORK_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `NestJS (@nestjs/*) imported inside layer:kernel.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T048: Forbidden Type Re-export Across Boundaries
- **Test ID:** ARC-03-T048
- **Scenario:** `export type { Controller } from '@nestjs/common';` in Platform Core.
- **Objective:** Ensure type re-exports are parsed and validated by import collector.
- **Component:** `SourceImportCollector`
- **Prerequisites:** Re-export statement in core.
- **Input / Setup:** `export type { Controller } from '@nestjs/common';`
- **Expected Result:** FAIL (Extracted with `isTypeOnly: true` and flagged by framework rule).
- **Expected Diagnostics:** Framework leakage detected.
- **Acceptance Criteria:** Re-exports are not ignored.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T049: Dynamic Import Coverage
- **Test ID:** ARC-03-T049
- **Scenario:** Dynamic import expression `const mod = await import('@nestjs/common');` in Core.
- **Objective:** Ensure dynamic imports are captured by `SourceImportCollector`.
- **Component:** `SourceImportCollector`
- **Prerequisites:** Dynamic import statement.
- **Input / Setup:** `await import('@nestjs/common')` in core file.
- **Expected Result:** FAIL (Extracted with `isDynamic: true` and flagged).
- **Expected Diagnostics:** Framework leakage detected.
- **Acceptance Criteria:** Dynamic imports cannot bypass boundary rules.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T050: Comprehensive Type Import Classification
- **Test ID:** ARC-03-T050
- **Scenario:** Extract diverse TypeScript import formats from source files.
- **Objective:** Verify `SourceImportCollector` correctly flags `isTypeOnly` for `import type` and `export type`.
- **Component:** `SourceImportCollector`
- **Prerequisites:** Test source file with mixed imports.
- **Input / Setup:** Run collector against mixed import file.
- **Expected Result:** PASS (All imports classified with correct boolean flags).
- **Expected Diagnostics:** Line numbers and specifiers mapped accurately.
- **Acceptance Criteria:** High-fidelity import evidence extraction.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category I — Circular Dependencies

### ARC-03-T051: Acyclic Workspace Verification
- **Test ID:** ARC-03-T051
- **Scenario:** Verify current workspace project graph has zero cycles.
- **Objective:** Confirm current repository forms a strict DAG.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Current workspace projects.
- **Input / Setup:** Evaluate `ARCH_CIRCULAR_DEPENDENCY`.
- **Expected Result:** PASS (Zero circular dependency findings).
- **Expected Diagnostics:** `PASS: Zero cycles detected in workspace dependency graph.`
- **Acceptance Criteria:** Zero findings emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T052: Direct Two-Project Cycle Detection
- **Test ID:** ARC-03-T052
- **Scenario:** Project A imports Project B, and Project B imports Project A (`A -> B -> A`).
- **Objective:** Detect and report direct 2-project cyclic dependency.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Cyclic fixture graph.
- **Input / Setup:** Inject dependency edge from `semantic-kernel` to `model-core` (while `model-core` imports `semantic-kernel`).
- **Expected Result:** FAIL (Finding code `CIRCULAR_PROJECT_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `Circular dependency detected: model-core -> semantic-kernel -> model-core`.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T053: Multi-Project Cycle Detection
- **Test ID:** ARC-03-T053
- **Scenario:** Three-project transitive cycle (`A -> B -> C -> A`).
- **Objective:** Detect multi-hop cyclic dependency paths.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Transitive cycle fixture.
- **Input / Setup:** Inject cyclic edges `kernel -> model -> compiler -> kernel`.
- **Expected Result:** FAIL (Finding code `CIRCULAR_PROJECT_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** `compiler -> kernel -> model -> compiler`.
- **Acceptance Criteria:** Cycle detected across multiple hops.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T054: Compiler / Runtime Implementation Cycle Detection
- **Test ID:** ARC-03-T054
- **Scenario:** `compiler-core` depends on `runtime-core` and `runtime-core` depends on `compiler-core`.
- **Objective:** Detect cyclic coupling between compiler and runtime layers.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Compiler/runtime cycle fixture.
- **Input / Setup:** Inject mutual dependencies.
- **Expected Result:** FAIL (Finding code `CIRCULAR_PROJECT_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** Cycle reported with both projects.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T055: Core / Adapter Inversion Cycle Detection
- **Test ID:** ARC-03-T055
- **Scenario:** Core depends on adapter and adapter depends on core.
- **Objective:** Catch architectural violation where core imports an adapter that consumes it.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Core/adapter cycle fixture.
- **Input / Setup:** Inject reverse dependency edge.
- **Expected Result:** FAIL (Finding code `CIRCULAR_PROJECT_DEPENDENCY`, severity ERROR).
- **Expected Diagnostics:** Cycle path clearly identified.
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T056: Canonical Cycle Representation & Deduplication
- **Test ID:** ARC-03-T056
- **Scenario:** Graph contains single cycle `A -> B -> A`. DFS visits both `A` and `B` as root entries.
- **Objective:** Verify cycle is canonicalized and deduplicated, emitting exactly one finding rather than rotated duplicates (`A -> B -> A` and `B -> A -> B`).
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Cyclic graph.
- **Input / Setup:** Run evaluation on cycle graph.
- **Expected Result:** Exactly 1 finding emitted for the cycle.
- **Expected Diagnostics:** Canonical ordering starts at lexicographically smallest node.
- **Acceptance Criteria:** Zero duplicate rotated findings.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T057: Isolated Subgraph Cycle Detection
- **Test ID:** ARC-03-T057
- **Scenario:** Disconnected subgraph contains cycle `X -> Y -> X` while main platform graph is acyclic.
- **Objective:** Ensure DFS visits all connected components and detects cycles in disconnected subgraphs.
- **Component:** `CircularDependencyRule`
- **Prerequisites:** Graph with multiple disconnected components.
- **Input / Setup:** Evaluate graph with disconnected cycle.
- **Expected Result:** FAIL (Cycle detected in disconnected component).
- **Expected Diagnostics:** Cycle in disconnected subgraph reported.
- **Acceptance Criteria:** All graph components evaluated.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category J — Workspace Package Integrity

### ARC-03-T058: Unique Project Name Verification
- **Test ID:** ARC-03-T058
- **Scenario:** Verify all workspace projects possess globally unique name identifiers.
- **Objective:** Detect duplicate project names in Nx workspace.
- **Component:** `WorkspaceIntegrityRule`
- **Prerequisites:** Workspace project graph.
- **Input / Setup:** Evaluate `ARCH_WORKSPACE_INTEGRITY` on current workspace.
- **Expected Result:** PASS (All project names unique).
- **Expected Diagnostics:** `Zero duplicate project names detected.`
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T059: Duplicate Project Name Rejection
- **Test ID:** ARC-03-T059
- **Scenario:** Two different `project.json` files declare `"name": "semantic-kernel"`.
- **Objective:** Detect and reject name collisions across workspace directories.
- **Component:** `WorkspaceIntegrityRule`
- **Prerequisites:** Fixture with colliding project names.
- **Input / Setup:** Evaluate `ARCH_WORKSPACE_INTEGRITY`.
- **Expected Result:** FAIL (Finding code `DUPLICATE_PROJECT_NAME`, severity ERROR).
- **Expected Diagnostics:** `Duplicate project name 'semantic-kernel' detected in workspace.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T060: Project Directory Root Existence Verification
- **Test ID:** ARC-03-T060
- **Scenario:** Verify that every declared project root exists on disk.
- **Objective:** Detect dangling project configurations pointing to non-existent directories.
- **Component:** `WorkspaceIntegrityRule`
- **Prerequisites:** Workspace project graph.
- **Input / Setup:** Evaluate `ARCH_WORKSPACE_INTEGRITY`.
- **Expected Result:** PASS (All project roots exist).
- **Expected Diagnostics:** Valid filesystem paths.
- **Acceptance Criteria:** No finding emitted.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T061: Dangling Project Configuration Rejection
- **Test ID:** ARC-03-T061
- **Scenario:** Project configuration points to non-existent directory `platform/deleted-project`.
- **Objective:** Reject phantom or stale project configurations.
- **Component:** `WorkspaceIntegrityRule`
- **Prerequisites:** Stale project node in evidence.
- **Input / Setup:** Inject non-existent root path in project node.
- **Expected Result:** FAIL (Finding code `INVALID_PROJECT_ROOT`, severity ERROR).
- **Expected Diagnostics:** `Project directory '...' does not exist on disk.`
- **Acceptance Criteria:** Generates ERROR finding.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T062: Manifest Package Name Consistency
- **Test ID:** ARC-03-T062
- **Scenario:** Project `semantic-kernel` has `package.json` declaring name `@ecosystem/semantic-kernel`.
- **Objective:** Confirm scoped package names follow platform naming conventions.
- **Component:** `PackageManifestCollector`
- **Prerequisites:** `package.json` in project directory.
- **Input / Setup:** Inspect manifest name property.
- **Expected Result:** PASS (Valid `@ecosystem/*` prefix).
- **Expected Diagnostics:** Standard naming convention adhered to.
- **Acceptance Criteria:** Scoped naming consistent.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T063: Workspace Dependency Map Consistency
- **Test ID:** ARC-03-T063
- **Scenario:** Verify `model-core` declares workspace dependency on `semantic-kernel` in `package.json` if required.
- **Objective:** Ensure manifest dependencies align with project imports.
- **Component:** `PackageManifestCollector`
- **Prerequisites:** Manifest evidence.
- **Input / Setup:** Inspect `packageDependencies` record in evidence.
- **Expected Result:** PASS (Declared dependencies mapped).
- **Expected Diagnostics:** Dependencies match workspace graph.
- **Acceptance Criteria:** No phantom dependencies.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category K — Evidence Collection

### ARC-03-T064: Successful Full Evidence Acquisition
- **Test ID:** ARC-03-T064
- **Scenario:** Execute `EvidenceCollector` in current workspace.
- **Objective:** Verify context snapshot is populated with projects, manifests, and source imports.
- **Component:** `EvidenceCollector`
- **Prerequisites:** Current workspace.
- **Input / Setup:** `collector.collectContext(request)`
- **Expected Result:** PASS (Context snapshot created; `nxGraphAvailable: true`, `sourceAstAvailable: true`).
- **Expected Diagnostics:** Valid `ArchitectureFitnessContext` returned.
- **Acceptance Criteria:** All evidence fields populated and frozen.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T065: Read-Only Filesystem Non-Mutation Guarantee
- **Test ID:** ARC-03-T065
- **Scenario:** Measure filesystem before and after evidence collection.
- **Objective:** Guarantee that evidence collection is strictly read-only and never modifies source or configuration files.
- **Component:** `EvidenceCollector`
- **Prerequisites:** Workspace state recorded.
- **Input / Setup:** Run evidence collection; compute git status / file hashes.
- **Expected Result:** PASS (Zero files created, modified, or deleted).
- **Expected Diagnostics:** Filesystem hashes 100% identical.
- **Acceptance Criteria:** Pure read-only inspection.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T066: Zero Network Request Guarantee
- **Test ID:** ARC-03-T066
- **Scenario:** Monitor network socket activity during evidence collection.
- **Objective:** Ensure evidence collection makes zero HTTP/network calls.
- **Component:** `EvidenceCollector`
- **Prerequisites:** Network interceptor / monitor.
- **Input / Setup:** Run evidence collection with network disabled.
- **Expected Result:** PASS (Zero network requests initiated).
- **Expected Diagnostics:** All evidence acquired from local filesystem.
- **Acceptance Criteria:** Completely offline and air-gapped safe.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T067: Zero Fabricated Evidence Guarantee
- **Test ID:** ARC-03-T067
- **Scenario:** Verify evidence collection only reports projects physically present on disk.
- **Objective:** Ensure the harness never fabricates hypothetical or mock project nodes.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Workspace filesystem.
- **Input / Setup:** Cross-reference discovered project roots with actual disk paths.
- **Expected Result:** PASS (100% of reported projects exist on disk).
- **Expected Diagnostics:** Factual truth matches filesystem.
- **Acceptance Criteria:** Zero mock or placeholder projects in evidence.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T068: Evidence Snapshot Immutability
- **Test ID:** ARC-03-T068
- **Scenario:** Attempt to mutate properties of `ArchitectureWorkspaceEvidence` or `ArchitectureFitnessContext`.
- **Objective:** Verify context and evidence objects are deeply frozen (`Object.freeze`).
- **Component:** `EvidenceCollector`
- **Prerequisites:** Collected context.
- **Input / Setup:** `context.evidence.projects.push(...)` in strict mode.
- **Expected Result:** PASS (Mutation throws TypeError due to frozen object).
- **Expected Diagnostics:** Immutable snapshot contract preserved.
- **Acceptance Criteria:** Context is completely immutable during rule execution.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T069: Missing Evidence Handling
- **Test ID:** ARC-03-T069
- **Scenario:** Evidence collection fails due to unreadable directory permissions.
- **Objective:** Ensure evidence failure sets `projectGraphAvailable: false` and error message.
- **Component:** `NxProjectGraphCollector`
- **Prerequisites:** Inaccessible path fixture.
- **Input / Setup:** Run collector against inaccessible directory.
- **Expected Result:** INCOMPLETE (Status is INCOMPLETE, graphExtractionError populated).
- **Expected Diagnostics:** Error captured safely without crash.
- **Acceptance Criteria:** Unreadable directory does not pass silently.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T070: Bounded Filesystem Traversal
- **Test ID:** ARC-03-T070
- **Scenario:** Verify collector skips `node_modules`, `dist`, `.git`, `tmp`, and cache folders.
- **Objective:** Ensure fast, bounded traversal that ignores transient build artifacts.
- **Component:** `SourceImportCollector`
- **Prerequisites:** Workspace containing `node_modules` and `dist`.
- **Input / Setup:** Run source file collection.
- **Expected Result:** PASS (Zero files collected from excluded directories).
- **Expected Diagnostics:** Only `src/` source files analyzed.
- **Acceptance Criteria:** Bounded directory traversal verified.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category L — Fitness Results

### ARC-03-T071: Conclusive PASS Outcome
- **Test ID:** ARC-03-T071
- **Scenario:** All requested mandatory rules evaluate on valid evidence with zero violations.
- **Objective:** Verify harness returns `status: 'PASS'`, `exitCode: 0`.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Compliant repository state.
- **Input / Setup:** `harness.evaluate(validRequest)`
- **Expected Result:** PASS (`status: 'PASS'`, `exitCode: 0`).
- **Expected Diagnostics:** `ALL ARCHITECTURE FITNESS CHECKS PASSED (0 Violations)`.
- **Acceptance Criteria:** Status is PASS only when all rules complete cleanly.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T072: Conclusive FAIL Outcome
- **Test ID:** ARC-03-T072
- **Scenario:** At least one mandatory architecture invariant is violated (e.g. Kernel imports NestJS).
- **Objective:** Verify harness returns `status: 'FAIL'`, `exitCode: 1`.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Architectural violation present in evidence.
- **Input / Setup:** Evaluate request with violation finding.
- **Expected Result:** FAIL (`status: 'FAIL'`, `exitCode: 1`).
- **Expected Diagnostics:** `ARCHITECTURE VERIFICATION FAILED — 1 architectural violation(s) detected.`
- **Acceptance Criteria:** Hard failure blocks CI process.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T073: Conclusive INCOMPLETE Outcome
- **Test ID:** ARC-03-T073
- **Scenario:** Evidence collection failed or unsupported rule requested, with zero violations.
- **Objective:** Verify harness returns `status: 'INCOMPLETE'`, `exitCode: 2` (never false PASS).
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Missing evidence context.
- **Input / Setup:** Evaluate request with missing evidence.
- **Expected Result:** INCOMPLETE (`status: 'INCOMPLETE'`, `exitCode: 2`).
- **Expected Diagnostics:** `ARCHITECTURE VERIFICATION INCOMPLETE — Prerequisites or evidence missing.`
- **Acceptance Criteria:** Incomplete analysis cannot result in code 0.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T074: Outcome Precedence (FAIL Overrides INCOMPLETE)
- **Test ID:** ARC-03-T074
- **Scenario:** Evaluation contains BOTH a definite violation (ERROR finding) AND an uncompleted rule.
- **Objective:** Confirm documented precedence: FAIL > INCOMPLETE > PASS.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Mixed violation and missing rule context.
- **Input / Setup:** Inject both an ERROR finding and an uncompleted rule ID.
- **Expected Result:** FAIL (`status: 'FAIL'`, `exitCode: 1`).
- **Expected Diagnostics:** Reports FAIL because known invariant violations take precedence.
- **Acceptance Criteria:** Definite failure is never downgraded to INCOMPLETE.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T075: Empty Findings with Missing Evidence Never Reports PASS
- **Test ID:** ARC-03-T075
- **Scenario:** Project graph has zero projects and findings array is empty `[]`.
- **Objective:** Verify harness does NOT report PASS solely because findings array is empty.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Empty evidence.
- **Input / Setup:** `harness.evaluate(...)` with `projects: []`.
- **Expected Result:** INCOMPLETE (exitCode: 2).
- **Expected Diagnostics:** Completeness cannot be inferred from empty findings.
- **Acceptance Criteria:** Strict "No False PASS" rule enforced.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T076: Warning-Only Evaluation Returns PASS with Non-Zero Warnings
- **Test ID:** ARC-03-T076
- **Scenario:** Evaluation produces 0 ERROR findings and 2 WARNING findings.
- **Objective:** Verify WARNING severity does not fail the build but is reported in coverage metrics.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Context producing WARNING findings.
- **Input / Setup:** Evaluate context with warnings.
- **Expected Result:** PASS (`status: 'PASS'`, `exitCode: 0`, `warningCount: 2`).
- **Expected Diagnostics:** Warnings visible in report without failing process.
- **Acceptance Criteria:** Correct severity separation between ERROR and WARNING.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category M — Finding Structure

### ARC-03-T077: Finding Field Completeness
- **Test ID:** ARC-03-T077
- **Scenario:** Validate that all emitted `ArchitectureFitnessFinding` objects contain all mandatory fields.
- **Objective:** Ensure findings are fully structured and actionable.
- **Component:** `ArchitectureFitnessFinding` contract
- **Prerequisites:** Emitted finding.
- **Input / Setup:** Inspect emitted violation finding.
- **Expected Result:** PASS (Contains `ruleId`, `code`, `severity`, `message`, `remediation`).
- **Expected Diagnostics:** All required fields are non-empty strings.
- **Acceptance Criteria:** Typed structure conforms to contract.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T078: Stable Rule Identifier Format
- **Test ID:** ARC-03-T078
- **Scenario:** Verify all rule IDs conform to `ARCH_<CATEGORY>` naming format.
- **Objective:** Ensure machine identifiers are stable across releases.
- **Component:** `RuleRegistry`
- **Prerequisites:** Registered rules.
- **Input / Setup:** Check all registered `rule.id` strings.
- **Expected Result:** PASS (All match `/^ARCH_[A-Z_]+$/`).
- **Expected Diagnostics:** Format: `ARCH_PROJECT_CLASSIFICATION`, `ARCH_FRAMEWORK_ISOLATION`, etc.
- **Acceptance Criteria:** Stable machine identifiers.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T079: Stable Finding Code Format
- **Test ID:** ARC-03-T079
- **Scenario:** Verify finding codes conform to `UPPER_SNAKE_CASE` format.
- **Objective:** Ensure finding codes are suitable for machine-readable triage.
- **Component:** Rules implementation
- **Prerequisites:** Emitted findings.
- **Input / Setup:** Check finding `code` properties.
- **Expected Result:** PASS (e.g. `FORBIDDEN_FRAMEWORK_DEPENDENCY`, `CIRCULAR_PROJECT_DEPENDENCY`).
- **Expected Diagnostics:** Constant codes across runs.
- **Acceptance Criteria:** No dynamic free-form text in code property.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T080: Repository-Relative Location Format
- **Test ID:** ARC-03-T080
- **Scenario:** Inspect `sourceLocation` property of source file findings.
- **Objective:** Ensure file paths are repository-relative and never expose private absolute system paths (`C:\Users\...`).
- **Component:** Rules implementation
- **Prerequisites:** Source violation finding.
- **Input / Setup:** Inspect `finding.sourceLocation`.
- **Expected Result:** PASS (Location formatted as `platform/kernel/...:12`).
- **Expected Diagnostics:** Forward-slash relative paths with line numbers.
- **Acceptance Criteria:** Safe, shareable reports without absolute paths.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T081: Actionable Remediation Guidance
- **Test ID:** ARC-03-T081
- **Scenario:** Inspect `remediation` property of violation findings.
- **Objective:** Confirm every finding provides explicit, actionable instructions on how to fix the violation.
- **Component:** Rules implementation
- **Prerequisites:** Violation finding.
- **Input / Setup:** Inspect `finding.remediation`.
- **Expected Result:** PASS (Remediation provides clear architectural guidance).
- **Expected Diagnostics:** Guidance explains how to decouple or invert dependencies.
- **Acceptance Criteria:** Helpful developer guidance included.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T082: Severity Classification Integrity
- **Test ID:** ARC-03-T082
- **Scenario:** Check that architectural boundary violations are always classified as `ERROR`.
- **Objective:** Ensure hard architectural invariants are never downgraded to `WARNING` or `INFO`.
- **Component:** Rules implementation
- **Prerequisites:** Boundary violation finding.
- **Input / Setup:** Inspect severity of `FORBIDDEN_DEPENDENCY_DIRECTION`.
- **Expected Result:** PASS (`severity: 'ERROR'`).
- **Expected Diagnostics:** Invariant violations are non-negotiable ERRORs.
- **Acceptance Criteria:** Severity is ERROR.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category N — Determinism

### ARC-03-T083: Stable Finding Ordering
- **Test ID:** ARC-03-T083
- **Scenario:** Evaluate repository multiple times and compare finding order.
- **Objective:** Ensure findings are sorted deterministically regardless of filesystem traversal order.
- **Component:** `ArchitectureFitnessHarness.sortFindings`
- **Prerequisites:** Multiple violation findings.
- **Input / Setup:** Shuffle findings and sort twice.
- **Expected Result:** PASS (Output array ordering is 100% identical).
- **Expected Diagnostics:** Sorted by severity > sourceProject > ruleId > sourceLocation.
- **Acceptance Criteria:** Deterministic ordering verified.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T084: Stable Rule Execution Order
- **Test ID:** ARC-03-T084
- **Scenario:** Inspect `evaluatedRuleIds` order in result.
- **Objective:** Ensure evaluated rules are always reported in deterministic alphabetical order.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** Compare `result.evaluatedRuleIds` across runs.
- **Expected Result:** PASS (Alphabetically sorted rule IDs).
- **Expected Diagnostics:** Consistent rule list order.
- **Acceptance Criteria:** Deterministic rule list.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T085: Absence of Non-Deterministic Timestamps in Reports
- **Test ID:** ARC-03-T085
- **Scenario:** Compare JSON reports generated across different seconds.
- **Objective:** Ensure core deterministic report does not include fluctuating current timestamps that break byte-level caching.
- **Component:** `JsonReporter`
- **Prerequisites:** Two evaluations at different times.
- **Input / Setup:** Generate JSON reports at `t0` and `t1`.
- **Expected Result:** PASS (Generated JSON strings are byte-for-byte identical).
- **Expected Diagnostics:** Zero dynamic time values in report output.
- **Acceptance Criteria:** Cache-friendly deterministic JSON.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T086: Cross-Platform Path Normalization
- **Test ID:** ARC-03-T086
- **Scenario:** Compare finding locations generated on Windows (`\`) and POSIX (`/`).
- **Objective:** Ensure backslashes are normalized to forward slashes across all platforms.
- **Component:** Collectors and Rules
- **Prerequisites:** Windows filesystem input.
- **Input / Setup:** Run evidence collection on Windows path.
- **Expected Result:** PASS (All paths use forward slashes `/`).
- **Expected Diagnostics:** Platform-independent relative paths.
- **Acceptance Criteria:** Cross-platform reproducibility.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T087: Stable Coverage Metrics Aggregation
- **Test ID:** ARC-03-T087
- **Scenario:** Compute coverage metrics across evaluations.
- **Objective:** Ensure error, warning, and info counters accurately sum finding counts.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** Check `coverage.errorCount === findings.filter(f => f.severity === 'ERROR').length`.
- **Expected Result:** PASS (Metrics strictly equal finding counts).
- **Expected Diagnostics:** Mathematical consistency.
- **Acceptance Criteria:** Accurate aggregation.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category O — CLI Behavior

### ARC-03-T088: CLI Help Invocation
- **Test ID:** ARC-03-T088
- **Scenario:** Run CLI with `--help`.
- **Objective:** Verify CLI displays usage information and exit code definitions.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Node.js runtime.
- **Input / Setup:** `node --experimental-strip-types tools/architecture/src/cli.ts --help`
- **Expected Result:** PASS (Help text displayed, process exits with code 0).
- **Expected Diagnostics:** Usage, options, and exit codes documented.
- **Acceptance Criteria:** Help text printed cleanly.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T089: CLI Exit Code 0 on Clean Pass
- **Test ID:** ARC-03-T089
- **Scenario:** Run CLI against clean compliant workspace.
- **Objective:** Verify CLI exits with process code 0 when all checks pass.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Compliant repository.
- **Input / Setup:** Execute CLI on clean repository.
- **Expected Result:** PASS (Process exit code 0).
- **Expected Diagnostics:** Final status PASS reported.
- **Acceptance Criteria:** Exit code is 0.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T090: CLI Exit Code 1 on Architecture Violation
- **Test ID:** ARC-03-T090
- **Scenario:** Run CLI when an architectural violation exists.
- **Objective:** Verify CLI exits with process code 1 to fail CI pipeline.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Repository with violation.
- **Input / Setup:** Execute CLI on violating workspace.
- **Expected Result:** FAIL (Process exit code 1).
- **Expected Diagnostics:** Violations printed with remediation.
- **Acceptance Criteria:** Exit code is 1.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T091: CLI Exit Code 2 on Incomplete Analysis
- **Test ID:** ARC-03-T091
- **Scenario:** Run CLI with missing workspace or invalid rule ID.
- **Objective:** Verify CLI exits with process code 2 on configuration/incomplete error.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Invalid arguments.
- **Input / Setup:** Execute CLI with `--rules=INVALID_RULE`.
- **Expected Result:** INCOMPLETE (Process exit code 2).
- **Expected Diagnostics:** Incomplete analysis diagnostic printed.
- **Acceptance Criteria:** Exit code is 2.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T092: CLI JSON Output Formatting
- **Test ID:** ARC-03-T092
- **Scenario:** Run CLI with `--format=json` or `--json`.
- **Objective:** Verify CLI outputs valid JSON parsable by external tooling.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Node.js runtime.
- **Input / Setup:** `node --experimental-strip-types tools/architecture/src/cli.ts --json`
- **Expected Result:** PASS (Stdout contains valid JSON).
- **Expected Diagnostics:** Parsable by `JSON.parse`.
- **Acceptance Criteria:** Machine-readable integration verified.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T093: CLI Specific Rule Selection
- **Test ID:** ARC-03-T093
- **Scenario:** Run CLI with `--rules=ARCH_PROJECT_CLASSIFICATION`.
- **Objective:** Verify CLI evaluates only the specified subset of rules.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Node.js runtime.
- **Input / Setup:** Run CLI with filtered rules option.
- **Expected Result:** PASS (`evaluatedRuleIds` contains only `ARCH_PROJECT_CLASSIFICATION`).
- **Expected Diagnostics:** Coverage reflects 1 requested rule.
- **Acceptance Criteria:** Filtered evaluation supported.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T094: CLI Custom Workspace Path Resolution
- **Test ID:** ARC-03-T094
- **Scenario:** Run CLI with `--workspace=<path>`.
- **Objective:** Verify CLI targets the explicitly specified workspace root directory.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** Valid workspace path.
- **Input / Setup:** Run CLI with custom `--workspace` argument.
- **Expected Result:** PASS (Inspects specified workspace).
- **Expected Diagnostics:** Context root matches argument.
- **Acceptance Criteria:** Safe path resolution.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category P — Reporting

### ARC-03-T095: Human-Readable Console Summary
- **Test ID:** ARC-03-T095
- **Scenario:** Render human-readable console report for passing evaluation.
- **Objective:** Verify header, summary metrics, evaluated rules, and status banner are formatted cleanly.
- **Component:** `ConsoleReporter`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** `ConsoleReporter.render(result)`
- **Expected Result:** PASS (Formatted box-drawing ASCII banner and clear status).
- **Expected Diagnostics:** Contains `ALL ARCHITECTURE FITNESS CHECKS PASSED`.
- **Acceptance Criteria:** Clear readability.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T096: Human-Readable Violation Diagnostics
- **Test ID:** ARC-03-T096
- **Scenario:** Render human-readable report with violations.
- **Objective:** Verify findings display source project, location, violation message, and remediation guidance.
- **Component:** `ConsoleReporter`
- **Prerequisites:** Result with findings.
- **Input / Setup:** `ConsoleReporter.render(resultWithFindings)`
- **Expected Result:** PASS (Displays detailed finding cards).
- **Expected Diagnostics:** Actionable remediation clearly visible.
- **Acceptance Criteria:** Developer-friendly output.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T097: Machine-Readable JSON Schema Conformance
- **Test ID:** ARC-03-T097
- **Scenario:** Render machine-readable JSON report.
- **Objective:** Verify JSON structure matches platform report schema.
- **Component:** `JsonReporter`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** `JsonReporter.render(result)`
- **Expected Result:** PASS (Valid JSON containing status, exitCode, coverage, findings).
- **Expected Diagnostics:** Includes `$schema` declaration.
- **Acceptance Criteria:** External CI/CD ingestion supported.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T098: Coverage Summary Transparency
- **Test ID:** ARC-03-T098
- **Scenario:** Inspect coverage metrics in report output.
- **Objective:** Ensure report explicitly displays evaluated rules count and skipped rules count.
- **Component:** `ConsoleReporter`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** Inspect rendered text for rules ratio.
- **Expected Result:** PASS (Displays `Rules Evaluated: X / Y`).
- **Expected Diagnostics:** Full transparency on uncompleted checks.
- **Acceptance Criteria:** Incomplete analysis cannot be hidden.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T099: Zero ANSI Color Injection in Machine JSON
- **Test ID:** ARC-03-T099
- **Scenario:** Inspect JSON output for ANSI escape codes (`\u001b[...]`).
- **Objective:** Guarantee that machine-readable JSON contains zero ANSI color escape codes.
- **Component:** `JsonReporter`
- **Prerequisites:** Evaluated result.
- **Input / Setup:** Search for escape codes in JSON string.
- **Expected Result:** PASS (Zero ANSI codes present).
- **Expected Diagnostics:** Clean plain-text JSON.
- **Acceptance Criteria:** Safe automated parsing.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category Q — Nx Integration

### ARC-03-T100: Dedicated Nx Project Configuration
- **Test ID:** ARC-03-T100
- **Scenario:** Verify `tools/architecture/project.json` declares valid Nx project `architecture-harness`.
- **Objective:** Confirm harness is integrated into Nx workspace as an official library project.
- **Component:** `tools/architecture/project.json`
- **Prerequisites:** Nx workspace.
- **Input / Setup:** Inspect project configuration in `tools/architecture`.
- **Expected Result:** PASS (Project name: `architecture-harness`, tags: `layer:tool`).
- **Expected Diagnostics:** Recognized by Nx CLI.
- **Acceptance Criteria:** Valid Nx project definition.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T101: Nx Typecheck Target Verification
- **Test ID:** ARC-03-T101
- **Scenario:** Execute `nx run architecture-harness:typecheck`.
- **Objective:** Verify harness code passes strict TypeScript typechecking via Nx target.
- **Component:** `architecture-harness` project
- **Prerequisites:** Nx tooling installed.
- **Input / Setup:** Run Nx typecheck target for `architecture-harness`.
- **Expected Result:** PASS (Target succeeds with exit code 0).
- **Expected Diagnostics:** Typecheck passes cleanly.
- **Acceptance Criteria:** Valid typecheck target.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T102: Nx Check Target Verification
- **Test ID:** ARC-03-T102
- **Scenario:** Verify `check` target in `tools/architecture/project.json`.
- **Objective:** Confirm `architecture-harness:check` executes the harness CLI.
- **Component:** `tools/architecture/project.json`
- **Prerequisites:** Project configuration.
- **Input / Setup:** Inspect target definition in `project.json`.
- **Expected Result:** PASS (Target command configured correctly).
- **Expected Diagnostics:** Runs `node --experimental-strip-types tools/architecture/src/cli.ts`.
- **Acceptance Criteria:** Official Nx target available.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T103: Package.json Architecture Scripts Preservation
- **Test ID:** ARC-03-T103
- **Scenario:** Inspect root `package.json` scripts.
- **Objective:** Confirm both `test:architecture` and `architecture:check` are defined and operational.
- **Component:** `package.json`
- **Prerequisites:** Root manifest.
- **Input / Setup:** Check `package.json` scripts block.
- **Expected Result:** PASS (Both scripts present; existing scripts preserved).
- **Expected Diagnostics:** Scripts point to correct executable tools.
- **Acceptance Criteria:** Backward and forward compatibility.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T104: No Fake Always-Success Scripts
- **Test ID:** ARC-03-T104
- **Scenario:** Inspect script commands in `package.json`.
- **Objective:** Guarantee that no script uses `exit 0`, `|| true`, or dummy stubs that mask failures.
- **Component:** `package.json`
- **Prerequisites:** Root manifest.
- **Input / Setup:** Scan scripts for masking operators.
- **Expected Result:** PASS (Zero masking operators).
- **Expected Diagnostics:** Real exit codes propagated directly.
- **Acceptance Criteria:** Genuine verification enforcement.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category R — ESLint Integration

### ARC-03-T105: Active ESLint Boundary Rules Compatibility
- **Test ID:** ARC-03-T105
- **Scenario:** Cross-reference harness rules with `eslint.config.mjs`.
- **Objective:** Ensure harness and ESLint enforce consistent layer restrictions.
- **Component:** `eslint.config.mjs` & `DependencyDirectionRule`
- **Prerequisites:** ESLint configuration.
- **Input / Setup:** Compare import restrictions across both configurations.
- **Expected Result:** PASS (Rules mutually reinforce the same architectural boundaries).
- **Expected Diagnostics:** Consistent layer matrix.
- **Acceptance Criteria:** Layered defense without contradiction.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T106: External Import Coverage Alignment
- **Test ID:** ARC-03-T106
- **Scenario:** Inspect external package restrictions across ESLint and harness.
- **Objective:** Confirm both mechanisms restrict `@nestjs/*` and `@angular/*` from Core.
- **Component:** `FrameworkIsolationRule`
- **Prerequisites:** Architecture rules.
- **Input / Setup:** Compare framework restriction patterns.
- **Expected Result:** PASS (Identical forbidden framework lists).
- **Expected Diagnostics:** Pure TypeScript core enforced by both layers.
- **Acceptance Criteria:** Consistent framework isolation.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T107: Deep Import Restriction Alignment
- **Test ID:** ARC-03-T107
- **Scenario:** Verify ESLint `no-restricted-imports` aligns with harness deep import detection.
- **Objective:** Confirm deep imports into `src/` and `dist/` are banned at both lint and harness layers.
- **Component:** `PublicApiBoundaryRule`
- **Prerequisites:** Configurations.
- **Input / Setup:** Check restricted patterns.
- **Expected Result:** PASS (Both enforce barrel entry point restriction).
- **Expected Diagnostics:** Consistent public API discipline.
- **Acceptance Criteria:** Multi-layered boundary protection.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T108: Accurate Reporting of ESLint Integration Capability
- **Test ID:** ARC-03-T108
- **Scenario:** Inspect `capabilities.eslintIntegrationAvailable` in context.
- **Objective:** Ensure the harness accurately reports programmatic ESLint integration status as false rather than claiming unverified programmatic execution.
- **Component:** `EvidenceCollector`
- **Prerequisites:** Context snapshot.
- **Input / Setup:** Check `context.capabilities.eslintIntegrationAvailable`.
- **Expected Result:** PASS (Accurately reflects current supported capability).
- **Expected Diagnostics:** Zero false capability claims.
- **Acceptance Criteria:** Factual capability transparency.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T109: Absence of Contradictory Duplicate Policy
- **Test ID:** ARC-03-T109
- **Scenario:** Verify that harness does not maintain a conflicting policy matrix that diverges from ESLint rules.
- **Objective:** Ensure single source of architectural truth derived from ARC-02.
- **Component:** `policy.contract.ts`
- **Prerequisites:** Policy definition.
- **Input / Setup:** Cross-reference `policy.contract.ts` with `docs/architecture/dependency-rules.md`.
- **Expected Result:** PASS (Harness is a typed projection of ARC-02).
- **Expected Diagnostics:** Zero policy divergence.
- **Acceptance Criteria:** Authoritative policy preserved.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category S — Policy Ownership

### ARC-03-T110: Single Authoritative Policy Projection
- **Test ID:** ARC-03-T110
- **Scenario:** Inspect `tools/architecture/src/contracts/policy.contract.ts`.
- **Objective:** Verify policy contract sources directly from ARC-02 without inventing new permissions.
- **Component:** `policy.contract.ts`
- **Prerequisites:** Policy contract source.
- **Input / Setup:** Verify `AUTHORITATIVE_LAYER_MATRIX` and `ARCHITECTURE_TAG_TAXONOMY`.
- **Expected Result:** PASS (Exact projection of ARC-02 specification).
- **Expected Diagnostics:** Sourced directly from ARC-02 documentation.
- **Acceptance Criteria:** Zero policy competition.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T111: Rejection of Wildcard Policy Exemptions
- **Test ID:** ARC-03-T111
- **Scenario:** Inspect policy matrix for blanket `*` or `allow-all` permissions.
- **Objective:** Ensure no platform layer possesses unrestricted import permissions.
- **Component:** `policy.contract.ts`
- **Prerequisites:** Policy matrix.
- **Input / Setup:** Scan allowed layers for wildcard tokens.
- **Expected Result:** PASS (Zero wildcard permissions in policy matrix).
- **Expected Diagnostics:** Every permitted layer is explicitly enumerated.
- **Acceptance Criteria:** Explicit contracts only.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T112: Unknown Project Policy Rejection
- **Test ID:** ARC-03-T112
- **Scenario:** A project not defined in the policy matrix attempts to import platform core.
- **Objective:** Ensure unknown projects are not granted default allow permissions.
- **Component:** `DependencyDirectionRule`
- **Prerequisites:** Unregistered project node.
- **Input / Setup:** Evaluate dependencies for untagged/unknown project.
- **Expected Result:** FAIL (Unrecognized project flagged).
- **Expected Diagnostics:** Default-deny policy applied.
- **Acceptance Criteria:** Strict zero-trust dependency evaluation.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T113: Narrow Documented Exception Boundary
- **Test ID:** ARC-03-T113
- **Scenario:** Check for undocumented inline exception comments (`// arch-ignore`).
- **Objective:** Verify the harness does not allow source files to bypass rules using magic comments.
- **Component:** `SourceImportCollector`
- **Prerequisites:** Source files.
- **Input / Setup:** Check if collector supports bypass comment directives.
- **Expected Result:** PASS (No comment-based bypass mechanism exists).
- **Expected Diagnostics:** All imports evaluated uniformly.
- **Acceptance Criteria:** Zero magic bypass comments.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T114: Policy Version Tracking
- **Test ID:** ARC-03-T114
- **Scenario:** Verify policy contracts document alignment with ARC-02 specification version.
- **Objective:** Ensure future policy changes require explicit versioned reconciliation.
- **Component:** `policy.contract.ts`
- **Prerequisites:** Contract documentation.
- **Input / Setup:** Inspect contract module header.
- **Expected Result:** PASS (Explicit reference to ARC-02 and AGENTS.md).
- **Expected Diagnostics:** Provenance documented.
- **Acceptance Criteria:** Clear policy provenance.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category T — Architecture Preservation

### ARC-03-T115: ARC-01 NestJS API Boundary Preserved
- **Test ID:** ARC-03-T115
- **Scenario:** Inspect backend architecture after ARC-03 implementation.
- **Objective:** Confirm NestJS backend application host boundaries established in ARC-01 are preserved.
- **Component:** Workspace Architecture
- **Prerequisites:** ARC-01 artifacts.
- **Input / Setup:** Verify `package.json` scripts and NestJS dependencies.
- **Expected Result:** PASS (NestJS remains configured as backend host in tooling/adapters).
- **Expected Diagnostics:** NestJS preserved without modification.
- **Acceptance Criteria:** ARC-01 backend intact.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T116: ARC-01 Angular Studio Boundary Preserved
- **Test ID:** ARC-03-T116
- **Scenario:** Inspect frontend architecture after ARC-03 implementation.
- **Objective:** Confirm Angular Studio frontend presentation boundaries established in ARC-01 are preserved.
- **Component:** Workspace Architecture
- **Prerequisites:** ARC-01 artifacts.
- **Input / Setup:** Verify Angular configurations and scripts in `package.json`.
- **Expected Result:** PASS (Angular remains configured for frontend).
- **Expected Diagnostics:** Angular preserved without modification.
- **Acceptance Criteria:** ARC-01 frontend intact.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T117: PrimeNG Integration Preserved
- **Test ID:** ARC-03-T117
- **Scenario:** Verify PrimeNG UI component library is preserved in architecture configuration.
- **Objective:** Confirm PrimeNG remains permitted exclusively in frontend presentation layer.
- **Component:** Workspace Architecture
- **Prerequisites:** Architecture policy.
- **Input / Setup:** Inspect PrimeNG classification in policy matrix.
- **Expected Result:** PASS (PrimeNG quarantined to presentation, preserved for UI).
- **Expected Diagnostics:** Allowed in frontend, forbidden in core.
- **Acceptance Criteria:** PrimeNG role preserved.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T118: Modular Monolith Repository Structure Preserved
- **Test ID:** ARC-03-T118
- **Scenario:** Inspect workspace structure after harness implementation.
- **Objective:** Confirm repository remains an Nx modular monolith with clean directory boundaries.
- **Component:** Monorepo Layout
- **Prerequisites:** Workspace root layout.
- **Input / Setup:** Inspect `platform/`, `adapters/`, `tools/` structure.
- **Expected Result:** PASS (Clean modular monolith structure intact).
- **Expected Diagnostics:** No microservices or distributed service bloat.
- **Acceptance Criteria:** Modular monolith maintained.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T119: Anti-Premature Complexity Rule Enforced
- **Test ID:** ARC-03-T119
- **Scenario:** Scan workspace for forbidden premature infrastructure.
- **Objective:** Confirm zero microservices, Kubernetes manifests, Kafka brokers, or billing engines were added.
- **Component:** Workspace Infrastructure
- **Prerequisites:** Workspace filesystem.
- **Input / Setup:** Verify absence of premature infrastructure directories.
- **Expected Result:** PASS (Zero premature infrastructure introduced).
- **Expected Diagnostics:** Strict adherence to AGENTS.md anti-premature complexity constitution.
- **Acceptance Criteria:** Clean-core focus maintained.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category U — Security & Sandboxing

### ARC-03-T120: No Arbitrary Executable Rule Loading
- **Test ID:** ARC-03-T120
- **Scenario:** Verify harness does not scan arbitrary filesystem directories for executable `.js`/`.ts` rule plugins.
- **Objective:** Prevent arbitrary code execution vulnerabilities in developer tooling.
- **Component:** `RuleRegistry`
- **Prerequisites:** Rule registry implementation.
- **Input / Setup:** Inspect `RuleRegistry` for dynamic module loading.
- **Expected Result:** PASS (Registry is statically defined and immutable).
- **Expected Diagnostics:** Zero dynamic `eval()` or unvetted `import()` of user strings.
- **Acceptance Criteria:** Static trusted rule registration only.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T121: Uncontrolled Workspace Path Traversal Prevention
- **Test ID:** ARC-03-T121
- **Scenario:** Pass malicious path `../../../../etc` as `--workspace` argument.
- **Objective:** Prevent path traversal attacks from escaping the intended workspace boundary.
- **Component:** `tools/architecture/src/cli.ts`
- **Prerequisites:** CLI entry point.
- **Input / Setup:** Run CLI with path traversal argument.
- **Expected Result:** INCOMPLETE (Fails safely if no valid workspace is found).
- **Expected Diagnostics:** Unhandled traversal prevented.
- **Acceptance Criteria:** Safe path resolution via `path.resolve`.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T122: Source File Immutability Under All Execution Modes
- **Test ID:** ARC-03-T122
- **Scenario:** Run harness in all available CLI modes (`--json`, `--rules=...`, default).
- **Objective:** Guarantee that no execution mode ever writes, mutates, or touches source files.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Clean git status.
- **Input / Setup:** Execute harness across all modes; run `git status`.
- **Expected Result:** PASS (`git status` reports working tree completely clean).
- **Expected Diagnostics:** Zero side-effects on source repository.
- **Acceptance Criteria:** Complete read-only safety.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T123: Private System Path Sanitization in Reports
- **Test ID:** ARC-03-T123
- **Scenario:** Inspect generated JSON reports for private username or local machine paths.
- **Objective:** Prevent leakage of developer environment paths in shared reports.
- **Component:** `JsonReporter` & `ConsoleReporter`
- **Prerequisites:** Generated report.
- **Input / Setup:** Scan output for user home directory strings (`C:\Users\...`).
- **Expected Result:** PASS (All finding paths are relative to workspace root).
- **Expected Diagnostics:** Only repository-relative locations exposed.
- **Acceptance Criteria:** Privacy and security preserved.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T124: Zero External Network Telemetry
- **Test ID:** ARC-03-T124
- **Scenario:** Verify harness does not send telemetry, phone home, or transmit analysis reports externally.
- **Objective:** Ensure complete confidentiality of enterprise architectural analysis.
- **Component:** `ArchitectureFitnessHarness`
- **Prerequisites:** Network monitoring.
- **Input / Setup:** Monitor outbound traffic during harness execution.
- **Expected Result:** PASS (Zero outbound network traffic).
- **Expected Diagnostics:** 100% local in-memory analysis.
- **Acceptance Criteria:** Zero telemetry.
- **Execution Status:** NOT_RUN — DEFERRED

---

## Category V — Architectural Boundaries

### ARC-03-T125: Zero Semantic Meta-Model Features Implemented
- **Test ID:** ARC-03-T125
- **Scenario:** Verify harness does not implement business entities, semantic types, or models.
- **Objective:** Ensure strict task boundary: ARC-03 is verification infrastructure only.
- **Component:** `tools/architecture`
- **Prerequisites:** Repository codebase.
- **Input / Setup:** Inspect changes made in ARC-03.
- **Expected Result:** PASS (Zero semantic business domain features implemented).
- **Expected Diagnostics:** Adheres to explicit non-goals in ARC-03 specification.
- **Acceptance Criteria:** Non-goal boundaries respected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T126: Zero Compiler Passes Implemented
- **Test ID:** ARC-03-T126
- **Scenario:** Confirm no AST lowering, IR generation, or compilation pipelines were created.
- **Objective:** Prevent premature implementation of Compiler Core in verification task.
- **Component:** Platform Architecture
- **Prerequisites:** Codebase inspection.
- **Input / Setup:** Scan for compiler implementation code.
- **Expected Result:** PASS (Zero compiler features implemented).
- **Expected Diagnostics:** Compiler Core remains deferred to future architectural milestones.
- **Acceptance Criteria:** Non-goals respected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T127: Zero Runtime Engine Execution Code Implemented
- **Test ID:** ARC-03-T127
- **Scenario:** Confirm no action execution pipelines, state managers, or workflow engines were created.
- **Objective:** Prevent premature runtime implementation in verification task.
- **Component:** Platform Architecture
- **Prerequisites:** Codebase inspection.
- **Input / Setup:** Scan for runtime execution code.
- **Expected Result:** PASS (Zero runtime execution engines implemented).
- **Expected Diagnostics:** Runtime Core remains deferred to future milestones.
- **Acceptance Criteria:** Non-goals respected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T128: Zero Database Persistence Implemented
- **Test ID:** ARC-03-T128
- **Scenario:** Confirm no SQL schemas, migrations, or database adapters were created.
- **Objective:** Prevent premature database persistence implementation.
- **Component:** Platform Architecture
- **Prerequisites:** Codebase inspection.
- **Input / Setup:** Scan for database migrations or connections.
- **Expected Result:** PASS (Zero database infrastructure implemented).
- **Expected Diagnostics:** Persistence remains deferred.
- **Acceptance Criteria:** Non-goals respected.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T129: Zero Automated Test Specifications Executed
- **Test ID:** ARC-03-T129
- **Scenario:** Verify that zero automated test cases (`*.spec.ts`, `*.test.ts`) were executed during ARC-03.
- **Objective:** Strict adherence to mandatory deferred testing protocol.
- **Component:** Test Archive
- **Prerequisites:** Task execution logs.
- **Input / Setup:** Check test execution logs.
- **Expected Result:** PASS (Tests executed: 0, status: NOT_RUN — DEFERRED).
- **Expected Diagnostics:** All 130 verification scenarios documented as deferred.
- **Acceptance Criteria:** Zero automated tests executed.
- **Execution Status:** NOT_RUN — DEFERRED

### ARC-03-T130: Definitive Task Boundary Completion
- **Test ID:** ARC-03-T130
- **Scenario:** Verify task execution stops strictly after ARC-03 without auto-advancing to ARC-04.
- **Objective:** Ensure agent honors task scope boundaries and awaits user direction before proceeding.
- **Component:** Workflow Governance
- **Prerequisites:** ARC-03 completion report.
- **Input / Setup:** Verify next-step recommendations.
- **Expected Result:** PASS (Execution stops after ARC-03).
- **Expected Diagnostics:** Awaits user confirmation before proceeding to ARC-04.
- **Acceptance Criteria:** Scope boundaries strictly respected.
- **Execution Status:** NOT_RUN — DEFERRED
