import { Request, Response } from 'express';
import { SignupInput, LoginInput } from '../validators/auth.validator';
import env from '../../config/env';
import { success, error } from '../../utils/response';
import userService from '../services/user.service';
import { Types } from 'mongoose';
import { Address } from '../../types/user';
import userModel from '../models/user.model';
import { uploadImage } from '../services/cloudinary.service';

class UserController {
  signup = async (req: Request, res: Response) => {
    try {
      const data: SignupInput = req.body;
      const { user, accessToken, refreshToken } = await userService.signup(data);

      success(res, 201, 'Đăng ký thành công', { user, accessToken, refreshToken });
    } catch (err) {
      error(res, 400, (err as Error).message);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data: LoginInput = req.body;
      const { user, accessToken, refreshToken } = await userService.login(data);
      success(res, 200, 'Đăng nhập thành công', { user, accessToken, refreshToken });
    } catch (err) {
      error(res, 400, (err as Error).message);
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { rfToken } = req.body;
      if (!rfToken) return error(res, 401, 'Thiếu refresh token');

      const { accessToken, refreshToken } = await userService.refreshToken(rfToken);

      success(res, 200, 'Làm mới token thành công', { accessToken, refreshToken });
    } catch (err) {
      error(res, 403, (err as Error).message);
    }
  };

  async pushAddress(userId: Types.ObjectId, address: Address) {
    try {
      return await userService.pushAddress(userId, address);
    } catch (error) {
      return false;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { userId, username, phone, password } = req.body;
      const file = req.file;

      if (!file) return error(res, 400, 'No file uploaded');

      const user = await userModel.findById(userId);
      if (!user) return error(res, 404, 'User not found');

      const imageUrl = await uploadImage(file.buffer, 'avatars', user.avatar);

      user.avatar = imageUrl;
      if (username) user.name = username;
      if (phone) user.phone = phone;
      if (password) user.password = password;
      await user.save();

      return success(res, 200, 'Cập nhật user thành công', user);
    } catch (err) {
      return error(res, 500, 'Server error');
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { rfToken } = req.body;
      if (!rfToken) return error(res, 401, 'Thiếu refresh token');
      await userService.logout(rfToken);
      success(res, 204, 'Đăng xuất thành công');
    } catch (err) {
      error(res, 500, 'Lỗi khi đăng xuất');
    }
  }
}

export default new UserController();
