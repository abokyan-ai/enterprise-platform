/**
 * TYPE-07: Explicit, immutable catalog of authored TypeDefinition snapshots.
 * No persistence, resolution, compatibility analysis, or runtime activation.
 */
import {
  ElementVersionRef,
  QualifiedName,
  SemanticContextRef,
  SemanticElementId,
  SemanticKernelError,
  SemanticVersion,
} from '@ecosystem/semantic-kernel';
import {
  type TypeDefinition,
  isTypeDefinition,
} from '../types/type-definition.js';
import {
  type TypeReference,
  isTypeIdReference,
  isTypeNameReference,
} from '../types/type-reference.js';
import {
  createTypeRegistryLookupResult,
  type TypeRegistryLookupResult,
} from './type-registry-result.js';

export const TYPE_REGISTRY_ERROR_CODES = Object.freeze({
  NON_OBJECT: 'TYPE_REGISTRY_NON_OBJECT',
  MISSING_DEFINITIONS: 'TYPE_REGISTRY_MISSING_DEFINITIONS',
  INVALID_DEFINITIONS: 'TYPE_REGISTRY_INVALID_DEFINITIONS',
  INVALID_DEFINITION: 'TYPE_REGISTRY_INVALID_DEFINITION',
  DUPLICATE_EXACT_REGISTRATION: 'TYPE_REGISTRY_DUPLICATE_EXACT_REGISTRATION',
  CONTEXTUAL_NAME_COLLISION: 'TYPE_REGISTRY_CONTEXTUAL_NAME_COLLISION',
  INVALID_EXACT_REFERENCE: 'TYPE_REGISTRY_INVALID_EXACT_REFERENCE',
  INVALID_NAME_LOOKUP: 'TYPE_REGISTRY_INVALID_NAME_LOOKUP',
  INVALID_ID_LOOKUP: 'TYPE_REGISTRY_INVALID_ID_LOOKUP',
  INVALID_TYPE_REFERENCE: 'TYPE_REGISTRY_INVALID_TYPE_REFERENCE',
} as const);
export type TypeRegistryErrorCode =
  (typeof TYPE_REGISTRY_ERROR_CODES)[keyof typeof TYPE_REGISTRY_ERROR_CODES];

export class TypeRegistryValidationError extends SemanticKernelError {
  public override readonly code: TypeRegistryErrorCode;
  public constructor(code: TypeRegistryErrorCode, message: string) {
    super(message, code);
    this.name = 'TypeRegistryValidationError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface CreateTypeRegistryParams {
  readonly definitions: readonly TypeDefinition[];
}
export interface TypeRegistryNameVersionLookup {
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
  readonly version: SemanticVersion;
}
export interface TypeRegistryNameLookup {
  readonly qualifiedName: QualifiedName;
  readonly contextRef: SemanticContextRef;
}

/** Enumeration follows original registration order, never SemVer precedence. */
export interface TypeRegistry {
  list(): readonly TypeDefinition[];
  getByExactVersion(reference: ElementVersionRef): TypeDefinition | undefined;
  getByName(lookup: TypeRegistryNameVersionLookup): TypeDefinition | undefined;
  listVersions(elementId: SemanticElementId): readonly TypeDefinition[];
  findByName(lookup: TypeRegistryNameLookup): TypeRegistryLookupResult;
  findByTypeReference(reference: TypeReference): TypeRegistryLookupResult;
}

type VersionIndex = Map<string, TypeDefinition>;
type NameIndex = Map<string, Map<string, VersionIndex>>;

class ImmutableTypeRegistry implements TypeRegistry {
  readonly #definitions: readonly TypeDefinition[];
  readonly #byIdentity: Map<string, VersionIndex>;
  readonly #byContextualName: NameIndex;
  public constructor(
    definitions: readonly TypeDefinition[],
    byIdentity: Map<string, VersionIndex>,
    byContextualName: NameIndex,
  ) {
    this.#definitions = Object.freeze([...definitions]);
    this.#byIdentity = byIdentity;
    this.#byContextualName = byContextualName;
    Object.freeze(this);
  }
  public list(): readonly TypeDefinition[] {
    return Object.freeze([...this.#definitions]);
  }
  public getByExactVersion(
    reference: ElementVersionRef,
  ): TypeDefinition | undefined {
    if (!(reference instanceof ElementVersionRef))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.INVALID_EXACT_REFERENCE,
        'Exact registry lookup requires an authentic ElementVersionRef.',
      );
    return this.#byIdentity
      .get(reference.elementId.toString())
      ?.get(reference.version.toString());
  }
  public getByName(
    lookup: TypeRegistryNameVersionLookup,
  ): TypeDefinition | undefined {
    validateNameVersionLookup(lookup);
    return this.#byContextualName
      .get(lookup.contextRef.toString())
      ?.get(lookup.qualifiedName.toString())
      ?.get(lookup.version.toString());
  }
  public listVersions(elementId: SemanticElementId): readonly TypeDefinition[] {
    if (!(elementId instanceof SemanticElementId))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.INVALID_ID_LOOKUP,
        'Version listing requires an authentic SemanticElementId.',
      );
    return freezeDefinitions(
      this.#definitions.filter((definition) => definition.id.equals(elementId)),
    );
  }
  public findByName(lookup: TypeRegistryNameLookup): TypeRegistryLookupResult {
    validateNameLookup(lookup);
    return createTypeRegistryLookupResult(
      this.#definitions.filter(
        (definition) =>
          definition.contextRef.equals(lookup.contextRef) &&
          definition.qualifiedName.equals(lookup.qualifiedName),
      ),
    );
  }
  public findByTypeReference(
    reference: TypeReference,
  ): TypeRegistryLookupResult {
    if (!isTypeIdReference(reference) && !isTypeNameReference(reference))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.INVALID_TYPE_REFERENCE,
        'TypeRegistry lookup requires an authentic TypeReference.',
      );
    if (isTypeIdReference(reference)) {
      return reference.ref.version === undefined
        ? createTypeRegistryLookupResult(
            this.listVersions(reference.ref.elementId),
          )
        : createTypeRegistryLookupResult(
            asArray(
              this.getByExactVersion(
                ElementVersionRef.fromParts(
                  reference.ref.elementId,
                  reference.ref.version,
                ),
              ),
            ),
          );
    }
    return reference.ref.version === undefined
      ? this.findByName({
          qualifiedName: reference.ref.qualifiedName,
          contextRef: reference.ref.contextRef,
        })
      : createTypeRegistryLookupResult(
          asArray(
            this.getByName({
              qualifiedName: reference.ref.qualifiedName,
              contextRef: reference.ref.contextRef,
              version: reference.ref.version,
            }),
          ),
        );
  }
}

/** Builds atomically: collisions fail before a registry snapshot is published. */
export function createTypeRegistry(
  params: CreateTypeRegistryParams,
): TypeRegistry {
  if (params === null || typeof params !== 'object' || Array.isArray(params))
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.NON_OBJECT,
      'TypeRegistry construction requires a non-null parameters object.',
    );
  const raw: { readonly definitions?: unknown } = params;
  if (!('definitions' in raw) || raw['definitions'] === undefined)
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.MISSING_DEFINITIONS,
      'TypeRegistry construction requires an explicit definitions collection.',
    );
  if (!Array.isArray(raw['definitions']))
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.INVALID_DEFINITIONS,
      'TypeRegistry definitions must be an array; null and non-array collections are invalid.',
    );
  const definitions = raw['definitions'];
  const byIdentity = new Map<string, VersionIndex>();
  const byContextualName: NameIndex = new Map();
  for (let index = 0; index < definitions.length; index += 1) {
    const definition = definitions[index];
    if (!isTypeDefinition(definition))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.INVALID_DEFINITION,
        `TypeRegistry definition at index ${index} is not an authentic TypeDefinition.`,
      );
    const identityKey = definition.id.toString();
    const versionKey = definition.version.toString();
    const identityVersions = byIdentity.get(identityKey);
    if (identityVersions?.has(versionKey))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.DUPLICATE_EXACT_REGISTRATION,
        `Duplicate TypeDefinition registration for exact identity ${identityKey} @ ${versionKey}.`,
      );
    const contextKey = definition.contextRef.toString();
    const nameKey = definition.qualifiedName.toString();
    const namesInContext = byContextualName.get(contextKey);
    const versionsAtName = namesInContext?.get(nameKey);
    if (versionsAtName?.has(versionKey))
      throw new TypeRegistryValidationError(
        TYPE_REGISTRY_ERROR_CODES.CONTEXTUAL_NAME_COLLISION,
        `Contextual type name collision for ${contextKey} / ${nameKey} @ ${versionKey}.`,
      );
    const writableIdentityVersions =
      identityVersions ?? new Map<string, TypeDefinition>();
    writableIdentityVersions.set(versionKey, definition);
    byIdentity.set(identityKey, writableIdentityVersions);
    const writableNamesInContext =
      namesInContext ?? new Map<string, VersionIndex>();
    const writableVersionsAtName =
      versionsAtName ?? new Map<string, TypeDefinition>();
    writableVersionsAtName.set(versionKey, definition);
    writableNamesInContext.set(nameKey, writableVersionsAtName);
    byContextualName.set(contextKey, writableNamesInContext);
  }
  return new ImmutableTypeRegistry(definitions, byIdentity, byContextualName);
}

function validateNameVersionLookup(
  lookup: TypeRegistryNameVersionLookup,
): void {
  validateNameLookup(lookup);
  if (!(lookup.version instanceof SemanticVersion))
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.INVALID_NAME_LOOKUP,
      'Contextual name/version lookup requires an authentic SemanticVersion.',
    );
}
function validateNameLookup(lookup: TypeRegistryNameLookup): void {
  if (lookup === null || typeof lookup !== 'object' || Array.isArray(lookup))
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.INVALID_NAME_LOOKUP,
      'Contextual name lookup requires a non-null lookup object.',
    );
  if (
    !(lookup.qualifiedName instanceof QualifiedName) ||
    !(lookup.contextRef instanceof SemanticContextRef)
  )
    throw new TypeRegistryValidationError(
      TYPE_REGISTRY_ERROR_CODES.INVALID_NAME_LOOKUP,
      'Contextual name lookup requires authentic QualifiedName and SemanticContextRef values.',
    );
}
function asArray(
  definition: TypeDefinition | undefined,
): readonly TypeDefinition[] {
  return definition === undefined
    ? Object.freeze([])
    : Object.freeze([definition]);
}
function freezeDefinitions(
  definitions: readonly TypeDefinition[],
): readonly TypeDefinition[] {
  return Object.freeze([...definitions]);
}
