import { useEffect, type ReactNode } from "react";
import {
  Moon,
  Sun,
  Activity,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import {
  usePlayerStore,
  selectCurrentStep,
  selectTotalSteps,
  selectIsFinished,
} from "@/core/player/playerStore";
import CanvasStage from "@/core/canvas/CanvasStage";
import demoModule from "@/core/player/_demoModule";

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const load = usePlayerStore((s) => s.load);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const speed = usePlayerStore((s) => s.speed);
  const setSpeed = usePlayerStore((s) => s.setSpeed);
  const stepForward = usePlayerStore((s) => s.stepForward);
  const stepBackward = usePlayerStore((s) => s.stepBackward);
  const reset = usePlayerStore((s) => s.reset);
  const seek = usePlayerStore((s) => s.seek);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const step = usePlayerStore(selectCurrentStep);
  const total = usePlayerStore(selectTotalSteps);
  const finished = usePlayerStore(selectIsFinished);
  const lastIdx = Math.max(total - 1, 0);

  useEffect(() => {
    load(demoModule);
  }, [load]);

  return (
    <div className="min-h-full">
      <header className="flex items-center justify-between border-b border-border bg-surface/60 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary">
            <Activity size={20} strokeWidth={2.4} />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight">
              Algo Visualizer
            </h1>
            <p className="text-xs text-muted-foreground">
              알고리즘 단계별 시각화
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="테마 전환"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-muted"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-5 px-6 py-12">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-primary-soft px-3 py-1 font-mono text-xs font-medium text-primary">
            Step 3 · 캔버스 게임 루프 점검
          </span>
          <p className="text-sm text-muted-foreground">
            재생하면 rAF 루프가 속도에 맞춰 자동 진행하고 스텝 사이를
            보간(트윈)합니다. 끝에 닿으면 자동 정지하고, 테마를 바꾸면 캔버스
            색도 따라옵니다.
          </p>
        </div>

        {/* 캔버스 */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <CanvasStage className="h-64 w-full" />
        </div>

        {/* 상태 줄 */}
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>
            step {currentIndex} / {lastIdx}
          </span>
          <span>
            {step?.note} · line {step?.pseudoLine}
          </span>
          <span className={finished ? "text-foreground" : "text-primary"}>
            {finished ? "finished" : isPlaying ? "playing" : "paused"}
          </span>
        </div>

        {/* 타임라인 (드래그 seek) */}
        <input
          type="range"
          min={0}
          max={lastIdx}
          value={currentIndex}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />

        {/* 트랜스포트 */}
        <section className="flex items-center justify-center gap-2">
          <CtrlButton label="처음" onClick={reset}>
            <SkipBack size={18} />
          </CtrlButton>
          <CtrlButton label="이전" onClick={stepBackward}>
            <ChevronLeft size={18} />
          </CtrlButton>
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-medium text-on-primary transition hover:bg-primary-hover"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "일시정지" : "재생"}
          </button>
          <CtrlButton label="다음" onClick={stepForward}>
            <ChevronRight size={18} />
          </CtrlButton>
          <CtrlButton label="끝" onClick={() => seek(lastIdx)}>
            <SkipForward size={18} />
          </CtrlButton>
        </section>

        {/* 속도 (임시 — Step 5 컨트롤 바에서 정식화) */}
        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <span>속도</span>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
          />
          <span className="w-20 text-right text-foreground">
            {speed} step/s
          </span>
        </div>
      </main>
    </div>
  );
}

function CtrlButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-muted"
    >
      {children}
    </button>
  );
}
