import { parseTrace, TraceEvent } from '@/engine/traceParser';

describe('traceParser', () => {
  it('parses a valid JSON string array', () => {
    const input = JSON.stringify([
      { t: 0.5, type: 'array_access', array: 'nums', index: 3 },
      { t: 1.0, type: 'line', line: 5 },
    ]);
    const events = parseTrace(input);
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe('array_access');
    expect(events[1].type).toBe('line');
  });

  it('sorts events by timestamp', () => {
    const input: TraceEvent[] = [
      { t: 2.0, type: 'line', line: 3 },
      { t: 0.5, type: 'line', line: 1 },
    ];
    const events = parseTrace(input);
    expect(events[0].t).toBe(0.5);
    expect(events[1].t).toBe(2.0);
  });

  it('throws on invalid JSON string', () => {
    expect(() => parseTrace('not json')).toThrow();
  });

  it('throws when top level is not an array', () => {
    expect(() => parseTrace(JSON.stringify({ t: 0, type: 'line' }))).toThrow();
  });

  it('skips events with missing required fields', () => {
    const input = JSON.stringify([
      { t: 0.5, type: 'array_access', array: 'nums', index: 0 },
      { type: 'line', line: 1 }, // missing t
      { t: 1.0 }, // missing type
    ]);
    const events = parseTrace(input);
    expect(events).toHaveLength(1);
  });

  it('skips events with unknown type', () => {
    const input = JSON.stringify([
      { t: 0.5, type: 'unknown_type', data: 42 },
    ]);
    const events = parseTrace(input);
    expect(events).toHaveLength(0);
  });

  it('parses all supported event types', () => {
    const raw = [
      { t: 0.0, type: 'line', line: 1 },
      { t: 0.1, type: 'variable_update', name: 'x', value: 5 },
      { t: 0.2, type: 'array_access', array: 'arr', index: 0 },
      { t: 0.3, type: 'array_update', array: 'arr', index: 0, value: 99 },
      { t: 0.4, type: 'swap', array: 'arr', i: 0, j: 1 },
      { t: 0.5, type: 'compare', array: 'arr', i: 0, j: 1 },
      { t: 0.6, type: 'pointer_move', pointer: 'p', index: 2 },
      { t: 0.7, type: 'function_call', name: 'foo', args: {} },
      { t: 0.8, type: 'function_return', name: 'foo', value: null },
    ];
    const events = parseTrace(raw);
    expect(events).toHaveLength(9);
  });
});
