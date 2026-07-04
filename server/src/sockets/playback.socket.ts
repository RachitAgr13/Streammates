import type { Socket } from 'socket.io';
import * as playbackService from '../services/playback.service.js';
import { isAppError } from '../utils/errors.js';
import type { PlaybackSyncPayload } from '../types/playback.types.js';
import {
  playbackChangeVideoSchema,
  playbackControlSchema,
  playbackRateSchema,
} from '../validators/playback.validator.js';
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

export function registerPlaybackHandlers(io: AppSocketServer, socket: AppSocket): void {
  socket.on('playback:play', async (payload) => {
    await handlePlaybackAction(socket, io, async () => {
      const parsed = playbackControlSchema.safeParse(payload);
      if (!parsed.success) throw new Error('Invalid payload');
      return playbackService.handlePlay(
        socket.data.roomCode!,
        socket.data.guestId!,
        parsed.data.currentTime,
      );
    });
  });

  socket.on('playback:pause', async (payload) => {
    await handlePlaybackAction(socket, io, async () => {
      const parsed = playbackControlSchema.safeParse(payload);
      if (!parsed.success) throw new Error('Invalid payload');
      return playbackService.handlePause(
        socket.data.roomCode!,
        socket.data.guestId!,
        parsed.data.currentTime,
      );
    });
  });

  socket.on('playback:seek', async (payload) => {
    await handlePlaybackAction(socket, io, async () => {
      const parsed = playbackControlSchema.safeParse(payload);
      if (!parsed.success) throw new Error('Invalid payload');
      return playbackService.handleSeek(
        socket.data.roomCode!,
        socket.data.guestId!,
        parsed.data.currentTime,
      );
    });
  });

  socket.on('playback:rate', async (payload) => {
    await handlePlaybackAction(socket, io, async () => {
      const parsed = playbackRateSchema.safeParse(payload);
      if (!parsed.success) throw new Error('Invalid payload');
      return playbackService.handleRateChange(
        socket.data.roomCode!,
        socket.data.guestId!,
        parsed.data.currentTime,
        parsed.data.playbackRate,
      );
    });
  });

  socket.on('playback:change-video', async (payload) => {
    await handlePlaybackAction(socket, io, async () => {
      const parsed = playbackChangeVideoSchema.safeParse(payload);
      if (!parsed.success) throw new Error('Invalid payload');
      return playbackService.handleChangeVideo(
        socket.data.roomCode!,
        socket.data.guestId!,
        parsed.data.videoId,
      );
    });
  });
}

async function handlePlaybackAction(
  socket: AppSocket,
  io: AppSocketServer,
  action: () => Promise<PlaybackSyncPayload>,
): Promise<void> {
  try {
    if (!socket.data.roomCode || !socket.data.guestId) {
      socket.emit('room:error', { message: 'Join the room before controlling playback' });
      return;
    }

    const syncPayload = await action();
    const channel = socketRoomName(socket.data.roomCode);
    io.to(channel).emit('playback:sync', syncPayload);
  } catch (error) {
    const message = isAppError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Playback action failed';
    socket.emit('room:error', { message });
  }
}
