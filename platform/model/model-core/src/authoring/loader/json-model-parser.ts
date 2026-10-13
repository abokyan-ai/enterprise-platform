/** Native JSON owns data acceptance; the strict parser tree supplies provenance. */
import {
  createScanner,
  SyntaxKind,
  parseTree,
  type Node,
  type ParseError,
} from 'jsonc-parser';
import {
  createDiagnostic,
  DiagnosticSeverities,
  type Diagnostic,
} from '@ecosystem/semantic-kernel';
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

export class JsonModelParser implements ModelDocumentParser {
  public parse(content: string): unknown {
    return this.parseWithLocations(content).value;
  }

  public parseWithLocations(
    content: string,
    sourceId?: string,
  ): ModelDocumentParseResult {
    assertSourceContent(content);
    const scanner = createScanner(content, false);
    let depth = 0,
      tokens = 0;
    for (
      let token = scanner.scan();
      token !== SyntaxKind.EOF;
      token = scanner.scan()
    ) {
      if (++tokens > MODEL_SOURCE_MAX_NODES * 4)
        throw new RangeError('JSON token limit exceeded.');
      if (
        token === SyntaxKind.OpenBraceToken ||
        token === SyntaxKind.OpenBracketToken
      ) {
        if (++depth > MODEL_SOURCE_MAX_DEPTH)
          throw new RangeError('JSON nesting limit exceeded.');
      } else if (
        token === SyntaxKind.CloseBraceToken ||
        token === SyntaxKind.CloseBracketToken
      )
        depth = Math.max(0, depth - 1);
    }
    const errors: ParseError[] = [];
    const root = parseTree(content, errors, {
      disallowComments: true,
      allowTrailingComma: false,
      allowEmptyContent: false,
    });
    let value: unknown;
    try {
      value = JSON.parse(content);
    } catch {
      const error = errors[0];
      const location = error
        ? new SourceCoordinateIndex(content, sourceId).evidenceLocation(
            error.offset,
            error.offset + error.length,
          )
        : undefined;
      throw new ModelParseError(
        'MODEL_LOADER_JSON_SYNTAX_ERROR',
        'Invalid JSON model syntax.',
        location,
      );
    }
    // No fault-tolerant or partial tree may be published for accepted native data.
    if (!root || errors.length > 0)
      throw new ModelParseError(
        'MODEL_LOADER_LOCATION_ERROR',
        'JSON source provenance could not be verified.',
      );
    const collector = new SourceLocationCollector(content, sourceId);
    const diagnostics: Diagnostic[] = [];
    const pending: { node: Node; path: SourcePath }[] = [
      { node: root, path: SourcePath.fromSegments([]) },
    ];
    let nodes = 0;
    while (pending.length > 0) {
      const { node, path } = pending.pop()!;
      if (++nodes > MODEL_SOURCE_MAX_NODES)
        throw new RangeError('JSON node limit exceeded.');
      collector.add(path, node.offset, node.offset + node.length);
      if (node.type === 'object') {
        const seen = new Set<string>();
        const children: { node: Node; path: SourcePath }[] = [];
        for (const property of node.children ?? []) {
          const key = property.children?.[0];
          const child = property.children?.[1];
          if (!key || typeof key.value !== 'string' || !child)
            throw new ModelParseError(
              'MODEL_LOADER_LOCATION_ERROR',
              'JSON property provenance is incomplete.',
            );
          const childPath = path.child(key.value);
          if (seen.has(key.value)) {
            collector.markAmbiguous(childPath);
            if (diagnostics.length < 128)
              diagnostics.push(
                createDiagnostic({
                  code: 'MODEL_SOURCE_DUPLICATE_KEY',
                  severity: DiagnosticSeverities.WARNING,
                  message:
                    'Duplicate JSON property: last value is retained; its path and descendants have ambiguous provenance.',
                  location: collector.location(
                    key.offset,
                    key.offset + key.length,
                  ),
                }),
              );
          }
          seen.add(key.value);
          children.push({ node: child, path: childPath });
        }
        for (let i = children.length - 1; i >= 0; i--)
          pending.push(children[i]);
      } else if (node.type === 'array') {
        for (let i = (node.children?.length ?? 0) - 1; i >= 0; i--)
          pending.push({ node: node.children![i], path: path.child(i) });
      }
    }
    return Object.freeze({
      value,
      locations: collector.publish(),
      diagnostics: Object.freeze(diagnostics),
    });
  }
}
