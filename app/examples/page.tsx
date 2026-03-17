import Link from 'next/link';

const EXAMPLES = [
  {
    id: 'bubble_sort',
    title: 'Bubble Sort',
    description:
      'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    complexity: 'O(n²)',
    language: 'Python',
  },
  {
    id: 'binary_search',
    title: 'Binary Search',
    description:
      'An efficient search algorithm that works on sorted arrays by repeatedly halving the search interval until the target value is found.',
    complexity: 'O(log n)',
    language: 'Python',
  },
];

export default function ExamplesPage() {
  return (
    <main className="flex flex-col min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Examples</h1>
      <p className="text-gray-400 mb-10">
        Explore pre-built algorithm traces. Click an example to open it in the
        visualizer.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-semibold">{ex.title}</h2>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded font-mono">
                {ex.complexity}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {ex.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-400">{ex.language}</span>
              <Link
                href={`/visualizer?example=${ex.id}`}
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
              >
                Visualize →
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
