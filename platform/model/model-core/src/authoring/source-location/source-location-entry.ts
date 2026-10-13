import type { DiagnosticLocation } from '@ecosystem/semantic-kernel';
import type { SourcePath } from './source-path.js';

export interface SourceLocationEntry {
  readonly path: SourcePath;
  readonly location: DiagnosticLocation;
  /** Zero-based UTF-16 offsets in the original string; half-open [start, end). */
  readonly startOffset: number;
  readonly endOffset: number;
}
