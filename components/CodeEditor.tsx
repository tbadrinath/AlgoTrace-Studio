'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import type { OnMount } from '@monaco-editor/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
      Loading editor…
    </div>
  ),
});

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  highlightedLine?: number;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  highlightedLine,
  readOnly = false,
}: CodeEditorProps) {
  const handleMount = useCallback<OnMount>(
    (editor) => {
      if (highlightedLine !== undefined) {
        editor.revealLineInCenter(highlightedLine);
        editor.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: highlightedLine,
                startColumn: 1,
                endLineNumber: highlightedLine,
                endColumn: 1,
              },
              options: {
                isWholeLine: true,
                className: 'bg-yellow-300/20',
                glyphMarginClassName: 'bg-yellow-400',
              },
            },
          ]
        );
      }
    },
    [highlightedLine]
  );

  return (
    <div className="h-full w-full border border-gray-700 rounded-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={(val) => onChange?.(val ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
