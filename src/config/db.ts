import mongoose from 'mongoose';
import logger from '../utils/logger';
import env from './env';

const MONGODB_URI = env.MONGO_URI;

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
}
