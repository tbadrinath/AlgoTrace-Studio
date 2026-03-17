import { mapTrace, mapEventToInstruction } from '@/engine/animationMapper';
import { TraceEvent } from '@/engine/traceParser';

describe('animationMapper', () => {
  describe('mapEventToInstruction', () => {
    it('maps line event to highlight_line', () => {
      const event: TraceEvent = { t: 0.5, type: 'line', line: 3 };
      const inst = mapEventToInstruction(event);
      expect(inst).not.toBeNull();
      expect(inst!.type).toBe('highlight_line');
      expect((inst as { line: number }).line).toBe(3);
    });

    it('maps variable_update to update_variable', () => {
      const event: TraceEvent = { t: 1.0, type: 'variable_update', name: 'x', value: 42 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('update_variable');
    });

    it('maps array_access to highlight_array_cell', () => {
      const event: TraceEvent = { t: 1.5, type: 'array_access', array: 'nums', index: 2 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('highlight_array_cell');
    });

    it('maps array_update to update_array_cell', () => {
      const event: TraceEvent = { t: 2.0, type: 'array_update', array: 'nums', index: 0, value: 99 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('update_array_cell');
    });

    it('maps swap to swap_array_cells with 1.5x duration', () => {
      const event: TraceEvent = { t: 2.5, type: 'swap', array: 'arr', i: 0, j: 1 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('swap_array_cells');
      expect(inst!.duration).toBeGreaterThan(0.4);
    });

    it('maps compare to compare_cells', () => {
      const event: TraceEvent = { t: 3.0, type: 'compare', array: 'arr', i: 1, j: 2 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('compare_cells');
    });

    it('maps pointer_move to move_pointer', () => {
      const event: TraceEvent = { t: 3.5, type: 'pointer_move', pointer: 'p', index: 5 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('move_pointer');
    });

    it('maps function_call to push_call_stack', () => {
      const event: TraceEvent = { t: 4.0, type: 'function_call', name: 'foo', args: { n: 5 } };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('push_call_stack');
    });

    it('maps function_return to pop_call_stack', () => {
      const event: TraceEvent = { t: 4.5, type: 'function_return', name: 'foo', value: 42 };
      const inst = mapEventToInstruction(event);
      expect(inst!.type).toBe('pop_call_stack');
    });
  });

  describe('mapTrace', () => {
    it('maps all events in order', () => {
      const events: TraceEvent[] = [
        { t: 0.0, type: 'line', line: 1 },
        { t: 0.5, type: 'array_access', array: 'arr', index: 0 },
        { t: 1.0, type: 'swap', array: 'arr', i: 0, j: 1 },
      ];
      const instructions = mapTrace(events);
      expect(instructions).toHaveLength(3);
      expect(instructions[0].type).toBe('highlight_line');
      expect(instructions[1].type).toBe('highlight_array_cell');
      expect(instructions[2].type).toBe('swap_array_cells');
    });

    it('returns empty array for empty input', () => {
      expect(mapTrace([])).toHaveLength(0);
    });
  });
});
