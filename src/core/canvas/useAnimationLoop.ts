import { useEffect, useRef } from "react";

/**
 * requestAnimationFrame 루프. active인 동안 매 프레임 callback(dt, now)을 호출.
 * callback은 ref로 보관 → 매 렌더마다 최신값을 쓰되 루프는 재시작하지 않는다.
 */
export function useAnimationLoop(
  callback: (dt: number, now: number) => void,
  active = true,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      cbRef.current(dt, now);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
