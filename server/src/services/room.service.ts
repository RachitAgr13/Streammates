import { Room } from '../models/Room.model.js';
import { AppError } from '../utils/errors.js';
import { generateGuestId, generateRoomCode, normalizeRoomCode } from '../utils/identifiers.js';
import { buildInviteLink, toRoomPublicResponse } from '../utils/roomMapper.js';
import type { CreateRoomInput, JoinRoomInput } from '../validators/room.validator.js';
import type { CreateRoomResult, JoinRoomResult } from '../types/room.types.js';

const MAX_CODE_RETRIES = 5;

function assertDatabaseAvailable(): void {
  if (Room.db.readyState !== 1) {
    throw new AppError(503, 'Database unavailable. Please try again later.');
  }
}

function assertRoomAccessible(room: InstanceType<typeof Room>): void {
  if (!room.isActive) {
    throw new AppError(410, 'This room is no longer active');
  }

  if (room.expiresAt < new Date()) {
    throw new AppError(410, 'This room has expired');
  }
}

function extractYouTubeVideoId(source: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function resolveVideoFields(videoType?: string, videoSource?: string) {
  if (!videoType || !videoSource) {
    return { videoType: undefined, videoSource: undefined };
  }

  if (videoType === 'youtube') {
    const videoId = extractYouTubeVideoId(videoSource);
    if (!videoId) {
      throw new AppError(400, 'Invalid YouTube URL or video ID');
    }
    return { videoType: 'youtube' as const, videoSource: videoId };
  }

  return { videoType: videoType as 'local', videoSource };
}

export async function createRoom(input: CreateRoomInput): Promise<CreateRoomResult> {
  assertDatabaseAvailable();

  const hostGuestId = generateGuestId();
  const video = resolveVideoFields(input.videoType, input.videoSource);

  for (let attempt = 0; attempt < MAX_CODE_RETRIES; attempt++) {
    const roomCode = generateRoomCode();

    try {
      const room = await Room.create({
        roomCode,
        name: input.name,
        hostGuestId,
        visibility: 'private',
        ...video,
        members: [
          {
            guestId: hostGuestId,
            nickname: input.nickname,
            role: 'host',
            joinedAt: new Date(),
          },
        ],
      });

      return {
        room: toRoomPublicResponse(room),
        guestId: hostGuestId,
        inviteLink: buildInviteLink(room.roomCode),
      };
    } catch (error) {
      const isDuplicateCode =
        error instanceof Error &&
        'code' in error &&
        (error as { code?: number }).code === 11000;

      if (!isDuplicateCode || attempt === MAX_CODE_RETRIES - 1) {
        throw error;
      }
    }
  }

  throw new AppError(500, 'Failed to generate a unique room code');
}

export async function getRoomByCode(code: string) {
  assertDatabaseAvailable();

  const roomCode = normalizeRoomCode(code);
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  assertRoomAccessible(room);

  return toRoomPublicResponse(room);
}

export async function joinRoom(code: string, input: JoinRoomInput): Promise<JoinRoomResult> {
  assertDatabaseAvailable();

  const roomCode = normalizeRoomCode(code);
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  assertRoomAccessible(room);

  if (input.guestId && room.bannedGuestIds.includes(input.guestId)) {
    throw new AppError(403, 'You have been banned from this room');
  }

  const existingMember = input.guestId
    ? room.members.find((m) => m.guestId === input.guestId)
    : undefined;

  if (existingMember) {
    if (room.bannedGuestIds.includes(existingMember.guestId)) {
      throw new AppError(403, 'You have been banned from this room');
    }

    existingMember.nickname = input.nickname;
    await room.save();

    return {
      room: toRoomPublicResponse(room),
      guestId: existingMember.guestId,
      member: {
        guestId: existingMember.guestId,
        nickname: existingMember.nickname,
        role: existingMember.role,
      },
    };
  }

  if (room.members.length >= room.settings.maxMembers) {
    throw new AppError(403, 'This room is full');
  }

  const guestId = generateGuestId();

  room.members.push({
    guestId,
    nickname: input.nickname,
    role: 'guest',
    joinedAt: new Date(),
  });

  await room.save();

  const member = room.members.find((m) => m.guestId === guestId)!;

  return {
    room: toRoomPublicResponse(room),
    guestId,
    member: {
      guestId: member.guestId,
      nickname: member.nickname,
      role: member.role,
    },
  };
}

export async function validateRoomMember(roomCode: string, guestId: string) {
  assertDatabaseAvailable();

  const normalizedCode = normalizeRoomCode(roomCode);
  const room = await Room.findOne({ roomCode: normalizedCode });

  if (!room) {
    throw new AppError(404, 'Room not found');
  }

  assertRoomAccessible(room);

  if (room.bannedGuestIds.includes(guestId)) {
    throw new AppError(403, 'You are banned from this room');
  }

  const member = room.members.find((m) => m.guestId === guestId);

  if (!member) {
    throw new AppError(403, 'You are not a member of this room');
  }

  return {
    room: toRoomPublicResponse(room),
    member: {
      guestId: member.guestId,
      nickname: member.nickname,
      role: member.role,
    },
  };
}
