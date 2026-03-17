import { mapEventToAnimation, mapTraceToAnimations } from '../engine/animationMapper';
import { parseTrace } from '../engine/traceParser';
import type { TraceEvent } from '../engine/traceParser';

function makeEvent(overrides: Partial<TraceEvent> & { type: TraceEvent['type'] }): TraceEvent {
  return { t: 0, ...overrides };
}

describe('mapEventToAnimation', () => {
  it('maps "line" event to highlight_line instruction', () => {
    const result = mapEventToAnimation(makeEvent({ type: 'line', line: 5 }));
    expect(result.type).toBe('highlight_line');
    expect(result.target).toBe('code_editor');
    expect(result.properties['line']).toBe(5);
  });

  it('maps "array_access" event to highlight_cell instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'array_access', array: 'arr', index: 2 })
    );
    expect(result.type).toBe('highlight_cell');
    expect(result.properties['index']).toBe(2);
  });

  it('maps "array_update" event to update_cell instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'array_update', array: 'arr', index: 3, value: 99 })
    );
    expect(result.type).toBe('update_cell');
    expect(result.properties['index']).toBe(3);
    expect(result.properties['value']).toBe(99);
  });

  it('maps "swap" event to animate_swap instruction with longer duration', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'swap', array: 'arr', index1: 0, index2: 1 })
    );
    expect(result.type).toBe('animate_swap');
    expect(result.properties['index1']).toBe(0);
    expect(result.properties['index2']).toBe(1);
    expect(result.duration).toBeGreaterThan(0.3);
  });

  it('maps "variable_update" event to update_variable instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'variable_update', name: 'n', value: 7 })
    );
    expect(result.type).toBe('update_variable');
    expect(result.target).toBe('variable_panel');
    expect(result.properties['name']).toBe('n');
    expect(result.properties['value']).toBe(7);
  });

  it('maps "compare" event to highlight_comparison instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'compare', index1: 2, index2: 3 })
    );
    expect(result.type).toBe('highlight_comparison');
    expect(result.properties['index1']).toBe(2);
    expect(result.properties['index2']).toBe(3);
  });

  it('maps "pointer_move" event to move_pointer instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'pointer_move', name: 'i', index: 4 })
    );
    expect(result.type).toBe('move_pointer');
    expect(result.properties['index']).toBe(4);
  });

  it('maps "function_call" event to push_call_stack instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'function_call', name: 'foo', args: { x: 1 } })
    );
    expect(result.type).toBe('push_call_stack');
    expect(result.target).toBe('call_stack');
    expect(result.properties['name']).toBe('foo');
  });

  it('maps "function_return" event to pop_call_stack instruction', () => {
    const result = mapEventToAnimation(
      makeEvent({ type: 'function_return', name: 'foo' })
    );
    expect(result.type).toBe('pop_call_stack');
    expect(result.target).toBe('call_stack');
  });

  it('sets timestamp from event t field', () => {
    const result = mapEventToAnimation(makeEvent({ type: 'line', line: 1, t: 3.5 }));
    expect(result.timestamp).toBe(3.5);
  });
});

describe('mapTraceToAnimations', () => {
  it('returns the same number of instructions as events', () => {
    const trace = parseTrace({
      events: [
        { t: 0, type: 'line', line: 1 },
        { t: 1, type: 'variable_update', name: 'x', value: 5 },
        { t: 2, type: 'swap', index1: 0, index2: 1 },
      ],
    });
    const instructions = mapTraceToAnimations(trace);
    expect(instructions).toHaveLength(3);
  });

  it('returns AnimationInstruction objects with required fields', () => {
    const trace = parseTrace({
      events: [{ t: 0, type: 'compare', index1: 0, index2: 1 }],
    });
    const [instr] = mapTraceToAnimations(trace);
    expect(instr).toHaveProperty('type');
    expect(instr).toHaveProperty('target');
    expect(instr).toHaveProperty('properties');
    expect(instr).toHaveProperty('duration');
    expect(instr).toHaveProperty('timestamp');
  });

  it('returns empty array for trace with no events', () => {
    const trace = parseTrace({ events: [] });
    expect(mapTraceToAnimations(trace)).toHaveLength(0);
  });
});
