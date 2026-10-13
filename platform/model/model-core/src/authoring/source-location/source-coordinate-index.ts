import {
  validateDiagnosticLocation,
  type DiagnosticLocation,
  type SourcePosition,
} from '@ecosystem/semantic-kernel';
import { ModelParseError } from '../loader/model-parse-error.js';

/** One scan of the bounded original source, then constant-time coordinate conversion. */
export class SourceCoordinateIndex {
  private readonly starts: number[] = [0];
  private readonly lines: Uint32Array;
  public constructor(
    private readonly content: string,
    private readonly sourceId?: string,
  ) {
    if (sourceId !== undefined && typeof sourceId !== 'string')
      throw new TypeError('Source identity must be a string when supplied.');
    this.lines = new Uint32Array(content.length + 1);
    let line = 0;
    for (let i = 0; i < content.length; i++) {
      this.lines[i] = line;
      if (content[i] === '\r') {
        if (content[i + 1] === '\n') this.lines[++i] = line;
        this.starts.push(i + 1);
        line++;
      } else if (content[i] === '\n') {
        this.starts.push(i + 1);
        line++;
      }
    }
    this.lines[content.length] = line;
  }

  private position(offset: number): SourcePosition {
    const line = this.lines[offset];
    return Object.freeze({
      line: line + 1,
      column: offset - this.starts[line] + 1,
    });
  }

  /** Invalid parser endpoints stay absent; a valid start can remain a point. */
  public evidenceLocation(
    start: number,
    end?: number,
  ): DiagnosticLocation | undefined {
    if (
      !Number.isSafeInteger(start) ||
      start < 0 ||
      start > this.content.length
    )
      return undefined;
    const validEnd =
      end !== undefined &&
      Number.isSafeInteger(end) &&
      end >= start &&
      end <= this.content.length
        ? end
        : undefined;
    return this.location(start, validEnd);
  }

  public location(start: number, end?: number): DiagnosticLocation {
    if (
      !Number.isSafeInteger(start) ||
      start < 0 ||
      start > this.content.length ||
      (end !== undefined &&
        (!Number.isSafeInteger(end) ||
          end < start ||
          end > this.content.length))
    ) {
      throw new ModelParseError(
        'MODEL_LOADER_LOCATION_ERROR',
        'Parser source range is outside its document.',
      );
    }
    // SK-11 end coordinates are inclusive. An authentic empty span is a point.
    const location = Object.freeze({
      ...(this.sourceId !== undefined ? { sourceUri: this.sourceId } : {}),
      start: this.position(start),
      ...(end !== undefined && end > start
        ? { end: this.position(end - 1) }
        : {}),
    });
    const error = validateDiagnosticLocation(location);
    if (error) throw error;
    return location;
  }
}
