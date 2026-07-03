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
}

export interface ClientToServerEvents {
  'room:join': (payload: RoomJoinPayload) => void;
  'room:leave': () => void;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
