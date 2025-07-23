import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình routes
app.use('/api', router);

// Route mặc định
app.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
