// src/websocket/utils/groups.ts
import WebSocket from 'ws';
import logger from '../../utils/logger';

const groups = new Map<string, Set<WebSocket>>();

export function addToGroup(group: string, ws: WebSocket) {
  if (!groups.has(group)) {
    groups.set(group, new Set());
  }
  groups.get(group)!.add(ws);
}

export function removeFromGroup(group: string, ws: WebSocket) {
  groups.get(group)?.delete(ws);
  if (groups.get(group)?.size === 0) {
    groups.delete(group);
  }
}

export function broadcastToGroup(group: string, data: unknown) {
  const message = JSON.stringify(data);
  const clients = groups.get(group);
  if (!clients) {
    logger.error('token is not valid!!!');
    return;
  }

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

export function sendToUser(userId: string, data: unknown) {
  broadcastToGroup(`user-${userId}`, data);
}

export function getUserGroup(userId: string): string {
  return `user-${userId}`;
}
