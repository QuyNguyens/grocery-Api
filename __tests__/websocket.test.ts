import WebSocket from 'ws';
import http from 'http';
import app from '../src/app';
import { setupWebSocket } from '../src/ws-server/websocket';
import { broadcastToGroup } from '../src/ws-server/utils/group';

let server: http.Server;

beforeAll(done => {
  server = http.createServer(app);
  setupWebSocket(server);
  server.listen(4001, done);
});

afterAll(done => {
  server.close(done);
});

describe('🔌 WebSocket Connection', () => {
  it('should connect and receive broadcast message', done => {
    const ws = new WebSocket('ws://localhost:4001?token=user123-token');

    ws.on('open', () => {
      // Kết nối thành công
    });

    ws.on('message', data => {
      const msg = JSON.parse(data.toString());
      expect(msg).toEqual({ type: 'TEST', message: 'Hello WebSocket' });
      ws.close();
      done(); // báo với Jest là test này hoàn tất
    });

    ws.on('close', () => {
      // Đóng kết nối (nếu cần xử lý)
    });

    // Đợi 500ms rồi broadcast
    setTimeout(() => {
      broadcastToGroup('user-user123', { type: 'TEST', message: 'Hello WebSocket' });
    }, 500);
  });
});
