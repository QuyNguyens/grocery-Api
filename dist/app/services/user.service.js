"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/auth.service.ts
const auth_1 = require("../../utils/auth");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const ms_1 = __importDefault(require("ms"));
const env_1 = __importDefault(require("../../config/env"));
class UserService {
    constructor() {
        this.signup = async (data) => {
            const existing = await user_repository_1.default.findUserByEmail(data.email);
            if (existing)
                throw new Error('Email đã tồn tại');
            const user = await user_repository_1.default.createUser(data);
            const tokens = (0, auth_1.generateTokens)({ userId: user._id, role: user.role });
            const { _id, name, email, avatar, role, addresses } = user;
            return {
                user: { _id, name, email, role, addresses },
                ...tokens,
            };
        };
        this.login = async (data) => {
            const user = await user_repository_1.default.findUserByEmail(data.email);
            if (!user || !(await user.comparePassword(data.password))) {
                throw new Error('Email hoặc mật khẩu không chính xác');
            }
            const tokens = (0, auth_1.generateTokens)({ userId: user._id, role: user.role });
            const { _id, name, email, avatar, phone, role, addresses } = user;
            const refresh = {
                userId: user._id,
                token: tokens.refreshToken,
                expiresAt: new Date(Date.now() + (0, ms_1.default)(env_1.default.JWT_REFRESH_EXPIRES_IN || '7d')),
            };
            refreshToken_model_1.default.create(refresh);
            return {
                user: { _id, name, email, avatar, phone, role, addresses },
                ...tokens,
            };
        };
        this.refreshToken = async (token) => {
            try {
                const payload = (0, auth_1.verifyRefreshToken)(token);
                const savedToken = await refreshToken_model_1.default.findOne({ token });
                if (!savedToken) {
                    throw new Error('Refresh token không tồn tại trong hệ thống');
                }
                if (savedToken.expiresAt < new Date()) {
                    await refreshToken_model_1.default.deleteOne({ token });
                    throw new Error('Refresh token đã hết hạn');
                }
                const newTokens = (0, auth_1.generateTokens)({ userId: payload.userId, role: payload.role });
                savedToken.token = newTokens.refreshToken;
                savedToken.expiresAt = new Date(Date.now() + (0, ms_1.default)(env_1.default.JWT_REFRESH_EXPIRES_IN || '7d'));
                await savedToken.save();
                return newTokens;
            }
            catch (err) {
                throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
            }
        };
    }
    async pushAddress(userId, address) {
        return await user_repository_1.default.pushAddress(userId, address);
    }
    async logout(rfToken) {
        return await refreshToken_model_1.default.deleteOne({ token: rfToken });
    }
}
exports.default = new UserService();
