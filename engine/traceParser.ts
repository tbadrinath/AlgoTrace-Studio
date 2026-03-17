/**
 * traceParser.ts
 * Converts raw JSON execution traces into normalized execution events.
 */

export type EventType =
  | 'line'
  | 'variable_update'
  | 'array_access'
  | 'array_update'
  | 'swap'
  | 'compare'
  | 'pointer_move'
  | 'function_call'
  | 'function_return';

export interface BaseEvent {
  t: number;
  type: EventType;
}

export interface LineEvent extends BaseEvent {
  type: 'line';
  line: number;
}

export interface VariableUpdateEvent extends BaseEvent {
  type: 'variable_update';
  name: string;
  value: unknown;
}

export interface ArrayAccessEvent extends BaseEvent {
  type: 'array_access';
  array: string;
  index: number;
}

export interface ArrayUpdateEvent extends BaseEvent {
  type: 'array_update';
  array: string;
  index: number;
  value: unknown;
}

export interface SwapEvent extends BaseEvent {
  type: 'swap';
  array: string;
  i: number;
  j: number;
}

export interface CompareEvent extends BaseEvent {
  type: 'compare';
  array: string;
  i: number;
  j: number;
}

export interface PointerMoveEvent extends BaseEvent {
  type: 'pointer_move';
  pointer: string;
  index: number;
}

export interface FunctionCallEvent extends BaseEvent {
  type: 'function_call';
  name: string;
  args: Record<string, unknown>;
}

export interface FunctionReturnEvent extends BaseEvent {
  type: 'function_return';
  name: string;
  value: unknown;
}

export type TraceEvent =
  | LineEvent
  | VariableUpdateEvent
  | ArrayAccessEvent
  | ArrayUpdateEvent
  | SwapEvent
  | CompareEvent
  | PointerMoveEvent
  | FunctionCallEvent
  | FunctionReturnEvent;

/**
 * Validates that a raw event has the required fields.
 */
function validateEvent(raw: unknown): raw is TraceEvent {
  if (typeof raw !== 'object' || raw === null) {
    return false;
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.t !== 'number' || typeof obj.type !== 'string') {
    return false;
  }
  const validTypes: EventType[] = [
    'line',
    'variable_update',
    'array_access',
    'array_update',
    'swap',
    'compare',
    'pointer_move',
    'function_call',
    'function_return',
  ];
  return validTypes.includes(obj.type as EventType);
}

/**
 * Parses a raw JSON string or object array into normalized TraceEvent[].
 * Throws an error if the input is malformed.
 */
export function parseTrace(input: string | unknown[]): TraceEvent[] {
  let raw: unknown;

  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input);
    } catch (err) {
      console.error('[traceParser] Failed to parse JSON:', err);
      throw new Error(`Trace parsing failed: invalid JSON. ${(err as Error).message}`);
    }
  } else {
    raw = input;
  }

  if (!Array.isArray(raw)) {
    const msg = '[traceParser] Expected an array of events at the top level.';
    console.error(msg);
    throw new Error(msg);
  }

  const events: TraceEvent[] = [];

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (!validateEvent(item)) {
      console.warn(`[traceParser] Skipping invalid event at index ${i}:`, item);
      continue;
    }
    events.push(item as TraceEvent);
  }

  // Sort by timestamp to ensure correct ordering
  events.sort((a, b) => a.t - b.t);

  return events;
}
