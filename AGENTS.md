# AGENTS.md — Platform Architecture & Operational Constitution

> **Status:** Permanent Mandatory Constitution  
> **Target System:** Model-Driven Enterprise Ecosystem Platform  
> **Full System Title:** A Composable, Model-Driven Enterprise Ecosystem Platform based on a Unified Semantic Meta-Model, with a Metadata-Compiled Runtime, Clean-Core Extension Model, and AI-Native Execution Architecture  
> **Audience:** All AI Agents, Autonomous Coding Assistants, and Contributing Engineers  
> **Authority:** Non-negotiable baseline. Modifying this constitution or layer boundaries requires explicit human approval.

---

## 1. Project Identity

This repository hosts the **Model-Driven Enterprise Ecosystem Platform**, an enterprise-grade platform designed to define, compile, govern, and execute composable enterprise applications without hardcoding business semantics into framework-specific monoliths.

### Core Architectural Pillars
1. **Unified Semantic Meta-Model:** A coherent semantic language providing foundational primitives (elements, facets, types, actions, events) across heterogeneous enterprise domains.
2. **Metadata-Compiled Runtime:** A deterministic pipeline that compiles authoring metadata into canonical models, transforms them into versioned Semantic Intermediate Representations (Semantic IR), and executes only resolved, validated runtime artifacts.
3. **Clean-Core Extension Model:** A strict zero-core-modification extension mechanism where enterprise customizations, vertical industries, and customer extensions plug into explicit platform contracts and ports.
4. **AI-Native Execution Architecture:** An architecture where AI agents operate as first-class, policy-governed actors through the exact same Semantic Action, Policy, and Audit pipelines as human users and automated systems.

### Current Repository State
- **Workspace Tooling:** Nx Monorepo (`nx` 23.3.0), Node.js, TypeScript (~6.0.3, ES2022/NodeNext).
- **Current Milestone:** `VS-00: Architecture Skeleton & Contract Harness`.
- **Implementation Reality Check:** The repository is at an initial bootstrap phase. The `packages/` directory is currently empty. Local architecture documentation under `docs/architecture/` is pending ingestion into the repository.
- **Rule of Truth:** Never assume libraries, modules, or services exist unless verified in the actual file system. Architecture specifications describe required target state, not accomplished implementation.

---

## 2. Architecture Mission

The mission of this platform is to solve enterprise fragility and lock-in by replacing brittle code generation and monolithic enterprise frameworks with a decoupled, model-driven, and verifiable foundation:

- **Semantic Primacy:** Business semantics remain decoupled from runtime engines, databases, and UI presentation frameworks.
- **Deterministic Predictability:** What can be verified and compiled must be validated and compiled ahead-of-time.
- **Isolation & Multi-Tenancy:** Strict runtime, data, and policy isolation boundaries at the tenant level.
- **Governed Autonomy:** AI agents are empowered to act, reason, and compose workflows, but can never bypass policy enforcement, capability contracts, tenant boundaries, or immutable audit trails.

---

## 3. Non-Negotiable Architecture Principles

Every agent and engineer must strictly uphold the following 25 foundational principles in every design, code edit, and review:

1. **Unify semantic language, not every domain ontology.**  
   *Rule:* Standardize meta-model primitives, grammar, and structural schemas across all domains. Never force every distinct business domain into a single, unwieldy, monolithic business ontology.

2. **SemanticElement is broader than SemanticType.**  
   *Rule:* Treat `SemanticElement` as the generalized, identifiable base unit of the semantic model. `SemanticType` is a specialized typing/classification element. Never use them interchangeably.

3. **Context owns meaning.**  
   *Rule:* Semantic definitions derive meaning exclusively within their bounded context and tenant scope. Never resolve symbols, attributes, or actions without their containing context.

4. **Prefer composition over inheritance.**  
   *Rule:* Assemble behavior, capabilities, and data shapes through composition and orthogonal facets. Deep object-oriented inheritance hierarchies in semantic definitions are strictly prohibited.

5. **Facets carry orthogonal semantic concerns.**  
   *Rule:* Isolate orthogonal concerns (e.g., persistence mappings, audit rules, validation constraints, localization, UI hints) into independent facets attached to semantic elements. Never pollute the core identity with ad-hoc concerns.

6. **Definition, Instance, and Execution are distinct.**  
   *Rule:* Strictly maintain clear architectural boundaries between the design-time *Definition* (metadata/schema), the stateful *Instance* (entity record/data state), and the active *Execution* (runtime context, transaction, stack trace).

7. **Semantic identity is independent from physical representations.**  
   *Rule:* Semantic entities possess stable, platform-independent identities (URN/URI/Semantic ID). Never tie semantic identity directly to relational primary keys, database schemas, or transient wire protocols.

8. **Externally meaningful side effects pass through Semantic Actions.**  
   *Rule:* Any state mutation or external system integration producing side effects MUST be modeled and executed as a declared Semantic Action. Direct backdoor mutations or unmonitored side effects are forbidden.

9. **Events represent facts, not future intentions.**  
   *Rule:* Semantic Events express immutable past facts (`OrderPlaced`, `InvoiceApproved`). Never model commands, intent, or desired future state as events.

10. **Capabilities represent ability; Policies govern authority.**  
    *Rule:* A Capability defines what a component, actor, or service is functionally able to do. A Policy evaluates whether a specific actor is permitted to exercise that capability in a given context. Never conflate ability with permission.

11. **Compile what can safely be compiled.**  
    *Rule:* Resolve, validate, optimize, and index all static semantic metadata ahead-of-time during compilation. Do not postpone deterministic validations to runtime execution.

12. **Runtime consumes resolved artifacts, not arbitrary raw metadata.**  
    *Rule:* The production runtime engine consumes only validated, compiled Semantic IR and optimized runtime artifacts. It must NEVER interpret or compile arbitrary, raw, unvalidated authoring metadata on the fly.

13. **Core extension is allowed only through explicit contracts.**  
    *Rule:* Protect the Clean-Core. Extensions, customization packages, and partner plugins can only interact with the platform through published, versioned extension points, interfaces, and contracts.

14. **Packages declare dependencies, capabilities, permissions, and compatibility.**  
    *Rule:* Every deployable semantic package must provide a complete, machine-readable manifest declaring required dependencies, exposed capabilities, requested permissions, and platform compatibility ranges.

15. **Tenant is a runtime and security isolation boundary.**  
    *Rule:* Complete tenant isolation must be enforced across execution state, data stores, caches, event streams, and policy decisions. Cross-tenant leakage is a critical architectural violation.

16. **Versioning and evolution belong to the semantic model.**  
    *Rule:* Semantic models, interfaces, and artifacts must support explicit SemVer declarations, schema evolution contracts, deprecation pathways, and backwards-compatibility guarantees.

17. **AI agents use the same Action and Policy execution path.**  
    *Rule:* Autonomous or assisted AI agents are first-class actors that must invoke operations through the standard Semantic Action dispatch pipeline, subject to standard Policy evaluation. No private agent backdoors.

18. **AI must never bypass authorization, policy enforcement, or audit.**  
    *Rule:* Every agent request must be authenticated, authorized against context policies, validated against capabilities, and recorded in the audit log. Zero exemptions for AI agents.

19. **Provenance is a first-class concern.**  
    *Rule:* Record full provenance (creator identity, agent model, prompt version, timestamp, reasoning hash, change rationale) for all metadata creations, modifications, and automated executions.

20. **The Meta-Model Kernel must remain small and stable.**  
    *Rule:* The Semantic Kernel contains only irreducible primitives, identity contracts, and diagnostic models. Domain logic, workflow execution, UI rendering, and orchestration are barred from the Kernel.

21. **Application semantics are independent of presentation technology.**  
    *Rule:* Business workflows, domain rules, and semantic schemas must remain completely decoupled from Angular, React, Vue, Flutter, HTML, or mobile platforms.

22. **Experience intent must remain separate from UI implementation.**  
    *Rule:* Experience models capture intent, interaction steps, information architecture, and behavioral goals. Layout rendering, CSS styling, and component mechanics belong exclusively to presentation adapters.

23. **Web and Mobile can share semantics without requiring identical UX.**  
    *Rule:* Deliver channel-appropriate user experiences from shared semantic contracts without forcing mobile to mimic web layouts or vice versa.

24. **Presentation targets must be replaceable adapters.**  
    *Rule:* Treat UI runtimes as disposable, pluggable adapters conforming to platform contracts (Ports and Adapters). Changing the UI framework must never impact underlying application semantics.

25. **Custom code is allowed only through explicit platform contracts.**  
    *Rule:* User-written or partner custom code executes strictly within sandboxed boundaries through explicit platform ports. Never allow custom code to monkey-patch, access private globals, or mutate platform internals.

---

## 4. Module and Dependency Boundaries

Architectural integrity requires strict layer isolation and unidirectional dependencies. The repository will enforce these rules via Nx module boundary tags, ESLint rules, and Architecture Fitness Tests:

```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Adapters                       │
│           (Angular, React, Mobile, CLI, APIs)               │
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
│       (Primitives, Identity, TypeRef, Facet Contracts)      │
└─────────────────────────────────────────────────────────────┘
```

### Strict Architectural Invariants:
1. **Semantic Kernel Independence:** The Kernel must have **ZERO dependencies** on Compiler, Runtime, UI, Persistence, or third-party web frameworks.
2. **Domain/Application Decoupling:** Semantic domain models must never import `@angular/*`, `react`, `@nestjs/*`, or any presentation/infrastructure package.
3. **Compiler to Runtime Direction:** The Compiler produces versioned Semantic IR and runtime artifacts. The Runtime consumes these artifacts. The Runtime must **NEVER depend on Compiler internal implementations**.
4. **No JIT Authoring Compilation:** The Runtime must never compile raw, unvalidated authoring metadata during standard execution.
5. **No Circular Dependencies:** Circular imports between libraries, packages, or architectural layers are strictly prohibited.
6. **No Direct Database Access for AI/Presentation:** AI agents and presentation adapters cannot query raw SQL/NoSQL databases or bypass the semantic repository port.
7. **No Unrestricted Scripting:** Scripting engines must not be used as an escape hatch to bypass defined semantic contracts.

---

## 5. Semantic Kernel Constraints

The **Semantic Kernel** is the root anchor of all platform models. It must remain minimal, stable, and zero-dependency.

### Permitted Within Minimum Kernel:
- **Semantic Identity:** Standards-compliant identity contracts (`SemanticId`, `URN`, `QualifiedName`).
- **Minimal `SemanticElement` Contract:** Core interface defining identification, kind, metadata, and facet collection.
- **Version Reference:** Explicit SemVer representation and dependency range contracts.
- **`TypeRef` & Primitives:** Scalar types, structural references, and primitive type definitions.
- **Facet Contract:** The generic contract allowing orthogonal facets to attach to elements.
- **Diagnostics:** Standard validation error, warning, diagnostic, and location reporting interfaces.

### Strictly Excluded from Kernel:
- ❌ Execution Engine / Runtime Dispatchers
- ❌ Workflow / Orchestration engines
- ❌ Policy Evaluation Engine
- ❌ Package Management / Packaging system
- ❌ UI Adapters / Rendering engines
- ❌ AI Prompting / LLM Integrations
- ❌ Persistence / Database schemas

### Crucial Architectural Distinctions:
| Concept A | Concept B | Architectural Boundary |
| :--- | :--- | :--- |
| **SemanticElement** | **SemanticType** | `SemanticElement` is any identifiable model node. `SemanticType` is a specific classification facet. |
| **Definition** | **Instance** | `Definition` is immutable design-time metadata. `Instance` is a stateful entity record. |
| **Instance** | **Execution** | `Instance` is entity state. `Execution` is active runtime context, invocation trace, and stack. |
| **Capability** | **Permission** | `Capability` is what a component *can* do. `Permission` is whether an actor is *allowed* to do it. |
| **Action** | **Event** | `Action` expresses intent to produce state changes. `Event` is an immutable record of past fact. |
| **Rule** | **Policy** | `Rule` verifies deterministic semantic validity. `Policy` evaluates dynamic security/governance context. |
| **Model Validation** | **Runtime Validation** | Model validation tests metadata conformance. Runtime validation checks live payloads and permissions. |

---

## 6. Compiler and Runtime Separation

The platform enforces a strict 4-stage pipeline from authoring to execution:

```
[ Authoring Model ] ──► [ Canonical Model ] ──► [ Semantic IR ] ──► [ Runtime Artifacts ]
  (Developer/IDE)       (Validated/Normalized)   (Resolved/Optimized)   (Executed by Runtime)
```

1. **Authoring Model:** Human- and tool-authored representations (declarative schemas, DSLs, or visual model files).
2. **Canonical Model:** Structurally normalized, semantically complete, and validated against the Semantic Meta-Model.
3. **Semantic IR (Intermediate Representation):** Fully resolved, type-checked, optimized, and versioned intermediate representation with all cross-references linked.
4. **Runtime Artifact:** Immutable, serialized, compiled bundles, lookup indexes, and execution manifests ready for zero-overhead consumption by the Runtime.

Agents must never bypass this pipeline to feed raw authoring JSON directly into the runtime execution engine.

---

## 7. Security and AI Governance

AI agents (including coding agents, runtime assistants, and workflow executors) are subject to platform governance:

### Agent Operating Safeguards:
- **Requirements vs. Implementation:** Treat architecture documents, tickets, and plans as *specifications of intent*, never as proof that code is implemented or working.
- **Zero Fabrication:** Never fabricate test outputs, mock passes, or claim unverified capabilities. If an action or test was not run, state so explicitly.
- **No Silent Boundary Weakening:** Never relax ESLint rules, suppress TypeScript type checks (`@ts-ignore`, `any`), or remove architecture fitness tests to make a build pass.
- **No Direct Data Layer Access:** AI agents interact with business domain state solely through audited Semantic Actions. Direct raw SQL execution, ORM backdoor calls, or schema tampering are strictly banned.
- **Explicit Provenance:** All agent-generated models, artifacts, and changes must include provenance metadata linking to the agent identity, model, timestamp, and triggering context.
- **Destructive Operation Shield:** Agents must not delete packages, reformat repositories, reset git histories, or run irreversible operations without explicit human authorization.
- **Dependency Hygiene:** Never install external npm packages or configure third-party services without a verified, justified architectural need and user confirmation.

---

## 8. Technology and Repository Principles

### Core Stack:
- **Language:** TypeScript (Strict mode enabled, `noImplicitAny`, `strictNullChecks`, modern target ES2022+).
- **Runtime Environment:** Node.js (Active LTS).
- **Monorepo Management:** Nx (`nx.json`, workspace project references, clear library tagging).
- **Architecture Paradigm:** Modular Monolith First, Ports and Adapters (Hexagonal Architecture), Dependency Inversion.
- **Design Philosophy:** Clean-Core, Explicit Contracts, Deterministic Compilation, Automated Fitness Verification.

### Anti-Premature Complexity (Strictly Prohibited at this Stage):
Do **NOT** introduce or configure:
- ❌ Microservices architectures or distributed service meshes
- ❌ Kubernetes manifests, Helm charts, or Docker swarm configurations
- ❌ Kafka, RabbitMQ, or heavy message brokers
- ❌ Multi-region or multi-cloud deployment automation
- ❌ Monetization, Marketplace, or billing engines
- ❌ Distributed temporal orchestration engines
- ❌ Dozens of empty boilerplate packages or speculative directories

Build vertical slices incrementally upon clean foundational contracts.

---

## 9. Engineering Workflow for AI Agents

Whenever tasked with an engineering issue or enhancement, agents must follow this sequential protocol:

1. **Understand Goal & Scope:** Read requirements carefully. Clarify ambiguous goals before modifying code.
2. **Inspect Existing Code & Contracts:** Inspect repository files, interfaces, and configurations. Never assume a module's structure without reading it.
3. **Check Dependencies & Boundaries:** Verify that proposed changes will not violate layer boundaries or introduce circular dependencies.
4. **Avoid Duplication:** Leverage existing abstractions, utilities, and contracts before creating new ones.
5. **Plan Non-Trivial Changes:** For changes affecting multiple files or contracts, outline a concise plan before editing.
6. **Protect Architecture Constitution:** Never modify `AGENTS.md` or core layer constraints without explicit human approval.
7. **Smallest Viable Increment:** Implement the minimal clean change that satisfies the acceptance criteria.
8. **Add Tests:** Write comprehensive unit and contract tests covering both positive execution and negative/rejection paths.
9. **Execute Verification:** Run build, typecheck, tests, and linter via available CLI commands.
10. **Honest Reporting:** Report exact commands run and output received. Never declare a check "passed" if it was not executed.
11. **Respect Scope Boundaries:** Never auto-advance to subsequent architectural phases or vertical slices without user consent.
12. **Final Structured Report:** Summarize modified files, verification results, constraints preserved, and identified risks.

---

## 10. Incremental Delivery Strategy

The platform architecture progresses via:
**Horizontal Foundations + Vertical End-to-End Slices**

Every increment must be:
- **Executable:** Can be invoked and run in an environment.
- **Testable:** Accompanied by automated positive and negative test suites.
- **Observable:** Emits diagnostic logs, metrics, or telemetry.
- **Measurable:** Adheres to deterministic performance and contract budgets.
- **Demoable:** Produces demonstrable end-to-end behavior.

### Architectural Roadmap Reference:
```
VS-00 ──► VS-01 ──► VS-02 ──► VS-03 ──► VS-04 ──► VS-05+
```

#### Current Milestone: `VS-00: Architecture Skeleton & Contract Harness`
- **ARC-01 Repository Architecture:** Workspace layout, Nx structure, and directory boundaries.
- **ARC-02 Dependency Rules:** Strict boundary configuration (Nx tags, ESLint module boundary enforcement).
- **ARC-03 Architecture Fitness Test Harness:** Automated test suites verifying dependency rules and layer purity.
- **ARC-04 Platform Bootstrap:** Minimal platform bootstrapping logic.
- **ARC-05 Platform CLI Skeleton:** Basic CLI harness for triggering platform verification and compilation commands.

*(Note: The roadmap provides strategic context. Agents must not execute tasks beyond the currently assigned task.)*

---

## 11. Prohibited Shortcuts

Agents and contributors are explicitly forbidden from taking the following shortcuts:
- 🚫 **Bypassing Policies:** Executing an action directly without passing through context policy checks.
- 🚫 **Direct ORM/Database Leaks:** Exposing database entities or SQL queries to presentation or agent components.
- 🚫 **Typing Degradation:** Using `any`, `unknown as any`, or suppressing compiler errors with `@ts-ignore`.
- 🚫 **Framework Ingestion in Kernel:** Importing web, UI, or HTTP frameworks into the Semantic Meta-Model Kernel.
- 🚫 **Unvalidated Metadata Execution:** Loading raw authoring schemas directly into the execution engine.
- 🚫 **Hidden Circular Barrels:** Creating circular index re-exports (`index.ts`) across packages.
- 🚫 **Phantom Tests:** Writing tests with empty assertions (`expect(true).toBe(true)`) or claiming unverified execution.

---

## 12. Definition of Done (DoD)

A task is considered complete **ONLY** when:
1. **Constitution Compliance:** Code adheres to all 25 Non-Negotiable Architecture Principles.
2. **Boundary Integrity:** Module boundaries, layer directions, and dependency rules are fully respected without circularity.
3. **Strict Type Safety:** All code compiles under strict TypeScript settings with zero errors or warnings.
4. **Comprehensive Test Coverage:** Positive paths, edge cases, and negative rejection paths are covered by automated tests.
5. **Verified Verification:** Build, typecheck, test, and lint commands have been actually run and confirmed passing.
6. **Clean Provenance:** Architectural decisions, contracts, and rationale are clearly documented.
7. **Scoped Delivery:** The implementation is strictly confined to the agreed scope with no scope creep.
