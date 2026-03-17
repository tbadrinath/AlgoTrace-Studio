# System Specification

## Purpose

AlgoFlow Visualizer is a web application for visualizing algorithm execution step by step. It accepts algorithm trace data (JSON), renders animated visualizations of data structures, and provides interactive playback controls.

## Core Requirements

### Functional

1. **Trace Parsing** — The system accepts trace JSON with events and produces a normalized `ParsedTrace` with validated events sorted by timestamp.
2. **Animation Mapping** — Each trace event maps to an `AnimationInstruction` describing what to animate and how.
3. **Code Display** — The code editor highlights the current line being executed.
4. **Array Display** — Arrays are visualized as colored bars and labeled cells, with distinct colors for highlighted, comparing, and swapping states.
5. **Variable Display** — A panel shows the current value of each tracked variable.
6. **Call Stack Display** — A panel shows the current call stack with function names and arguments.
7. **Timeline Controls** — Users can play, pause, step forward, restart, and scrub to any step.

### Non-Functional

- **Performance**: Visualization must be responsive at 60 fps for arrays up to 100 elements.
- **Accessibility**: All interactive controls must have ARIA labels.
- **SSR Safety**: No browser-only APIs execute during server-side rendering.
- **Type Safety**: All TypeScript compiles without errors in strict mode.

## Supported Event Types

| Type              | Description                                 |
|-------------------|---------------------------------------------|
| `line`            | Highlight a line in the code editor         |
| `variable_update` | Update a variable's value in the panel      |
| `array_access`    | Highlight an array cell (read)              |
| `array_update`    | Update an array cell's value                |
| `swap`            | Animate a swap between two indices          |
| `compare`         | Highlight two cells being compared          |
| `pointer_move`    | Move a named pointer to an index            |
| `function_call`   | Push a frame onto the call stack            |
| `function_return` | Pop a frame from the call stack             |

## Trace JSON Format

```json
{
  "algorithm": "string",
  "language": "string",
  "code": "string",
  "initialArray": [number],
  "events": [
    { "t": number, "type": "EventType", ...eventFields }
  ]
}
```
