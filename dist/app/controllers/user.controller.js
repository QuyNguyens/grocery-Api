"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../config/env"));
const response_1 = require("../../utils/response");
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.signup = async (req, res) => {
            try {
                const data = req.body;
                const { user, accessToken, refreshToken } = await user_service_1.default.signup(data);
                res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                (0, response_1.success)(res, 201, 'Đăng ký thành công', { user, accessToken });
            }
            catch (err) {
                (0, response_1.error)(res, 400, err.message);
            }
        };
        this.login = async (req, res) => {
            try {
                const data = req.body;
                const { user, accessToken, refreshToken } = await user_service_1.default.login(data);
                res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                (0, response_1.success)(res, 200, 'Đăng nhập thành công', { user, accessToken });
            }
            catch (err) {
                (0, response_1.error)(res, 400, err.message);
            }
        };
        this.refresh = async (req, res) => {
            try {
                const refreshToken = req.cookies?.refresh_token;
                if (!refreshToken)
                    return res.status(400).json({ message: 'error' });
                (0, response_1.error)(res, 400, 'Thiếu refresh token');
                const accessToken = await user_service_1.default.refreshToken(refreshToken);
                (0, response_1.success)(res, 200, 'Làm mới token thành công', accessToken);
            }
            catch (err) {
                (0, response_1.error)(res, 403, err.message);
            }
        };
    }
}
exports.default = new UserController();
