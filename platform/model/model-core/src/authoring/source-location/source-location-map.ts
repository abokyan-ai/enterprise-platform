import { SourcePath, isSourcePointer } from './source-path.js';
import type { SourceLocationEntry } from './source-location-entry.js';
import { SourceCoordinateIndex } from './source-coordinate-index.js';
import { MODEL_SOURCE_MAX_NODES } from '../loader/parser-limits.js';

export interface SourceLocationMap {
  readonly sourceId?: string;
  readonly entries: readonly SourceLocationEntry[];
  /** Duplicate-key paths and their descendants have no single trustworthy origin. */
  readonly ambiguousPaths: readonly SourcePath[];
  get(path: SourcePath | string): SourceLocationEntry | undefined;
}

/** Internal construction boundary. No AST or source text is retained on publish. */
export class SourceLocationCollector {
  private readonly index = new Map<string, SourceLocationEntry>();
  private readonly ambiguous = new Map<string, SourcePath>();
  private readonly coordinates: SourceCoordinateIndex;
  private count = 0;
  private pointerUnits = 0;

  public constructor(
    content: string,
    private readonly sourceId?: string,
  ) {
    this.coordinates = new SourceCoordinateIndex(content, sourceId);
  }

  public add(path: SourcePath, start: number, end: number): void {
    if (++this.count > MODEL_SOURCE_MAX_NODES)
      throw new RangeError('Source location entry limit exceeded.');
    const key = path.toString();
    this.pointerUnits += key.length;
    if (this.pointerUnits > 8_000_000)
      throw new RangeError('Source location pointer budget exceeded.');
    if (this.index.has(key)) {
      this.markAmbiguous(path);
      return;
    }
    this.index.set(
      key,
      Object.freeze({
        path,
        startOffset: start,
        endOffset: end,
        location: this.coordinates.location(start, end),
      }),
    );
  }

  public location(start: number, end: number) {
    return this.coordinates.location(start, end);
  }

  public markAmbiguous(path: SourcePath): void {
    this.ambiguous.set(path.toString(), path);
  }

  public publish(): SourceLocationMap {
    const excluded = new Set(this.ambiguous.keys());
    const available = (pointer: string): boolean => {
      let p = pointer;
      while (true) {
        if (excluded.has(p)) return false;
        if (p === '') return true;
        p = p.slice(0, p.lastIndexOf('/'));
      }
    };
    const index = new Map(
      [...this.index].filter(([pointer]) => available(pointer)),
    );
    const entries = Object.freeze([...index.values()]);
    return publishMap(
      this.sourceId,
      index,
      entries,
      Object.freeze([...this.ambiguous.values()]),
    );
  }
}

/** This closure owns metadata only, never the collector or coordinate buffers. */
function publishMap(
  sourceId: string | undefined,
  index: ReadonlyMap<string, SourceLocationEntry>,
  entries: readonly SourceLocationEntry[],
  ambiguousPaths: readonly SourcePath[],
): SourceLocationMap {
  return Object.freeze({
    ...(sourceId !== undefined ? { sourceId } : {}),
    entries,
    ambiguousPaths,
    get(path: SourcePath | string): SourceLocationEntry | undefined {
      const pointer = path instanceof SourcePath ? path.toString() : path;
      if (!isSourcePointer(pointer))
        throw new TypeError('Invalid source JSON Pointer.');
      const entry = index.get(pointer);
      return path instanceof SourcePath && entry && !path.equals(entry.path)
        ? undefined
        : entry;
    },
  });
}
