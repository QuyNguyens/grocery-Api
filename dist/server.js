"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const queue_1 = require("./queue");
const websocket_1 = require("./ws-server/websocket");
const logger_1 = __importDefault(require("./utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Kết nối MongoDB
        await (0, db_1.connectToDatabase)();
        // Khởi động RabbitMQ Consumers
        await (0, queue_1.initRabbitMQConsumers)();
        // Start HTTP server
        const server = app_1.default.listen(PORT, () => {
            logger_1.default.info(`🚀 Server is running on ht tp://localhost:${PORT}`);
        });
        (0, websocket_1.setupWebSocket)(server);
        return server;
    }
    catch (error) {
        logger_1.default.error('❌ Failed to start server: ' + error.message);
        process.exit(1);
    }
}
startServer();
