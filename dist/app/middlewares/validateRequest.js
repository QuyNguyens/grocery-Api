"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const xss_1 = __importDefault(require("xss"));
const response_1 = require("../../utils/response");
function sanitizeValue(value) {
    if (typeof value === 'string')
        return (0, xss_1.default)(value);
    if (Array.isArray(value))
        return value.map(sanitizeValue);
    if (typeof value === 'object' && value !== null) {
        const sanitizedObj = {};
        for (const key in value) {
            sanitizedObj[key] = sanitizeValue(value[key]);
        }
        return sanitizedObj;
    }
    return value;
}
function validateRequest(schema) {
    return (req, res, next) => {
        // Sanitize body
        if (req.body) {
            req.body = sanitizeValue(req.body);
        }
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const formattedErrors = result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            (0, response_1.error)(res, 400, 'Validate failed', formattedErrors);
        }
        req.body = result.data; // validated & sanitized
        next();
    };
}
