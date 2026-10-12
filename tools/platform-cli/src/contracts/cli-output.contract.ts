/**
 * @file cli-output.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Narrow output interface abstracting standard output and error streams.
 */

export interface PlatformCliOutput {
  write(message: string): void;
  writeError(message: string): void;
}
