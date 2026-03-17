'use client';

export interface StackFrame {
  name: string;
  args?: Record<string, unknown>;
}

export interface CallStackViewerProps {
  callStack: StackFrame[];
}

export default function CallStackViewer({ callStack }: CallStackViewerProps) {
  if (callStack.length === 0) {
    return (
      <div className="p-3 text-xs text-gray-600 italic">Call stack empty</div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {callStack.map((frame, i) => (
        <div
          key={i}
          className={`rounded px-3 py-2 border text-xs font-mono ${
            i === 0
              ? 'bg-blue-900/40 border-blue-700 text-blue-200'
              : 'bg-gray-800 border-gray-700 text-gray-400'
          }`}
        >
          <div className="font-semibold truncate">{frame.name}()</div>
          {frame.args && Object.keys(frame.args).length > 0 && (
            <div className="mt-1 text-gray-500 truncate">
              {Object.entries(frame.args)
                .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                .join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
