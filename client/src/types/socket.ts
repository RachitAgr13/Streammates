import type { MemberRole } from './room';

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
  'playback:sync': (data: import('./playback').PlaybackSyncPayload) => void;
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

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
