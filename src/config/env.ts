import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  MONGO_URI: getEnv('MONGO_URI'),
  AMQP_URL: getEnv('AMQP_URL'),
  USER_QUEUE: getEnv('USER_QUEUE', 'queue_events'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN'),
  REFRESH_TOKEN_COOKIE_NAME: getEnv('REFRESH_TOKEN_COOKIE_NAME'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  FACEBOOK_CLIENT_ID: getEnv('FACEBOOK_CLIENT_ID'),
  FACEBOOK_CLIENT_SECRET: getEnv('FACEBOOK_CLIENT_SECRET'),
  SCHEMA_FE_URL: getEnv('SCHEMA_FE_URL'),
};
