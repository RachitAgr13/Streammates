export type MemberRole = 'host' | 'moderator' | 'guest';
export type VideoType = 'youtube' | 'local';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  updatedAt: string;
}

export interface RoomMember {
  guestId: string;
  nickname: string;
  role: MemberRole;
  joinedAt: string;
}

export interface RoomSettings {
  sharedControls: boolean;
  maxMembers: number;
}

export interface Room {
  id: string;
  roomCode: string;
  name: string;
  hostGuestId: string;
  visibility: 'public' | 'private';
  videoType?: VideoType;
  videoSource?: string;
  playbackState: PlaybackState;
  settings: RoomSettings;
  members: RoomMember[];
  memberCount: number;
  createdAt: string;
}

export interface CreateRoomPayload {
  name: string;
  nickname: string;
  videoType?: VideoType;
  videoSource?: string;
}

export interface JoinRoomPayload {
  nickname: string;
  guestId?: string;
}

export interface CreateRoomResponse {
  success: true;
  data: {
    room: Room;
    guestId: string;
    inviteLink: string;
  };
}

export interface GetRoomResponse {
  success: true;
  data: {
    room: Room;
  };
}

export interface JoinRoomResponse {
  success: true;
  data: {
    room: Room;
    guestId: string;
    member: {
      guestId: string;
      nickname: string;
      role: MemberRole;
    };
  };
}
