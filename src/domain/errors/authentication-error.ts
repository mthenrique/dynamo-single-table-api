import { BaseError } from './base-error';

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed', statusCode = 401) {
    super(message, statusCode);
  }
}
