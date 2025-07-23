// queue/consumers/user.consumer.ts
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { env } from "process";

/**
 * Khởi tạo consumer cho hàng đợi người dùng
 */
export async function userConsumer(channel: Channel): Promise<void> {
  const queue = env.USER_QUEUE;

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const content = msg.content.toString();
        const data = JSON.parse(content);

        logger.info(`📥 [UserConsumer] Received message: ${content}`);

        // TODO: Thực hiện xử lý dữ liệu tại đây
        // Ví dụ: await handleUserMessage(data);

        // Sau khi xử lý xong, xác nhận
        channel.ack(msg);
      } catch (err) {
        logger.error(`❌ [UserConsumer] Error: ${(err as Error).message}`);
        // Có thể chọn: không ack để message được xử lại
        channel.nack(msg, false, false); // Bỏ qua message lỗi
      }
    }
  });

  logger.info(`✅ [UserConsumer] Listening on queue: ${queue}`);
}
