/**
 * @file cli-config.contract.ts
 * @module @ecosystem/platform-cli/contracts
 *
 * Strongly typed configuration contract for Platform CLI invocations.
 */

export interface PlatformCliConfig {
  readonly workspaceRoot: string;
  readonly format: 'text' | 'json';
  readonly verbose: boolean;
  readonly version: string;
  readonly binaryName: string;
}
