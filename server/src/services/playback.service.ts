import { Room } from '../models/Room.model.js';
import type { IRoom } from '../models/Room.model.js';
import { AppError } from '../utils/errors.js';
import { normalizeRoomCode } from '../utils/identifiers.js';
import { extractYouTubeVideoId } from '../utils/youtube.js';
import type { PlaybackAction, PlaybackSyncPayload } from '../types/playback.types.js';

function assertDatabaseAvailable(): void {
  if (Room.db.readyState !== 1) {
    throw new AppError(503, 'Database unavailable');
  }
}

async function getRoomDocument(roomCode: string): Promise<IRoom> {
  assertDatabaseAvailable();

  const room = await Room.findOne({ roomCode: normalizeRoomCode(roomCode) });

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  if (!room.isActive || room.expiresAt < new Date()) {
    throw new AppError(410, 'Room is no longer active');
  }

  return room;
}

export function canControlPlayback(room: IRoom, guestId: string): boolean {
  if (room.settings.sharedControls) return true;
  return room.hostGuestId === guestId;
}

export function buildPlaybackSync(
  room: IRoom,
  actionBy: string,
  action: PlaybackAction = 'sync',
): PlaybackSyncPayload {
  return {
    isPlaying: room.playbackState.isPlaying,
    currentTime: room.playbackState.currentTime,
    playbackRate: room.playbackState.playbackRate,
    serverTimestamp: Date.now(),
    videoId: room.videoType === 'youtube' ? (room.videoSource ?? null) : null,
    action,
    actionBy,
  };
}

export async function getPlaybackSyncForRoom(
  roomCode: string,
  actionBy = 'server',
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);
  return buildPlaybackSync(room, actionBy, 'sync');
}

async function updatePlaybackState(
  room: IRoom,
  guestId: string,
  action: PlaybackAction,
  updates: {
    isPlaying?: boolean;
    currentTime: number;
    playbackRate?: number;
  },
): Promise<PlaybackSyncPayload> {
  if (!canControlPlayback(room, guestId)) {
    throw new AppError(403, 'You do not have permission to control playback');
  }

  room.playbackState.isPlaying = updates.isPlaying ?? room.playbackState.isPlaying;
  room.playbackState.currentTime = updates.currentTime;
  if (updates.playbackRate !== undefined) {
    room.playbackState.playbackRate = updates.playbackRate;
  }
  room.playbackState.updatedAt = new Date();

  await room.save();

  return buildPlaybackSync(room, guestId, action);
}

export async function handlePlay(
  roomCode: string,
  guestId: string,
  currentTime: number,
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);
  return updatePlaybackState(room, guestId, 'play', { isPlaying: true, currentTime });
}

export async function handlePause(
  roomCode: string,
  guestId: string,
  currentTime: number,
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);
  return updatePlaybackState(room, guestId, 'pause', { isPlaying: false, currentTime });
}

export async function handleSeek(
  roomCode: string,
  guestId: string,
  currentTime: number,
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);
  return updatePlaybackState(room, guestId, 'seek', { currentTime });
}

export async function handleRateChange(
  roomCode: string,
  guestId: string,
  currentTime: number,
  playbackRate: number,
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);
  return updatePlaybackState(room, guestId, 'rate', {
    currentTime,
    playbackRate,
  });
}

export async function handleChangeVideo(
  roomCode: string,
  guestId: string,
  videoSource: string,
): Promise<PlaybackSyncPayload> {
  const room = await getRoomDocument(roomCode);

  if (!canControlPlayback(room, guestId)) {
    throw new AppError(403, 'You do not have permission to control playback');
  }

  const videoId = extractYouTubeVideoId(videoSource);
  if (!videoId) {
    throw new AppError(400, 'Invalid YouTube URL or video ID');
  }

  room.videoType = 'youtube';
  room.videoSource = videoId;
  room.playbackState = {
    isPlaying: false,
    currentTime: 0,
    playbackRate: 1,
    updatedAt: new Date(),
  };

  await room.save();

  return buildPlaybackSync(room, guestId, 'change-video');
}
