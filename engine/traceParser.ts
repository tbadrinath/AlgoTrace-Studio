export type TraceEventType =
  | 'line'
  | 'variable_update'
  | 'array_access'
  | 'array_update'
  | 'swap'
  | 'compare'
  | 'pointer_move'
  | 'function_call'
  | 'function_return';

export interface TraceEvent {
  t: number;
  type: TraceEventType;
  [key: string]: unknown;
}

export interface ParsedTrace {
  events: TraceEvent[];
  metadata: Record<string, unknown>;
}

const VALID_TYPES: ReadonlySet<string> = new Set<TraceEventType>([
  'line',
  'variable_update',
  'array_access',
  'array_update',
  'swap',
  'compare',
  'pointer_move',
  'function_call',
  'function_return',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseEvent(raw: unknown, index: number): TraceEvent {
  if (!isRecord(raw)) {
    throw new Error(`Event at index ${index} is not an object`);
  }
  if (typeof raw['t'] !== 'number') {
    throw new Error(`Event at index ${index} missing numeric field "t"`);
  }
  if (typeof raw['type'] !== 'string' || !VALID_TYPES.has(raw['type'])) {
    throw new Error(
      `Event at index ${index} has invalid type: "${String(raw['type'])}"`
    );
  }
  return raw as TraceEvent;
}

export function parseTrace(json: unknown): ParsedTrace {
  if (!isRecord(json)) {
    throw new Error('Trace must be a JSON object');
  }

  const rawEvents = json['events'];
  if (!Array.isArray(rawEvents)) {
    throw new Error('Trace must have an "events" array');
  }

  const events = rawEvents.map((e, i) => parseEvent(e, i));

  // Sort by timestamp to ensure correct ordering
  events.sort((a, b) => a.t - b.t);

  const metadata: Record<string, unknown> = {};
  for (const key of Object.keys(json)) {
    if (key !== 'events') {
      metadata[key] = json[key];
    }
  }

  return { events, metadata };
}

export function getEventAtTime(
  trace: ParsedTrace,
  time: number
): TraceEvent | null {
  let result: TraceEvent | null = null;
  for (const event of trace.events) {
    if (event.t <= time) {
      result = event;
    } else {
      break;
    }
  }
  return result;
}
