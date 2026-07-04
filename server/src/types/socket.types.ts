import type { MemberRole } from './room.types.js';
import type { PlaybackSyncPayload } from './playback.types.js';

export interface PresenceMember {
  guestId: string;
  nickname: string;
  role: MemberRole;
}

export interface RoomJoinPayload {
  roomCode: string;
  guestId: string;
}

export interface ServerToClientEvents {
  'room:joined': (data: {
    roomCode: string;
    member: PresenceMember;
    onlineGuestIds: string[];
  }) => void;
  'presence:sync': (data: { onlineGuestIds: string[] }) => void;
  'room:members-sync': (data: {
    members: Array<{
      guestId: string;
      nickname: string;
      role: MemberRole;
      joinedAt: string;
    }>;
    memberCount: number;
  }) => void;
  'member:online': (data: PresenceMember) => void;
  'member:offline': (data: { guestId: string }) => void;
  'room:error': (data: { message: string }) => void;
  'playback:sync': (data: PlaybackSyncPayload) => void;
}

export interface ClientToServerEvents {
  'room:join': (payload: RoomJoinPayload) => void;
  'room:leave': () => void;
  'playback:play': (payload: { currentTime: number }) => void;
  'playback:pause': (payload: { currentTime: number }) => void;
  'playback:seek': (payload: { currentTime: number }) => void;
  'playback:rate': (payload: { currentTime: number; playbackRate: number }) => void;
  'playback:change-video': (payload: { videoId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomCode?: string;
  guestId?: string;
  nickname?: string;
  role?: MemberRole;
}

export function socketRoomName(roomCode: string): string {
  return `room:${roomCode.toUpperCase()}`;
}
