import { useEffect, useRef } from "react";
import type { VizPalette } from "@/core/player/types";
import { usePlayerStore } from "@/core/player/playerStore";
import { useUIStore } from "@/store/uiStore";
import { useAnimationLoop } from "./useAnimationLoop";
import { resolvePalette } from "./palette";

const MAX_TWEEN_MS = 220;

export default function CanvasStage({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const paletteRef = useRef<VizPalette | null>(null);
  const lastIndexRef = useRef(-1);
  const lastStepTimeRef = useRef(0);
  const playAccumRef = useRef(0);

  const theme = useUIStore((s) => s.theme);

  // 테마 변경 시 팔레트 재해석 (Canvas는 CSS 변수를 직접 못 읽음)
  useEffect(() => {
    paletteRef.current = resolvePalette();
  }, [theme]);

  // 캔버스 크기/DPR 동기화
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const sync = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      sizeRef.current = { width, height, dpr };
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // 게임 루프: 자동 진행 + 트윈 보간 + draw
  useAnimationLoop((dt, now) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const st = usePlayerStore.getState();
    const { module, steps, currentIndex, isPlaying, speed } = st;
    const stepIntervalMs = 1000 / speed;

    // 자동 진행 (프레임당 최대 1스텝 → speed 60까지 60fps에 정합)
    if (isPlaying && steps.length > 0) {
      playAccumRef.current += dt;
      if (playAccumRef.current >= stepIntervalMs) {
        playAccumRef.current = 0;
        st.stepForward();
      }
    } else {
      playAccumRef.current = 0;
    }

    // 인덱스 변경 감지 → 트윈 리셋 (자동/수동/seek 공통)
    if (currentIndex !== lastIndexRef.current) {
      lastIndexRef.current = currentIndex;
      lastStepTimeRef.current = now;
    }

    const { width, height, dpr } = sizeRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 논리 좌표계로 그림
    ctx.clearRect(0, 0, width, height);

    if (!module || steps.length === 0) return;

    const palette = paletteRef.current ?? resolvePalette();
    const tweenMs = Math.min(stepIntervalMs, MAX_TWEEN_MS);
    const progress =
      tweenMs <= 0 ? 1 : Math.min(1, (now - lastStepTimeRef.current) / tweenMs);

    module.draw(ctx, {
      step: steps[currentIndex],
      prevStep: currentIndex > 0 ? steps[currentIndex - 1] : null,
      progress,
      width,
      height,
      palette,
    });
  });

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
