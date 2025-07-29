"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/auth.service.ts
const auth_1 = require("../../utils/auth");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
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
            const { _id, name, email, avatar, role, addresses } = user;
            return {
                user: { _id, name, email, role, addresses },
                ...tokens,
            };
        };
        this.refreshToken = async (token) => {
            try {
                const payload = (0, auth_1.verifyRefreshToken)(token);
                const tokens = (0, auth_1.generateTokens)(payload);
                return tokens;
            }
            catch (err) {
                throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
            }
        };
    }
}
exports.default = new UserService();
