import type { VizPalette } from "../player/types";

function read(s: CSSStyleDeclaration, name: string, fallback: string) {
  const v = s.getPropertyValue(name).trim();
  return v || fallback;
}

/** 현재 테마(:root / .dark)의 CSS 변수를 읽어 캔버스용 팔레트로 변환 */
export function resolvePalette(): VizPalette {
  const s = getComputedStyle(document.documentElement);
  return {
    default: read(s, "--viz-default", "#8fbdec"),
    compare: read(s, "--viz-compare", "#e8b65b"),
    swap: read(s, "--viz-swap", "#e88b8b"),
    pivot: read(s, "--viz-pivot", "#b89be0"),
    sorted: read(s, "--viz-sorted", "#7fcf9f"),
    foreground: read(s, "--foreground", "#1b2a41"),
    mutedForeground: read(s, "--muted-foreground", "#5b6b82"),
    surface: read(s, "--surface", "#ffffff"),
    border: read(s, "--border", "#d3e2f1"),
    primary: read(s, "--primary", "#4f93dd"),
  };
}
