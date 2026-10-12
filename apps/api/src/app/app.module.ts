/**
 * @file app.module.ts
 * @module apps/api
 *
 * Primary NestJS Composition Root.
 * Imports only currently implemented operational and integration modules.
 * Pure TypeScript Platform Core is NEVER decorated or registered as NestJS providers.
 */

import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { PlatformInfoModule } from './platform-info/platform-info.module.js';

@Module({
  imports: [HealthModule, PlatformInfoModule],
})
export class AppModule {}
