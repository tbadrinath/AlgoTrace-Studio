'use client';

interface StackFrame {
  name: string;
  args: Record<string, unknown>;
}

interface CallStackViewerProps {
  frames: StackFrame[];
}

export default function CallStackViewer({ frames }: CallStackViewerProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-full overflow-auto">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
        Call Stack
      </h3>
      {frames.length === 0 ? (
        <p className="text-xs text-gray-500 italic">Stack is empty</p>
      ) : (
        <div className="flex flex-col-reverse gap-1">
          {frames.map((frame, idx) => (
            <div
              key={idx}
              className={`rounded p-2 text-xs font-mono border ${
                idx === frames.length - 1
                  ? 'border-blue-500 bg-blue-500/10 text-blue-200'
                  : 'border-gray-700 bg-gray-800 text-gray-300'
              }`}
            >
              <div className="font-semibold text-white">{frame.name}()</div>
              {Object.entries(frame.args).map(([argName, argValue]) => (
                <div key={argName} className="text-gray-400 ml-2">
                  {argName}: <span className="text-green-300">{String(argValue)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
