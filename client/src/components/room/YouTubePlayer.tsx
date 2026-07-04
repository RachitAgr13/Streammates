import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { loadYouTubeApi } from '@/lib/loadYouTubeApi';

export interface YouTubePlayerHandle {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  isReady: () => boolean;
}

interface YouTubePlayerProps {
  videoId: string | null;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({ videoId, onReady, onStateChange }, ref) => {
    const containerId = useId().replace(/:/g, '');
    const playerRef = useRef<YT.Player | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);
    const onReadyRef = useRef(onReady);
    const onStateChangeRef = useRef(onStateChange);

    onReadyRef.current = onReady;
    onStateChangeRef.current = onStateChange;

    useImperativeHandle(ref, () => ({
      playVideo: () => playerRef.current?.playVideo(),
      pauseVideo: () => playerRef.current?.pauseVideo(),
      seekTo: (seconds) => playerRef.current?.seekTo(seconds, true),
      getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
      getDuration: () => playerRef.current?.getDuration() ?? 0,
      getPlayerState: () => playerRef.current?.getPlayerState() ?? YT.PlayerState.UNSTARTED,
      setPlaybackRate: (rate) => playerRef.current?.setPlaybackRate(rate),
      getPlaybackRate: () => playerRef.current?.getPlaybackRate() ?? 1,
      loadVideoById: (id, startSeconds = 0) =>
        playerRef.current?.loadVideoById(id, startSeconds),
      isReady: () => playerRef.current !== null,
    }));

    useEffect(() => {
      let cancelled = false;

      loadYouTubeApi()
        .then(() => {
          if (!cancelled) setIsApiReady(true);
        })
        .catch(console.error);

      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      if (!isApiReady || !videoId) return;

      playerRef.current?.destroy();
      playerRef.current = null;

      playerRef.current = new YT.Player(containerId, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          disablekb: 1,
        },
        events: {
          onReady: () => onReadyRef.current?.(),
          onStateChange: (event) => onStateChangeRef.current?.(event.data),
        },
      });

      return () => {
        playerRef.current?.destroy();
        playerRef.current = null;
      };
    }, [isApiReady, videoId, containerId]);

    if (!videoId) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-stream-900 text-white/40">
          No video loaded
        </div>
      );
    }

    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <div id={containerId} className="absolute inset-0 h-full w-full" />
      </div>
    );
  },
);

YouTubePlayer.displayName = 'YouTubePlayer';
