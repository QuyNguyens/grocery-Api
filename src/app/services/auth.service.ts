// src/services/auth.service.ts
import * as UserRepo from '../repositories/user.repository';
import { generateTokens, verifyRefreshToken } from '../../utils/auth';
import { SignupInput, LoginInput } from '../validators/auth.validator';
import { Types } from 'mongoose';
import { JwtPayload } from '../../types/jwt';

export const signup = async (data: SignupInput) => {
  const existing = await UserRepo.findUserByEmail(data.email);
  if (existing) throw new Error('Email đã tồn tại');

  const user = await UserRepo.createUser(data);
  const tokens = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });

  return { user, ...tokens };
};

export const login = async (data: LoginInput) => {
  const user = await UserRepo.findUserByEmail(data.email);
  if (!user || !(await user.comparePassword(data.password))) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  const tokens = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });
  return { user, ...tokens };
};

export const refreshToken = async (token: string) => {
  try {
    const payload = verifyRefreshToken(token) as JwtPayload;
    const tokens = generateTokens(payload);
    return tokens;
  } catch (err) {
    throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
  }
};
