import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen px-6 py-16">
      <section className="text-center max-w-3xl mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AlgoFlow Visualizer
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Step through algorithms visually. Understand sorting, searching, and
          more with real-time code tracing and animated data structures.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/visualizer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
          >
            Launch Visualizer
          </Link>
          <Link
            href="/playground"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Open Playground
          </Link>
          <Link
            href="/examples"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Browse Examples
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <FeatureCard
          icon="🖊️"
          title="Code Editor"
          description="Write or paste algorithm code with full syntax highlighting powered by Monaco Editor."
        />
        <FeatureCard
          icon="📊"
          title="Array Visualizer"
          description="Watch arrays transform step by step with animated swaps, comparisons, and updates."
        />
        <FeatureCard
          icon="⏱️"
          title="Timeline Controls"
          description="Play, pause, scrub, and step through every event in your algorithm trace."
        />
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
