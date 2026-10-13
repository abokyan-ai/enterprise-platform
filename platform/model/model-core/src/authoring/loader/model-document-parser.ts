import type { Diagnostic } from '@ecosystem/semantic-kernel';
import type { SourceLocationMap } from '../source-location/source-location-map.js';

/** Syntax values remain untrusted; MOD-01 owns structural acceptance. */
export interface ModelDocumentParseResult {
  readonly value: unknown;
  readonly locations?: SourceLocationMap;
  readonly diagnostics?: readonly Diagnostic[];
}

export interface ModelDocumentParser {
  parse(content: string): unknown;
  /** Optional extension: existing injected parse-only implementations remain valid. */
  parseWithLocations?(
    content: string,
    sourceId?: string,
  ): ModelDocumentParseResult;
}
