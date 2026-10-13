/**
 * @file type-validation-result.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: TypeValidationResult Contract, Coverage Metrics, and Factory.
 *
 * Defines the immutable diagnostic output produced by Type Validation Rules.
 *
 * Invariants:
 * 1. Diagnostic-Centric: Output is an immutable collection of SK-11 Diagnostic objects.
 * 2. Deterministic Semantics:
 *    - `hasErrors = true` if and only if at least one Diagnostic has ERROR severity.
 *    - `isValid = true` if and only if `hasErrors === false`.
 * 3. Scope Boundary:
 *    - Empty Diagnostics does NOT certify global model validity, deployment readiness,
 *      or target type resolution. It proves only that the executed local rules found no
 *      violations in the supplied declarations.
 * 4. Immutability: Deeply frozen output structures.
 */

import {
  type Diagnostic,
  type DiagnosticSeverity,
  DiagnosticSeverities,
} from '@ecosystem/semantic-kernel';

/**
 * Audit metrics detailing which validation categories were executed vs skipped.
 */
export interface TypeValidationCoverage {
  /** Indicates whether TypeDefinition-level structural checks ran */
  readonly typeChecked: boolean;

  /** Indicates whether DataFacet-level structural and ownership checks ran */
  readonly dataFacetChecked: boolean;

  /** Number of fields evaluated in the DataFacet (0 if absent) */
  readonly fieldCount: number;

  /** Indicates whether FieldConstraint checks ran */
  readonly constraintsChecked: boolean;

  /** Number of FieldConstraintSets evaluated (0 if absent) */
  readonly constraintSetCount: number;

  /** Categories of checks skipped because prerequisite inputs were absent */
  readonly skippedChecks: readonly string[];
}

/**
 * Immutable result returned by `validateTypeDefinition`.
 */
export interface TypeValidationResult {
  /** Ordered list of structured SK-11 Diagnostics emitted during validation */
  readonly diagnostics: readonly Diagnostic[];

  /** True if at least one Diagnostic has ERROR severity */
  readonly hasErrors: boolean;

  /** True if at least one Diagnostic has WARNING severity */
  readonly hasWarnings: boolean;

  /** Total count of ERROR diagnostics */
  readonly errorCount: number;

  /** Total count of WARNING diagnostics */
  readonly warningCount: number;

  /** Total count of INFO diagnostics */
  readonly infoCount: number;

  /** Total count of all diagnostics */
  readonly totalDiagnosticCount: number;

  /** Coverage report detailing evaluated and skipped rule categories */
  readonly coverage: TypeValidationCoverage;

  /**
   * Convenience property indicating whether local validation passed without errors.
   *
   * @remarks
   * Evaluates to `!hasErrors`.
   * IMPORTANT: This indicates ONLY that the executed local rules found no violations.
   * It does NOT guarantee that external type references resolve, that the model
   * can be compiled into Semantic IR, or that runtime business instances are valid.
   */
  readonly isValid: boolean;
}

/**
 * Parameters for building an immutable TypeValidationResult.
 */
export interface CreateTypeValidationResultParams {
  readonly diagnostics: readonly Diagnostic[];
  readonly coverage: TypeValidationCoverage;
}

/**
 * Creates an immutable, frozen TypeValidationResult from collected diagnostics and coverage.
 *
 * @param params Diagnostics collection and coverage report.
 * @returns Deeply frozen TypeValidationResult.
 */
export function createTypeValidationResult(
  params: CreateTypeValidationResultParams,
): TypeValidationResult {
  const diagnostics = Object.freeze([...params.diagnostics]);

  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const diag of diagnostics) {
    if (diag.severity === DiagnosticSeverities.ERROR) {
      errorCount++;
    } else if (diag.severity === DiagnosticSeverities.WARNING) {
      warningCount++;
    } else if (diag.severity === DiagnosticSeverities.INFO) {
      infoCount++;
    }
  }

  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;
  const isValid = !hasErrors;

  const coverage: TypeValidationCoverage = Object.freeze({
    typeChecked: params.coverage.typeChecked,
    dataFacetChecked: params.coverage.dataFacetChecked,
    fieldCount: params.coverage.fieldCount,
    constraintsChecked: params.coverage.constraintsChecked,
    constraintSetCount: params.coverage.constraintSetCount,
    skippedChecks: Object.freeze([...params.coverage.skippedChecks]),
  });

  return Object.freeze({
    diagnostics,
    hasErrors,
    hasWarnings,
    errorCount,
    warningCount,
    infoCount,
    totalDiagnosticCount: diagnostics.length,
    coverage,
    isValid,
  });
}
