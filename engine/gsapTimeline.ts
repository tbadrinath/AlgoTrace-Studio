import type { AnimationInstruction } from './animationMapper';

type UpdateCallback = (step: number) => void;

export class GSAPTimeline {
  private instructions: AnimationInstruction[];
  private currentStep = 0;
  private playing = false;
  private updateCallback: UpdateCallback | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gsapInstance: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tl: any = null;

  constructor(instructions: AnimationInstruction[]) {
    this.instructions = instructions;
  }

  private async loadGSAP(): Promise<void> {
    if (this.gsapInstance) return;
    const mod = await import('gsap');
    this.gsapInstance = mod.gsap ?? mod.default;
    this.tl = this.gsapInstance.timeline({ paused: true });

    for (const instr of this.instructions) {
      this.tl.to(
        {},
        {
          duration: instr.duration,
          onStart: () => {
            this.currentStep = this.instructions.indexOf(instr);
            this.updateCallback?.(this.currentStep);
          },
        },
        instr.timestamp
      );
    }
  }

  async play(): Promise<void> {
    await this.loadGSAP();
    this.playing = true;
    this.tl?.play();
  }

  async pause(): Promise<void> {
    await this.loadGSAP();
    this.playing = false;
    this.tl?.pause();
  }

  async stepForward(): Promise<void> {
    await this.loadGSAP();
    this.playing = false;
    this.tl?.pause();
    const next = this.currentStep + 1;
    if (next < this.instructions.length) {
      const instr = this.instructions[next];
      this.tl?.seek(instr.timestamp);
      this.currentStep = next;
      this.updateCallback?.(this.currentStep);
    }
  }

  async restart(): Promise<void> {
    await this.loadGSAP();
    this.playing = false;
    this.tl?.restart().pause();
    this.currentStep = 0;
    this.updateCallback?.(0);
  }

  async scrub(progress: number): Promise<void> {
    await this.loadGSAP();
    const clamped = Math.max(0, Math.min(1, progress));
    const duration: number = this.tl?.duration() ?? 0;
    this.tl?.seek(clamped * duration);
    this.currentStep = Math.floor(clamped * (this.instructions.length - 1));
    this.updateCallback?.(this.currentStep);
  }

  onUpdate(callback: UpdateCallback): void {
    this.updateCallback = callback;
  }
}
