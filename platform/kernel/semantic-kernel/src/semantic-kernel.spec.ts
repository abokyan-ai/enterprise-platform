import { describe, it, expect } from 'vitest';
import {
  createSemanticId,
  isSemanticId,
  SemanticKernelError,
  isSemanticElement,
  parseVersion,
  formatVersion,
  compareVersions,
  createDiagnosticResult,
  emptyDiagnosticResult,
  KERNEL_VERSION,
  PLATFORM_NAME,
} from '../src/index.js';

describe('SemanticId', () => {
  it('creates a valid SemanticId from a non-empty string', () => {
    const id = createSemanticId('ecosystem.types:CustomerOrder');
    expect(id).toBe('ecosystem.types:CustomerOrder');
    expect(isSemanticId(id)).toBe(true);
  });

  it('trims whitespace when creating SemanticId', () => {
    const id = createSemanticId('  ecosystem.types:Invoice  ');
    expect(id).toBe('ecosystem.types:Invoice');
  });

  it('throws SemanticKernelError for empty string', () => {
    expect(() => createSemanticId('')).toThrow(SemanticKernelError);
    expect(() => createSemanticId('   ')).toThrow(SemanticKernelError);
  });

  it('isSemanticId returns false for non-string values', () => {
    expect(isSemanticId(null)).toBe(false);
    expect(isSemanticId(undefined)).toBe(false);
    expect(isSemanticId(42)).toBe(false);
    expect(isSemanticId({})).toBe(false);
  });
});

describe('SemanticElement', () => {
  it('isSemanticElement returns true for valid element', () => {
    const element = {
      semanticId: createSemanticId('ecosystem.types:Order'),
      kind: 'type' as const,
      metadata: { label: 'Order' },
    };
    expect(isSemanticElement(element)).toBe(true);
  });

  it('isSemanticElement returns false for null', () => {
    expect(isSemanticElement(null)).toBe(false);
  });

  it('isSemanticElement returns false for object without semanticId', () => {
    expect(isSemanticElement({ kind: 'type' })).toBe(false);
  });

  it('isSemanticElement returns false for object without kind', () => {
    expect(isSemanticElement({ semanticId: 'x' })).toBe(false);
  });
});

describe('VersionRef', () => {
  it('parses a valid SemVer string', () => {
    const v = parseVersion('1.2.3');
    expect(v.major).toBe(1);
    expect(v.minor).toBe(2);
    expect(v.patch).toBe(3);
  });

  it('parses a SemVer string with prerelease', () => {
    const v = parseVersion('2.0.0-alpha.1');
    expect(v.prerelease).toBe('alpha.1');
  });

  it('throws on invalid SemVer', () => {
    expect(() => parseVersion('not-a-version')).toThrow();
  });

  it('formats VersionRef back to string', () => {
    const v = parseVersion('1.2.3');
    expect(formatVersion(v)).toBe('1.2.3');
  });

  it('formats VersionRef with prerelease', () => {
    const v = parseVersion('1.0.0-beta.2');
    expect(formatVersion(v)).toBe('1.0.0-beta.2');
  });

  it('compareVersions returns correct ordering', () => {
    const v1 = parseVersion('1.0.0');
    const v2 = parseVersion('2.0.0');
    expect(compareVersions(v1, v2)).toBeLessThan(0);
    expect(compareVersions(v2, v1)).toBeGreaterThan(0);
    expect(compareVersions(v1, v1)).toBe(0);
  });
});

describe('Diagnostics', () => {
  it('creates a DiagnosticResult with errors', () => {
    const result = createDiagnosticResult([
      { severity: 'error', code: 'E001', message: 'Something failed' },
    ]);
    expect(result.hasErrors).toBe(true);
    expect(result.hasWarnings).toBe(false);
    expect(result.diagnostics).toHaveLength(1);
  });

  it('creates an empty DiagnosticResult', () => {
    const result = emptyDiagnosticResult();
    expect(result.hasErrors).toBe(false);
    expect(result.hasWarnings).toBe(false);
    expect(result.diagnostics).toHaveLength(0);
  });
});

describe('Kernel constants', () => {
  it('exports KERNEL_VERSION', () => {
    expect(KERNEL_VERSION).toBe('0.1.0');
  });

  it('exports PLATFORM_NAME', () => {
    expect(PLATFORM_NAME).toBe('Model-Driven Enterprise Ecosystem Platform');
  });
});
