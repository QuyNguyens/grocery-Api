"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConsumer = userConsumer;
const logger_1 = __importDefault(require("../../utils/logger"));
const process_1 = require("process");
/**
 * Khởi tạo consumer cho hàng đợi người dùng
 */
async function userConsumer(channel) {
    const queue = process_1.env.USER_QUEUE;
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            try {
                const content = msg.content.toString();
                const data = JSON.parse(content);
                logger_1.default.info(`📥 [UserConsumer] Received message: ${content}`);
                // TODO: Thực hiện xử lý dữ liệu tại đây
                // Ví dụ: await handleUserMessage(data);
                // Sau khi xử lý xong, xác nhận
                channel.ack(msg);
            }
            catch (err) {
                logger_1.default.error(`❌ [UserConsumer] Error: ${err.message}`);
                // Có thể chọn: không ack để message được xử lại
                channel.nack(msg, false, false); // Bỏ qua message lỗi
            }
        }
    });
    logger_1.default.info(`✅ [UserConsumer] Listening on queue: ${queue}`);
}
