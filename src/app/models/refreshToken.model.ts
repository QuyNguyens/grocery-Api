import mongoose, { Schema, Document } from 'mongoose';
import { IRefreshToken } from '../../types/user';

interface IRefreshTokenDocument extends IRefreshToken, Document {}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
