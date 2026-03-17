'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';
import { parseTrace } from '@/engine/traceParser';

const SAMPLE_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`;

const SAMPLE_TRACE = JSON.stringify(
  [
    { t: 0.0, type: 'line', line: 1 },
    { t: 0.5, type: 'array_access', array: 'arr', index: 0 },
    { t: 1.0, type: 'compare', array: 'arr', i: 0, j: 1 },
    { t: 1.5, type: 'swap', array: 'arr', i: 0, j: 1 },
    { t: 2.0, type: 'variable_update', name: 'i', value: 0 },
  ],
  null,
  2
);

export default function PlaygroundPage() {
  const router = useRouter();
  const [code, setCode] = useState(SAMPLE_CODE);
  const [traceJson, setTraceJson] = useState(SAMPLE_TRACE);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = useCallback(() => {
    setError(null);
    try {
      parseTrace(traceJson); // validate
      const encoded = encodeURIComponent(traceJson);
      const codeEncoded = encodeURIComponent(code);
      router.push(`/visualizer?trace=${encoded}&code=${codeEncoded}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [code, traceJson, router]);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex items-center gap-4">
        <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
          ← Home
        </a>
        <h1 className="text-xl font-bold">Playground</h1>
      </header>

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-800 bg-gray-900">
            Code
          </div>
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} language="python" />
          </div>
        </div>

        {/* Trace Input */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-800 bg-gray-900">
            Execution Trace (JSON)
          </div>
          <div className="flex-1">
            <CodeEditor
              value={traceJson}
              onChange={setTraceJson}
              language="json"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-800 flex items-center gap-4 bg-gray-900">
        {error && (
          <p className="text-red-400 text-sm flex-1">⚠ {error}</p>
        )}
        {!error && <div className="flex-1" />}
        <button
          onClick={handleVisualize}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
        >
          Visualize →
        </button>
      </footer>
    </main>
  );
}
