/**
 * @file type-validation-rule.ts
 * @module @ecosystem/model-core/validation
 *
 * TYPE-06: TypeValidationRule Interface and Definition Contract.
 *
 * Defines the contract for an individual deterministic semantic validation rule
 * that inspects authored TypeDefinitions and supporting declarations.
 *
 * Invariants:
 * 1. Pure Functions: Rules are deterministic, side-effect-free, and stateless.
 * 2. Immutable Input: Rules must never mutate TypeDefinition, DataFacet,
 *    FieldDefinition, or FieldConstraint inputs.
 * 3. Diagnostic Output: Rules return readonly arrays of structured SK-11 Diagnostics.
 * 4. Zero External Dependencies: No filesystem, registry, compiler, or database access.
 */

import { type Diagnostic } from '@ecosystem/semantic-kernel';
import { type TypeValidationInput } from './type-validation-input.js';

/**
 * Contract representing an individual semantic validation rule.
 */
export interface TypeValidationRule {
  /** Stable unique rule identifier (e.g. 'RULE-TYPE-KIND') */
  readonly id: string;

  /** Human-readable descriptive name */
  readonly name: string;

  /** Explanatory description of the semantic invariant checked */
  readonly description: string;

  /** Machine-readable diagnostic codes that this rule may emit */
  readonly diagnosticCodes: readonly string[];

  /**
   * Evaluates the rule against the supplied validation input.
   *
   * @param input Strongly typed, immutable validation input.
   * @returns Readonly array of Diagnostics (empty if invariant holds).
   */
  validate(input: TypeValidationInput): readonly Diagnostic[];
}
