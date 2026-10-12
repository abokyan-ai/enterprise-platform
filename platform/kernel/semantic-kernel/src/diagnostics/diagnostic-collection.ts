/**
 * @file diagnostic-collection.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * SK-11: DiagnosticCollection and deterministic collection operations.
 *
 * Provides an immutable sequence of diagnostics with deterministic ordering,
 * aggregation, severity filtering, and error status querying.
 *
 * Architectural Invariants:
 * 1. Collection Immutability: Never exposes mutable arrays; returns frozen instances.
 * 2. Deterministic Ordering: Preserves insertion order during concatenation.
 * 3. No Silent Filtering: Concatenation preserves all diagnostics without silent deduplication.
 * 4. hasErrors Semantics: Returns true if and only if at least one Diagnostic has ERROR severity.
 * 5. Full Backward Compatibility: Preserves ARC-01 DiagnosticResult and createDiagnosticResult.
 */

import { Diagnostic, serializeDiagnostic, DiagnosticJSON } from './diagnostic.js';
import { DiagnosticSeverities, DiagnosticSeverity } from './diagnostic-severity.js';

/**
 * Immutable collection contract for diagnostics.
 */
export interface DiagnosticCollection {
  /** The immutable list of contained diagnostics */
  readonly diagnostics: readonly Diagnostic[];

  /** True if any diagnostic in the collection has ERROR severity */
  readonly hasErrors: boolean;

  /** True if any diagnostic in the collection has WARNING severity */
  readonly hasWarnings: boolean;

  /** Total count of diagnostics */
  readonly count: number;

  /** Returns a new collection containing only diagnostics matching the given severity */
  filterBySeverity(severity: DiagnosticSeverity): DiagnosticCollection;

  /** Returns a new collection concatenating this collection with another */
  combine(other: DiagnosticCollection | readonly Diagnostic[]): DiagnosticCollection;

  /** Serializes the entire collection to a JSON array */
  toJSON(): readonly DiagnosticJSON[];
}

/**
 * Checks whether an array of diagnostics contains at least one ERROR.
 * Supports canonical 'ERROR' as well as legacy 'error'.
 */
export function hasErrors(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some(
    (d) =>
      d.severity === DiagnosticSeverities.ERROR ||
      (d.severity as string) === 'error',
  );
}

/**
 * Checks whether an array of diagnostics contains at least one WARNING.
 * Supports canonical 'WARNING' as well as legacy 'warning'.
 */
export function hasWarnings(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some(
    (d) =>
      d.severity === DiagnosticSeverities.WARNING ||
      (d.severity as string) === 'warning',
  );
}

/**
 * Concatenates two diagnostic sequences preserving insertion order and immutability.
 * Does not silently filter or alter items.
 */
export function combineDiagnostics(
  first: readonly Diagnostic[],
  second: readonly Diagnostic[],
): readonly Diagnostic[] {
  return Object.freeze([...first, ...second]);
}

/**
 * Implementation of the immutable DiagnosticCollection contract.
 */
class ImmutableDiagnosticCollection implements DiagnosticCollection {
  public readonly diagnostics: readonly Diagnostic[];
  public readonly hasErrors: boolean;
  public readonly hasWarnings: boolean;
  public readonly count: number;

  constructor(items: readonly Diagnostic[]) {
    this.diagnostics = Object.freeze([...items]);
    this.count = this.diagnostics.length;
    this.hasErrors = hasErrors(this.diagnostics);
    this.hasWarnings = hasWarnings(this.diagnostics);
    Object.freeze(this);
  }

  public filterBySeverity(severity: DiagnosticSeverity): DiagnosticCollection {
    const filtered = this.diagnostics.filter((d) => d.severity === severity);
    return new ImmutableDiagnosticCollection(filtered);
  }

  public combine(
    other: DiagnosticCollection | readonly Diagnostic[],
  ): DiagnosticCollection {
    const otherItems =
      'diagnostics' in other ? other.diagnostics : other;
    return new ImmutableDiagnosticCollection([
      ...this.diagnostics,
      ...otherItems,
    ]);
  }

  public toJSON(): readonly DiagnosticJSON[] {
    return Object.freeze(this.diagnostics.map((d) => serializeDiagnostic(d)));
  }
}

const EMPTY_COLLECTION: DiagnosticCollection = new ImmutableDiagnosticCollection([]);

/**
 * Creates an immutable DiagnosticCollection from a sequence of diagnostics.
 */
export function createDiagnosticCollection(
  diagnostics: readonly Diagnostic[] = [],
): DiagnosticCollection {
  if (!diagnostics || diagnostics.length === 0) {
    return EMPTY_COLLECTION;
  }
  return new ImmutableDiagnosticCollection(diagnostics);
}

/**
 * Returns an empty, immutable DiagnosticCollection singleton.
 */
export function emptyDiagnosticCollection(): DiagnosticCollection {
  return EMPTY_COLLECTION;
}

// ─── Legacy Backward Compatibility Layer (ARC-01 Contract) ───────────────────

/**
 * Legacy DiagnosticResult interface from initial ARC-01 bootstrap.
 * Preserved for zero breaking changes across existing platform code and tests.
 */
export interface DiagnosticResult {
  readonly diagnostics: ReadonlyArray<Diagnostic>;
  readonly hasErrors: boolean;
  readonly hasWarnings: boolean;
}

/**
 * Legacy factory creating a DiagnosticResult.
 * Preserved for full backward compatibility with semantic-kernel.spec.ts.
 */
export function createDiagnosticResult(
  diagnostics: Diagnostic[],
): DiagnosticResult {
  const frozen = Object.freeze([...diagnostics]);
  return Object.freeze({
    diagnostics: frozen,
    hasErrors: hasErrors(frozen),
    hasWarnings: hasWarnings(frozen),
  });
}

/**
 * Legacy factory creating an empty DiagnosticResult.
 */
export function emptyDiagnosticResult(): DiagnosticResult {
  return Object.freeze({
    diagnostics: Object.freeze([]),
    hasErrors: false,
    hasWarnings: false,
  });
}
