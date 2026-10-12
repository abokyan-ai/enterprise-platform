/**
 * @file platform-info.contract.ts
 * @module @ecosystem/platform-contracts
 *
 * Frontend-safe contract for the Platform Information endpoint.
 * Used by both Angular Studio (consumer) and NestJS API (producer).
 *
 * FORBIDDEN: @nestjs/*, @angular/*, primeng
 * This file must remain importable in any TypeScript environment.
 */

/**
 * The response shape returned by the GET /api/platform/info endpoint.
 * Both the NestJS controller and Angular HttpClient service agree on this type.
 */
export interface PlatformInfoResponse {
  readonly platform: string;
  readonly version: string;
  readonly architecture: string;
  readonly semanticCore: string;
  readonly milestone: string;
  readonly status: 'operational' | 'degraded' | 'maintenance';
}

/**
 * Generic API envelope for consistent response wrapping.
 */
export interface ApiResponse<T> {
  readonly data: T;
  readonly timestamp: string;
  readonly requestId?: string;
}
