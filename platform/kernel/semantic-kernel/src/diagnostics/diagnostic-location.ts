/**
 * @file diagnostic-location.ts
 * @module @ecosystem/semantic-kernel/diagnostics
 *
 * SK-11: DiagnosticLocation contracts and coordinate policies.
 *
 * Provides a technology-neutral, immutable location representation supporting:
 * 1. Semantic locations (SemanticElementId, QualifiedName, SemanticContextRef, modelPath).
 * 2. Source coordinates (sourceUri, start, end with 1-based lines and columns).
 * 3. Legacy file/line/column/length compatibility for existing platform harnesses.
 *
 * Architectural Invariants:
 * 1. Missing ≠ Null ≠ Value: Locations are optional; omitting a location is distinct from null.
 * 2. 1-Based Coordinates: Lines and columns count from 1 (standard compiler/IDE convention).
 * 3. Pure Data Contract: No AST node references, no filesystem or network calls.
 * 4. Immutability: Sealed objects with readonly properties and frozen arrays.
 */

import { SemanticKernelError } from '../semantic-id.js';
import { SemanticElementId } from '../identity/semantic-element-id.js';
import { QualifiedName } from '../naming/qualified-name.js';
import { SemanticContextRef } from '../identity/semantic-context-ref.js';

/**
 * 1-based source coordinate position.
 */
export interface SourcePosition {
  /** 1-based line number (>= 1) */
  readonly line: number;
  /** 1-based column number (>= 1, UTF-16 code units) */
  readonly column: number;
}

/**
 * Structured error codes for location validation failures.
 */
export const DIAGNOSTIC_LOCATION_ERROR_CODES = {
  NON_OBJECT: 'DIAGNOSTIC_LOCATION_NON_OBJECT',
  INVALID_LINE: 'DIAGNOSTIC_LOCATION_INVALID_LINE',
  INVALID_COLUMN: 'DIAGNOSTIC_LOCATION_INVALID_COLUMN',
  INVALID_SPAN: 'DIAGNOSTIC_LOCATION_INVALID_SPAN',
  INVALID_MODEL_PATH: 'DIAGNOSTIC_LOCATION_INVALID_MODEL_PATH',
  INVALID_SOURCE_URI: 'DIAGNOSTIC_LOCATION_INVALID_SOURCE_URI',
} as const;

export type DiagnosticLocationErrorCode =
  (typeof DIAGNOSTIC_LOCATION_ERROR_CODES)[keyof typeof DIAGNOSTIC_LOCATION_ERROR_CODES];

/**
 * Dedicated error class for diagnostic location validation failures.
 */
export class DiagnosticLocationValidationError extends SemanticKernelError {
  public override readonly code: DiagnosticLocationErrorCode;

  constructor(code: DiagnosticLocationErrorCode, message: string) {
    super(message, code);
    this.name = 'DiagnosticLocationValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Technology-neutral, immutable diagnostic location.
 */
export interface DiagnosticLocation {
  /** Identifier of source document (URI, relative path, or logical document ID) */
  readonly sourceUri?: string;

  /** Starting coordinate (1-based line and column) */
  readonly start?: SourcePosition;

  /** Optional ending coordinate (inclusive, 1-based line and column) */
  readonly end?: SourcePosition;

  /** Semantic element identifier (SK-01) */
  readonly elementId?: SemanticElementId;

  /** Canonical qualified name (SK-03) */
  readonly qualifiedName?: QualifiedName;

  /** Semantic context reference (SK-04) */
  readonly contextRef?: SemanticContextRef;

  /** Structured model property path (e.g. ['fields', 'customerCode']) */
  readonly modelPath?: readonly string[];

  // ─── Legacy compatibility properties (from ARC-01 initial diagnostics contract) ───
  readonly file?: string;
  readonly line?: number;
  readonly column?: number;
  readonly length?: number;
}

/**
 * Validates a candidate SourcePosition object.
 */
export function validateSourcePosition(
  pos: unknown,
): DiagnosticLocationValidationError | null {
  if (pos === null || typeof pos !== 'object' || Array.isArray(pos)) {
    return new DiagnosticLocationValidationError(
      DIAGNOSTIC_LOCATION_ERROR_CODES.NON_OBJECT,
      'SourcePosition must be an object with line and column numbers.',
    );
  }

  const record = pos as Record<string, unknown>;

  if (
    typeof record['line'] !== 'number' ||
    !Number.isInteger(record['line']) ||
    record['line'] < 1
  ) {
    return new DiagnosticLocationValidationError(
      DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_LINE,
      `SourcePosition line must be a positive integer >= 1, received ${record['line']}.`,
    );
  }

  if (
    typeof record['column'] !== 'number' ||
    !Number.isInteger(record['column']) ||
    record['column'] < 1
  ) {
    return new DiagnosticLocationValidationError(
      DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_COLUMN,
      `SourcePosition column must be a positive integer >= 1, received ${record['column']}.`,
    );
  }

  return null;
}

/**
 * Strictly validates a candidate DiagnosticLocation object.
 * Returns null if valid, or a DiagnosticLocationValidationError.
 */
export function validateDiagnosticLocation(
  loc: unknown,
): DiagnosticLocationValidationError | null {
  if (loc === null || typeof loc !== 'object' || Array.isArray(loc)) {
    return new DiagnosticLocationValidationError(
      DIAGNOSTIC_LOCATION_ERROR_CODES.NON_OBJECT,
      'DiagnosticLocation must be a non-null object.',
    );
  }

  const record = loc as Record<string, unknown>;

  if ('sourceUri' in record && record['sourceUri'] !== undefined) {
    if (typeof record['sourceUri'] !== 'string') {
      return new DiagnosticLocationValidationError(
        DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_SOURCE_URI,
        `sourceUri must be a string, received ${typeof record['sourceUri']}.`,
      );
    }
  }

  if ('start' in record && record['start'] !== undefined) {
    const startErr = validateSourcePosition(record['start']);
    if (startErr) {
      return startErr;
    }
  }

  if ('end' in record && record['end'] !== undefined) {
    const endErr = validateSourcePosition(record['end']);
    if (endErr) {
      return endErr;
    }

    if ('start' in record && record['start'] !== undefined) {
      const start = record['start'] as SourcePosition;
      const end = record['end'] as SourcePosition;

      if (
        start.line > end.line ||
        (start.line === end.line && start.column > end.column)
      ) {
        return new DiagnosticLocationValidationError(
          DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_SPAN,
          `Invalid coordinate span: start position (${start.line}:${start.column}) is after end position (${end.line}:${end.column}).`,
        );
      }
    }
  }

  if ('modelPath' in record && record['modelPath'] !== undefined) {
    if (
      !Array.isArray(record['modelPath']) ||
      record['modelPath'].some((s) => typeof s !== 'string' || s.length === 0)
    ) {
      return new DiagnosticLocationValidationError(
        DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_MODEL_PATH,
        'modelPath must be an array of non-empty strings.',
      );
    }
  }

  if ('line' in record && record['line'] !== undefined) {
    if (
      typeof record['line'] !== 'number' ||
      !Number.isInteger(record['line']) ||
      record['line'] < 1
    ) {
      return new DiagnosticLocationValidationError(
        DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_LINE,
        `Legacy line coordinate must be an integer >= 1, received ${record['line']}.`,
      );
    }
  }

  if ('column' in record && record['column'] !== undefined) {
    if (
      typeof record['column'] !== 'number' ||
      !Number.isInteger(record['column']) ||
      record['column'] < 1
    ) {
      return new DiagnosticLocationValidationError(
        DIAGNOSTIC_LOCATION_ERROR_CODES.INVALID_COLUMN,
        `Legacy column coordinate must be an integer >= 1, received ${record['column']}.`,
      );
    }
  }

  return null;
}
