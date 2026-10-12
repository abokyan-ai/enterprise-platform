/**
 * @file platform-info.controller.ts
 * @module apps/api/platform-info
 *
 * Implements the reference vertical slice Platform Information REST endpoint.
 * Conforms strictly to the shared contract defined in @ecosystem/platform-contracts.
 */

import { Controller, Get } from '@nestjs/common';
import type {
  ApiResponse,
  PlatformInfoResponse,
} from '@ecosystem/platform-contracts';

@Controller('platform')
export class PlatformInfoController {
  @Get('info')
  public getPlatformInfo(): ApiResponse<PlatformInfoResponse> {
    const info: PlatformInfoResponse = {
      platform: 'Model-Driven Enterprise Ecosystem Platform',
      version: '0.1.0',
      architecture: 'Modular Monolith',
      semanticCore: 'Pure TypeScript',
      milestone: 'VS-00: Architecture Skeleton & Contract Harness',
      status: 'operational',
    };

    return {
      data: info,
      timestamp: new Date().toISOString(),
      requestId: 'req-init',
    };
  }
}
