// src/services/auth.service.ts
import { generateTokens, verifyRefreshToken } from '../../utils/auth';
import { SignupInput, LoginInput } from '../validators/auth.validator';
import { Types } from 'mongoose';
import { JwtPayload } from '../../types/jwt';
import userRepository from '../repositories/user.repository';
import { Address } from '../../types/user';

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
    const { _id, name, email, avatar, role, addresses } = user;

    return {
      user: { _id, name, email, role, addresses },
      ...tokens,
    };
  };

  refreshToken = async (token: string) => {
    try {
      const payload = verifyRefreshToken(token) as JwtPayload;
      const tokens = generateTokens(payload);
      return tokens;
    } catch (err) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  };

  async pushAddress(userId: Types.ObjectId, address: Address) {
    return await userRepository.pushAddress(userId, address);
  }
}

export default new UserService();
