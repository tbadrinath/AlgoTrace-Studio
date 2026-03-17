'use client';

interface VariablePanelProps {
  variables: Record<string, unknown>;
}

export default function VariablePanel({ variables }: VariablePanelProps) {
  const entries = Object.entries(variables);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-full overflow-auto">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
        Variables
      </h3>
      {entries.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No variables yet</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-700">
              <th className="pb-1 font-medium">Name</th>
              <th className="pb-1 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => (
              <tr key={name} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-1 font-mono text-purple-300">{name}</td>
                <td className="py-1 font-mono text-green-300">
                  {typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
