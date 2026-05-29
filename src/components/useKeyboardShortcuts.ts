import { useEffect } from "react";
import { usePlayerStore } from "@/core/player/playerStore";

/**
 * 전역 키보드 단축키
 * - Space: 재생/일시정지
 * - ←/→: 이전/다음 스텝
 * - Home/End: 처음/끝
 *
 * 입력 필드(INPUT/TEXTAREA/contentEditable) 포커스 중에는 무시.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const store = usePlayerStore.getState();
      switch (e.code) {
        case "Space":
          e.preventDefault();
          store.togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          store.stepBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          store.stepForward();
          break;
        case "Home":
          e.preventDefault();
          store.reset();
          break;
        case "End":
          e.preventDefault();
          store.seek(store.steps.length - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
