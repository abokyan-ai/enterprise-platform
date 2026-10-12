/**
 * @file cli-config-resolver.ts
 * @module @ecosystem/platform-cli/configuration
 *
 * Resolves typed CLI configuration with deterministic defaults.
 */

import { resolve } from 'node:path';
import type { PlatformCliConfig } from '../contracts/cli-config.contract.js';

export const PLATFORM_CLI_VERSION = '0.1.0';
export const PLATFORM_CLI_BINARY_NAME = 'ecosystem';

export interface ResolveCliConfigOptions {
  readonly workspaceRoot?: string;
  readonly format?: 'text' | 'json';
  readonly verbose?: boolean;
}

export function resolveCliConfig(options?: ResolveCliConfigOptions): PlatformCliConfig {
  const workspaceRoot = resolve(options?.workspaceRoot ?? process.cwd());
  const format = options?.format ?? 'text';
  const verbose = options?.verbose ?? false;

  return Object.freeze({
    workspaceRoot,
    format,
    verbose,
    version: PLATFORM_CLI_VERSION,
    binaryName: PLATFORM_CLI_BINARY_NAME,
  });
}
