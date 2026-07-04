import type { Socket } from 'socket.io';
import { presenceService } from '../services/presence.service.js';
import { validateRoomMember } from '../services/room.service.js';
import { getPlaybackSyncForRoom } from '../services/playback.service.js';
import { isAppError } from '../utils/errors.js';
import { roomJoinPayloadSchema } from '../validators/socket.validator.js';
import { registerPlaybackHandlers } from './playback.socket.js';
import type { AppSocketServer } from '../config/socket.js';
import {
  socketRoomName,
  type ClientToServerEvents,
  type InterServerEvents,
  type ServerToClientEvents,
  type SocketData,
} from '../types/socket.types.js';

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function registerRoomHandlers(io: AppSocketServer, socket: AppSocket): void {
  registerPlaybackHandlers(io, socket);

  socket.on('room:join', async (payload) => {
    try {
      const parsed = roomJoinPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Invalid join payload' });
        return;
      }

      const { roomCode, guestId } = parsed.data;
      const { room, member } = await validateRoomMember(roomCode, guestId);

      const { previousSocketId } = presenceService.addMember(
        roomCode,
        guestId,
        socket.id,
        member,
      );

      if (previousSocketId) {
        const oldSocket = io.sockets.sockets.get(previousSocketId);
        oldSocket?.emit('room:error', { message: 'Connected from another tab' });
        oldSocket?.disconnect(true);
      }

      socket.data.roomCode = room.roomCode;
      socket.data.guestId = guestId;
      socket.data.nickname = member.nickname;
      socket.data.role = member.role;

      const channel = socketRoomName(room.roomCode);
      await socket.join(channel);

      const onlineGuestIds = presenceService.getOnlineGuestIds(room.roomCode);

      socket.emit('room:joined', {
        roomCode: room.roomCode,
        member,
        onlineGuestIds,
      });

      socket.emit('presence:sync', { onlineGuestIds });

      io.to(channel).emit('room:members-sync', {
        members: room.members,
        memberCount: room.memberCount,
      });

      socket.to(channel).emit('member:online', member);

      const playbackSync = await getPlaybackSyncForRoom(room.roomCode, guestId);
      socket.emit('playback:sync', playbackSync);
    } catch (error) {
      const message = isAppError(error)
        ? error.message
        : 'Failed to join room';
      socket.emit('room:error', { message });
    }
  });

  socket.on('room:leave', () => {
    handleDisconnect(io, socket, false);
  });

  socket.on('disconnect', () => {
    handleDisconnect(io, socket, true);
  });
}

function handleDisconnect(io: AppSocketServer, socket: AppSocket, isDisconnect: boolean): void {
  const removed = presenceService.removeBySocket(socket.id);
  if (!removed) return;

  const channel = socketRoomName(removed.roomCode);

  if (isDisconnect) {
    socket.to(channel).emit('member:offline', { guestId: removed.guestId });
  } else {
    io.to(channel).emit('member:offline', { guestId: removed.guestId });
    socket.leave(channel);
  }
}
