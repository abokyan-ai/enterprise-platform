import { describe, it, expect } from 'vitest';
import {
  createTypeDefinition,
  type TypeDefinition,
  type FieldDefinition,
} from '../src/index.js';
import { createSemanticId } from '@ecosystem/semantic-kernel';

describe('TypeDefinition', () => {
  it('creates a valid TypeDefinition', () => {
    const id = createSemanticId('ecosystem.types:CustomerOrder');
    const typeDef = createTypeDefinition({
      semanticId: id,
      namespace: 'ecosystem.types',
      metadata: { label: 'Customer Order' },
    });

    expect(typeDef.semanticId).toBe('ecosystem.types:CustomerOrder');
    expect(typeDef.kind).toBe('type');
    expect(typeDef.namespace).toBe('ecosystem.types');
    expect(typeDef.fields).toHaveLength(0);
    expect(typeDef.metadata?.label).toBe('Customer Order');
  });

  it('creates a TypeDefinition with fields', () => {
    const id = createSemanticId('ecosystem.types:Invoice');
    const field: FieldDefinition = {
      semanticId: createSemanticId('ecosystem.types:Invoice.amount'),
      kind: 'field',
      fieldType: { kind: 'primitive', primitiveKind: 'decimal' },
      required: true,
    };

    const typeDef = createTypeDefinition({
      semanticId: id,
      namespace: 'ecosystem.types',
      fields: [field],
    });

    expect(typeDef.fields).toHaveLength(1);
    expect(typeDef.fields[0].semanticId).toBe('ecosystem.types:Invoice.amount');
  });

  it('throws when namespace is empty', () => {
    const id = createSemanticId('ecosystem.types:SomeType');
    expect(() =>
      createTypeDefinition({ semanticId: id, namespace: '' }),
    ).toThrow('namespace cannot be empty');
  });

  it('TypeDefinition fields are frozen (immutable)', () => {
    const id = createSemanticId('ecosystem.types:Product');
    const typeDef = createTypeDefinition({
      semanticId: id,
      namespace: 'ecosystem.types',
    });
    // Attempt to mutate fields — should fail silently in non-strict or throw in strict
    expect(() => {
      (typeDef.fields as unknown as FieldDefinition[]).push({} as FieldDefinition);
    }).toThrow();
  });
});
