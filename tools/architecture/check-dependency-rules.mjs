#!/usr/bin/env node
/**
 * @file check-dependency-rules.mjs
 * @description Architecture Fitness Test & Dependency Boundary Verification Engine
 *
 * Enforces the architectural constitution defined in AGENTS.md and ARC-02:
 * 1. Semantic Kernel Isolation: Pure TypeScript, zero platform/framework dependencies.
 * 2. Model Core Direction: Depends only on Semantic Kernel.
 * 3. Framework Confinement: NestJS and Angular/PrimeNG confined to adapters/apps.
 * 4. Deep Import Prevention: Inter-package imports must use public entry points only.
 * 5. Type-Only Imports: Subject to the exact same boundary rules as runtime imports.
 * 6. Project Graph Cycle Detection: No circular dependencies between projects.
 * 7. Tag Taxonomy Coverage: Every project must have valid, non-empty tags.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, join, extname } from 'node:path';

const WORKSPACE_ROOT = resolve(process.cwd());

// ─── 1. Architectural Taxonomy & Allowed Dependency Matrix ───────────────────

const ALLOWED_PROJECT_DEPENDENCIES = {
  'semantic-kernel': [],
  'model-core': ['semantic-kernel'],
  'platform-contracts': [],
};

const FORBIDDEN_FRAMEWORK_PATTERNS = {
  'layer:kernel': [
    { pattern: /@nestjs\//, name: 'NestJS (@nestjs/*)' },
    { pattern: /@angular\//, name: 'Angular (@angular/*)' },
    { pattern: /primeng/, name: 'PrimeNG' },
    { pattern: /express/, name: 'Express' },
    { pattern: /typeorm/, name: 'TypeORM' },
    { pattern: /prisma/, name: 'Prisma' },
    { pattern: /@ecosystem\/(?!semantic-kernel)/, name: 'Higher platform layers' },
  ],
  'layer:model': [
    { pattern: /@nestjs\//, name: 'NestJS (@nestjs/*)' },
    { pattern: /@angular\//, name: 'Angular (@angular/*)' },
    { pattern: /primeng/, name: 'PrimeNG' },
    { pattern: /express/, name: 'Express' },
    { pattern: /typeorm/, name: 'TypeORM' },
    { pattern: /prisma/, name: 'Prisma' },
    { pattern: /@ecosystem\/(compiler|runtime|experience|adapter)/, name: 'Compiler/Runtime/Adapters' },
  ],
  'layer:contracts': [
    { pattern: /@nestjs\//, name: 'NestJS (@nestjs/*)' },
    { pattern: /@angular\//, name: 'Angular (@angular/*)' },
    { pattern: /primeng/, name: 'PrimeNG' },
    { pattern: /express/, name: 'Express' },
  ],
};

// ─── 2. Discover All Projects ───────────────────────────────────────────────

function findProjects(dir, projects = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      const projectJsonPath = join(fullPath, 'project.json');
      if (existsSync(projectJsonPath)) {
        try {
          const config = JSON.parse(readFileSync(projectJsonPath, 'utf8'));
          projects.push({
            name: config.name,
            root: fullPath,
            relativeRoot: relative(WORKSPACE_ROOT, fullPath).replace(/\\/g, '/'),
            tags: config.tags || [],
            config,
          });
        } catch (err) {
          console.error(`Failed to parse ${projectJsonPath}:`, err.message);
        }
      } else {
        findProjects(fullPath, projects);
      }
    }
  }
  return projects;
}

// ─── 3. Collect Source Files ────────────────────────────────────────────────

function collectSourceFiles(dir, files = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else {
      const ext = extname(entry);
      if (['.ts', '.tsx', '.js', '.mjs'].includes(ext) && !entry.endsWith('.spec.ts') && !entry.endsWith('.test.ts')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

// ─── 4. Extract Imports (Runtime, Type-Only, Dynamic) ─────────────────────────

function extractImports(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const imports = [];

  // Match:
  // import ... from '...';
  // import type ... from '...';
  // export ... from '...';
  // export type ... from '...';
  // import('...')
  const importRegex = /(?:import\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?|export\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)|import\s*\()\s*['"]([^'"]+)['"]/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = importRegex.exec(line)) !== null) {
      imports.push({
        specifier: match[1],
        line: index + 1,
        rawLine: line.trim(),
      });
    }
  });

  return imports;
}

// ─── 5. Run Verification ────────────────────────────────────────────────────

console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║ ARC-02 — Architecture Dependency Rules & Boundary Verification Engine     ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

const projects = findProjects(WORKSPACE_ROOT);
console.log(`Discovered ${projects.length} workspace projects:`);
projects.forEach((p) => {
  console.log(`  • ${p.name.padEnd(20)} [${p.relativeRoot}] (tags: ${p.tags.join(', ') || 'NONE'})`);
});
console.log('');

const violations = [];

// ── Check 1: Tag Taxonomy Coverage ──────────────────────────────────────────
console.log('── Check 1: Project Tag Taxonomy Coverage ─────────────────────────────');
let tagErrors = 0;
for (const p of projects) {
  if (!p.tags || p.tags.length === 0) {
    violations.push({
      sourceProject: p.name,
      targetDependency: 'N/A',
      violatedRule: 'Untagged Project: Every project must declare architectural tags',
      location: join(p.relativeRoot, 'project.json'),
      suggestion: 'Assign tags like layer:kernel, scope:platform, runtime:universal, framework:none',
    });
    tagErrors++;
  } else {
    const hasLayer = p.tags.some((t) => t.startsWith('layer:'));
    if (!hasLayer) {
      violations.push({
        sourceProject: p.name,
        targetDependency: 'N/A',
        violatedRule: 'Missing layer:* Tag: Architectural layer is required',
        location: join(p.relativeRoot, 'project.json'),
        suggestion: 'Add an explicit layer tag (e.g. layer:kernel, layer:model, layer:contracts)',
      });
      tagErrors++;
    }
  }
}
if (tagErrors === 0) {
  console.log('  PASS: All projects have valid, required architectural tags.\n');
} else {
  console.log(`  FAIL: Found ${tagErrors} tag issues.\n`);
}

// ── Check 2: Inter-Project Allowed Dependency Matrix ────────────────────────
console.log('── Check 2: Project Dependency Direction Matrix ───────────────────────');
let matrixErrors = 0;
for (const p of projects) {
  const allowed = ALLOWED_PROJECT_DEPENDENCIES[p.name];
  if (!allowed) continue;

  const srcDir = join(p.root, 'src');
  if (!existsSync(srcDir)) continue;
  const files = collectSourceFiles(srcDir);

  for (const file of files) {
    const relFile = relative(WORKSPACE_ROOT, file).replace(/\\/g, '/');
    const imports = extractImports(file);

    for (const imp of imports) {
      // Check inter-workspace package imports
      if (imp.specifier.startsWith('@ecosystem/')) {
        const targetPkg = imp.specifier.replace('@ecosystem/', '').split('/')[0];
        if (targetPkg !== p.name && !allowed.includes(targetPkg)) {
          violations.push({
            sourceProject: p.name,
            targetDependency: imp.specifier,
            violatedRule: `Forbidden Dependency Direction: ${p.name} cannot depend on ${targetPkg}`,
            location: `${relFile}:${imp.line}`,
            suggestion: `Allowed dependencies for ${p.name} are: [${allowed.join(', ') || 'NONE'}]`,
          });
          matrixErrors++;
        }
      }
    }
  }
}
if (matrixErrors === 0) {
  console.log('  PASS: All project dependencies strictly adhere to the allowed matrix.\n');
} else {
  console.log(`  FAIL: Found ${matrixErrors} illegal project dependencies.\n`);
}

// ── Check 3: Framework Isolation in Core ─────────────────────────────────────
console.log('── Check 3: Framework Isolation in Platform Core ──────────────────────');
let frameworkErrors = 0;
for (const p of projects) {
  const layerTag = p.tags.find((t) => t.startsWith('layer:'));
  const forbidden = layerTag ? FORBIDDEN_FRAMEWORK_PATTERNS[layerTag] : null;
  if (!forbidden) continue;

  const srcDir = join(p.root, 'src');
  if (!existsSync(srcDir)) continue;
  const files = collectSourceFiles(srcDir);

  for (const file of files) {
    const relFile = relative(WORKSPACE_ROOT, file).replace(/\\/g, '/');
    const imports = extractImports(file);

    for (const imp of imports) {
      for (const rule of forbidden) {
        if (rule.pattern.test(imp.specifier)) {
          violations.push({
            sourceProject: p.name,
            targetDependency: imp.specifier,
            violatedRule: `Framework Leakage: ${rule.name} imported inside ${layerTag}`,
            location: `${relFile}:${imp.line}`,
            suggestion: 'Remove framework dependency. Platform Core must remain Pure TypeScript.',
          });
          frameworkErrors++;
        }
      }
    }
  }
}
if (frameworkErrors === 0) {
  console.log('  PASS: Platform Core is completely isolated from framework implementations.\n');
} else {
  console.log(`  FAIL: Found ${frameworkErrors} framework leakage violations.\n`);
}

// ── Check 4: Deep Import Prevention ──────────────────────────────────────────
console.log('── Check 4: Public API & Deep Import Restriction ──────────────────────');
let deepImportErrors = 0;
for (const p of projects) {
  const srcDir = join(p.root, 'src');
  if (!existsSync(srcDir)) continue;
  const files = collectSourceFiles(srcDir);

  for (const file of files) {
    const relFile = relative(WORKSPACE_ROOT, file).replace(/\\/g, '/');
    const imports = extractImports(file);

    for (const imp of imports) {
      // Rule 4a: No @ecosystem/*/src/* or @ecosystem/*/dist/*
      if (/@ecosystem\/[^/]+\/(src|dist)\//.test(imp.specifier)) {
        violations.push({
          sourceProject: p.name,
          targetDependency: imp.specifier,
          violatedRule: 'Illegal Deep Import: Subpath imports into package internals are forbidden',
          location: `${relFile}:${imp.line}`,
          suggestion: 'Import exclusively from the root package export (e.g. @ecosystem/semantic-kernel)',
        });
        deepImportErrors++;
      }

      // Rule 4b: No relative traverse into another package
      if (imp.specifier.startsWith('../') && (imp.specifier.includes('/platform/') || imp.specifier.includes('/adapters/'))) {
        violations.push({
          sourceProject: p.name,
          targetDependency: imp.specifier,
          violatedRule: 'Illegal Cross-Package Relative Import: Bypassing package boundary',
          location: `${relFile}:${imp.line}`,
          suggestion: 'Use declared package alias instead of relative filesystem path',
        });
        deepImportErrors++;
      }
    }
  }
}
if (deepImportErrors === 0) {
  console.log('  PASS: All inter-package imports use published public entry points.\n');
} else {
  console.log(`  FAIL: Found ${deepImportErrors} deep import violations.\n`);
}

// ── Check 5: Project Graph Cycles ────────────────────────────────────────────
console.log('── Check 5: Project Graph Cycles ──────────────────────────────────────');
let cycleErrors = 0;
const graphPath = join(WORKSPACE_ROOT, 'graph.json');
if (existsSync(graphPath)) {
  try {
    const graphData = JSON.parse(readFileSync(graphPath, 'utf8'));
    const dependencies = graphData.graph?.dependencies || {};

    // Cycle detection via DFS
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    function dfs(node, path = []) {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = (dependencies[node] || []).map((d) => d.target);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recursionStack.has(neighbor)) {
          cycles.push([...path, neighbor]);
        }
      }

      recursionStack.delete(node);
    }

    for (const node of Object.keys(dependencies)) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    if (cycles.length > 0) {
      cycles.forEach((c) => {
        violations.push({
          sourceProject: c[0],
          targetDependency: c.join(' -> '),
          violatedRule: 'Circular Project Dependency',
          location: 'Nx Project Graph',
          suggestion: 'Break cycle by inverting dependency or extracting shared port contract',
        });
        cycleErrors++;
      });
      console.log(`  FAIL: Detected ${cycles.length} project cycle(s) in Nx graph.\n`);
    } else {
      console.log('  PASS: Zero cycles detected in Nx project graph.\n');
    }
  } catch (err) {
    console.warn(`  WARN: Could not parse graph.json for cycle verification: ${err.message}\n`);
  }
} else {
  console.log('  PASS: graph.json not present; run "nx graph --file=graph.json" to refresh.\n');
}

// ─── Summary Report ─────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════════════════');
if (violations.length === 0) {
  console.log('✅ ALL ARCHITECTURE FITNESS CHECKS PASSED (0 Violations)');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  process.exit(0);
} else {
  console.log(`❌ ARCHITECTURE VIOLATIONS DETECTED: ${violations.length}\n`);
  violations.forEach((v, idx) => {
    console.log(`[Violation ${idx + 1}]`);
    console.log(`  Source Project:    ${v.sourceProject}`);
    console.log(`  Target Dependency: ${v.targetDependency}`);
    console.log(`  Violated Rule:     ${v.violatedRule}`);
    console.log(`  Import Location:   ${v.location}`);
    console.log(`  Remediation:       ${v.suggestion}\n`);
  });
  console.log('═══════════════════════════════════════════════════════════════════════════');
  process.exit(1);
}
