"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToUser = exports.broadcastToGroup = void 0;
exports.setupWebSocket = setupWebSocket;
// src/websocket/index.ts
const ws_1 = require("ws");
const auth_1 = require("../utils/auth");
const group_1 = require("./utils/group");
Object.defineProperty(exports, "broadcastToGroup", { enumerable: true, get: function () { return group_1.broadcastToGroup; } });
Object.defineProperty(exports, "sendToUser", { enumerable: true, get: function () { return group_1.sendToUser; } });
const logger_1 = __importDefault(require("../utils/logger"));
function setupWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws, req) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const token = url.searchParams.get('token');
        const userId = (0, auth_1.verifyTokenForSocket)(token || '');
        if (!userId) {
            ws.close();
            return;
        }
        ws.userId = userId;
        (0, group_1.addToGroup)(`user-${userId}`, ws);
        logger_1.default.info(`🔌 User ${userId} connected via WebSocket`);
        ws.on('message', msg => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.joinGroup) {
                    (0, group_1.addToGroup)(data.joinGroup, ws);
                }
            }
            catch (err) {
                logger_1.default.error('Error parsing message:', err);
            }
        });
        ws.on('close', () => {
            (0, group_1.removeFromGroup)(`user-${userId}`, ws);
            logger_1.default.info(`❌ User ${userId} disconnected`);
        });
    });
}
