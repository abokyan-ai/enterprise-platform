import { SemanticKernelError } from '@ecosystem/semantic-kernel';

export const INSTANCE_ID_MIN_LENGTH = 3;
export const INSTANCE_ID_MAX_LENGTH = 128;
export const INSTANCE_ID_PATTERN =
  /^[a-zA-Z0-9][a-zA-Z0-9._:-]{1,126}[a-zA-Z0-9]$/;

export class InstanceIdValidationError extends SemanticKernelError {
  public constructor(message: string) {
    super(message, 'INSTANCE_ID_INVALID');
    this.name = 'InstanceIdValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Independent business-instance identity; it makes no uniqueness claim. */
export class InstanceId {
  readonly #value: string;
  private constructor(value: string) {
    this.#value = value;
    Object.freeze(this);
  }
  public static parse(value: unknown): InstanceId {
    if (typeof value !== 'string')
      throw new InstanceIdValidationError(
        'InstanceId must be a string primitive.',
      );
    if (
      value.length < INSTANCE_ID_MIN_LENGTH ||
      value.length > INSTANCE_ID_MAX_LENGTH ||
      !INSTANCE_ID_PATTERN.test(value)
    ) {
      throw new InstanceIdValidationError(
        'InstanceId must be 3–128 ASCII alphanumeric characters, with . _ : or - only internally.',
      );
    }
    return new InstanceId(value);
  }
  public static isValid(value: unknown): value is string {
    try {
      InstanceId.parse(value);
      return true;
    } catch {
      return false;
    }
  }
  public equals(other: unknown): boolean {
    return other instanceof InstanceId && this.#value === other.#value;
  }
  public toString(): string {
    return this.#value;
  }
  public toJSON(): string {
    return this.#value;
  }
}
