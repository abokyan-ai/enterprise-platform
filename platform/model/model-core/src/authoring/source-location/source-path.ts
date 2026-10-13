/** Structural document address; strings are properties, numbers are array indices. */
import { MODEL_SOURCE_MAX_DEPTH } from '../loader/parser-limits.js';

export type SourcePathSegment = string | number;

export class SourcePath {
  public readonly segments: readonly SourcePathSegment[];
  private readonly pointer: string;

  private constructor(segments: readonly SourcePathSegment[]) {
    this.segments = Object.freeze([...segments]);
    this.pointer = segments
      .map((s) => '/' + String(s).replace(/~/g, '~0').replace(/\//g, '~1'))
      .join('');
    if (this.pointer.length > 4096)
      throw new RangeError('SourcePath exceeds its 4096-character bound.');
    Object.freeze(this);
  }

  public static fromSegments(
    segments: readonly SourcePathSegment[],
  ): SourcePath {
    if (!Array.isArray(segments))
      throw new TypeError('Invalid SourcePath segments.');
    if (segments.length > MODEL_SOURCE_MAX_DEPTH)
      throw new RangeError('SourcePath depth limit exceeded.');
    const copy = [...segments];
    if (
      copy.some(
        (s) =>
          typeof s !== 'string' &&
          (typeof s !== 'number' ||
            !Number.isSafeInteger(s) ||
            s < 0 ||
            Object.is(s, -0)),
      )
    ) {
      throw new TypeError(
        'SourcePath requires at most 128 property or nonnegative safe-index segments.',
      );
    }
    return new SourcePath(copy);
  }

  public child(segment: SourcePathSegment): SourcePath {
    return SourcePath.fromSegments([...this.segments, segment]);
  }

  public parent(): SourcePath | undefined {
    return this.segments.length === 0
      ? undefined
      : SourcePath.fromSegments(this.segments.slice(0, -1));
  }

  public equals(other: unknown): boolean {
    return (
      other instanceof SourcePath &&
      this.segments.length === other.segments.length &&
      this.segments.every((s, i) => s === other.segments[i])
    );
  }

  /** RFC 6901 spelling; root is the empty string, '/' is an empty property name. */
  public toString(): string {
    return this.pointer;
  }
  public toJSON(): string {
    return this.pointer;
  }
}

export function isSourcePointer(pointer: unknown): pointer is string {
  return (
    typeof pointer === 'string' &&
    pointer.length <= 4096 &&
    (pointer === '' || pointer.startsWith('/')) &&
    !/~(?:[^01]|$)/.test(pointer)
  );
}
