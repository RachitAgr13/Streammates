import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Room } from '@/types/room';

interface GuestSession {
  guestId: string;
  nickname: string;
}

interface GuestStore {
  sessions: Record<string, GuestSession>;
  setSession: (roomCode: string, guestId: string, nickname: string) => void;
  getSession: (roomCode: string) => GuestSession | undefined;
  clearSession: (roomCode: string) => void;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      setSession: (roomCode, guestId, nickname) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [roomCode.toUpperCase()]: { guestId, nickname },
          },
        })),
      getSession: (roomCode) => get().sessions[roomCode.toUpperCase()],
      clearSession: (roomCode) =>
        set((state) => {
          const sessions = { ...state.sessions };
          delete sessions[roomCode.toUpperCase()];
          return { sessions };
        }),
    }),
    { name: 'streammates-guest' },
  ),
);

interface RoomStore {
  currentRoom: Room | null;
  inviteLink: string | null;
  setRoom: (room: Room, inviteLink?: string) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  inviteLink: null,
  setRoom: (room, inviteLink) =>
    set({
      currentRoom: room,
      inviteLink: inviteLink ?? `${window.location.origin}/room/${room.roomCode}`,
    }),
  clearRoom: () => set({ currentRoom: null, inviteLink: null }),
}));
