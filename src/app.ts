import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import '../src/config/passport';

const app: Application = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: 'https://grocery-ecru.vercel.app',
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
