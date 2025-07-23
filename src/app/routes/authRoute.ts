// src/app/routes/authRoute.ts
import { Router } from 'express';
import passport from 'passport';
import session from 'express-session';

const authRouter = Router();

authRouter.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (_req, res) => {
    res.status(200).json({ message: 'oke' });
    // res.redirect('/dashboard');
  },
);

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).json({ message: 'oke' });
    // res.redirect('/dashboard');
  },
);

export default authRouter;
