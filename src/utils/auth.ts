import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import env from '../config/env';
import { JwtPayload } from '../types/jwt';

const JWT_SECRET = env.JWT_SECRET!;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN! || '15m';
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN || '7d';

export function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return { accessToken, refreshToken };
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// ✅ Middleware xác thực token từ header Authorization
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    // return res.error(401, 'No token provided');
    return res.status(400).json({ message: 'error' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'error' });
    // return res.error(401, 'Invalid token');
  }
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

// ✅ Hàm verifyToken đơn giản cho WebSocket (không phải middleware)
export function verifyTokenForSocket(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.userId.toString();
  } catch {
    return null;
  }
}
