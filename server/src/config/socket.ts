import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from './env.js';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types/socket.types.js';
import { registerRoomHandlers } from '../sockets/room.socket.js';

export type AppSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function initSocketServer(httpServer: HttpServer): AppSocketServer {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.on('connection', (socket) => {
    registerRoomHandlers(io, socket);
  });

  console.log('Socket.IO initialized');

  return io;
}
