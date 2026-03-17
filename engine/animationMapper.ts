/**
 * animationMapper.ts
 * Maps normalized execution events into animation instructions.
 */

import type { TraceEvent } from './traceParser';

export type AnimationType =
  | 'highlight_line'
  | 'highlight_array_cell'
  | 'update_array_cell'
  | 'swap_array_cells'
  | 'compare_cells'
  | 'move_pointer'
  | 'update_variable'
  | 'push_call_stack'
  | 'pop_call_stack';

export interface BaseInstruction {
  t: number;
  type: AnimationType;
  duration: number;
}

export interface HighlightLineInstruction extends BaseInstruction {
  type: 'highlight_line';
  line: number;
}

export interface HighlightArrayCellInstruction extends BaseInstruction {
  type: 'highlight_array_cell';
  array: string;
  index: number;
}

export interface UpdateArrayCellInstruction extends BaseInstruction {
  type: 'update_array_cell';
  array: string;
  index: number;
  value: unknown;
}

export interface SwapArrayCellsInstruction extends BaseInstruction {
  type: 'swap_array_cells';
  array: string;
  i: number;
  j: number;
}

export interface CompareCellsInstruction extends BaseInstruction {
  type: 'compare_cells';
  array: string;
  i: number;
  j: number;
}

export interface MovePointerInstruction extends BaseInstruction {
  type: 'move_pointer';
  pointer: string;
  index: number;
}

export interface UpdateVariableInstruction extends BaseInstruction {
  type: 'update_variable';
  name: string;
  value: unknown;
}

export interface PushCallStackInstruction extends BaseInstruction {
  type: 'push_call_stack';
  name: string;
  args: Record<string, unknown>;
}

export interface PopCallStackInstruction extends BaseInstruction {
  type: 'pop_call_stack';
  name: string;
  value: unknown;
}

export type AnimationInstruction =
  | HighlightLineInstruction
  | HighlightArrayCellInstruction
  | UpdateArrayCellInstruction
  | SwapArrayCellsInstruction
  | CompareCellsInstruction
  | MovePointerInstruction
  | UpdateVariableInstruction
  | PushCallStackInstruction
  | PopCallStackInstruction;

const DEFAULT_DURATION = 0.4;

/**
 * Maps a single TraceEvent to an AnimationInstruction.
 * Returns null if the event type is not supported.
 */
export function mapEventToInstruction(
  event: TraceEvent
): AnimationInstruction | null {
  switch (event.type) {
    case 'line':
      return {
        t: event.t,
        type: 'highlight_line',
        duration: DEFAULT_DURATION,
        line: event.line,
      };

    case 'variable_update':
      return {
        t: event.t,
        type: 'update_variable',
        duration: DEFAULT_DURATION,
        name: event.name,
        value: event.value,
      };

    case 'array_access':
      return {
        t: event.t,
        type: 'highlight_array_cell',
        duration: DEFAULT_DURATION,
        array: event.array,
        index: event.index,
      };

    case 'array_update':
      return {
        t: event.t,
        type: 'update_array_cell',
        duration: DEFAULT_DURATION,
        array: event.array,
        index: event.index,
        value: event.value,
      };

    case 'swap':
      return {
        t: event.t,
        type: 'swap_array_cells',
        duration: DEFAULT_DURATION * 1.5,
        array: event.array,
        i: event.i,
        j: event.j,
      };

    case 'compare':
      return {
        t: event.t,
        type: 'compare_cells',
        duration: DEFAULT_DURATION,
        array: event.array,
        i: event.i,
        j: event.j,
      };

    case 'pointer_move':
      return {
        t: event.t,
        type: 'move_pointer',
        duration: DEFAULT_DURATION,
        pointer: event.pointer,
        index: event.index,
      };

    case 'function_call':
      return {
        t: event.t,
        type: 'push_call_stack',
        duration: DEFAULT_DURATION,
        name: event.name,
        args: event.args,
      };

    case 'function_return':
      return {
        t: event.t,
        type: 'pop_call_stack',
        duration: DEFAULT_DURATION,
        name: event.name,
        value: event.value,
      };

    default:
      console.warn('[animationMapper] Unknown event type:', (event as TraceEvent).type);
      return null;
  }
}

/**
 * Maps an array of TraceEvents into AnimationInstructions.
 */
export function mapTrace(events: TraceEvent[]): AnimationInstruction[] {
  const instructions: AnimationInstruction[] = [];

  for (const event of events) {
    const instruction = mapEventToInstruction(event);
    if (instruction !== null) {
      instructions.push(instruction);
    }
  }

  return instructions;
}
