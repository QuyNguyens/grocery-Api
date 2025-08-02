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
  APP_URL: getEnv('APP_URL'),
  VNPAY_TMN_CODE: getEnv('VNPAY_TMN_CODE'),
  VNPAY_SECURE_SECRET: getEnv('VNPAY_SECURE_SECRET'),
  VNPAY_HOST: getEnv('VNPAY_HOST'),
  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),
};