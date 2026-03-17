'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ArrayVisualizer from '@/components/ArrayVisualizer';
import VariablePanel from '@/components/VariablePanel';
import CallStackViewer from '@/components/CallStackViewer';
import TimelineControls from '@/components/TimelineControls';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900 rounded text-gray-500 text-sm">
      Loading editor…
    </div>
  ),
});

import type { ParsedTrace } from '@/engine/traceParser';

const SAMPLE_TRACE: ParsedTrace = {
  metadata: { algorithm: 'bubble_sort', language: 'python' },
  events: [
    { t: 0, type: 'line', line: 1 },
    { t: 1, type: 'variable_update', name: 'n', value: 7 },
    { t: 2, type: 'line', line: 2 },
    { t: 3, type: 'compare', index1: 0, index2: 1 },
    { t: 4, type: 'swap', index1: 0, index2: 1 },
    { t: 5, type: 'array_update', index: 0, value: 34 },
    { t: 6, type: 'array_update', index: 1, value: 64 },
    { t: 7, type: 'compare', index1: 1, index2: 2 },
    { t: 8, type: 'function_call', name: 'bubble_sort', args: { arr: '[64,34,25]' } },
    { t: 9, type: 'function_return', name: 'bubble_sort' },
    { t: 10, type: 'line', line: 5 },
  ],
};

const SAMPLE_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`;

interface StackFrame {
  name: string;
  args?: Record<string, unknown>;
}

export default function VisualizerPage() {
  const [trace] = useState<ParsedTrace>(SAMPLE_TRACE);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<[number, number] | null>(null);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [variables, setVariables] = useState<Record<string, string | number | boolean>>({});
  const [callStack, setCallStack] = useState<StackFrame[]>([]);
  const [highlightedLine, setHighlightedLine] = useState<number | undefined>();

  const totalSteps = trace.events.length;

  useEffect(() => {
    const event = trace.events[currentStep];
    if (!event) return;

    setHighlightedIndices([]);
    setSwapIndices(null);
    setComparingIndices([]);

    switch (event.type) {
      case 'line':
        setHighlightedLine(typeof event.line === 'number' ? event.line : undefined);
        break;
      case 'variable_update':
        if (typeof event.name === 'string') {
          setVariables((prev) => ({
            ...prev,
            [event.name as string]: event.value as string | number | boolean,
          }));
        }
        break;
      case 'array_update':
        if (typeof event.index === 'number' && event.value !== undefined) {
          setArray((prev) => {
            const next = [...prev];
            next[event.index as number] = event.value as number;
            return next;
          });
          setHighlightedIndices([event.index as number]);
        }
        break;
      case 'swap':
        if (typeof event.index1 === 'number' && typeof event.index2 === 'number') {
          setSwapIndices([event.index1, event.index2]);
          setArray((prev) => {
            const next = [...prev];
            const i1 = event.index1 as number;
            const i2 = event.index2 as number;
            [next[i1], next[i2]] = [next[i2], next[i1]];
            return next;
          });
        }
        break;
      case 'compare':
        if (typeof event.index1 === 'number' && typeof event.index2 === 'number') {
          setComparingIndices([event.index1, event.index2]);
        }
        break;
      case 'function_call':
        if (typeof event.name === 'string') {
          setCallStack((prev) => [
            { name: event.name as string, args: event.args as Record<string, unknown> | undefined },
            ...prev,
          ]);
        }
        break;
      case 'function_return':
        setCallStack((prev) => prev.slice(1));
        break;
    }
  }, [currentStep, trace.events]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), 600);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setVariables({});
    setCallStack([]);
    setHighlightedLine(undefined);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <header className="px-4 py-2 border-b border-gray-800 flex items-center gap-4">
        <h1 className="text-lg font-bold text-blue-400">AlgoFlow Visualizer</h1>
        <span className="text-sm text-gray-500">Bubble Sort</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="w-2/5 border-r border-gray-800 flex flex-col">
          <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-800">Code</div>
          <div className="flex-1">
            <CodeEditor
              code={SAMPLE_CODE}
              language="python"
              readOnly
              highlightedLine={highlightedLine}
            />
          </div>
        </div>

        {/* Center: Array Visualizer */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-800">Array</div>
          <div className="flex-1 flex items-center justify-center p-6">
            <ArrayVisualizer
              array={array}
              highlightedIndices={highlightedIndices}
              swapIndices={swapIndices}
              comparingIndices={comparingIndices}
            />
          </div>
        </div>

        {/* Right: Variable Panel + Call Stack */}
        <div className="w-56 flex flex-col">
          <div className="flex-1 border-b border-gray-800 overflow-auto">
            <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-800">Variables</div>
            <VariablePanel variables={variables} />
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-800">Call Stack</div>
            <CallStackViewer callStack={callStack} />
          </div>
        </div>
      </div>

      {/* Bottom: Timeline */}
      <div className="border-t border-gray-800">
        <TimelineControls
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={() => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1))}
          onRestart={handleRestart}
          onScrub={(step) => { setIsPlaying(false); setCurrentStep(step); }}
        />
      </div>
    </div>
  );
}
