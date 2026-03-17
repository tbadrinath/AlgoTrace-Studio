import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
          Open Source · Web-Based
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AlgoTrace Studio
        </h1>
        <p className="max-w-2xl text-xl text-gray-400 mb-10">
          Visualize program execution step-by-step with animated traces.
          Paste your code, upload a JSON execution trace, and watch your
          algorithm come to life.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/playground"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
          >
            Open Playground →
          </Link>
          <Link
            href="/examples"
            className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg font-semibold transition-colors"
          >
            View Examples
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-8">
        {[
          {
            icon: '🔍',
            title: 'Step-by-Step Execution',
            desc: 'Follow every line of your algorithm with synchronized code and array visualizations.',
          },
          {
            icon: '🎬',
            title: 'GSAP Animations',
            desc: 'Smooth, professional animations for swaps, comparisons, pointer movements, and more.',
          },
          {
            icon: '📊',
            title: 'JSON Trace Format',
            desc: 'Upload your own execution traces in a simple JSON format to visualize any algorithm.',
          },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
