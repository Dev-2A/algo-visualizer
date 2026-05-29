import { useEffect } from "react";
import { Moon, Sun, Activity } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import {
  usePlayerStore,
  selectCurrentStep,
  selectTotalSteps,
  selectIsFinished,
} from "@/core/player/playerStore";
import CanvasStage from "@/core/canvas/CanvasStage";
import ControlBar from "@/components/ControlBar";
import PseudocodePanel from "@/components/PseudocodePanel";
import CounterPanel from "@/components/CounterPanel";
import { useKeyboardShortcuts } from "@/components/useKeyboardShortcuts";
import { bubbleSort } from "@/modules/sorting";

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const load = usePlayerStore((s) => s.load);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const step = usePlayerStore(selectCurrentStep);
  const total = usePlayerStore(selectTotalSteps);
  const finished = usePlayerStore(selectIsFinished);

  useEffect(() => {
    load(bubbleSort);
  }, [load]);
  useKeyboardShortcuts();

  const lastIdx = Math.max(total - 1, 0);

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

      <main className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-10">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-primary-soft px-3 py-1 font-mono text-xs font-medium text-primary">
            Step 7 · 카운터 패널 + 색상 우선순위
          </span>
          <p className="text-sm text-muted-foreground">
            비교·스왑 카운트가 사이드바 카드로 승격됐고, 막대 색은{" "}
            <span className="text-viz-sorted">sorted</span> &gt;{" "}
            <span className="text-viz-swap">swap</span> &gt;{" "}
            <span className="text-viz-compare">compare</span> &gt;{" "}
            <span className="text-viz-pivot">pivot</span> 순으로 우선합니다.
          </p>
        </div>

        {/* 2단: 캔버스+상태 | 사이드바(의사코드 + 카운터) */}
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <CanvasStage className="h-72 w-full sm:h-[400px]" />
            </div>
            {/* 상태 줄 (카운터는 패널로 이동, step/state만) */}
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>
                step {currentIndex} / {lastIdx}
              </span>
              <span className={finished ? "text-viz-sorted" : "text-primary"}>
                {finished ? "finished" : isPlaying ? "playing" : "paused"}
              </span>
            </div>
            {/* note */}
            <div className="rounded-xl bg-surface-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              {step?.note ?? "\u00A0"}
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <PseudocodePanel />
            <CounterPanel />
          </aside>
        </div>

        <ControlBar />

        {/* 단축키 안내 */}
        <p className="text-center text-[11px] text-muted-foreground/70">
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5 font-mono">
            Space
          </kbd>{" "}
          재생/일시정지 ·{" "}
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5 font-mono">
            ←
          </kbd>{" "}
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5 font-mono">
            →
          </kbd>{" "}
          스텝 ·{" "}
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5 font-mono">
            Home
          </kbd>{" "}
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5 font-mono">
            End
          </kbd>{" "}
          처음/끝
        </p>
      </main>
    </div>
  );
}
