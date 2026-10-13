export const MODEL_SOURCE_MAX_LENGTH = 2_000_000;
export const MODEL_SOURCE_MAX_DEPTH = 128;
export const MODEL_SOURCE_MAX_NODES = 100_000;

export function assertSourceContent(content: string): void {
  if (typeof content !== 'string')
    throw new TypeError('Model source must contain text.');
  if (content.length > MODEL_SOURCE_MAX_LENGTH)
    throw new RangeError('Model source length limit exceeded.');
  if (content.trim().length === 0)
    throw new TypeError('Model source must contain text.');
}
