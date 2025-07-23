import app from './app';
import { initRabbitMQConsumers } from './queue';
import { setupWebSocket } from './ws-server/websocket';
import logger from './utils/logger';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Kết nối MongoDB
    await connectToDatabase();

    // Khởi động RabbitMQ Consumers
    await initRabbitMQConsumers();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });

    setupWebSocket(server);

    return server;
  } catch (error) {
    logger.error('❌ Failed to start server: ' + (error as Error).message);
    process.exit(1);
  }
}

startServer();
