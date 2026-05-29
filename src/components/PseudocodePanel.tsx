import { Code2 } from "lucide-react";
import { usePlayerStore, selectCurrentStep } from "@/core/player/playerStore";

export default function PseudocodePanel() {
  const moduleName = usePlayerStore((s) => s.module?.name);
  const pseudocode = usePlayerStore((s) => s.module?.pseudocode ?? []);
  const step = usePlayerStore(selectCurrentStep);
  const activeLine = step?.pseudoLine ?? -1;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Code2 size={16} className="text-primary" />
          <span>의사코드</span>
        </div>
        {moduleName && (
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-mono text-[11px] font-medium text-primary">
            {moduleName}
          </span>
        )}
      </header>

      <ol className="flex flex-col font-mono text-[13px] leading-6">
        {pseudocode.map((line, i) => {
          const active = i === activeLine;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-md px-2 py-0.5 transition-colors duration-150 ${
                active ? "bg-primary-soft" : ""
              }`}
            >
              {/* 좌측 인디케이터 */}
              <span
                aria-hidden
                className={`h-4 w-1 rounded-full transition-colors ${
                  active ? "bg-primary" : "bg-transparent"
                }`}
              />
              {/* 라인 넘버 */}
              <span
                className={`w-5 shrink-0 select-none text-right tabular-nums ${
                  active ? "text-primary" : "text-muted-foreground/60"
                }`}
              >
                {i}
              </span>
              {/* 내용 */}
              <span
                className={`whitespace-pre ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {line}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
