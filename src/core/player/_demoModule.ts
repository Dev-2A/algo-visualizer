import type { AlgoModule, AlgoStep } from "./types";

/**
 * ⚠️ 임시: 플레이어 코어 + 캔버스 루프 점검용 더미 모듈.
 * 실제 정렬 모듈을 추가하는 Step 4에서 이 파일은 삭제됩니다.
 */
interface DemoState {
  value: number;
  max: number;
}

const STEPS = 6;

const demoModule: AlgoModule<number, DemoState> = {
  id: "demo",
  name: "데모",
  category: "sorting",
  pseudocode: ["for i in 0..n:", "  move(i)", "done()"],
  counters: [{ key: "i", label: "진행" }],
  defaultInput: STEPS,
  generate: (max) => {
    const steps: AlgoStep<DemoState>[] = [];
    for (let i = 0; i <= max; i++) {
      steps.push({
        state: { value: i, max },
        pseudoLine: i === 0 ? 0 : i === max ? 2 : 1,
        counters: { i },
        note: `value = ${i}`,
      });
    }
    return steps;
  },
  draw: (ctx, { step, prevStep, progress, width, height, palette }) => {
    const max = step.state.max || 1;
    const from = prevStep ? prevStep.state.value : step.state.value;
    const v = from + (step.state.value - from) * progress; // 보간된 위치

    const pad = 40;
    const trackY = height / 2;
    const x = pad + ((width - pad * 2) * v) / max;

    // 트랙
    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.border;
    ctx.beginPath();
    ctx.moveTo(pad, trackY);
    ctx.lineTo(width - pad, trackY);
    ctx.stroke();

    // 진행 채움
    ctx.strokeStyle = palette.primary;
    ctx.beginPath();
    ctx.moveTo(pad, trackY);
    ctx.lineTo(x, trackY);
    ctx.stroke();

    // 이동 원
    ctx.fillStyle = palette.sorted;
    ctx.beginPath();
    ctx.arc(x, trackY, 14, 0, Math.PI * 2);
    ctx.fill();

    // 라벨
    ctx.fillStyle = palette.mutedForeground;
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText(`${step.state.value} / ${max}`, width / 2, trackY - 36);
  },
};

export default demoModule;
