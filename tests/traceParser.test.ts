import { parseTrace, getEventAtTime } from '../engine/traceParser';
import type { ParsedTrace } from '../engine/traceParser';

const ALL_EVENT_TYPES = [
  'line',
  'variable_update',
  'array_access',
  'array_update',
  'swap',
  'compare',
  'pointer_move',
  'function_call',
  'function_return',
] as const;

describe('parseTrace', () => {
  it('parses a valid trace object with multiple event types', () => {
    const raw = {
      algorithm: 'test',
      events: [
        { t: 0, type: 'line', line: 1 },
        { t: 1, type: 'variable_update', name: 'x', value: 42 },
        { t: 2, type: 'array_access', array: 'arr', index: 0 },
        { t: 3, type: 'array_update', array: 'arr', index: 0, value: 99 },
        { t: 4, type: 'swap', array: 'arr', index1: 0, index2: 1 },
        { t: 5, type: 'compare', array: 'arr', index1: 0, index2: 1 },
        { t: 6, type: 'pointer_move', name: 'i', index: 2 },
        { t: 7, type: 'function_call', name: 'foo', args: {} },
        { t: 8, type: 'function_return', name: 'foo' },
      ],
    };

    const trace = parseTrace(raw);
    expect(trace.events).toHaveLength(9);
    expect(trace.metadata['algorithm']).toBe('test');
  });

  it('sorts events by timestamp', () => {
    const raw = {
      events: [
        { t: 3, type: 'line', line: 3 },
        { t: 1, type: 'line', line: 1 },
        { t: 2, type: 'line', line: 2 },
      ],
    };
    const trace = parseTrace(raw);
    expect(trace.events[0].t).toBe(1);
    expect(trace.events[1].t).toBe(2);
    expect(trace.events[2].t).toBe(3);
  });

  it('throws when input is not an object', () => {
    expect(() => parseTrace(null)).toThrow();
    expect(() => parseTrace('string')).toThrow();
    expect(() => parseTrace(42)).toThrow();
  });

  it('throws when events field is missing', () => {
    expect(() => parseTrace({})).toThrow('events');
  });

  it('throws when events is not an array', () => {
    expect(() => parseTrace({ events: 'bad' })).toThrow();
  });

  it('throws when an event has no "t" field', () => {
    expect(() =>
      parseTrace({ events: [{ type: 'line', line: 1 }] })
    ).toThrow();
  });

  it('throws when an event has an invalid type', () => {
    expect(() =>
      parseTrace({ events: [{ t: 0, type: 'invalid_type' }] })
    ).toThrow('invalid_type');
  });

  it('validates all 9 event types as valid', () => {
    const events = ALL_EVENT_TYPES.map((type, i) => ({ t: i, type }));
    const trace = parseTrace({ events });
    expect(trace.events).toHaveLength(9);
  });
});

describe('getEventAtTime', () => {
  let trace: ParsedTrace;

  beforeEach(() => {
    trace = parseTrace({
      events: [
        { t: 0, type: 'line', line: 1 },
        { t: 1, type: 'variable_update', name: 'x', value: 10 },
        { t: 2, type: 'compare', index1: 0, index2: 1 },
        { t: 5, type: 'swap', index1: 0, index2: 1 },
      ],
    });
  });

  it('returns null when time is before all events', () => {
    expect(getEventAtTime(trace, -1)).toBeNull();
  });

  it('returns the event at exact time', () => {
    const event = getEventAtTime(trace, 1);
    expect(event?.type).toBe('variable_update');
  });

  it('returns the last event at or before the given time', () => {
    const event = getEventAtTime(trace, 3);
    expect(event?.type).toBe('compare');
    expect(event?.t).toBe(2);
  });

  it('returns last event when time exceeds all events', () => {
    const event = getEventAtTime(trace, 100);
    expect(event?.type).toBe('swap');
    expect(event?.t).toBe(5);
  });
});
