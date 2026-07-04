import type { PlaybackSyncPayload } from '@/types/playback';

const DRIFT_THRESHOLD_SECONDS = 2;

export function computeTargetTime(state: PlaybackSyncPayload, now = Date.now()): number {
  if (!state.isPlaying) {
    return state.currentTime;
  }

  const elapsed = (now - state.serverTimestamp) / 1000;
  return state.currentTime + elapsed * state.playbackRate;
}

export function shouldResync(
  playerTime: number,
  targetTime: number,
  threshold = DRIFT_THRESHOLD_SECONDS,
): boolean {
  return Math.abs(playerTime - targetTime) > threshold;
}

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
