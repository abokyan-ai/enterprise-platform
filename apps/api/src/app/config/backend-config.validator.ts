/**
 * @file backend-config.validator.ts
 * @module apps/api/config
 *
 * Environment loading and strict validation for the backend host.
 * Fails closed on invalid or malformed configuration before network binding.
 */

import type {
  PlatformBackendConfig,
  PlatformEnvironment,
} from './backend-config.contract.js';
import { PlatformConfigurationError } from './backend-config.contract.js';

const VALID_ENVIRONMENTS: readonly PlatformEnvironment[] = [
  'development',
  'test',
  'production',
];

export function loadAndValidateBackendConfig(
  env: NodeJS.ProcessEnv = process.env
): PlatformBackendConfig {
  // 1. Validate Environment
  const rawEnv = (env['NODE_ENV'] || 'development').trim().toLowerCase();
  if (!VALID_ENVIRONMENTS.includes(rawEnv as PlatformEnvironment)) {
    throw new PlatformConfigurationError(
      `Invalid NODE_ENV '${rawEnv}'. Must be one of: [${VALID_ENVIRONMENTS.join(', ')}].`,
      'NODE_ENV',
      'Set NODE_ENV to development, test, or production.'
    );
  }
  const environment = rawEnv as PlatformEnvironment;

  // 2. Validate Port
  const rawPort = env['PORT'] !== undefined ? env['PORT'] : '3000';
  const port = Number.parseInt(String(rawPort).trim(), 10);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new PlatformConfigurationError(
      `Invalid PORT value '${rawPort}'. Must be an integer between 1 and 65535.`,
      'PORT',
      'Specify a valid numerical port (e.g. PORT=3000).'
    );
  }

  // 3. Validate Host
  const host = (env['HOST'] || (environment === 'production' ? '0.0.0.0' : '127.0.0.1')).trim();
  if (!host) {
    throw new PlatformConfigurationError(
      'HOST cannot be empty.',
      'HOST',
      'Provide a valid binding address (e.g. 127.0.0.1 or 0.0.0.0).'
    );
  }

  // 4. Validate API Prefix
  let apiPrefix = (env['API_PREFIX'] || 'api').trim();
  apiPrefix = apiPrefix.replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes
  if (!apiPrefix) {
    apiPrefix = 'api';
  }

  // 5. Validate CORS Origins
  let corsOrigins: string[];
  if (env['CORS_ORIGINS']) {
    corsOrigins = env['CORS_ORIGINS']
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    corsOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
  }

  // Production security checks
  if (environment === 'production') {
    if (corsOrigins.includes('*')) {
      throw new PlatformConfigurationError(
        'Wildcard CORS origin (*) is forbidden in production environments.',
        'CORS_ORIGINS',
        'Specify explicit client domains in CORS_ORIGINS.'
      );
    }
  }

  return Object.freeze({
    host,
    port,
    environment,
    apiPrefix,
    corsOrigins: Object.freeze(corsOrigins),
    shutdownTimeoutMs: 5000,
  });
}
