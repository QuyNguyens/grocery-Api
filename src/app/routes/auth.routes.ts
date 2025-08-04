// src/app/routes/authRoute.ts
import { Request, Router } from 'express';
import passport from 'passport';
import session from 'express-session';
import { IUser } from '../../types/user';
import env from '../../config/env';
import { Types } from 'mongoose';
import { generateTokens } from '../../utils/auth';
interface AuthenticatedRequest extends Request {
  user: IUser & {
    id: Types.ObjectId;
  };
}

const authRouter = Router();

authRouter.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { id, ...user } = (req as AuthenticatedRequest).user;

    const tokens = generateTokens({ userId: id, role: user.role });

    res.redirect(
      `${env.SCHEMA_FE_URL}/auth/callback?access=${tokens.accessToken}&refresh=${tokens.refreshToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  },
);

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const { id, ...user } = (req as AuthenticatedRequest).user;

    const tokens = generateTokens({ userId: id, role: user.role });

    res.redirect(
      `${env.SCHEMA_FE_URL}/auth/callback?access=${tokens.accessToken}&refresh=${tokens.refreshToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  },
);

export default authRouter;
