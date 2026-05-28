import { useEffect, type ReactNode } from "react";
import {
  Moon,
  Sun,
  Activity,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import {
  usePlayerStore,
  selectCurrentStep,
  selectTotalSteps,
  selectIsFinished,
} from "@/core/player/playerStore";
import demoModule from "@/core/player/_demoModule";

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const load = usePlayerStore((s) => s.load);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const stepForward = usePlayerStore((s) => s.stepForward);
  const stepBackward = usePlayerStore((s) => s.stepBackward);
  const reset = usePlayerStore((s) => s.reset);
  const seek = usePlayerStore((s) => s.seek);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const step = usePlayerStore(selectCurrentStep);
  const total = usePlayerStore(selectTotalSteps);
  const finished = usePlayerStore(selectIsFinished);

  // 임시: 데모 모듈 로드 (Step 4에서 실제 정렬 모듈로 교체)
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

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-14">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-primary-soft px-3 py-1 font-mono text-xs font-medium text-primary">
            Step 2 · 플레이어 코어 점검
          </span>
          <p className="text-sm text-muted-foreground">
            도메인 무지 플레이어 스토어를 직접 조작하는 임시 점검 패널입니다.
            자동 재생은 애니메이션 루프가 들어오는 Step 3부터 동작합니다.
          </p>
        </div>

        {/* 상태 표시 */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">
              step {currentIndex} / {Math.max(total - 1, 0)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-xs ${
                finished
                  ? "bg-viz-sorted/20 text-foreground"
                  : "bg-primary-soft text-primary"
              }`}
            >
              {finished ? "finished" : isPlaying ? "playing" : "paused"}
            </span>
          </div>

          {/* 진행 막대 */}
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{
                width:
                  total > 1 ? `${(currentIndex / (total - 1)) * 100}%` : "0%",
              }}
            />
          </div>

          <pre className="overflow-x-auto rounded-xl bg-surface-muted p-4 font-mono text-sm text-foreground">
            {JSON.stringify(
              {
                note: step?.note,
                pseudoLine: step?.pseudoLine,
                counters: step?.counters,
                state: step?.state,
              },
              null,
              2,
            )}
          </pre>
        </section>

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
            className="rounded-xl bg-primary px-5 py-2.5 font-medium text-on-primary transition hover:bg-primary-hover"
          >
            {isPlaying ? "일시정지" : "재생"}
          </button>
          <CtrlButton label="다음" onClick={stepForward}>
            <ChevronRight size={18} />
          </CtrlButton>
          <CtrlButton label="끝" onClick={() => seek(total - 1)}>
            <SkipForward size={18} />
          </CtrlButton>
        </section>
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
