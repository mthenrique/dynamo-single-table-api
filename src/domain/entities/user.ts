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

export const UserKeys = {
  generatePK: (userId: string): string => `USER#${userId}`,

  generateSK: (userId: string): string => `PROFILE#${userId}`,

  generateGSI1PK: (email: string): string => `EMAIL#${email}`,
  generateGSI1SK: (): string => 'USER',

  generateGSI2PK: (status: User['status']): string => `STATUS#${status}`,
  generateGSI2SK: (userId: string): string => `USER#${userId}`,
};
