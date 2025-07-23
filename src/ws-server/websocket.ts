// src/websocket/index.ts
import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { verifyTokenForSocket } from '../utils/auth';
import { addToGroup, removeFromGroup, broadcastToGroup, sendToUser } from './utils/group';
import logger from '../utils/logger';

interface ExtWebSocket extends WebSocket {
  userId?: string;
}

export function setupWebSocket(server: import('http').Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: ExtWebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    const userId = verifyTokenForSocket(token || '');
    if (!userId) {
      ws.close();
      return;
    }

    ws.userId = userId;
    addToGroup(`user-${userId}`, ws);

    logger.info(`🔌 User ${userId} connected via WebSocket`);

    ws.on('message', msg => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.joinGroup) {
          addToGroup(data.joinGroup, ws);
        }
      } catch (err) {
        logger.error('Error parsing message:', err);
      }
    });

    ws.on('close', () => {
      removeFromGroup(`user-${userId}`, ws);
      logger.info(`❌ User ${userId} disconnected`);
    });
  });
}

export { broadcastToGroup, sendToUser };
