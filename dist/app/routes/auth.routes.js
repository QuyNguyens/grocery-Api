"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/routes/authRoute.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = __importDefault(require("../../config/env"));
const authRouter = (0, express_1.Router)();
authRouter.use((0, express_session_1.default)({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
authRouter.use(passport_1.default.initialize());
authRouter.use(passport_1.default.session());
authRouter.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const { accessToken, refreshToken, ...user } = req.user;
    res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${env_1.default.SCHEMA_FE_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
authRouter.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
authRouter.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    const { accessToken, refreshToken, ...user } = req.user;
    res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${env_1.default.SCHEMA_FE_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
exports.default = authRouter;
