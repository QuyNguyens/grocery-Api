"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../../utils/response");
const user_service_1 = __importDefault(require("../services/user.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_service_1 = require("../services/cloudinary.service");
class UserController {
    constructor() {
        this.signup = async (req, res) => {
            try {
                const data = req.body;
                const { user, accessToken, refreshToken } = await user_service_1.default.signup(data);
                (0, response_1.success)(res, 201, 'Đăng ký thành công', { user, accessToken, refreshToken });
            }
            catch (err) {
                (0, response_1.error)(res, 400, err.message);
            }
        };
        this.login = async (req, res) => {
            try {
                const data = req.body;
                const { user, accessToken, refreshToken } = await user_service_1.default.login(data);
                (0, response_1.success)(res, 200, 'Đăng nhập thành công', { user, accessToken, refreshToken });
            }
            catch (err) {
                (0, response_1.error)(res, 400, err.message);
            }
        };
        this.refresh = async (req, res) => {
            try {
                const { rfToken } = req.body;
                if (!rfToken)
                    return (0, response_1.error)(res, 401, 'Thiếu refresh token');
                const { accessToken, refreshToken } = await user_service_1.default.refreshToken(rfToken);
                (0, response_1.success)(res, 200, 'Làm mới token thành công', { accessToken, refreshToken });
            }
            catch (err) {
                (0, response_1.error)(res, 403, err.message);
            }
        };
    }
    async pushAddress(userId, address) {
        try {
            return await user_service_1.default.pushAddress(userId, address);
        }
        catch (error) {
            return false;
        }
    }
    async update(req, res) {
        try {
            const { userId, username, phone, password } = req.body;
            const file = req.file;
            if (!file)
                return (0, response_1.error)(res, 400, 'No file uploaded');
            const user = await user_model_1.default.findById(userId);
            if (!user)
                return (0, response_1.error)(res, 404, 'User not found');
            const imageUrl = await (0, cloudinary_service_1.uploadImage)(file.buffer, 'avatars', user.avatar);
            user.avatar = imageUrl;
            if (username)
                user.name = username;
            if (phone)
                user.phone = phone;
            if (password)
                user.password = password;
            await user.save();
            return (0, response_1.success)(res, 200, 'Cập nhật user thành công', user);
        }
        catch (err) {
            return (0, response_1.error)(res, 500, 'Server error');
        }
    }
    async logout(req, res) {
        try {
            const { rfToken } = req.body;
            if (!rfToken)
                return (0, response_1.error)(res, 401, 'Thiếu refresh token');
            await user_service_1.default.logout(rfToken);
            (0, response_1.success)(res, 204, 'Đăng xuất thành công');
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi đăng xuất');
        }
    }
}
exports.default = new UserController();
