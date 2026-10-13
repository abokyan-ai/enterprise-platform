/**
 * @file model-load-result.ts
 * @module @ecosystem/model-core/authoring
 *
 * Typed success/failure boundary for model loading.
 */

import type { Diagnostic } from '@ecosystem/semantic-kernel';
import type { SourceLocationMap } from '../source-location/source-location-map.js';
import type { AuthoringDocument } from '../authoring-document.js';

export type ModelLoadResult =
  | {
      readonly status: 'SUCCESS';
      readonly locations?: SourceLocationMap;
      readonly document: AuthoringDocument;
      readonly diagnostics: readonly Diagnostic[];
    }
  | {
      readonly status: 'FAILURE';
      readonly locations?: SourceLocationMap;
      readonly diagnostics: readonly Diagnostic[];
    };

export function createModelLoadSuccess(
  document: AuthoringDocument,
  diagnostics: readonly Diagnostic[] = [],
  locations?: SourceLocationMap,
): ModelLoadResult {
  return Object.freeze({
    status: 'SUCCESS',
    document,
    diagnostics: Object.freeze([...diagnostics]),
    ...(locations !== undefined ? { locations } : {}),
  });
}

export function createModelLoadFailure(
  diagnostics: readonly Diagnostic[],
  locations?: SourceLocationMap,
): ModelLoadResult {
  return Object.freeze({
    status: 'FAILURE',
    diagnostics: Object.freeze([...diagnostics]),
    ...(locations !== undefined ? { locations } : {}),
  });
}
