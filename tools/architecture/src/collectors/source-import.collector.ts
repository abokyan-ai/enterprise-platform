/**
 * @file source-import.collector.ts
 * @module @ecosystem/architecture-harness/collectors
 *
 * Scans project source trees and extracts static, type-only, dynamic imports,
 * and re-exports. Deterministic, repository-relative, read-only.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import type {
  ArchitectureProjectNode,
  ArchitectureSourceImport,
} from '../contracts/harness.contract.js';

export interface DiscoveredSourceImports {
  readonly sourceImports: Readonly<Record<string, readonly ArchitectureSourceImport[]>>;
  readonly sourceAstAvailable: boolean;
}

export class SourceImportCollector {
  constructor(private readonly workspaceRoot: string) {}

  public collect(projects: readonly ArchitectureProjectNode[]): DiscoveredSourceImports {
    const projectImports: Record<string, ArchitectureSourceImport[]> = {};

    try {
      for (const project of projects) {
        const srcDir = project.sourceRoot
          ? join(this.workspaceRoot, project.sourceRoot)
          : join(project.root, 'src');

        if (!existsSync(srcDir)) {
          projectImports[project.name] = [];
          continue;
        }

        const files = this.collectSourceFiles(srcDir);
        const imports: ArchitectureSourceImport[] = [];

        for (const file of files) {
          const fileImports = this.extractImportsFromFile(file);
          imports.push(...fileImports);
        }

        // Sort deterministically: relativeFilePath ASC, lineNumber ASC
        imports.sort((a, b) => {
          const fileCmp = a.relativeFilePath.localeCompare(b.relativeFilePath);
          return fileCmp !== 0 ? fileCmp : a.lineNumber - b.lineNumber;
        });

        projectImports[project.name] = imports;
      }

      const readonlyMap: Record<string, readonly ArchitectureSourceImport[]> = {};
      for (const [k, v] of Object.entries(projectImports)) {
        readonlyMap[k] = Object.freeze(v);
      }

      return {
        sourceImports: Object.freeze(readonlyMap),
        sourceAstAvailable: true,
      };
    } catch {
      return {
        sourceImports: Object.freeze({}),
        sourceAstAvailable: false,
      };
    }
  }

  private collectSourceFiles(dir: string, files: string[] = []): string[] {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (['node_modules', 'dist', '.git', 'tmp'].includes(entry)) {
        continue;
      }
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        this.collectSourceFiles(fullPath, files);
      } else {
        const ext = extname(entry);
        if (
          ['.ts', '.tsx', '.js', '.mjs'].includes(ext) &&
          !entry.endsWith('.spec.ts') &&
          !entry.endsWith('.test.ts') &&
          !entry.endsWith('.spec.tsx') &&
          !entry.endsWith('.test.tsx')
        ) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  private extractImportsFromFile(filePath: string): ArchitectureSourceImport[] {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const imports: ArchitectureSourceImport[] = [];
    const relativeFilePath = relative(this.workspaceRoot, filePath).replace(/\\/g, '/');

    // Regex matchers
    const staticImportRegex = /import\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;
    const typeOnlyImportRegex = /import\s+type\s+/;
    const staticExportRegex = /export\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)['"]([^'"]+)['"]/g;
    const typeOnlyExportRegex = /export\s+type\s+.*from\s+/;
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Static imports
      let match: RegExpExecArray | null;
      staticImportRegex.lastIndex = 0;
      while ((match = staticImportRegex.exec(line)) !== null) {
        const isTypeOnly = typeOnlyImportRegex.test(trimmed);
        imports.push({
          specifier: match[1],
          lineNumber: lineNum,
          isTypeOnly,
          isDynamic: false,
          rawStatement: trimmed,
          relativeFilePath,
        });
      }

      // Re-exports
      staticExportRegex.lastIndex = 0;
      while ((match = staticExportRegex.exec(line)) !== null) {
        const isTypeOnly = typeOnlyExportRegex.test(trimmed);
        imports.push({
          specifier: match[1],
          lineNumber: lineNum,
          isTypeOnly,
          isDynamic: false,
          rawStatement: trimmed,
          relativeFilePath,
        });
      }

      // Dynamic imports
      dynamicImportRegex.lastIndex = 0;
      while ((match = dynamicImportRegex.exec(line)) !== null) {
        imports.push({
          specifier: match[1],
          lineNumber: lineNum,
          isTypeOnly: false,
          isDynamic: true,
          rawStatement: trimmed,
          relativeFilePath,
        });
      }
    });

    return imports;
  }
}
