/**
 * @file cli-exit-code.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Deterministic process exit code mappings for the Platform CLI.
 */

export const PlatformCliExitCode = {
  /** Successful command execution (0) */
  SUCCESS: 0,
  /** Execution failure inside command handler (1) */
  COMMAND_FAILURE: 1,
  /** Invalid arguments, unknown options, or command usage error (2) */
  INVALID_USAGE: 2,
  /** Missing prerequisite or requested capability not yet implemented (3) */
  UNSUPPORTED_OR_MISSING_PREREQUISITE: 3,
  /** Configuration error or invalid workspace context (4) */
  CONFIGURATION_FAILURE: 4,
} as const;

export type PlatformCliExitCode =
  (typeof PlatformCliExitCode)[keyof typeof PlatformCliExitCode];
