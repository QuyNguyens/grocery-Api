// queue/index.ts
import amqp, { Channel, Connection } from "amqplib";
import logger from "../utils/logger";
import { userConsumer } from "./consumers/user.consumer";
import { env } from "process";

let connection: Connection | null = null;
let channel: Channel | null = null;

/**
 * Khởi tạo RabbitMQ connection & các consumer
 */
export async function initRabbitMQConsumers(): Promise<void> {
  try {
    connection = await amqp.connect(env.AMQP_URL);
    channel = await connection.createChannel();

    logger.info("✅ Connected to RabbitMQ");

    // Khởi tạo các consumer
    await userConsumer(channel);
    
    // Nếu có nhiều consumer:
    // await orderConsumer(channel);
    // await paymentConsumer(channel);

  } catch (err) {
    logger.error("❌ Failed to initialize RabbitMQ consumers: " + (err as Error).message);
    process.exit(1);
  }
}

export { channel, connection };
