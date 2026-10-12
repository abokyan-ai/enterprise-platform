/**
 * @file policy.contract.ts
 * @module @ecosystem/architecture-harness/contracts
 *
 * Typed representation and projection of the authoritative ARC-02 dependency policy.
 * Sourced directly from docs/architecture/dependency-rules.md and AGENTS.md.
 * Does not establish a competing policy.
 */

export interface LayerDependencyMatrix {
  readonly [layer: string]: {
    readonly allowedLayers: readonly string[];
    readonly allowedProjects?: readonly string[];
    readonly forbiddenFrameworks: readonly {
      readonly name: string;
      readonly pattern: RegExp;
    }[];
  };
}

export interface TagTaxonomyDefinition {
  readonly validLayers: readonly string[];
  readonly validScopes: readonly string[];
  readonly validRuntimes: readonly string[];
  readonly validFrameworks: readonly string[];
}

/**
 * Standard tag taxonomy established in ARC-02 Section 22.
 */
export const ARCHITECTURE_TAG_TAXONOMY: TagTaxonomyDefinition = {
  validLayers: [
    'layer:kernel',
    'layer:model',
    'layer:compiler',
    'layer:runtime',
    'layer:contracts',
    'layer:experience',
    'layer:adapter',
    'layer:application',
    'layer:tool',
  ],
  validScopes: [
    'scope:platform',
    'scope:shared',
    'scope:backend',
    'scope:frontend',
  ],
  validRuntimes: [
    'runtime:universal',
    'runtime:node',
    'runtime:browser',
  ],
  validFrameworks: [
    'framework:none',
    'framework:nestjs',
    'framework:angular',
  ],
};

/**
 * Authoritative Layer Dependency Matrix established in ARC-02 Section 8.
 */
export const AUTHORITATIVE_LAYER_MATRIX: LayerDependencyMatrix = {
  'layer:kernel': {
    allowedLayers: [],
    allowedProjects: [],
    forbiddenFrameworks: [
      { name: 'NestJS (@nestjs/*)', pattern: /@nestjs\// },
      { name: 'Angular (@angular/*)', pattern: /@angular\// },
      { name: 'PrimeNG (primeng/*)', pattern: /primeng/ },
      { name: 'Express', pattern: /express/ },
      { name: 'TypeORM', pattern: /typeorm/ },
      { name: 'Prisma', pattern: /prisma/ },
    ],
  },
  'layer:model': {
    allowedLayers: ['layer:kernel'],
    allowedProjects: ['semantic-kernel'],
    forbiddenFrameworks: [
      { name: 'NestJS (@nestjs/*)', pattern: /@nestjs\// },
      { name: 'Angular (@angular/*)', pattern: /@angular\// },
      { name: 'PrimeNG (primeng/*)', pattern: /primeng/ },
      { name: 'Express', pattern: /express/ },
      { name: 'TypeORM', pattern: /typeorm/ },
      { name: 'Prisma', pattern: /prisma/ },
    ],
  },
  'layer:compiler': {
    allowedLayers: ['layer:kernel', 'layer:model'],
    allowedProjects: ['semantic-kernel', 'model-core'],
    forbiddenFrameworks: [
      { name: 'NestJS (@nestjs/*)', pattern: /@nestjs\// },
      { name: 'Angular (@angular/*)', pattern: /@angular\// },
      { name: 'PrimeNG (primeng/*)', pattern: /primeng/ },
    ],
  },
  'layer:runtime': {
    allowedLayers: ['layer:kernel', 'layer:contracts'],
    allowedProjects: ['semantic-kernel', 'platform-contracts'],
    forbiddenFrameworks: [
      { name: 'NestJS (@nestjs/*)', pattern: /@nestjs\// },
      { name: 'Angular (@angular/*)', pattern: /@angular\// },
      { name: 'PrimeNG (primeng/*)', pattern: /primeng/ },
    ],
  },
  'layer:contracts': {
    allowedLayers: [],
    allowedProjects: [],
    forbiddenFrameworks: [
      { name: 'NestJS (@nestjs/*)', pattern: /@nestjs\// },
      { name: 'Angular (@angular/*)', pattern: /@angular\// },
      { name: 'PrimeNG (primeng/*)', pattern: /primeng/ },
    ],
  },
  'layer:tool': {
    allowedLayers: ['layer:kernel', 'layer:model', 'layer:contracts', 'layer:compiler', 'layer:runtime'],
    forbiddenFrameworks: [],
  },
};
