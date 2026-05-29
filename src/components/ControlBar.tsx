import { type ReactNode } from "react";
import {
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Gauge,
} from "lucide-react";
import { usePlayerStore, selectTotalSteps } from "@/core/player/playerStore";

export default function ControlBar() {
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const speed = usePlayerStore((s) => s.speed);
  const total = usePlayerStore(selectTotalSteps);

  const setSpeed = usePlayerStore((s) => s.setSpeed);
  const stepForward = usePlayerStore((s) => s.stepForward);
  const stepBackward = usePlayerStore((s) => s.stepBackward);
  const reset = usePlayerStore((s) => s.reset);
  const seek = usePlayerStore((s) => s.seek);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const lastIdx = Math.max(total - 1, 0);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      {/* 타임라인 */}
      <div className="flex items-center gap-3">
        <span className="w-10 font-mono text-xs text-muted-foreground">
          {currentIndex}
        </span>
        <input
          type="range"
          min={0}
          max={lastIdx}
          value={currentIndex}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="타임라인"
          className="flex-1 accent-[var(--primary)]"
        />
        <span className="w-10 text-right font-mono text-xs text-muted-foreground">
          {lastIdx}
        </span>
      </div>

      {/* 트랜스포트 + 속도 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-2">
          <IconBtn label="처음 (Home)" onClick={reset}>
            <SkipBack size={18} />
          </IconBtn>
          <IconBtn label="이전 스텝 (←)" onClick={stepBackward}>
            <ChevronLeft size={18} />
          </IconBtn>
          <button
            onClick={togglePlay}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={isPlaying ? "일시정지 (Space)" : "재생 (Space)"}
            title={isPlaying ? "일시정지 (Space)" : "재생 (Space)"}
            className="flex min-w-[112px] items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-medium text-on-primary transition hover:bg-primary-hover"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "일시정지" : "재생"}
          </button>
          <IconBtn label="다음 스텝 (→)" onClick={stepForward}>
            <ChevronRight size={18} />
          </IconBtn>
          <IconBtn label="끝 (End)" onClick={() => seek(lastIdx)}>
            <SkipForward size={18} />
          </IconBtn>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Gauge size={14} />
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="재생 속도"
            className="w-28 accent-[var(--primary)]"
          />
          <span className="w-16 text-right text-foreground">
            {speed} step/s
          </span>
        </div>
      </div>
    </section>
  );
}

function IconBtn({
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
      onMouseDown={(e) => e.preventDefault()}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-muted"
    >
      {children}
    </button>
  );
}
