import type { IRoom } from '../models/Room.model.js';
import type { RoomPublicResponse } from '../types/room.types.js';
import { env } from '../config/env.js';

export function toRoomPublicResponse(room: IRoom): RoomPublicResponse {
  return {
    id: room._id.toString(),
    roomCode: room.roomCode,
    name: room.name,
    hostGuestId: room.hostGuestId,
    visibility: room.visibility,
    videoType: room.videoType,
    videoSource: room.videoSource,
    playbackState: room.playbackState,
    settings: room.settings,
    members: room.members.map((m) => ({
      guestId: m.guestId,
      nickname: m.nickname,
      role: m.role,
      joinedAt: m.joinedAt.toISOString(),
    })),
    memberCount: room.members.length,
    createdAt: room.createdAt.toISOString(),
  };
}

export function buildInviteLink(roomCode: string): string {
  return `${env.CLIENT_URL}/room/${roomCode}`;
}
