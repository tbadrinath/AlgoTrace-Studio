import { NextRequest, NextResponse } from 'next/server';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

// Language configurations for the Piston code execution API.
// Version "*" always resolves to the latest available runtime.
// See https://emkc.org/api/v2/piston/runtimes for the full list.
const LANGUAGE_MAP: Record<string, { language: string; version: string; filename: string }> = {
  python: { language: 'python', version: '*', filename: 'main.py' },
  javascript: { language: 'javascript', version: '*', filename: 'main.js' },
  java: { language: 'java', version: '*', filename: 'Main.java' },
  cpp: { language: 'c++', version: '*', filename: 'main.cpp' },
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = (await req.json()) as { code: string; language: string };

    const config = LANGUAGE_MAP[language];
    if (!config) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const pistonRes = await fetch(PISTON_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ name: config.filename, content: code }],
      }),
    });

    if (!pistonRes.ok) {
      return NextResponse.json({ error: 'Execution service unavailable' }, { status: 502 });
    }

    const result = (await pistonRes.json()) as {
      run: { stdout: string; stderr: string; code: number };
      compile?: { stdout: string; stderr: string; code: number };
    };

    return NextResponse.json({
      stdout: result.run.stdout,
      stderr: result.run.stderr,
      exitCode: result.run.code,
      compileOutput: result.compile?.stderr ?? '',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
