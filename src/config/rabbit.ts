import amqp, { Channel, Connection } from 'amqplib';
import env from './env';
import logger from '../utils/logger';

const USER_QUEUE = env.USER_QUEUE;

let channel: Channel | null = null;

/**
 * Connect to RabbitMQ and create a channel
 */
export async function connectRabbitMQ(): Promise<void> {
  try {
    const connection: Connection = await amqp.connect(env.AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(USER_QUEUE, { durable: true });
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('❌ RabbitMQ connection error: ', error);
    process.exit(1);
  }
}

/**
 * Send message into queue
 * @param message - JSON data to send
 */
export function sendMessage(message: Record<string, any>): void {
  if (!channel) {
    logger.error('❌ RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
  }

  const payload = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(USER_QUEUE, payload, { persistent: true });
  logger.info('📤 Message sent to queue:', message.type ?? '[unknown type]');
}
