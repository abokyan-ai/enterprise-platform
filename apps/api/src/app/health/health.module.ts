/**
 * @file health.module.ts
 * @module apps/api/health
 *
 * NestJS module encapsulating operational health and readiness capabilities.
 */

import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { ApplicationLifecycleService } from '../lifecycle/application-lifecycle.service.js';

@Module({
  controllers: [HealthController],
  providers: [ApplicationLifecycleService],
  exports: [ApplicationLifecycleService],
})
export class HealthModule {}
