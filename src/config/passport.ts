// src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import userModel from '../app/models/user.model';
import env from './env';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({
          providerId: profile.id,
          provider: 'google',
        });

        if (existingUser) return done(null, existingUser);

        const newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          provider: 'google',
          providerId: profile.id,
          avatar: profile.photos?.[0]?.value,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_CLIENT_ID!,
      clientSecret: env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await userModel.findOne({
          providerId: profile.id,
          provider: 'facebook',
        });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            provider: 'facebook',
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as any, false);
      }
    },
  ),
);

// Session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});
