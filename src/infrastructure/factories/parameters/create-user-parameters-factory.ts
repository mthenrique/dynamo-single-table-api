import { ZodUserParametersValidator } from '@/infrastructure/validators/zod-user-parameters-validator';

export class CreateUserParametersFactory {
  public make() {
    return new ZodUserParametersValidator();
  }
}
