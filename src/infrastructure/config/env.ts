import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Servidor
  NODE_ENV: z
    .enum(['local', 'development', 'production', 'test'])
    .default('local'),
  PORT: z.coerce.number().default(3000),
  AWS_REGION: z.string().min(1),
  DYNAMODB_TABLE_NAME: z.string().min(1),

  // AWS Credentials (opcional para desenvolvimento local)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Logs
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Valida as variáveis de ambiente
const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(envParseResult.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = envParseResult.data;

export type Env = typeof env;
