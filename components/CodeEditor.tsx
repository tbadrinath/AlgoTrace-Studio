'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import type { editor as MonacoEditor } from 'monaco-editor';

const Editor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.default),
  { ssr: false }
);

export interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  highlightedLine?: number;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  code,
  onChange,
  highlightedLine,
  language = 'python',
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<MonacoEditor.IEditorDecorationsCollection | null>(null);

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;

    if (decorationsRef.current) {
      decorationsRef.current.clear();
    }

    if (highlightedLine !== undefined && highlightedLine > 0) {
      decorationsRef.current = ed.createDecorationsCollection([
        {
          range: {
            startLineNumber: highlightedLine,
            endLineNumber: highlightedLine,
            startColumn: 1,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'bg-yellow-500/20',
            glyphMarginClassName: 'bg-yellow-500',
          },
        },
      ]);
      ed.revealLineInCenter(highlightedLine);
    }
  }, [highlightedLine]);

  function handleMount(ed: MonacoEditor.IStandaloneCodeEditor) {
    editorRef.current = ed;
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        onChange={(val) => onChange?.(val ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}
