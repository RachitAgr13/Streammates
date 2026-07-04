import { z } from 'zod';

const timeSchema = z.number().min(0).max(86400);

export const playbackControlSchema = z.object({
  currentTime: timeSchema,
});

export const playbackRateSchema = z.object({
  currentTime: timeSchema,
  playbackRate: z.number().min(0.25).max(2),
});

export const playbackChangeVideoSchema = z.object({
  videoId: z.string().trim().min(1),
});

export const playbackChangeVideoFromUrlSchema = z.object({
  url: z.string().trim().min(1),
});
