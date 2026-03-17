'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg text-gray-500">
      Loading editor…
    </div>
  ),
});

type Language = 'python' | 'javascript' | 'java' | 'cpp';

interface LanguageConfig {
  label: string;
  monacoLang: string;
  starterCode: string;
}

const LANGUAGES: Record<Language, LanguageConfig> = {
  python: {
    label: 'Python',
    monacoLang: 'python',
    starterCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
`,
  },
  javascript: {
    label: 'JavaScript',
    monacoLang: 'javascript',
    starterCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
`,
  },
  java: {
    label: 'Java',
    monacoLang: 'java',
    starterCode: `import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}
`,
  },
  cpp: {
    label: 'C++',
    monacoLang: 'cpp',
    starterCode: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`,
  },
};

interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  compileOutput: string;
}

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(LANGUAGES.python.starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].starterCode);
    setResult(null);
  }, []);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = (await res.json()) as ExecuteResult & { error?: string };
      if (data.error) {
        setResult({ stdout: '', stderr: data.error, exitCode: -1, compileOutput: '' });
      } else {
        setResult(data);
      }
    } catch {
      setResult({
        stdout: '',
        stderr: 'Failed to connect to execution service.',
        exitCode: -1,
        compileOutput: '',
      });
    } finally {
      setRunning(false);
    }
  }, [code, language]);

  const config = LANGUAGES[language];

  return (
    <main className="flex flex-col min-h-screen px-6 py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Code Playground</h1>
          <p className="mt-1 text-gray-400">
            Write, paste, or modify code and run it directly in your browser.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Language selector */}
          <div className="flex rounded-lg border border-gray-700 overflow-hidden">
            {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-2 text-sm font-medium transition ${
                  language === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {LANGUAGES[lang].label}
              </button>
            ))}
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Running…
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden border border-gray-800">
        <CodeEditor
          code={code}
          onChange={setCode}
          language={config.monacoLang}
          readOnly={false}
        />
      </div>

      {/* Output panel */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-300">Output</span>
          {result !== null && (
            <span
              className={`text-xs rounded-full px-2 py-0.5 font-mono ${
                result.exitCode === 0
                  ? 'bg-green-900/60 text-green-400'
                  : 'bg-red-900/60 text-red-400'
              }`}
            >
              exit {result.exitCode}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 min-h-[120px] font-mono text-sm">
          {result === null && !running && (
            <span className="text-gray-600">Click &quot;Run&quot; to execute your code…</span>
          )}
          {running && <span className="text-gray-500">Executing…</span>}
          {result !== null && (
            <>
              {result.compileOutput && (
                <div className="mb-2">
                  <span className="text-yellow-400 font-semibold">Compile output:</span>
                  <pre className="mt-1 whitespace-pre-wrap text-yellow-300">
                    {result.compileOutput}
                  </pre>
                </div>
              )}
              {result.stdout && (
                <pre className="whitespace-pre-wrap text-green-300">{result.stdout}</pre>
              )}
              {result.stderr && (
                <pre className="whitespace-pre-wrap text-red-400">{result.stderr}</pre>
              )}
              {!result.stdout && !result.stderr && !result.compileOutput && (
                <span className="text-gray-500">(no output)</span>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
