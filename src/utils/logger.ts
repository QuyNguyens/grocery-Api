// utils/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Lấy ngày hiện tại theo format DD-MM-YYYY
const currentDate = new Date();
const dateFolderName = currentDate
  .toLocaleDateString('en-GB') // => 23/07/2025
  .split('/')
  .join('-'); // => 23-07-2025

// Tạo thư mục logs/<ngày>
const logsDir = path.resolve(__dirname, '..', 'logs', dateFolderName);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Tạo transport dùng fixed file name
const transport = new DailyRotateFile({
  filename: 'app.log', // luôn là app.log
  dirname: logsDir, // logs/23-07-2025
  datePattern: '', // KHÔNG cần datePattern vì ta đã tạo folder theo ngày rồi
  zippedArchive: false,
  maxFiles: '14d',
  level: 'info',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
    winston.format.printf(
      info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`,
    ),
  ),
  transports: [transport, new winston.transports.Console()],
});

export default logger;
