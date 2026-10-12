/**
 * @file frontend-config.ts
 * @module apps/studio/config
 *
 * Frontend configuration contract and environment settings for Angular Studio.
 * Strictly owned by the frontend application host.
 * Never leaks backend secrets or server environment variables.
 */

export interface FrontendConfig {
  readonly apiBaseUrl: string;
  readonly appName: string;
  readonly environment: 'development' | 'production';
  readonly version: string;
}

export function getFrontendConfig(): FrontendConfig {
  return Object.freeze({
    apiBaseUrl: '/api',
    appName: 'Model-Driven Enterprise Ecosystem Studio',
    environment: 'development',
    version: '0.1.0',
  });
}
