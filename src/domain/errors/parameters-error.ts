import { BaseError } from './base-error';

export class ParametersError extends BaseError {
  public declare parameters: Record<string, unknown>;

  constructor(message: string, parameters: Record<string, unknown>) {
    super(message, 400);
    this.name = 'ParametersError';
    this.parameters = parameters;
  }
}
