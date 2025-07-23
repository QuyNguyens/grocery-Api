import { Types } from 'mongoose';

export interface JwtPayload {
  userId: Types.ObjectId;
  role: 'user' | 'admin';
}
