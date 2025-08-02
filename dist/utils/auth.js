"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.verifyTokenForSocket = verifyTokenForSocket;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const response_1 = require("./response");
const JWT_SECRET = env_1.default.JWT_SECRET;
const JWT_EXPIRES_IN = env_1.default.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = env_1.default.JWT_REFRESH_SECRET || 'your_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = env_1.default.JWT_REFRESH_EXPIRES_IN || '7d';
function generateTokens(payload) {
    const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
}
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return (0, response_1.error)(res, 401, 'Access token expired or invalid');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return (0, response_1.error)(res, 401, 'Access token expired or invalid');
    }
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
}
function verifyTokenForSocket(token) {
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded.userId.toString();
    }
    catch {
        return null;
    }
}
