import type { TraceEvent, ParsedTrace } from './traceParser';

export interface AnimationInstruction {
  type: string;
  target: string;
  properties: Record<string, unknown>;
  duration: number;
  timestamp: number;
}

export function mapEventToAnimation(event: TraceEvent): AnimationInstruction {
  const base = { timestamp: event.t, duration: 0.3 };

  switch (event.type) {
    case 'line':
      return {
        ...base,
        type: 'highlight_line',
        target: 'code_editor',
        properties: { line: event['line'] ?? 0 },
      };

    case 'array_access':
      return {
        ...base,
        type: 'highlight_cell',
        target: `array_${String(event['array'] ?? 'arr')}`,
        properties: { index: event['index'] ?? 0, color: 'blue' },
      };

    case 'array_update':
      return {
        ...base,
        type: 'update_cell',
        target: `array_${String(event['array'] ?? 'arr')}`,
        properties: { index: event['index'] ?? 0, value: event['value'] ?? 0 },
      };

    case 'swap':
      return {
        ...base,
        type: 'animate_swap',
        target: `array_${String(event['array'] ?? 'arr')}`,
        properties: { index1: event['index1'] ?? 0, index2: event['index2'] ?? 1 },
        duration: 0.5,
      };

    case 'variable_update':
      return {
        ...base,
        type: 'update_variable',
        target: 'variable_panel',
        properties: { name: event['name'] ?? '', value: event['value'] ?? null },
      };

    case 'compare':
      return {
        ...base,
        type: 'highlight_comparison',
        target: `array_${String(event['array'] ?? 'arr')}`,
        properties: { index1: event['index1'] ?? 0, index2: event['index2'] ?? 1, color: 'yellow' },
      };

    case 'pointer_move':
      return {
        ...base,
        type: 'move_pointer',
        target: `pointer_${String(event['name'] ?? 'ptr')}`,
        properties: { index: event['index'] ?? 0 },
      };

    case 'function_call':
      return {
        ...base,
        type: 'push_call_stack',
        target: 'call_stack',
        properties: { name: event['name'] ?? '', args: event['args'] ?? {} },
      };

    case 'function_return':
      return {
        ...base,
        type: 'pop_call_stack',
        target: 'call_stack',
        properties: { name: event['name'] ?? '' },
      };

    default: {
      const _exhaustive: never = event.type;
      return {
        ...base,
        type: 'noop',
        target: 'unknown',
        properties: { eventType: _exhaustive },
      };
    }
  }
}

export function mapTraceToAnimations(
  trace: ParsedTrace
): AnimationInstruction[] {
  return trace.events.map(mapEventToAnimation);
}
