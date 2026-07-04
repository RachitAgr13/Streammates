import { useState } from 'react';
import { PLAYBACK_RATES } from '@/utils/playback';
import { formatTime } from '@/utils/youtube';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  canControl: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRateChange: (rate: number) => void;
}

export function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  canControl,
  onTogglePlay,
  onSeek,
  onRateChange,
}: PlaybackControlsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const shownTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (shownTime / duration) * 100 : 0;

  function commitSeek(value: number) {
    setIsDragging(false);
    onSeek(value);
  }

  return (
    <div className="border-t border-white/5 p-4">
      <div className="flex items-center gap-4">
        {canControl ? (
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-violet/20 text-accent-violet transition-colors hover:bg-accent-violet/30"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/40">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </div>
        )}

        <span className="w-12 shrink-0 text-xs text-white/50 tabular-nums">
          {formatTime(shownTime)}
        </span>

        {canControl ? (
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={shownTime}
            onPointerDown={() => {
              setIsDragging(true);
              setDragTime(shownTime);
            }}
            onChange={(e) => setDragTime(Number(e.target.value))}
            onMouseUp={(e) => {
              if (isDragging) commitSeek(Number((e.target as HTMLInputElement).value));
            }}
            onTouchEnd={(e) => {
              if (isDragging) commitSeek(Number((e.target as HTMLInputElement).value));
            }}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-stream-700 accent-accent-violet"
          />
        ) : (
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-stream-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <span className="w-12 shrink-0 text-right text-xs text-white/50 tabular-nums">
          {formatTime(duration)}
        </span>

        {canControl && (
          <select
            value={playbackRate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            className="rounded-lg bg-stream-800 px-2 py-1 text-xs text-white/70 outline-none"
            aria-label="Playback speed"
          >
            {PLAYBACK_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        )}
      </div>

      {!canControl && (
        <p className="mt-2 text-center text-xs text-white/30">Host controls playback</p>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}
