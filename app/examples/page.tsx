import Link from 'next/link';
import bubbleSort from '@/examples/bubble-sort.json';
import binarySearch from '@/examples/binary-search.json';

const EXAMPLES = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Classic O(n²) sorting with swap and compare animations.',
    trace: bubbleSort,
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'O(log n) search with pointer animation.',
    trace: binarySearch,
    code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  },
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <header className="mb-8 flex items-center gap-4">
        <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Home
        </a>
        <h1 className="text-3xl font-bold">Examples</h1>
      </header>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
        {EXAMPLES.map((ex) => {
          const traceStr = encodeURIComponent(JSON.stringify(ex.trace));
          const codeStr = encodeURIComponent(ex.code);
          return (
            <div key={ex.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-3">
              <h2 className="text-xl font-semibold">{ex.title}</h2>
              <p className="text-gray-400 text-sm flex-1">{ex.description}</p>
              <Link
                href={`/visualizer?trace=${traceStr}&code=${codeStr}`}
                className="mt-2 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors text-center"
              >
                Visualize →
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
