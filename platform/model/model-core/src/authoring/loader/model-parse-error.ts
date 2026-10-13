import type { DiagnosticLocation } from '@ecosystem/semantic-kernel';

/** Fixed diagnostics with authentic optional parser positions, never source snippets. */
export class ModelParseError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
    public readonly location?: DiagnosticLocation,
  ) {
    super(message);
    this.name = 'ModelParseError';
  }
}
