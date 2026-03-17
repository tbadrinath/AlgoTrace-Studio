'use client';

import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg text-gray-500">
      Loading editor…
    </div>
  ),
});

const STARTER_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
`;

export default function PlaygroundPage() {
  return (
    <main className="flex flex-col min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Code Playground</h1>
      <p className="text-gray-400 mb-8">
        Write or paste your algorithm code below. The editor supports syntax
        highlighting for Python, JavaScript, TypeScript, and more.
      </p>
      <div className="flex-1 min-h-[500px]">
        <CodeEditor code={STARTER_CODE} language="python" />
      </div>
    </main>
  );
}
