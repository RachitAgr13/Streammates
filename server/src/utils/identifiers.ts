import crypto from 'crypto';

/** Excludes ambiguous characters: 0/O, 1/I/L */
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(length = 6): string {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => CHARSET[byte % CHARSET.length]).join('');
}

export function generateGuestId(): string {
  return crypto.randomUUID();
}

export function normalizeRoomCode(code: string): string {
  return code.trim().toUpperCase();
}
