/** Pure orchestration: explicit source -> syntax -> existing MOD-01 validation. */
import {
  createDiagnostic,
  DiagnosticSeverities,
  type Diagnostic,
  type DiagnosticLocation,
} from '@ecosystem/semantic-kernel';
import { AUTHORING_DIAGNOSTIC_CODES } from '../authoring-diagnostic-codes.js';
import {
  AuthoringDocumentValidationError,
  parseAuthoringDocument,
  validateAuthoringDocumentStructure,
} from '../authoring-document.js';
import type { SourceLocationMap } from '../source-location/source-location-map.js';
import { SourcePath } from '../source-location/source-path.js';
import type {
  ModelDocumentParser,
  ModelDocumentParseResult,
} from './model-document-parser.js';
import { JsonModelParser } from './json-model-parser.js';
import { YamlModelParser } from './yaml-model-parser.js';
import { ensureModelSource, isModelSource } from './model-source.js';
import {
  normalizeModelSourceFormat,
  type ModelSourceFormat,
} from './model-source-format.js';
import {
  isModelLoadRequest,
  type ModelLoadRequest,
} from './model-load-request.js';
import {
  createModelLoadSuccess,
  createModelLoadFailure,
  type ModelLoadResult,
} from './model-load-result.js';
import { ModelParseError } from './model-parse-error.js';
import { assertSourceContent } from './parser-limits.js';

export const MODEL_LOADER_DIAGNOSTIC_CODES = Object.freeze({
  INVALID_REQUEST: 'MODEL_LOADER_INVALID_REQUEST',
  UNSUPPORTED_FORMAT: 'MODEL_LOADER_UNSUPPORTED_FORMAT',
  PARSE_ERROR: 'MODEL_LOADER_PARSE_ERROR',
  STRUCTURAL_ERROR: 'MODEL_LOADER_STRUCTURAL_ERROR',
  RESOURCE_LIMIT: 'MODEL_LOADER_RESOURCE_LIMIT',
  JSON_SYNTAX_ERROR: 'MODEL_LOADER_JSON_SYNTAX_ERROR',
  YAML_SYNTAX_ERROR: 'MODEL_LOADER_YAML_SYNTAX_ERROR',
  YAML_DOCUMENT_COUNT: 'MODEL_LOADER_YAML_DOCUMENT_COUNT',
  YAML_VALUE_ERROR: 'MODEL_LOADER_YAML_VALUE_ERROR',
  LOCATION_ERROR: 'MODEL_LOADER_LOCATION_ERROR',
  DUPLICATE_SOURCE_KEY: 'MODEL_SOURCE_DUPLICATE_KEY',
} as const);
export type ModelLoaderDiagnosticCode =
  (typeof MODEL_LOADER_DIAGNOSTIC_CODES)[keyof typeof MODEL_LOADER_DIAGNOSTIC_CODES];

/** Only validator-supplied fields/codes are used; never inspect exception prose. */
function diagnosticPath(
  diagnostic: Diagnostic,
  value: unknown,
): SourcePath | undefined {
  const index = diagnostic.details?.['index'];
  const property = diagnostic.details?.['property'];
  const segments: (string | number)[] = [];
  if (typeof index === 'number' && Number.isSafeInteger(index) && index >= 0)
    segments.push('declarations', index);
  if (typeof property === 'string') segments.push(property);
  else if (
    diagnostic.code === AUTHORING_DIAGNOSTIC_CODES.UNSUPPORTED_SCHEMA_VERSION
  )
    segments.push('schemaVersion');
  else if (
    diagnostic.code === AUTHORING_DIAGNOSTIC_CODES.INVALID_DECLARATION_KIND
  )
    segments.push('kind');
  else if (
    diagnostic.code === AUTHORING_DIAGNOSTIC_CODES.INVALID_DECLARATION &&
    segments.length > 0
  ) {
    const declarations =
      typeof value === 'object' && value !== null
        ? (value as Record<string, unknown>)['declarations']
        : undefined;
    const declaration: unknown = Array.isArray(declarations)
      ? declarations[index as number]
      : undefined;
    if (
      typeof declaration === 'object' &&
      declaration !== null &&
      !Array.isArray(declaration)
    )
      segments.push('definition');
  } else if (
    segments.length === 0 &&
    diagnostic.code !== AUTHORING_DIAGNOSTIC_CODES.INVALID_ROOT
  )
    return undefined;
  return SourcePath.fromSegments(segments);
}

function enrich(
  diagnostic: Diagnostic,
  locations: SourceLocationMap | undefined,
  value: unknown,
): Diagnostic {
  if (!locations) return diagnostic;
  const path = diagnosticPath(diagnostic, value);
  if (!path) return diagnostic;
  // Missing required properties point at their verified containing object only.
  const target =
    diagnostic.code === AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY
      ? path.parent()
      : path;
  const entry = target ? locations.get(target) : undefined;
  return entry
    ? createDiagnostic({ ...diagnostic, location: entry.location })
    : diagnostic;
}

export class ModelLoader {
  readonly #parsers: Readonly<Record<ModelSourceFormat, ModelDocumentParser>>;
  public constructor(
    parsers: Partial<Record<ModelSourceFormat, ModelDocumentParser>> = {},
  ) {
    this.#parsers = Object.freeze({
      json: parsers.json ?? new JsonModelParser(),
      yaml: parsers.yaml ?? new YamlModelParser(),
    });
    Object.freeze(this);
  }

  public load(request: ModelLoadRequest): ModelLoadResult {
    let sourceId: string | undefined;
    let locations: SourceLocationMap | undefined;
    let parsed: ModelDocumentParseResult | undefined;
    let phase: 'request' | 'format' | 'parse' | 'structure' = 'request';
    try {
      if (!isModelLoadRequest(request))
        throw new TypeError('Invalid ModelLoadRequest.');
      if (isModelSource(request.source)) sourceId = request.source.sourceId;
      const source = ensureModelSource(request.source);
      sourceId = source.sourceId;
      phase = 'format';
      const format = normalizeModelSourceFormat(source.format);
      phase = 'parse';
      assertSourceContent(source.content);
      const parser = this.#parsers[format];
      parsed = parser.parseWithLocations
        ? parser.parseWithLocations(source.content, sourceId)
        : { value: parser.parse(source.content) };
      locations = parsed.locations;
      if (locations && locations.sourceId !== sourceId) {
        locations = undefined;
        throw new ModelParseError(
          'MODEL_LOADER_LOCATION_ERROR',
          'Parser provenance belongs to a different source.',
        );
      }
      phase = 'structure';
      const structural = validateAuthoringDocumentStructure(parsed.value);
      const diagnostics = [
        ...(parsed.diagnostics ?? []).slice(0, 128),
        ...structural
          .slice(0, 128)
          .map((d) => enrich(d, locations, parsed!.value)),
      ];
      const firstError =
        parsed.diagnostics?.find(
          (d) => d.severity === DiagnosticSeverities.ERROR,
        ) ?? structural.find((d) => d.severity === DiagnosticSeverities.ERROR);
      if (firstError) {
        if (
          !diagnostics.some((d) => d.severity === DiagnosticSeverities.ERROR)
        ) {
          if (diagnostics.length === 256) diagnostics.pop();
          diagnostics.push(enrich(firstError, locations, parsed.value));
        }
        return createModelLoadFailure(diagnostics, locations);
      }
      const document = parseAuthoringDocument(parsed.value);
      return createModelLoadSuccess(
        document,
        diagnostics.slice(0, 256),
        locations,
      );
    } catch (error) {
      let code: string;
      let message: string;
      let location: DiagnosticLocation | undefined;
      if (error instanceof ModelParseError) {
        code = error.code;
        message = error.message;
        location = error.location;
      } else if (error instanceof RangeError) {
        code = MODEL_LOADER_DIAGNOSTIC_CODES.RESOURCE_LIMIT;
        message = 'Model source exceeds a supported resource bound.';
      } else if (error instanceof AuthoringDocumentValidationError) {
        const candidate = error.code.replace(
          'AUTHORING_DOCUMENT_',
          'AUTHORING_',
        );
        code = (
          Object.values(AUTHORING_DIAGNOSTIC_CODES) as readonly string[]
        ).includes(candidate)
          ? candidate
          : MODEL_LOADER_DIAGNOSTIC_CODES.STRUCTURAL_ERROR;
        message = 'Authoring document validation failed.';
        if (locations)
          try {
            const segments: (string | number)[] =
              error.declarationIndex === undefined
                ? []
                : ['declarations', error.declarationIndex];
            if (
              error.field !== undefined &&
              !(
                error.field === 'declarations' &&
                error.declarationIndex !== undefined
              )
            )
              segments.push(error.field);
            const path = SourcePath.fromSegments(segments);
            const target =
              code === AUTHORING_DIAGNOSTIC_CODES.MISSING_REQUIRED_PROPERTY
                ? path.parent()
                : path;
            location = target ? locations.get(target)?.location : undefined;
          } catch {
            location = undefined;
          }
      } else {
        code =
          phase === 'request'
            ? MODEL_LOADER_DIAGNOSTIC_CODES.INVALID_REQUEST
            : phase === 'format'
              ? MODEL_LOADER_DIAGNOSTIC_CODES.UNSUPPORTED_FORMAT
              : phase === 'parse'
                ? MODEL_LOADER_DIAGNOSTIC_CODES.PARSE_ERROR
                : MODEL_LOADER_DIAGNOSTIC_CODES.STRUCTURAL_ERROR;
        message =
          phase === 'structure'
            ? 'Authoring document validation failed.'
            : 'Model source could not be loaded.';
      }
      return createModelLoadFailure(
        [
          createDiagnostic({
            code,
            severity: DiagnosticSeverities.ERROR,
            message,
            ...(location ? { location } : {}),
            ...(sourceId !== undefined ? { source: sourceId } : {}),
          }),
        ],
        locations,
      );
    }
  }
}

export const modelLoader = new ModelLoader();
export function loadModel(request: ModelLoadRequest): ModelLoadResult {
  return modelLoader.load(request);
}
