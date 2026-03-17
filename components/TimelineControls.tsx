'use client';

import { useCallback } from 'react';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStep: () => void;
  onSeek: (time: number) => void;
}

export default function TimelineControls({
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onRestart,
  onStep,
  onSeek,
}: TimelineControlsProps) {
  const handleScrub = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSeek(parseFloat(e.target.value));
    },
    [onSeek]
  );

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="flex items-center gap-3 bg-gray-900 border-t border-gray-700 px-4 py-3"
      role="toolbar"
      aria-label="Timeline controls"
    >
      {/* Restart */}
      <button
        onClick={onRestart}
        className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        aria-label="Restart"
        title="Restart"
      >
        ⏮
      </button>

      {/* Play / Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="p-2 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors min-w-[2.5rem]"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Step */}
      <button
        onClick={onStep}
        className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        aria-label="Step forward"
        title="Step"
      >
        ⏭
      </button>

      {/* Timeline scrubber */}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono w-10 text-right">
          {currentTime.toFixed(1)}s
        </span>
        <div className="relative flex-1 h-2 bg-gray-700 rounded-full">
          <div
            className="absolute left-0 top-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Timeline scrubber"
          />
        </div>
        <span className="text-xs text-gray-400 font-mono w-10">
          {duration.toFixed(1)}s
        </span>
      </div>
    </div>
  );
}
