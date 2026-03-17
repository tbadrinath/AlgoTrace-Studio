'use client';

import { useRef, useEffect } from 'react';

export interface ArrayVisualizerProps {
  array: number[];
  highlightedIndices?: number[];
  swapIndices?: [number, number] | null;
  comparingIndices?: number[];
}

function getCellColor(
  index: number,
  highlightedIndices: number[],
  swapIndices: [number, number] | null | undefined,
  comparingIndices: number[]
): string {
  if (swapIndices && (index === swapIndices[0] || index === swapIndices[1])) {
    return 'bg-orange-500 border-orange-400 scale-110';
  }
  if (comparingIndices.includes(index)) {
    return 'bg-yellow-500 border-yellow-400';
  }
  if (highlightedIndices.includes(index)) {
    return 'bg-blue-500 border-blue-400';
  }
  return 'bg-gray-700 border-gray-600';
}

export default function ArrayVisualizer({
  array,
  highlightedIndices = [],
  swapIndices = null,
  comparingIndices = [],
}: ArrayVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations would be wired here for production; CSS transitions handle basics
  }, [array, swapIndices]);

  const maxVal = Math.max(...array, 1);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full">
      {/* Bar chart view */}
      <div className="flex items-end gap-1 h-32">
        {array.map((val, i) => {
          const heightPct = Math.round((val / maxVal) * 100);
          const colorClass = swapIndices && (i === swapIndices[0] || i === swapIndices[1])
            ? 'bg-orange-500'
            : comparingIndices.includes(i)
            ? 'bg-yellow-400'
            : highlightedIndices.includes(i)
            ? 'bg-blue-500'
            : 'bg-gray-600';
          return (
            <div
              key={i}
              className={`w-8 rounded-t transition-all duration-300 ${colorClass}`}
              style={{ height: `${heightPct}%` }}
              title={`[${i}] = ${val}`}
            />
          );
        })}
      </div>

      {/* Cell view */}
      <div className="flex gap-1 flex-wrap justify-center">
        {array.map((val, i) => (
          <div
            key={i}
            className={`flex flex-col items-center transition-all duration-300 ${
              swapIndices && (i === swapIndices[0] || i === swapIndices[1])
                ? 'scale-110'
                : ''
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono text-sm font-bold transition-colors duration-300 ${getCellColor(i, highlightedIndices, swapIndices, comparingIndices)}`}
            >
              {val}
            </div>
            <span className="text-xs text-gray-500 mt-0.5">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
