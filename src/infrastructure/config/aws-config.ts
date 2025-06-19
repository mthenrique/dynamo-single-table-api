import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { env } from './env';

export const createDynamoDBClient = (): DynamoDBClient => {
  const config: DynamoDBClientConfig = {
    region: env.AWS_REGION,
  };

  // If you are in local development, use LocalStack
  if (env.NODE_ENV === 'local') {
    config.endpoint = 'http://localhost:4566';
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new DynamoDBClient(config);
};
