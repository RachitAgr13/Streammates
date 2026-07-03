import { z } from 'zod';

export const roomJoinPayloadSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .length(6, 'Room code must be 6 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Invalid room code'),
  guestId: z.string().uuid('Invalid guest ID'),
});

export type RoomJoinPayload = z.infer<typeof roomJoinPayloadSchema>;
