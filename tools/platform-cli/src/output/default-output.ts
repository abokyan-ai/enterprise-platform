/**
 * @file default-output.ts
 * @module @ecosystem/platform-cli/output
 *
 * Default standard output and standard error stream implementation.
 */

import type { PlatformCliOutput } from '../contracts/cli-output.contract.js';

export class DefaultPlatformCliOutput implements PlatformCliOutput {
  public write(message: string): void {
    process.stdout.write(message.endsWith('\n') ? message : message + '\n');
  }

  public writeError(message: string): void {
    process.stderr.write(message.endsWith('\n') ? message : message + '\n');
  }
}
