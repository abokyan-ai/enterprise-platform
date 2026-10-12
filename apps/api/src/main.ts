/**
 * @file main.ts
 * @module apps/api
 *
 * NestJS backend host application bootstrap entry point.
 * Coordinates configuration validation, NestJS composition, CORS,
 * lifecycle state, graceful shutdown, and fatal error reporting.
 */

import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import { loadAndValidateBackendConfig } from './app/config/backend-config.validator.js';
import { ApplicationLifecycleService } from './app/lifecycle/application-lifecycle.service.js';

export async function bootstrap(): Promise<void> {
  const logger = new Logger('PlatformBootstrap');

  try {
    logger.log('Loading and validating backend host configuration...');
    const config = loadAndValidateBackendConfig();
    logger.log(`Configuration accepted: Environment=${config.environment}, Host=${config.host}, Port=${config.port}`);

    const app = await NestFactory.create(AppModule, {
      logger: config.environment === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug'],
    });

    // Configure global routing prefix
    app.setGlobalPrefix(config.apiPrefix);

    // Configure CORS with explicit allowed origins
    app.enableCors({
      origin: [...config.corsOrigins],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

    // Enable framework-supported graceful shutdown hooks
    app.enableShutdownHooks();

    // Start HTTP listener
    await app.listen(config.port, config.host);

    // Update lifecycle state to READY
    const lifecycle = app.get(ApplicationLifecycleService);
    lifecycle.setReady();

    logger.log(`🚀 Platform Backend Host listening at http://${config.host}:${config.port}/${config.apiPrefix}`);
    logger.log(`Health check ready at: http://${config.host}:${config.port}/${config.apiPrefix}/health`);
    logger.log(`Platform info ready at: http://${config.host}:${config.port}/${config.apiPrefix}/platform/info`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`FATAL BOOTSTRAP FAILURE: ${message}`);
    process.exit(1);
  }
}

// Auto-start bootstrap when executed directly
bootstrap().catch((err) => {
  console.error('Unhandled bootstrap exception:', err);
  process.exit(1);
});
