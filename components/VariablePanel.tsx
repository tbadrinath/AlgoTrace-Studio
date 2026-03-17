'use client';

export interface VariablePanelProps {
  variables: Record<string, string | number | boolean>;
}

export default function VariablePanel({ variables }: VariablePanelProps) {
  const entries = Object.entries(variables);

  if (entries.length === 0) {
    return (
      <div className="p-3 text-xs text-gray-600 italic">No variables yet</div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-gray-500">
          <th className="text-left px-3 py-1 font-medium">Name</th>
          <th className="text-left px-3 py-1 font-medium">Value</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([name, value]) => (
          <tr
            key={name}
            className="border-t border-gray-800 animate-pulse-once hover:bg-gray-800/50 transition-colors"
          >
            <td className="px-3 py-1.5 font-mono text-purple-300">{name}</td>
            <td className="px-3 py-1.5 font-mono text-green-300">
              {String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
