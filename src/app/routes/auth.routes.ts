// src/app/routes/authRoute.ts
import { Request, Router } from 'express';
import passport from 'passport';
import session from 'express-session';
import { IUser } from '../../types/user';
import env from '../../config/env';
interface AuthenticatedRequest extends Request {
  user: IUser & {
    accessToken: string;
    refreshToken: string;
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
    const { accessToken, refreshToken, ...user } = (req as AuthenticatedRequest).user;

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${env.SCHEMA_FE_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  },
);

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const { accessToken, refreshToken, ...user } = (req as AuthenticatedRequest).user;

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(
      `${env.SCHEMA_FE_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  },
);

export default authRouter;
