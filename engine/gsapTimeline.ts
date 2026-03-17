/**
 * gsapTimeline.ts
 * Creates a GSAP timeline from animation instructions.
 * Note: GSAP is used on the client side only.
 */

import type { AnimationInstruction } from './animationMapper';

export interface TimelineCallbacks {
  onHighlightLine?: (line: number) => void;
  onHighlightArrayCell?: (array: string, index: number) => void;
  onUpdateArrayCell?: (array: string, index: number, value: unknown) => void;
  onSwapArrayCells?: (array: string, i: number, j: number) => void;
  onCompareCells?: (array: string, i: number, j: number) => void;
  onMovePointer?: (pointer: string, index: number) => void;
  onUpdateVariable?: (name: string, value: unknown) => void;
  onPushCallStack?: (name: string, args: Record<string, unknown>) => void;
  onPopCallStack?: (name: string, value: unknown) => void;
}

export interface GSAPTimelineInstance {
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (time: number) => void;
  duration: () => number;
  isActive: () => boolean;
  kill: () => void;
}

/**
 * Creates a GSAP timeline from animation instructions.
 * Callbacks are invoked at each animation step.
 */
export async function createGSAPTimeline(
  instructions: AnimationInstruction[],
  callbacks: TimelineCallbacks
): Promise<GSAPTimelineInstance> {
  // Dynamic import to avoid SSR issues
  const gsapModule = await import('gsap');
  const gsap = gsapModule.default || gsapModule;

  const tl = gsap.timeline({ paused: true });

  for (const inst of instructions) {
    const position = inst.t;

    switch (inst.type) {
      case 'highlight_line':
        tl.call(
          () => {
            callbacks.onHighlightLine?.(inst.line);
          },
          [],
          position
        );
        break;

      case 'highlight_array_cell':
        tl.call(
          () => {
            callbacks.onHighlightArrayCell?.(inst.array, inst.index);
          },
          [],
          position
        );
        break;

      case 'update_array_cell':
        tl.call(
          () => {
            callbacks.onUpdateArrayCell?.(inst.array, inst.index, inst.value);
          },
          [],
          position
        );
        break;

      case 'swap_array_cells':
        tl.call(
          () => {
            callbacks.onSwapArrayCells?.(inst.array, inst.i, inst.j);
          },
          [],
          position
        );
        break;

      case 'compare_cells':
        tl.call(
          () => {
            callbacks.onCompareCells?.(inst.array, inst.i, inst.j);
          },
          [],
          position
        );
        break;

      case 'move_pointer':
        tl.call(
          () => {
            callbacks.onMovePointer?.(inst.pointer, inst.index);
          },
          [],
          position
        );
        break;

      case 'update_variable':
        tl.call(
          () => {
            callbacks.onUpdateVariable?.(inst.name, inst.value);
          },
          [],
          position
        );
        break;

      case 'push_call_stack':
        tl.call(
          () => {
            callbacks.onPushCallStack?.(inst.name, inst.args);
          },
          [],
          position
        );
        break;

      case 'pop_call_stack':
        tl.call(
          () => {
            callbacks.onPopCallStack?.(inst.name, inst.value);
          },
          [],
          position
        );
        break;

      default:
        console.warn('[gsapTimeline] Unknown instruction type:', (inst as AnimationInstruction).type);
    }
  }

  // Add a small padding at the end so timeline has a proper duration
  if (instructions.length > 0) {
    const maxT = Math.max(...instructions.map((i) => i.t));
    tl.set({}, {}, maxT + 0.5);
  }

  return {
    play: () => tl.play(),
    pause: () => tl.pause(),
    restart: () => tl.restart(),
    seek: (time: number) => tl.seek(time),
    duration: () => tl.duration(),
    isActive: () => tl.isActive(),
    kill: () => tl.kill(),
  };
}
