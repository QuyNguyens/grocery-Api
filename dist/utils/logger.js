"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils/logger.ts
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Lấy ngày hiện tại theo format DD-MM-YYYY
const currentDate = new Date();
const dateFolderName = currentDate
    .toLocaleDateString('en-GB') // => 23/07/2025
    .split('/')
    .join('-'); // => 23-07-2025
// Tạo thư mục logs/<ngày>
const logsDir = path_1.default.resolve(__dirname, '..', 'logs', dateFolderName);
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Tạo transport dùng fixed file name
const transport = new winston_daily_rotate_file_1.default({
    filename: 'app.log', // luôn là app.log
    dirname: logsDir, // logs/23-07-2025
    datePattern: '', // KHÔNG cần datePattern vì ta đã tạo folder theo ngày rồi
    zippedArchive: false,
    maxFiles: '14d',
    level: 'info',
});
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }), winston_1.default.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)),
    transports: [transport, new winston_1.default.transports.Console()],
});
exports.default = logger;
