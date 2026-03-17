# Architecture

## Overview

AlgoFlow Visualizer is a Next.js 15 App Router application that provides interactive algorithm visualization with step-by-step code tracing.

## Directory Structure

```
algoflow-visualizer/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (dark theme)
│   ├── page.tsx            # Homepage / landing
│   ├── playground/page.tsx # Code editor playground
│   ├── visualizer/page.tsx # Main visualizer UI
│   └── examples/page.tsx   # Algorithm examples gallery
├── components/             # Reusable React components
│   ├── CodeEditor.tsx      # Monaco Editor wrapper (lazy loaded)
│   ├── ArrayVisualizer.tsx # Animated array display
│   ├── VariablePanel.tsx   # Variable state display
│   ├── CallStackViewer.tsx # Call stack display
│   └── TimelineControls.tsx# Playback controls
├── engine/                 # Core logic (pure TypeScript, SSR-safe)
│   ├── traceParser.ts      # Parse and validate trace JSON
│   ├── animationMapper.ts  # Map trace events to animation instructions
│   └── gsapTimeline.ts     # GSAP timeline controller (SSR-safe)
├── examples/               # Sample trace JSON files
├── tests/                  # Jest unit tests + Playwright E2E tests
└── docs/                   # Documentation
```

## Data Flow

```
Trace JSON → parseTrace() → ParsedTrace → mapTraceToAnimations() → AnimationInstruction[]
                                                                            ↓
                                                                   GSAPTimeline.play()
                                                                            ↓
                                                              React state updates → Re-render
```

## Technology Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework    | Next.js 15.5 (App Router)           |
| UI           | React 19 + TailwindCSS 3            |
| Editor       | Monaco Editor (via @monaco-editor/react, lazy loaded) |
| Animation    | GSAP 3 (client-side only)           |
| Language     | TypeScript 5 (strict mode)          |
| Testing      | Jest 29 + Playwright 1.44           |

## SSR Safety

- Monaco Editor: loaded with `dynamic(..., { ssr: false })`  
- GSAP: only imported inside `useEffect` or dynamically in engine methods  
- All interactive components are marked `'use client'`
