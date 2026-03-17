'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ArrayVisualizerProps {
  name: string;
  values: unknown[];
  highlightedIndex?: number;
  compareIndices?: [number, number];
  swapIndices?: [number, number];
  pointers?: Record<string, number>;
}

export default function ArrayVisualizer({
  name,
  values,
  highlightedIndex,
  compareIndices,
  swapIndices,
  pointers = {},
}: ArrayVisualizerProps) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate swap
    if (swapIndices) {
      const [i, j] = swapIndices;
      const cellI = cellRefs.current[i];
      const cellJ = cellRefs.current[j];
      if (cellI && cellJ) {
        const tl = gsap.timeline();
        tl.to([cellI, cellJ], { y: -20, duration: 0.2, ease: 'power2.out' });
        tl.to(cellI, { x: (j - i) * 56, duration: 0.3 });
        tl.to(cellJ, { x: (i - j) * 56, duration: 0.3 }, '<');
        tl.to([cellI, cellJ], { y: 0, duration: 0.2, ease: 'power2.in' });
        tl.set([cellI, cellJ], { x: 0 });
      }
    }
  }, [swapIndices]);

  const getCellClass = (index: number) => {
    const base =
      'flex items-center justify-center w-12 h-12 border-2 rounded font-mono text-sm font-semibold transition-colors duration-200';
    if (highlightedIndex === index) {
      return `${base} border-yellow-400 bg-yellow-400/20 text-yellow-300`;
    }
    if (compareIndices && (compareIndices[0] === index || compareIndices[1] === index)) {
      return `${base} border-blue-400 bg-blue-400/20 text-blue-300`;
    }
    if (swapIndices && (swapIndices[0] === index || swapIndices[1] === index)) {
      return `${base} border-green-400 bg-green-400/20 text-green-300`;
    }
    return `${base} border-gray-600 bg-gray-800 text-gray-100`;
  };

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-400 mb-1 font-mono">{name}</div>
      <div className="flex gap-1 items-end">
        {values.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            {/* Pointer labels above */}
            <div className="text-xs text-purple-400 font-mono h-4">
              {Object.entries(pointers)
                .filter(([, v]) => v === idx)
                .map(([k]) => k)
                .join(',')}
            </div>
            <div
              ref={(el) => { cellRefs.current[idx] = el; }}
              className={getCellClass(idx)}
            >
              {String(val)}
            </div>
            {/* Index label below */}
            <div className="text-xs text-gray-500">{idx}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
