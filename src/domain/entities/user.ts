import { BaseEntity } from './base-entity';

export interface User extends BaseEntity {
  id?: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  preferences?: {
    theme: 'LIGHT' | 'DARK';
    notifications: boolean;
  };
  // Global Secondary Index fields
  GSI1PK?: string;
  GSI1SK?: string;
  GSI2PK?: string;
  GSI2SK?: string;
}

export type UserUpdateData = Partial<
  Omit<User, 'PK' | 'SK' | 'type' | 'createdAt' | 'updatedAt' | 'preferences'>
> & {
  id: string;
  preferences?: Partial<User['preferences']>;
};

// Helper functions for generating DynamoDB keys
export const UserKeys = {
  // Generate Partition Key for user
  generatePK: (userId: string): string => `USER#${userId}`,

  // Generate Sort Key for user
  generateSK: (userId: string): string => `PROFILE#${userId}`,

  // Generate Global Secondary Index 1 key for email lookup
  generateGSI1PK: (email: string): string => `EMAIL#${email}`,
  generateGSI1SK: (): string => 'USER',

  // Generate Global Secondary Index 2 key for status lookup
  generateGSI2PK: (status: User['status']): string => `STATUS#${status}`,
  generateGSI2SK: (userId: string): string => `USER#${userId}`,
};
