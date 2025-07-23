import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { SignupInput, LoginInput } from '../validators/auth.validator';
import env from '../../config/env';
import { success, error } from '../../utils/response';

export const signup = async (req: Request, res: Response) => {
  try {
    const data: SignupInput = req.body;
    const { user, accessToken, refreshToken } = await AuthService.signup(data);
    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    success(res, 201, 'Đăng ký thành công', { user, accessToken });
  } catch (err) {
    error(res, 400, (err as Error).message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginInput = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(data);
    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    success(res, 200, 'Đăng nhập thành công', { user, accessToken });
  } catch (err) {
    error(res, 400, (err as Error).message);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return res.status(400).json({ message: 'error' });
    error(res, 400, 'Thiếu refresh token');

    const accessToken = await AuthService.refreshToken(refreshToken);
    success(res, 200, 'Làm mới token thành công', accessToken);
  } catch (err) {
    error(res, 403, (err as Error).message);
  }
};
