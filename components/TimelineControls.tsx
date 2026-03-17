'use client';

export interface TimelineControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onRestart: () => void;
  onScrub: (step: number) => void;
}

export default function TimelineControls({
  isPlaying,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onRestart,
  onScrub,
}: TimelineControlsProps) {
  const progress = totalSteps > 1 ? currentStep / (totalSteps - 1) : 0;

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {/* Scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 font-mono w-20 shrink-0">
          Step {currentStep + 1} / {totalSteps}
        </span>
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full accent-blue-500 cursor-pointer"
          aria-label="Timeline scrubber"
        />
        <span className="text-xs text-gray-500 font-mono w-10 text-right shrink-0">
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
          aria-label="Restart"
          title="Restart"
        >
          ⏮
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors min-w-[70px]"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Step forward"
          title="Step Forward"
        >
          ⏭
        </button>

        <span className="ml-auto text-xs text-gray-600 font-mono">
          AlgoFlow Visualizer
        </span>
      </div>
    </div>
  );
}
