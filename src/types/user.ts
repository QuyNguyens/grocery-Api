// src/types/user.ts
export interface Address {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  isDefault?: boolean;
}

export type AuthProvider = 'local' | 'google' | 'facebook';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin';

  provider: AuthProvider;
  providerId?: string;

  addresses?: Address[];
  createdAt?: Date;
  updatedAt?: Date;
}
