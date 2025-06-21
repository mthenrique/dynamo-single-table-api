import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { env } from './env';

export const createDynamoDBClient = (): DynamoDBClient => {
  const config: DynamoDBClientConfig = {
    region: env.AWS_REGION,
  };

  // Use AWS_ENDPOINT if provided, otherwise fallback to localhost for local development
  if (process.env.AWS_ENDPOINT) {
    config.endpoint = process.env.AWS_ENDPOINT;
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    };
  } else if (env.NODE_ENV === 'local') {
    config.endpoint = 'http://localhost:4566';
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new DynamoDBClient(config);
};
