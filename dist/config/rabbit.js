"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
exports.sendMessage = sendMessage;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
const USER_QUEUE = env_1.default.USER_QUEUE;
let channel = null;
/**
 * Connect to RabbitMQ and create a channel
 */
async function connectRabbitMQ() {
    try {
        const connection = await amqplib_1.default.connect(env_1.default.AMQP_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(USER_QUEUE, { durable: true });
        logger_1.default.info('Connected to RabbitMQ');
    }
    catch (error) {
        logger_1.default.error('❌ RabbitMQ connection error: ', error);
        process.exit(1);
    }
}
/**
 * Send message into queue
 * @param message - JSON data to send
 */
function sendMessage(message) {
    if (!channel) {
        logger_1.default.error('❌ RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
        throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
    }
    const payload = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(USER_QUEUE, payload, { persistent: true });
    logger_1.default.info('📤 Message sent to queue:', message.type ?? '[unknown type]');
}
