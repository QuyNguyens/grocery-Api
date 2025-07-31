"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = __importDefault(require("../app/models/user.model"));
const env_1 = __importDefault(require("./env"));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.default.GOOGLE_CLIENT_ID,
    clientSecret: env_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env_1.default.APP_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await user_model_1.default.findOne({
            providerId: profile.id,
            provider: 'google',
        });
        if (existingUser)
            return done(null, {
                ...existingUser.toObject(),
                accessToken,
                refreshToken,
            });
        const newUser = await user_model_1.default.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            provider: 'google',
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value,
        });
        return done(null, {
            ...newUser.toObject(),
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        return done(err);
    }
}));
// Facebook Strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: env_1.default.FACEBOOK_CLIENT_ID,
    clientSecret: env_1.default.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${env_1.default.APP_URL}/api/auth/google/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await user_model_1.default.findOne({
            providerId: profile.id,
            provider: 'facebook',
        });
        if (!user) {
            user = await user_model_1.default.create({
                name: profile.displayName,
                email,
                provider: 'facebook',
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value,
            });
        }
        return done(null, {
            ...user.toObject(),
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        return done(err, false);
    }
}));
// Session
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await user_model_1.default.findById(id);
    done(null, user);
});
