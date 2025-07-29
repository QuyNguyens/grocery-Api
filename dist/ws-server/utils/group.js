"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToGroup = addToGroup;
exports.removeFromGroup = removeFromGroup;
exports.broadcastToGroup = broadcastToGroup;
exports.sendToUser = sendToUser;
exports.getUserGroup = getUserGroup;
// src/websocket/utils/groups.ts
const ws_1 = __importDefault(require("ws"));
const logger_1 = __importDefault(require("../../utils/logger"));
const groups = new Map();
function addToGroup(group, ws) {
    if (!groups.has(group)) {
        groups.set(group, new Set());
    }
    groups.get(group).add(ws);
}
function removeFromGroup(group, ws) {
    groups.get(group)?.delete(ws);
    if (groups.get(group)?.size === 0) {
        groups.delete(group);
    }
}
function broadcastToGroup(group, data) {
    const message = JSON.stringify(data);
    const clients = groups.get(group);
    if (!clients) {
        logger_1.default.error('token is not valid!!!');
        return;
    }
    for (const client of clients) {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    }
}
function sendToUser(userId, data) {
    broadcastToGroup(`user-${userId}`, data);
}
function getUserGroup(userId) {
    return `user-${userId}`;
}
