import type { PresenceMember } from '../types/socket.types.js';

interface SocketPresence {
  socketId: string;
  guestId: string;
  nickname: string;
  role: PresenceMember['role'];
  connectedAt: Date;
}

class PresenceService {
  /** roomCode → guestId → presence (one guestId may only be online once) */
  private rooms = new Map<string, Map<string, SocketPresence>>();

  /** socketId → roomCode for fast disconnect cleanup */
  private socketIndex = new Map<string, { roomCode: string; guestId: string }>();

  addMember(
    roomCode: string,
    guestId: string,
    socketId: string,
    member: Omit<PresenceMember, 'guestId'> & { guestId: string },
  ): { previousSocketId?: string } {
    const normalizedCode = roomCode.toUpperCase();

    if (!this.rooms.has(normalizedCode)) {
      this.rooms.set(normalizedCode, new Map());
    }

    const roomPresence = this.rooms.get(normalizedCode)!;
    const existing = roomPresence.get(guestId);
    let previousSocketId: string | undefined;

    if (existing && existing.socketId !== socketId) {
      previousSocketId = existing.socketId;
      this.socketIndex.delete(existing.socketId);
    }

    roomPresence.set(guestId, {
      socketId,
      guestId,
      nickname: member.nickname,
      role: member.role,
      connectedAt: new Date(),
    });

    this.socketIndex.set(socketId, { roomCode: normalizedCode, guestId });

    return { previousSocketId };
  }

  removeBySocket(socketId: string): { roomCode: string; guestId: string } | null {
    const entry = this.socketIndex.get(socketId);
    if (!entry) return null;

    const roomPresence = this.rooms.get(entry.roomCode);
    if (roomPresence) {
      const member = roomPresence.get(entry.guestId);
      if (member?.socketId === socketId) {
        roomPresence.delete(entry.guestId);
      }
      if (roomPresence.size === 0) {
        this.rooms.delete(entry.roomCode);
      }
    }

    this.socketIndex.delete(socketId);
    return entry;
  }

  getOnlineGuestIds(roomCode: string): string[] {
    const roomPresence = this.rooms.get(roomCode.toUpperCase());
    if (!roomPresence) return [];
    return Array.from(roomPresence.keys());
  }

  getOnlineMembers(roomCode: string): PresenceMember[] {
    const roomPresence = this.rooms.get(roomCode.toUpperCase());
    if (!roomPresence) return [];
    return Array.from(roomPresence.values()).map(({ guestId, nickname, role }) => ({
      guestId,
      nickname,
      role,
    }));
  }

  isOnline(roomCode: string, guestId: string): boolean {
    return this.rooms.get(roomCode.toUpperCase())?.has(guestId) ?? false;
  }
}

export const presenceService = new PresenceService();
