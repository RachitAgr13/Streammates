import { apiFetch } from './api';
import type {
  CreateRoomPayload,
  CreateRoomResponse,
  GetRoomResponse,
  JoinRoomPayload,
  JoinRoomResponse,
} from '@/types/room';

export async function createRoom(payload: CreateRoomPayload) {
  return apiFetch<CreateRoomResponse>('/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getRoom(code: string) {
  return apiFetch<GetRoomResponse>(`/rooms/${code.toUpperCase()}`);
}

export async function joinRoom(code: string, payload: JoinRoomPayload) {
  return apiFetch<JoinRoomResponse>(`/rooms/${code.toUpperCase()}/join`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
