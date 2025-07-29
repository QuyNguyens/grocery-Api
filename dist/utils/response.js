"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
function success(res, statusCode, message, data = null, meta = {}) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
}
function error(res, statusCode, message, errors = null, meta = {}) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        meta,
    });
}
