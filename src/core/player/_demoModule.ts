import type { AlgoModule, AlgoStep } from "./types";

/**
 * ⚠️ 임시: 플레이어 스토어(상태 머신) 점검용 더미 모듈.
 * 실제 정렬 모듈을 추가하는 Step 4에서 이 파일은 삭제됩니다.
 */
interface DemoState {
  value: number;
}

const demoModule: AlgoModule<number, DemoState> = {
  id: "demo",
  name: "데모 카운터",
  category: "sorting",
  pseudocode: ["start()", "value += 1", "value += 1", "done()"],
  counters: [{ key: "ticks", label: "진행" }],
  defaultInput: 0,
  generate: (start) => {
    const steps: AlgoStep<DemoState>[] = [];
    for (let i = 0; i <= 3; i++) {
      steps.push({
        state: { value: start + i },
        pseudoLine: i,
        counters: { ticks: i },
        note: `스텝 ${i}: value = ${start + i}`,
      });
    }
    return steps;
  },
  draw: () => {
    /* 점검 단계에선 캔버스 렌더 없음 (Step 3에서 실제 draw 도입) */
  },
};

export default demoModule;
