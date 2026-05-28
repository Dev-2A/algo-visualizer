import { create } from "zustand";
import type { AlgoModule, AlgoStep } from "./types";

const DEFAULT_SPEED = 8; // 초당 스텝 수
const MIN_SPEED = 0.5;
const MAX_SPEED = 60;

export interface PlayerState {
  module: AlgoModule | null;
  input: unknown;
  steps: AlgoStep[];
  currentIndex: number;
  isPlaying: boolean;
  /** 초당 진행 스텝 수 (애니메이션 루프가 이 값으로 진행 속도를 결정) */
  speed: number;

  // ── 로딩 ─────────────────────────────
  load: (module: AlgoModule, input?: unknown) => void;
  setInput: (input: unknown) => void;

  // ── 트랜스포트 ───────────────────────
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seek: (index: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  module: null,
  input: null,
  steps: [],
  currentIndex: 0,
  isPlaying: false,
  speed: DEFAULT_SPEED,

  load: (module, input) => {
    const usedInput = input ?? module.defaultInput;
    set({
      module,
      input: usedInput,
      steps: module.generate(usedInput),
      currentIndex: 0,
      isPlaying: false,
    });
  },

  setInput: (input) => {
    const { module } = get();
    if (!module) return;
    set({
      input,
      steps: module.generate(input),
      currentIndex: 0,
      isPlaying: false,
    });
  },

  play: () => {
    const { steps, currentIndex } = get();
    if (steps.length === 0) return;
    // 끝에서 재생을 누르면 처음부터 다시
    if (currentIndex >= steps.length - 1) {
      set({ currentIndex: 0, isPlaying: true });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => set({ isPlaying: false }),

  togglePlay: () => {
    if (get().isPlaying) get().pause();
    else get().play();
  },

  stepForward: () => {
    const { currentIndex, steps } = get();
    if (currentIndex < steps.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ isPlaying: false }); // 끝 도달 → 정지
    }
  },

  stepBackward: () => {
    const { currentIndex } = get();
    if (currentIndex > 0)
      set({ currentIndex: currentIndex - 1, isPlaying: false });
  },

  seek: (index) => {
    const { steps } = get();
    if (steps.length === 0) return;
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    set({ currentIndex: clamped, isPlaying: false });
  },

  reset: () => set({ currentIndex: 0, isPlaying: false }),

  setSpeed: (speed) =>
    set({ speed: Math.max(MIN_SPEED, Math.min(speed, MAX_SPEED)) }),
}));

// ── 파생 셀렉터 ─────────────────────────────
export const selectCurrentStep = (s: PlayerState): AlgoStep | null =>
  s.steps[s.currentIndex] ?? null;

export const selectPrevStep = (s: PlayerState): AlgoStep | null =>
  s.currentIndex > 0 ? (s.steps[s.currentIndex - 1] ?? null) : null;

export const selectTotalSteps = (s: PlayerState): number => s.steps.length;

/** 0..1 진행률 (타임라인/프로그레스 바용) */
export const selectProgress = (s: PlayerState): number =>
  s.steps.length <= 1 ? 0 : s.currentIndex / (s.steps.length - 1);

/** 마지막 스텝 도달 여부 (루프 종료 판단) */
export const selectIsFinished = (s: PlayerState): boolean =>
  s.steps.length > 0 && s.currentIndex >= s.steps.length - 1;
