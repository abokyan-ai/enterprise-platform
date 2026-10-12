/**
 * @file index.ts
 * @module @ecosystem/platform-cli
 *
 * Public entry point for Platform CLI contracts and utilities.
 */

export * from './contracts/index.js';
export * from './registry/command-registry.js';
export * from './router/command-router.js';
export * from './commands/index.js';
export * from './parsing/argument-parser.js';
export * from './output/default-output.js';
export * from './configuration/cli-config-resolver.js';
export { runPlatformCli } from './cli.js';
