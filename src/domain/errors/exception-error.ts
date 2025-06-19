import { BaseError } from './base-error';

export class ExceptionError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500, false); // isOperational = false for non-operational errors
  }
}
