"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
// src/validators/auth.validator.ts
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên không được để trống'),
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(1, 'Mật khẩu không được để trống'),
});
