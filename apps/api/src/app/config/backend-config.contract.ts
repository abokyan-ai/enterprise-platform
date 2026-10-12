/**
 * @file backend-config.contract.ts
 * @module apps/api/config
 *
 * Strongly typed contract for the NestJS backend host configuration.
 * Strictly owned by the backend application host boundary.
 * Never imported into Platform Core.
 */

export type PlatformEnvironment = 'development' | 'test' | 'production';

export interface PlatformBackendConfig {
  /** Network host address to bind the HTTP listener (e.g. '127.0.0.1'). */
  readonly host: string;
  /** TCP port to listen on (1 - 65535). */
  readonly port: number;
  /** Active deployment environment profile. */
  readonly environment: PlatformEnvironment;
  /** Global HTTP API routing prefix (e.g. 'api'). */
  readonly apiPrefix: string;
  /** Explicit allowed CORS origins for browser clients. */
  readonly corsOrigins: readonly string[];
  /** Graceful shutdown timeout in milliseconds. */
  readonly shutdownTimeoutMs: number;
}

export class PlatformConfigurationError extends Error {
  public readonly code = 'CONFIG_VALIDATION_FAILED';

  constructor(
    message: string,
    public readonly invalidField?: string,
    public readonly remediation?: string
  ) {
    super(message);
    this.name = 'PlatformConfigurationError';
    Object.setPrototypeOf(this, PlatformConfigurationError.prototype);
  }
}
