import type { DrawParams } from "src/core/player/types";
import type { SortState } from "./types";

const BAR_GAP = 2;
const PAD_X = 12;
const PAD_Y = 14;

export function drawSorting(
  ctx: CanvasRenderingContext2D,
  { step, progress, width, height, palette }: DrawParams<SortState>,
) {
  const { array, compare, swap, pivot, sortedFlags } = step.state;
  const n = array.length;
  if (n === 0) return;

  const usableW = Math.max(0, width - PAD_X * 2);
  const usableH = Math.max(0, height - PAD_Y * 2);
  const slotW = usableW / n;
  const barW = Math.max(1, slotW - BAR_GAP);

  // 값 → 높이 (최대값 기준)
  let maxVal = 1;
  for (let i = 0; i < n; i++) if (array[i] > maxVal) maxVal = array[i];

  const slotX = (idx: number) => PAD_X + idx * slotW;
  const barH = (val: number) => (val / maxVal) * usableH;

  // 스왑 트윈: swap=[a,b]일 때 a/b의 표시 X를 prev↔current로 보간
  // (현재 step.array는 이미 스왑된 상태이므로, a의 막대는 b의 슬롯에서 a의 슬롯으로 슬라이드)
  const lerpX = (idx: number): number => {
    if (!swap) return slotX(idx);
    const [a, b] = swap;
    if (idx === a) return slotX(b) + (slotX(a) - slotX(b)) * progress;
    if (idx === b) return slotX(a) + (slotX(b) - slotX(a)) * progress;
    return slotX(idx);
  };

  for (let i = 0; i < n; i++) {
    const h = barH(array[i]);
    const x = lerpX(i);
    const y = PAD_Y + (usableH - h);

    // 색 우선순위: sorted > swap > compare > pivot > default
    let color = palette.default;
    if (sortedFlags[i]) color = palette.sorted;
    else if (swap && (i === swap[0] || i === swap[1])) color = palette.swap;
    else if (compare && (i === compare[0] || i === compare[1]))
      color = palette.compare;
    else if (pivot === i) color = palette.pivot;

    ctx.fillStyle = color;
    roundRect(ctx, x, y, barW, h, 4);
    ctx.fill();
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
