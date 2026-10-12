/**
 * @file health.controller.ts
 * @module apps/api/health
 *
 * Exposes minimal liveness (/health) and readiness (/ready) endpoints.
 * Distinguishes host liveness from operational readiness.
 * Never exposes secrets or internal infrastructure details.
 */

import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationLifecycleService } from '../lifecycle/application-lifecycle.service.js';

@Controller()
export class HealthController {
  constructor(private readonly lifecycle: ApplicationLifecycleService) {}

  /**
   * Liveness Probe: Confirms the HTTP server process is running and responsive.
   */
  @Get('health')
  public getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness Probe: Confirms the backend host is ready to serve incoming requests.
   * Returns 503 Service Unavailable if the application is still initializing or stopping.
   */
  @Get('ready')
  public getReady(): {
    status: string;
    uptimeSeconds: number;
    checks: { host: string; configuration: string; contracts: string };
  } {
    if (!this.lifecycle.isReady()) {
      throw new HttpException(
        {
          status: 'unready',
          state: this.lifecycle.getState(),
          message: 'Host application has not completed initialization.',
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    return {
      status: 'ready',
      uptimeSeconds: this.lifecycle.getUptimeSeconds(),
      checks: {
        host: 'ok',
        configuration: 'ok',
        contracts: 'ok',
      },
    };
  }
}
