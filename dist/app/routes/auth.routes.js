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
const auth_1 = require("../../utils/auth");
const authRouter = (0, express_1.Router)();
authRouter.use((0, express_session_1.default)({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
authRouter.use(passport_1.default.initialize());
authRouter.use(passport_1.default.session());
authRouter.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const { id, ...user } = req.user;
    const tokens = (0, auth_1.generateTokens)({ userId: id, role: user.role });
    res.redirect(`${env_1.default.SCHEMA_FE_URL}/auth/callback?access=${tokens.accessToken}&refresh=${tokens.refreshToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
authRouter.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
authRouter.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    const { id, ...user } = req.user;
    const tokens = (0, auth_1.generateTokens)({ userId: id, role: user.role });
    res.redirect(`${env_1.default.SCHEMA_FE_URL}/auth/callback?access=${tokens.accessToken}&refresh=${tokens.refreshToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
exports.default = authRouter;
