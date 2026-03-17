'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';
import ArrayVisualizer from '@/components/ArrayVisualizer';
import VariablePanel from '@/components/VariablePanel';
import CallStackViewer from '@/components/CallStackViewer';
import TimelineControls from '@/components/TimelineControls';
import { parseTrace, TraceEvent } from '@/engine/traceParser';
import { mapTrace, AnimationInstruction } from '@/engine/animationMapper';
import { createGSAPTimeline, GSAPTimelineInstance } from '@/engine/gsapTimeline';

interface StackFrame {
  name: string;
  args: Record<string, unknown>;
}

interface ArrayState {
  [arrayName: string]: unknown[];
}

function VisualizerInner() {
  const searchParams = useSearchParams();
  const traceParam = searchParams.get('trace') ?? '[]';
  const codeParam = searchParams.get('code') ?? '';

  const [code] = useState(() => {
    try { return decodeURIComponent(codeParam); } catch { return codeParam; }
  });

  const [events] = useState<TraceEvent[]>(() => {
    try {
      return parseTrace(decodeURIComponent(traceParam));
    } catch (err) {
      console.error('[Visualizer] Failed to parse trace:', err);
      return [];
    }
  });

  const [instructions] = useState<AnimationInstruction[]>(() => mapTrace(events));

  // Visualization state
  const [highlightedLine, setHighlightedLine] = useState<number | undefined>();
  const [arrays, setArrays] = useState<ArrayState>({});
  const [highlightedCell, setHighlightedCell] = useState<{ array: string; index: number } | null>(null);
  const [compareIndices, setCompareIndices] = useState<{ array: string; i: number; j: number } | null>(null);
  const [swapIndices, setSwapIndices] = useState<{ array: string; i: number; j: number } | null>(null);
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [callStack, setCallStack] = useState<StackFrame[]>([]);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const timelineRef = useRef<GSAPTimelineInstance | null>(null);
  const rafRef = useRef<number | null>(null);

  // Build GSAP timeline
  useEffect(() => {
    let cancelled = false;

    createGSAPTimeline(instructions, {
      onHighlightLine: (line) => setHighlightedLine(line),
      onHighlightArrayCell: (array, index) => setHighlightedCell({ array, index }),
      onUpdateArrayCell: (array, index, value) => {
        setArrays((prev) => {
          const arr = [...(prev[array] ?? [])];
          arr[index] = value;
          return { ...prev, [array]: arr };
        });
      },
      onSwapArrayCells: (array, i, j) => {
        setSwapIndices({ array, i, j });
        setArrays((prev) => {
          const arr = [...(prev[array] ?? [])];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          return { ...prev, [array]: arr };
        });
        setTimeout(() => setSwapIndices(null), 800);
      },
      onCompareCells: (array, i, j) => {
        setCompareIndices({ array, i, j });
        setTimeout(() => setCompareIndices(null), 600);
      },
      // Pointer visualization is handled by ArrayVisualizer via the pointers prop; no callback action needed here.
      onMovePointer: () => {},
      onUpdateVariable: (name, value) =>
        setVariables((prev) => ({ ...prev, [name]: value })),
      onPushCallStack: (name, args) =>
        setCallStack((prev) => [...prev, { name, args }]),
      onPopCallStack: () =>
        setCallStack((prev) => prev.slice(0, -1)),
    }).then((tl) => {
      if (!cancelled) {
        timelineRef.current = tl;
        setDuration(tl.duration());
      }
    }).catch((err) => {
      console.error('[Visualizer] Failed to create GSAP timeline:', err);
    });

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [instructions]);

  // RAF loop to track currentTime
  useEffect(() => {
    const tick = () => {
      const tl = timelineRef.current;
      if (tl) {
        setCurrentTime(tl.duration() > 0 ? tl.time() : 0);
        if (!tl.isActive()) setIsPlaying(false);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handlePlay = useCallback(() => {
    timelineRef.current?.play();
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    timelineRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleRestart = useCallback(() => {
    timelineRef.current?.restart();
    setIsPlaying(true);
  }, []);

  const handleStep = useCallback(() => {
    if (!timelineRef.current) return;
    const tl = timelineRef.current;
    const next = currentTime + 0.5;
    tl.seek(Math.min(next, duration));
    tl.pause();
    setIsPlaying(false);
  }, [currentTime, duration]);

  const handleSeek = useCallback((time: number) => {
    timelineRef.current?.seek(time);
    timelineRef.current?.pause();
    setIsPlaying(false);
    setCurrentTime(time);
  }, []);

  const arrayNames = Object.keys(arrays);

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-3 border-b border-gray-800 flex items-center gap-4 bg-gray-900">
        <a href="/playground" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Playground
        </a>
        <h1 className="text-lg font-bold">Visualizer</h1>
        {events.length === 0 && (
          <span className="text-xs text-yellow-400">No events loaded</span>
        )}
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Code editor */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-800 bg-gray-900">
            Code
          </div>
          <div className="flex-1">
            <CodeEditor
              value={code}
              language="python"
              highlightedLine={highlightedLine}
              readOnly
            />
          </div>
        </div>

        {/* Right: Visualizations */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* Arrays */}
          <div className="flex-1 overflow-auto p-4 border-b border-gray-800">
            <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Arrays</h2>
            {arrayNames.length === 0 ? (
              <p className="text-xs text-gray-600 italic">Arrays will appear as the trace runs</p>
            ) : (
              arrayNames.map((name) => (
                <ArrayVisualizer
                  key={name}
                  name={name}
                  values={arrays[name]}
                  highlightedIndex={
                    highlightedCell?.array === name ? highlightedCell.index : undefined
                  }
                  compareIndices={
                    compareIndices?.array === name
                      ? [compareIndices.i, compareIndices.j]
                      : undefined
                  }
                  swapIndices={
                    swapIndices?.array === name
                      ? [swapIndices.i, swapIndices.j]
                      : undefined
                  }
                />
              ))
            )}
          </div>

          {/* Variables + Call Stack */}
          <div className="h-48 flex overflow-hidden">
            <div className="flex-1 border-r border-gray-800 overflow-auto">
              <VariablePanel variables={variables} />
            </div>
            <div className="flex-1 overflow-auto">
              <CallStackViewer frames={callStack} />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <TimelineControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlay={handlePlay}
        onPause={handlePause}
        onRestart={handleRestart}
        onStep={handleStep}
        onSeek={handleSeek}
      />
    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading visualizer…</p>
      </div>
    }>
      <VisualizerInner />
    </Suspense>
  );
}
