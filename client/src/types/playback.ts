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
