"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.channel = void 0;
exports.initRabbitMQConsumers = initRabbitMQConsumers;
// queue/index.ts
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = __importDefault(require("../utils/logger"));
const user_consumer_1 = require("./consumers/user.consumer");
const process_1 = require("process");
let connection = null;
exports.connection = connection;
let channel = null;
exports.channel = channel;
/**
 * Khởi tạo RabbitMQ connection & các consumer
 */
async function initRabbitMQConsumers() {
    try {
        exports.connection = connection = await amqplib_1.default.connect(process_1.env.AMQP_URL);
        exports.channel = channel = await connection.createChannel();
        logger_1.default.info("✅ Connected to RabbitMQ");
        // Khởi tạo các consumer
        await (0, user_consumer_1.userConsumer)(channel);
        // Nếu có nhiều consumer:
        // await orderConsumer(channel);
        // await paymentConsumer(channel);
    }
    catch (err) {
        logger_1.default.error("❌ Failed to initialize RabbitMQ consumers: " + err.message);
        process.exit(1);
    }
}
