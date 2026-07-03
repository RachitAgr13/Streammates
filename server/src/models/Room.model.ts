import mongoose, { Schema, type Document } from 'mongoose';
import type { MemberRole, PlaybackState, RoomSettings, VideoType, RoomVisibility } from '../types/room.types.js';

export interface IRoomMember {
  guestId: string;
  userId?: mongoose.Types.ObjectId;
  nickname: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface IRoom extends Document {
  roomCode: string;
  name: string;
  hostGuestId: string;
  hostUserId?: mongoose.Types.ObjectId;
  visibility: RoomVisibility;
  videoType?: VideoType;
  videoSource?: string;
  playbackState: PlaybackState;
  settings: RoomSettings;
  members: IRoomMember[];
  bannedGuestIds: string[];
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const memberSchema = new Schema<IRoomMember>(
  {
    guestId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    nickname: { type: String, required: true, trim: true, maxlength: 30 },
    role: { type: String, enum: ['host', 'moderator', 'guest'], default: 'guest' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const playbackStateSchema = new Schema<PlaybackState>(
  {
    isPlaying: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
    playbackRate: { type: Number, default: 1 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const roomSchema = new Schema<IRoom>(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    hostGuestId: { type: String, required: true },
    hostUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    videoType: { type: String, enum: ['youtube', 'local'] },
    videoSource: { type: String, trim: true },
    playbackState: { type: playbackStateSchema, default: () => ({}) },
    settings: {
      sharedControls: { type: Boolean, default: false },
      maxMembers: { type: Number, default: 50, min: 2, max: 100 },
    },
    members: { type: [memberSchema], default: [] },
    bannedGuestIds: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

roomSchema.index({ isActive: 1, visibility: 1 });
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Room = mongoose.model<IRoom>('Room', roomSchema);
