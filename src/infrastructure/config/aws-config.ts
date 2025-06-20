import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { env } from './env';

export const createDynamoDBClient = (): DynamoDBClient => {
  const config: DynamoDBClientConfig = {
    region: env.AWS_REGION,
  };

  if (env.NODE_ENV === 'local') {
    config.endpoint = 'http://localhost:4566';
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new DynamoDBClient(config);
};
