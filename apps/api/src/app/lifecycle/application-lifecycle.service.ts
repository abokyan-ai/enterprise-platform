/**
 * @file application-lifecycle.service.ts
 * @module apps/api/lifecycle
 *
 * Operational lifecycle manager for the NestJS application host.
 * Tracks host states (STARTING -> READY -> STOPPING -> STOPPED).
 * Confined strictly to application layer (layer:application).
 */

import { Injectable, OnApplicationShutdown } from '@nestjs/common';

export type HostLifecycleState = 'STARTING' | 'READY' | 'STOPPING' | 'STOPPED';

@Injectable()
export class ApplicationLifecycleService implements OnApplicationShutdown {
  private state: HostLifecycleState = 'STARTING';
  private readonly startedAt: Date = new Date();

  public getState(): HostLifecycleState {
    return this.state;
  }

  public isReady(): boolean {
    return this.state === 'READY';
  }

  public setReady(): void {
    this.state = 'READY';
  }

  public setStopping(): void {
    this.state = 'STOPPING';
  }

  public getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startedAt.getTime()) / 1000);
  }

  public onApplicationShutdown(signal?: string): void {
    this.state = 'STOPPING';
  }
}
