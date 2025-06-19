import { BaseEntity } from '../entities/base-entity';

export interface IBaseRepository<T extends BaseEntity> {
  create(item: Omit<T, 'createdAt' | 'updatedAt'>): Promise<T>;
  get(PK: string, SK: string): Promise<T | null>;
  update(
    PK: string,
    SK: string,
    item: Partial<T> | Record<string, any>,
  ): Promise<T>;
  delete(PK: string, SK: string): Promise<void>;

  // Query methods specific to single table design
  queryByPK(PK: string): Promise<T[]>;
  queryByGSI1(GSI1PK: string, GSI1SK: string): Promise<T[]>;
  queryByGSI2(GSI2PK: string, GSI2SK: string): Promise<T[]>;
  queryByGSI2PK(GSI2PK: string): Promise<T[]>;
}
