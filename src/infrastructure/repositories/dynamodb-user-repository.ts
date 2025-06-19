/* eslint-disable indent */
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { BaseEntity } from '../../domain/entities/base-entity';
import { IBaseRepository } from '../../domain/repositories/i-base-repository';
import { createDynamoDBClient } from '../config/aws-config';

export class DynamoDBRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string) {
    const ddbClient = createDynamoDBClient();
    this.client = DynamoDBDocumentClient.from(ddbClient);
    this.tableName = tableName;
  }

  public async create(item: Omit<T, 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      createdAt: now,
      updatedAt: now,
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: newItem,
      }),
    );

    return newItem as T;
  }

  public async get(PK: string, SK: string): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK, SK },
      }),
    );

    return (result.Item as T) || null;
  }

  public async update(PK: string, SK: string, item: Partial<T>): Promise<T> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    const excludedFields = ['PK', 'SK', 'id', 'createdAt', 'updatedAt'];

    Object.entries(item).forEach(([key, value]) => {
      if (!excludedFields.includes(key)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK, SK },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return result.Attributes as T;
  }

  public async delete(PK: string, SK: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { PK, SK },
      }),
    );
  }

  public async queryByPK(PK: string): Promise<T[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': PK,
        },
      }),
    );

    return result.Items as T[];
  }

  public async queryByGSI1(GSI1PK: string, GSI1SK: string): Promise<T[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk',
        ExpressionAttributeValues: {
          ':gsi1pk': GSI1PK,
          ':gsi1sk': GSI1SK,
        },
      }),
    );

    return result.Items as T[];
  }

  public async queryByGSI2(GSI2PK: string, GSI2SK: string): Promise<T[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :gsi2pk AND GSI2SK = :gsi2sk',
        ExpressionAttributeValues: {
          ':gsi2pk': GSI2PK,
          ':gsi2sk': GSI2SK,
        },
      }),
    );

    return result.Items as T[];
  }

  public async queryByGSI2PK(GSI2PK: string): Promise<T[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :gsi2pk',
        ExpressionAttributeValues: {
          ':gsi2pk': GSI2PK,
        },
      }),
    );

    return result.Items as T[];
  }
}
