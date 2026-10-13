/**
 * @file validate-type-definition.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: Authoritative Public Validation Entry Point.
 *
 * Provides the pure, deterministic validation function inspecting an authored
 * TypeDefinition and optional supporting declarations against established local
 * semantic rules.
 *
 * Architectural Invariants:
 * 1. Pure Function: Deterministic, side-effect-free, zero global state.
 * 2. Immutable Output: Returns a deeply frozen TypeValidationResult containing SK-11 Diagnostics.
 * 3. Never Mutates Inputs: Input TypeDefinition, DataFacet, and constraints are strictly unchanged.
 * 4. Local Verification Boundary: Does NOT resolve external references, validate runtime values,
 *    compile models, query databases, or claim global platform validity.
 * 5. Deterministic Ordering: Rules execute in fixed sequential order.
 */

import { type Diagnostic } from '@ecosystem/semantic-kernel';
import {
  type TypeValidationInput,
  validateTypeValidationInput,
} from './type-validation-input.js';
import {
  type TypeValidationResult,
  type TypeValidationCoverage,
  createTypeValidationResult,
} from './type-validation-result.js';
import { type TypeValidationRule } from './type-validation-rule.js';
import { STANDARD_TYPE_VALIDATION_RULES } from './rules/index.js';

/**
 * Options for configuring type validation execution.
 */
export interface ValidateTypeDefinitionOptions {
  /**
   * Custom rule suite to execute.
   * Defaults to STANDARD_TYPE_VALIDATION_RULES in deterministic order.
   */
  readonly rules?: readonly TypeValidationRule[];
}

/**
 * Validates an authored TypeDefinition and its available supporting declarations.
 *
 * Evaluates local semantic invariants (classification, DataFacet ownership,
 * field ownership, field uniqueness, value-type declarations, constraint association,
 * constraint applicability, and constraint coherence).
 *
 * @param input Validated or candidate TypeValidationInput containing TypeDefinition and optional facets/constraints.
 * @param options Optional configuration specifying custom rules.
 * @returns Deeply frozen, deterministic TypeValidationResult.
 *
 * @remarks
 * An empty `diagnostics` array (`isValid === true`) certifies ONLY that the executed
 * local rules found no violations in the supplied declarations. It does NOT guarantee
 * that referenced authored types exist in a registry, that the definition can be compiled
 * into Semantic IR, or that runtime business instances conform to constraints.
 *
 * @example
 * ```typescript
 * const result = validateTypeDefinition({
 *   typeDefinition: customerType,
 *   dataFacet: customerDataFacet,
 *   fieldConstraints: [customerNameConstraints],
 * });
 *
 * if (result.hasErrors) {
 *   console.error(`Validation failed with ${result.errorCount} error(s):`);
 *   for (const diag of result.diagnostics) {
 *     console.error(`- [${diag.code}] ${diag.message}`);
 *   }
 * }
 * ```
 */
export function validateTypeDefinition(
  input: TypeValidationInput,
  options?: ValidateTypeDefinitionOptions,
): TypeValidationResult {
  // 1. Verify input integrity at the construction boundary
  const validatedInput = validateTypeValidationInput(input);

  // 2. Determine rules to execute (deterministic order)
  const rules = options?.rules ?? STANDARD_TYPE_VALIDATION_RULES;

  // 3. Execute rules sequentially and collect diagnostics
  const allDiagnostics: Diagnostic[] = [];

  for (const rule of rules) {
    const diagnostics = rule.validate(validatedInput);
    for (const diag of diagnostics) {
      allDiagnostics.push(diag);
    }
  }

  // 4. Compute coverage audit metrics
  const skippedChecks: string[] = [];

  if (validatedInput.dataFacet === undefined) {
    skippedChecks.push('DATA_FACET_OWNER_CHECKS');
    skippedChecks.push('FIELD_OWNER_CHECKS');
    skippedChecks.push('FIELD_UNIQUENESS_CHECKS');
    skippedChecks.push('FIELD_TYPE_DECLARATION_CHECKS');
  }

  if (
    validatedInput.fieldConstraints === undefined ||
    validatedInput.fieldConstraints.length === 0
  ) {
    skippedChecks.push('CONSTRAINT_ASSOCIATION_CHECKS');
    skippedChecks.push('CONSTRAINT_APPLICABILITY_CHECKS');
    skippedChecks.push('CONSTRAINT_COHERENCE_CHECKS');
  } else if (validatedInput.dataFacet === undefined) {
    skippedChecks.push('CONSTRAINT_APPLICABILITY_CHECKS');
  }

  skippedChecks.push('EXTERNAL_TYPE_RESOLUTION');
  skippedChecks.push('GLOBAL_NAME_UNIQUENESS');
  skippedChecks.push('RUNTIME_INSTANCE_VALIDATION');
  skippedChecks.push('COMPILER_IR_LOWERING');

  const coverage: TypeValidationCoverage = {
    typeChecked: true,
    dataFacetChecked: validatedInput.dataFacet !== undefined,
    fieldCount: validatedInput.dataFacet?.fieldCount ?? 0,
    constraintsChecked:
      validatedInput.fieldConstraints !== undefined &&
      validatedInput.fieldConstraints.length > 0,
    constraintSetCount: validatedInput.fieldConstraints?.length ?? 0,
    skippedChecks,
  };

  // 5. Construct and return frozen result
  return createTypeValidationResult({
    diagnostics: allDiagnostics,
    coverage,
  });
}
