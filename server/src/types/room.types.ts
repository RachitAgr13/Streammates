export type MemberRole = 'host' | 'moderator' | 'guest';
export type VideoType = 'youtube' | 'local';
export type RoomVisibility = 'public' | 'private';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  updatedAt: Date;
}

export interface RoomMember {
  guestId: string;
  userId?: string;
  nickname: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface RoomSettings {
  sharedControls: boolean;
  maxMembers: number;
}

export interface RoomDocument {
  _id: string;
  roomCode: string;
  name: string;
  hostGuestId: string;
  hostUserId?: string;
  visibility: RoomVisibility;
  videoType?: VideoType;
  videoSource?: string;
  playbackState: PlaybackState;
  settings: RoomSettings;
  members: RoomMember[];
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface RoomPublicResponse {
  id: string;
  roomCode: string;
  name: string;
  hostGuestId: string;
  visibility: RoomVisibility;
  videoType?: VideoType;
  videoSource?: string;
  playbackState: PlaybackState;
  settings: RoomSettings;
  members: Array<{
    guestId: string;
    nickname: string;
    role: MemberRole;
    joinedAt: string;
  }>;
  memberCount: number;
  createdAt: string;
}

export interface CreateRoomResult {
  room: RoomPublicResponse;
  guestId: string;
  inviteLink: string;
}

export interface JoinRoomResult {
  room: RoomPublicResponse;
  guestId: string;
  member: {
    guestId: string;
    nickname: string;
    role: MemberRole;
  };
}
