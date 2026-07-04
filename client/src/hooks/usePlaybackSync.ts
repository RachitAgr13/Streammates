import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from '@/services/socket';
import type { PlaybackSyncPayload } from '@/types/playback';
import type { YouTubePlayerHandle } from '@/components/room/YouTubePlayer';
import { computeTargetTime, shouldResync } from '@/utils/playback';
import { extractYouTubeVideoId } from '@/utils/youtube';

interface UsePlaybackSyncOptions {
  enabled: boolean;
  canControl: boolean;
  guestId: string | undefined;
  playerRef: React.RefObject<YouTubePlayerHandle | null>;
  onVideoChange?: (videoId: string) => void;
}

export function usePlaybackSync({
  enabled,
  canControl,
  guestId,
  playerRef,
  onVideoChange,
}: UsePlaybackSyncOptions) {
  const [syncState, setSyncState] = useState<PlaybackSyncPayload | null>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isApplyingRemote = useRef(false);
  const lastSyncRef = useRef<PlaybackSyncPayload | null>(null);
  const pendingSyncRef = useRef<PlaybackSyncPayload | null>(null);

  const applySync = useCallback(
    (payload: PlaybackSyncPayload) => {
      const player = playerRef.current;
      if (!player?.isReady()) {
        pendingSyncRef.current = payload;
        return;
      }

      isApplyingRemote.current = true;
      lastSyncRef.current = payload;
      setSyncState(payload);

      if (payload.action === 'change-video' && payload.videoId) {
        onVideoChange?.(payload.videoId);
        player.loadVideoById(payload.videoId, payload.currentTime);
      }

      const targetTime = computeTargetTime(payload);
      player.setPlaybackRate(payload.playbackRate);
      player.seekTo(targetTime);

      if (payload.isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }

      setDisplayTime(targetTime);

      window.setTimeout(() => {
        isApplyingRemote.current = false;
      }, 400);
    },
    [playerRef, onVideoChange],
  );

  const handlePlayerReady = useCallback(() => {
    if (pendingSyncRef.current) {
      const pending = pendingSyncRef.current;
      pendingSyncRef.current = null;
      applySync(pending);
    } else if (lastSyncRef.current) {
      applySync(lastSyncRef.current);
    }
  }, [applySync]);

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();

    const onSync = (payload: PlaybackSyncPayload) => {
      if (
        payload.actionBy === guestId &&
        canControl &&
        payload.action !== 'sync' &&
        payload.action !== 'change-video'
      ) {
        lastSyncRef.current = payload;
        setSyncState(payload);
        return;
      }

      applySync(payload);
    };

    socket.on('playback:sync', onSync);

    return () => {
      socket.off('playback:sync', onSync);
    };
  }, [enabled, guestId, canControl, applySync]);

  const emitPlay = useCallback(() => {
    if (!canControl || isApplyingRemote.current) return;
    const currentTime = playerRef.current?.getCurrentTime() ?? 0;
    getSocket().emit('playback:play', { currentTime });
    playerRef.current?.playVideo();
  }, [canControl, playerRef]);

  const emitPause = useCallback(() => {
    if (!canControl || isApplyingRemote.current) return;
    const currentTime = playerRef.current?.getCurrentTime() ?? 0;
    getSocket().emit('playback:pause', { currentTime });
    playerRef.current?.pauseVideo();
  }, [canControl, playerRef]);

  const emitSeek = useCallback(
    (currentTime: number) => {
      if (!canControl || isApplyingRemote.current) return;
      getSocket().emit('playback:seek', { currentTime });
      playerRef.current?.seekTo(currentTime);
    },
    [canControl, playerRef],
  );

  const emitRate = useCallback(
    (playbackRate: number) => {
      if (!canControl || isApplyingRemote.current) return;
      const currentTime = playerRef.current?.getCurrentTime() ?? 0;
      getSocket().emit('playback:rate', { currentTime, playbackRate });
      playerRef.current?.setPlaybackRate(playbackRate);
    },
    [canControl, playerRef],
  );

  const emitChangeVideo = useCallback(
    (urlOrId: string) => {
      if (!canControl) return;
      const videoId = extractYouTubeVideoId(urlOrId);
      if (!videoId) return;
      getSocket().emit('playback:change-video', { videoId });
    },
    [canControl],
  );

  const togglePlayPause = useCallback(() => {
    if (syncState?.isPlaying) {
      emitPause();
    } else {
      emitPlay();
    }
  }, [syncState?.isPlaying, emitPlay, emitPause]);

  useEffect(() => {
    if (!enabled) return;

    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.isReady()) return;

      const current = player.getCurrentTime();
      const dur = player.getDuration();
      setDisplayTime(current);
      if (dur > 0) setDuration(dur);

      if (!canControl && lastSyncRef.current?.isPlaying) {
        const target = computeTargetTime(lastSyncRef.current);
        if (shouldResync(current, target)) {
          applySync(lastSyncRef.current);
        }
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [enabled, canControl, playerRef, applySync]);

  return {
    syncState,
    displayTime,
    duration,
    isPlaying: syncState?.isPlaying ?? false,
    playbackRate: syncState?.playbackRate ?? 1,
    canControl,
    emitPlay,
    emitPause,
    emitSeek,
    emitRate,
    emitChangeVideo,
    togglePlayPause,
    handlePlayerReady,
  };
}
