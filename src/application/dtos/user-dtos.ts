import { User } from '@/domain/entities/user';

export type CreateUserInputDTO = {
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  preferences: {
    theme: 'LIGHT' | 'DARK';
    notifications: boolean;
  };
};

export type UpdateUserInputDTO = {
  id: string;
  name?: string;
  preferences?: {
    theme: 'LIGHT' | 'DARK';
    notifications: boolean;
  };
};

export type UserResponseDTO = {
  id: string;
  email: string;
  name: string;
  status: User['status'];
  preferences?: {
    theme: 'LIGHT' | 'DARK';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type UserListResponseDTO = {
  users: UserResponseDTO[];
  total: number;
};

export type GetUsersByStatusDTO = {
  status: User['status'];
};

export type GetUserByIdDTO = {
  id: string;
};

export type GetUserByEmailDTO = {
  email: string;
};

export type DeleteUserDTO = {
  id: string;
};
