/**
 * @file platform-info.service.ts
 * @module apps/studio/services
 *
 * Angular HttpClient service consuming the Platform Information endpoint.
 * Uses only the frontend-safe contract from @ecosystem/platform-contracts.
 * Handles backend unavailability gracefully with controlled state.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import type {
  ApiResponse,
  PlatformInfoResponse,
} from '@ecosystem/platform-contracts';
import { getFrontendConfig } from '../config/frontend-config.js';

export interface PlatformInfoState {
  readonly loading: boolean;
  readonly data: PlatformInfoResponse | null;
  readonly error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PlatformInfoService {
  private readonly http = inject(HttpClient);
  private readonly config = getFrontendConfig();

  public fetchPlatformInfo(): Observable<PlatformInfoState> {
    const url = `${this.config.apiBaseUrl}/platform/info`;

    return this.http.get<ApiResponse<PlatformInfoResponse>>(url).pipe(
      map((res) => ({
        loading: false,
        data: res.data,
        error: null,
      })),
      catchError((err) => {
        const errorMsg =
          err.status === 0
            ? 'Backend host is currently unreachable (Connection Refused).'
            : `Backend returned error HTTP ${err.status}: ${err.statusText || 'Unknown'}`;

        return of({
          loading: false,
          data: null,
          error: errorMsg,
        });
      })
    );
  }
}
