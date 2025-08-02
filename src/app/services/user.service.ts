// src/services/auth.service.ts
import { generateTokens, verifyRefreshToken } from '../../utils/auth';
import { SignupInput, LoginInput } from '../validators/auth.validator';
import { Types } from 'mongoose';
import { JwtPayload } from '../../types/jwt';
import userRepository from '../repositories/user.repository';
import { Address, IRefreshToken } from '../../types/user';
import refreshTokenModel from '../models/refreshToken.model';
import ms from 'ms';
import env from '../../config/env';

class UserService {
  signup = async (data: SignupInput) => {
    const existing = await userRepository.findUserByEmail(data.email);
    if (existing) throw new Error('Email đã tồn tại');

    const user = await userRepository.createUser(data);
    const tokens = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });
    const { _id, name, email, avatar, role, addresses } = user;

    return {
      user: { _id, name, email, role, addresses },
      ...tokens,
    };
  };

  login = async (data: LoginInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (!user || !(await user.comparePassword(data.password))) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const tokens = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });
    const { _id, name, email, avatar, phone, role, addresses } = user;

    const refresh: IRefreshToken = {
      userId: user._id as Types.ObjectId,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN || '7d')),
    };
    refreshTokenModel.create(refresh);

    return {
      user: { _id, name, email, avatar, phone, role, addresses },
      ...tokens,
    };
  };

  refreshToken = async (token: string) => {
    try {
      const payload = verifyRefreshToken(token) as JwtPayload;

      const savedToken = await refreshTokenModel.findOne({ token });

      if (!savedToken) {
        throw new Error('Refresh token không tồn tại trong hệ thống');
      }

      if (savedToken.expiresAt < new Date()) {
        await refreshTokenModel.deleteOne({ token });
        throw new Error('Refresh token đã hết hạn');
      }

      const newTokens = generateTokens({ userId: payload.userId, role: payload.role });

      savedToken.token = newTokens.refreshToken;
      savedToken.expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN || '7d'));
      await savedToken.save();

      return newTokens;
    } catch (err) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  };

  async pushAddress(userId: Types.ObjectId, address: Address) {
    return await userRepository.pushAddress(userId, address);
  }

  async logout(rfToken: string) {
    return await refreshTokenModel.deleteOne({ token: rfToken });
  }
}

export default new UserService();
