import { usePlayerStore, selectCurrentStep } from "@/core/player/playerStore";
import type { CounterDef } from "@/core/player/types";

type Accent = NonNullable<CounterDef["accent"]>;

const TEXT_CLASS: Record<Accent, string> = {
  compare: "text-viz-compare",
  swap: "text-viz-swap",
  pivot: "text-viz-pivot",
  sorted: "text-viz-sorted",
  primary: "text-primary",
};

const DOT_CLASS: Record<Accent, string> = {
  compare: "bg-viz-compare",
  swap: "bg-viz-swap",
  pivot: "bg-viz-pivot",
  sorted: "bg-viz-sorted",
  primary: "bg-primary",
};

export default function CounterPanel() {
  const counters = usePlayerStore((s) => s.module?.counters ?? []);
  const step = usePlayerStore(selectCurrentStep);

  if (counters.length === 0) return null;

  return (
    <section className="grid grid-cols-2 gap-3">
      {counters.map((c) => {
        const accent: Accent = c.accent ?? "primary";
        const value = step?.counters[c.key] ?? 0;
        return (
          <div
            key={c.key}
            className="flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${DOT_CLASS[accent]}`}
              />
              <span>{c.label}</span>
            </div>
            <span
              className={`font-mono text-3xl font-bold tabular-nums ${TEXT_CLASS[accent]}`}
            >
              {value}
            </span>
          </div>
        );
      })}
    </section>
  );
}
