export type PlaybackAction = 'play' | 'pause' | 'seek' | 'rate' | 'change-video' | 'sync';

export interface PlaybackSyncPayload {
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  serverTimestamp: number;
  videoId: string | null;
  action: PlaybackAction;
  actionBy: string;
}

export interface PlaybackControlPayload {
  currentTime: number;
}

export interface PlaybackRatePayload {
  currentTime: number;
  playbackRate: number;
}

export interface PlaybackChangeVideoPayload {
  videoId: string;
  currentTime?: number;
}
