import { z } from 'zod';

export const createRoomSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Room name must be at least 2 characters')
      .max(80, 'Room name must be at most 80 characters'),
    nickname: z
      .string()
      .trim()
      .min(2, 'Nickname must be at least 2 characters')
      .max(30, 'Nickname must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_\-\s]+$/, 'Nickname contains invalid characters'),
    videoType: z.enum(['youtube', 'local']).optional(),
    videoSource: z.string().trim().optional(),
  }),
});

export const roomCodeParamSchema = z.object({
  params: z.object({
    code: z
      .string()
      .trim()
      .length(6, 'Room code must be 6 characters')
      .regex(/^[A-Za-z0-9]+$/, 'Invalid room code format'),
  }),
});

export const joinRoomSchema = z.object({
  params: z.object({
    code: z
      .string()
      .trim()
      .length(6, 'Room code must be 6 characters')
      .regex(/^[A-Za-z0-9]+$/, 'Invalid room code format'),
  }),
  body: z.object({
    nickname: z
      .string()
      .trim()
      .min(2, 'Nickname must be at least 2 characters')
      .max(30, 'Nickname must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_\-\s]+$/, 'Nickname contains invalid characters'),
    guestId: z.string().uuid('Invalid guest ID').optional(),
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>['body'];
export type JoinRoomInput = z.infer<typeof joinRoomSchema>['body'];
