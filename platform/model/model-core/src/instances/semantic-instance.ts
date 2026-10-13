import {
  ElementVersionRef,
  SemanticElementId,
  SemanticKernelError,
  type PrimitiveValue,
  parsePrimitiveValue,
  serializePrimitiveValue,
  type PrimitiveValueJSON,
} from '@ecosystem/semantic-kernel';
import { InstanceId } from './instance-id.js';

export type InstanceValue =
  | Readonly<{ readonly state: 'null' }>
  | Readonly<{ readonly state: 'value'; readonly value: PrimitiveValue }>;
export interface InstanceFieldValue {
  readonly fieldId: SemanticElementId;
  readonly value: InstanceValue;
}
export interface SemanticInstance {
  readonly id: InstanceId;
  readonly typeRef: ElementVersionRef;
  readonly fields: readonly InstanceFieldValue[];
}
export interface CreateSemanticInstanceParams {
  readonly id: InstanceId;
  readonly typeRef: ElementVersionRef;
  readonly fields: readonly InstanceFieldValue[];
}
export interface SemanticInstanceJSON {
  readonly id: string;
  readonly typeRef: { readonly elementId: string; readonly version: string };
  readonly fields: readonly {
    readonly fieldId: string;
    readonly value:
      | { readonly state: 'null' }
      | { readonly state: 'value'; readonly value: PrimitiveValueJSON };
  }[];
}
export const SEMANTIC_INSTANCE_ERROR_CODES = Object.freeze({
  INVALID_PARAMS: 'SEMANTIC_INSTANCE_INVALID_PARAMS',
  INVALID_ID: 'SEMANTIC_INSTANCE_INVALID_ID',
  INVALID_TYPE_REF: 'SEMANTIC_INSTANCE_INVALID_TYPE_REF',
  INVALID_FIELDS: 'SEMANTIC_INSTANCE_INVALID_FIELDS',
  INVALID_FIELD: 'SEMANTIC_INSTANCE_INVALID_FIELD',
  DUPLICATE_FIELD: 'SEMANTIC_INSTANCE_DUPLICATE_FIELD',
  INVALID_VALUE: 'SEMANTIC_INSTANCE_INVALID_VALUE',
  INVALID_JSON: 'SEMANTIC_INSTANCE_INVALID_JSON',
} as const);
export type SemanticInstanceErrorCode =
  (typeof SEMANTIC_INSTANCE_ERROR_CODES)[keyof typeof SEMANTIC_INSTANCE_ERROR_CODES];
export class SemanticInstanceValidationError extends SemanticKernelError {
  public override readonly code: SemanticInstanceErrorCode;
  public constructor(code: SemanticInstanceErrorCode, message: string) {
    super(message, code);
    this.code = code;
    this.name = 'SemanticInstanceValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export function createNullInstanceValue(): InstanceValue {
  return Object.freeze({ state: 'null' as const });
}
export function createPresentInstanceValue(
  value: PrimitiveValue,
): InstanceValue {
  if (!isPrimitiveValue(value))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_VALUE,
      'Present instance values require a trusted PrimitiveValue.',
    );
  return Object.freeze({ state: 'value' as const, value });
}
export function createInstanceFieldValue(
  fieldId: SemanticElementId,
  value: InstanceValue,
): InstanceFieldValue {
  if (!(fieldId instanceof SemanticElementId))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_FIELD,
      'Instance field values require a SemanticElementId.',
    );
  if (!isInstanceValue(value))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_VALUE,
      'Instance field values require a null or present InstanceValue.',
    );
  return Object.freeze({ fieldId, value });
}
export function createSemanticInstance(
  params: CreateSemanticInstanceParams,
): SemanticInstance {
  if (params === null || typeof params !== 'object')
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_PARAMS,
      'SemanticInstance requires a parameters object.',
    );
  if (!(params.id instanceof InstanceId))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_ID,
      'SemanticInstance requires an InstanceId.',
    );
  if (!(params.typeRef instanceof ElementVersionRef))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_TYPE_REF,
      'SemanticInstance requires an exact ElementVersionRef.',
    );
  if (!Array.isArray(params.fields))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_FIELDS,
      'SemanticInstance requires an explicit fields array.',
    );
  const seen = new Set<string>();
  const fields = params.fields.map((field, index) => {
    if (!isInstanceFieldValue(field))
      throw new SemanticInstanceValidationError(
        SEMANTIC_INSTANCE_ERROR_CODES.INVALID_FIELD,
        `Invalid instance field value at index ${index}.`,
      );
    const key = field.fieldId.toString();
    if (seen.has(key))
      throw new SemanticInstanceValidationError(
        SEMANTIC_INSTANCE_ERROR_CODES.DUPLICATE_FIELD,
        `Duplicate instance field identity '${key}'.`,
      );
    seen.add(key);
    return field;
  });
  return Object.freeze({
    id: params.id,
    typeRef: params.typeRef,
    fields: Object.freeze(fields),
  });
}
export function findInstanceField(
  instance: SemanticInstance,
  fieldId: SemanticElementId,
): InstanceFieldValue | undefined {
  if (!isSemanticInstance(instance) || !(fieldId instanceof SemanticElementId))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_FIELD,
      'Field lookup requires trusted SemanticInstance and SemanticElementId values.',
    );
  return instance.fields.find((field) => field.fieldId.equals(fieldId));
}
export function isInstanceValue(value: unknown): value is InstanceValue {
  if (value === null || typeof value !== 'object') return false;
  const candidate = value as { state?: unknown; value?: unknown };
  return candidate.state === 'null'
    ? Object.keys(candidate).length === 1
    : candidate.state === 'value' &&
        isPrimitiveValue(candidate.value) &&
        Object.keys(candidate).length === 2;
}
export function isInstanceFieldValue(
  value: unknown,
): value is InstanceFieldValue {
  if (value === null || typeof value !== 'object') return false;
  const candidate = value as { fieldId?: unknown; value?: unknown };
  return (
    candidate.fieldId instanceof SemanticElementId &&
    isInstanceValue(candidate.value)
  );
}
export function isSemanticInstance(value: unknown): value is SemanticInstance {
  if (value === null || typeof value !== 'object') return false;
  const candidate = value as {
    id?: unknown;
    typeRef?: unknown;
    fields?: unknown;
  };
  return (
    candidate.id instanceof InstanceId &&
    candidate.typeRef instanceof ElementVersionRef &&
    Array.isArray(candidate.fields) &&
    candidate.fields.every(isInstanceFieldValue)
  );
}
export function serializeSemanticInstance(
  instance: SemanticInstance,
): SemanticInstanceJSON {
  if (!isSemanticInstance(instance))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_PARAMS,
      'Serialization requires a trusted SemanticInstance.',
    );
  return Object.freeze({
    id: instance.id.toString(),
    typeRef: instance.typeRef.toJSON(),
    fields: Object.freeze(
      instance.fields.map((field) =>
        Object.freeze({
          fieldId: field.fieldId.toString(),
          value:
            field.value.state === 'null'
              ? Object.freeze({ state: 'null' as const })
              : Object.freeze({
                  state: 'value' as const,
                  value: serializePrimitiveValue(field.value.value),
                }),
        }),
      ),
    ),
  });
}
export function parseSemanticInstance(raw: unknown): SemanticInstance {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_JSON,
      'SemanticInstance JSON must be a plain object.',
    );
  const value = raw as { id?: unknown; typeRef?: unknown; fields?: unknown };
  if (!Array.isArray(value.fields))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_JSON,
      'SemanticInstance JSON requires a fields array.',
    );
  return createSemanticInstance({
    id: InstanceId.parse(value.id),
    typeRef: ElementVersionRef.fromJSON(value.typeRef),
    fields: value.fields.map(parseInstanceFieldValue),
  });
}
function parseInstanceFieldValue(raw: unknown): InstanceFieldValue {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw))
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_JSON,
      'Instance field JSON must be an object.',
    );
  const value = raw as { fieldId?: unknown; value?: unknown };
  const state = value.value as { state?: unknown; value?: unknown } | null;
  if (state === null || typeof state !== 'object')
    throw new SemanticInstanceValidationError(
      SEMANTIC_INSTANCE_ERROR_CODES.INVALID_JSON,
      'Instance field JSON requires a value state.',
    );
  return createInstanceFieldValue(
    SemanticElementId.parse(value.fieldId),
    state.state === 'null'
      ? createNullInstanceValue()
      : state.state === 'value'
        ? createPresentInstanceValue(parsePrimitiveValue(state.value))
        : (() => {
            throw new SemanticInstanceValidationError(
              SEMANTIC_INSTANCE_ERROR_CODES.INVALID_VALUE,
              'Unknown instance value state.',
            );
          })(),
  );
}
function isPrimitiveValue(value: unknown): value is PrimitiveValue {
  try {
    parsePrimitiveValue(value);
    return true;
  } catch {
    return false;
  }
}
