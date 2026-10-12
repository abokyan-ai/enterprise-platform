/**
 * @file platform-info.module.ts
 * @module apps/api/platform-info
 *
 * NestJS module declaring the reference Platform Information controller.
 */

import { Module } from '@nestjs/common';
import { PlatformInfoController } from './platform-info.controller.js';

@Module({
  controllers: [PlatformInfoController],
})
export class PlatformInfoModule {}
