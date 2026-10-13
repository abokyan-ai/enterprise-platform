/** One YAML document pass supplies both values and authentic node ranges. */
import {
  parseAllDocuments,
  isMap,
  isSeq,
  isScalar,
  isNode,
  type Node,
} from 'yaml';
import type {
  ModelDocumentParser,
  ModelDocumentParseResult,
} from './model-document-parser.js';
import { ModelParseError } from './model-parse-error.js';
import {
  assertSourceContent,
  MODEL_SOURCE_MAX_DEPTH,
  MODEL_SOURCE_MAX_NODES,
} from './parser-limits.js';
import { SourcePath } from '../source-location/source-path.js';
import { SourceLocationCollector } from '../source-location/source-location-map.js';
import { SourceCoordinateIndex } from '../source-location/source-coordinate-index.js';

export class YamlModelParser implements ModelDocumentParser {
  public parse(content: string): unknown {
    return this.parseWithLocations(content).value;
  }

  public parseWithLocations(
    content: string,
    sourceId?: string,
  ): ModelDocumentParseResult {
    assertSourceContent(content);
    const documents = parseAllDocuments(content, {
      uniqueKeys: true,
      merge: false,
      prettyErrors: true,
      strict: true,
      logLevel: 'silent',
    });
    if (documents.length !== 1) {
      const range = documents[1]?.contents?.range;
      throw new ModelParseError(
        'MODEL_LOADER_YAML_DOCUMENT_COUNT',
        'Model source must contain exactly one YAML document.',
        range
          ? new SourceCoordinateIndex(content, sourceId).evidenceLocation(
              range[0],
              range[1],
            )
          : undefined,
      );
    }
    const document = documents[0];
    if (document.errors.length > 0) {
      const error = document.errors[0];
      throw new ModelParseError(
        'MODEL_LOADER_YAML_SYNTAX_ERROR',
        'Invalid YAML model syntax.',
        new SourceCoordinateIndex(content, sourceId).evidenceLocation(
          error.pos[0],
          error.pos[1],
        ),
      );
    }
    const collector = new SourceLocationCollector(content, sourceId);
    const pending: { node: Node; path?: SourcePath; depth: number }[] = [];
    if (isNode(document.contents))
      pending.push({
        node: document.contents,
        path: SourcePath.fromSegments([]),
        depth: 0,
      });
    let nodes = 0;
    while (pending.length > 0) {
      const { node, path, depth } = pending.pop()!;
      if (++nodes > MODEL_SOURCE_MAX_NODES || depth > MODEL_SOURCE_MAX_DEPTH)
        throw new RangeError('YAML syntax resource limit exceeded.');
      if (path && node.range) collector.add(path, node.range[0], node.range[1]);
      // Alias use receives its own span. Expanded children receive no invented spans.
      if (isMap(node)) {
        const children: { node: Node; path?: SourcePath; depth: number }[] = [];
        for (const pair of node.items) {
          const key = pair.key;
          if (isNode(key)) children.push({ node: key, depth: depth + 1 });
          let property: string | undefined;
          if (isScalar(key)) {
            if (typeof key.value === 'string') property = key.value;
            else if (key.value === null) property = '';
            else if (
              typeof key.value === 'number' ||
              typeof key.value === 'boolean'
            )
              property = String(key.value);
          }
          if (isNode(pair.value))
            children.push({
              node: pair.value,
              ...(path &&
              property !== undefined &&
              (!node.tag || node.tag === 'tag:yaml.org,2002:map')
                ? { path: path.child(property) }
                : {}),
              depth: depth + 1,
            });
        }
        for (let i = children.length - 1; i >= 0; i--)
          pending.push(children[i]);
      } else if (isSeq(node)) {
        for (let i = node.items.length - 1; i >= 0; i--) {
          const child = node.items[i];
          if (isNode(child))
            pending.push({
              node: child,
              ...(path && (!node.tag || node.tag === 'tag:yaml.org,2002:seq')
                ? { path: path.child(i) }
                : {}),
              depth: depth + 1,
            });
        }
      }
    }
    let value: unknown;
    try {
      value = document.toJS({ maxAliasCount: 100 });
    } catch {
      throw new ModelParseError(
        'MODEL_LOADER_YAML_VALUE_ERROR',
        'YAML value conversion or alias safety limit failed.',
      );
    }
    if (value === undefined)
      throw new ModelParseError(
        'MODEL_LOADER_YAML_VALUE_ERROR',
        'YAML source did not produce a document value.',
      );
    return Object.freeze({
      value,
      locations: collector.publish(),
      diagnostics: Object.freeze([]),
    });
  }
}
