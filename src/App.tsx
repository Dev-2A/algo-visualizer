import { Moon, Sun, Activity } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

const vizSwatches = [
  { label: "기본", className: "bg-viz-default" },
  { label: "비교", className: "bg-viz-compare" },
  { label: "스왑", className: "bg-viz-swap" },
  { label: "피벗", className: "bg-viz-pivot" },
  { label: "정렬됨", className: "bg-viz-sorted" },
];

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

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

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
        <section className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-primary-soft px-3 py-1 font-mono text-xs font-medium text-primary">
            Step 1 · 스캐폴딩 완료
          </span>
          <h2 className="text-3xl font-bold tracking-tight">
            파스텔 블루 토큰 &amp; 다크 모드 점검
          </h2>
          <p className="max-w-prose text-muted-foreground">
            우측 상단 버튼으로 테마를 전환하면 토큰이 즉시 반영됩니다. 아래는
            정렬 시각화에 쓸 상태 색상 팔레트입니다.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {vizSwatches.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4"
            >
              <span className={`h-12 w-full rounded-lg ${s.className}`} />
              <span className="font-mono text-xs text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 font-mono text-sm">
          <p className="text-muted-foreground"># 현재 테마</p>
          <p className="mt-1 text-foreground">
            theme = <span className="text-primary">"{theme}"</span>
          </p>
        </section>
      </main>
    </div>
  );
}
