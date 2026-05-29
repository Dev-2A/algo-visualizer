import type { AlgoStep } from "src/core/player/types";
import type { SortingAlgorithmSpec, SortState } from "../types";

const pseudocode = [
  "for i = 0..n-2:", // 0
  "  for j = 0..n-2-i:", // 1
  "    if a[j] > a[j+1]:", // 2
  "      swap(a[j], a[j+1])", // 3
  "  mark a[n-1-i] as sorted", // 4
  "done", // 5
];

function generate(input: number[]): AlgoStep<SortState>[] {
  const arr = [...input];
  const n = arr.length;
  const sortedFlags = Array(n).fill(false);
  const steps: AlgoStep<SortState>[] = [];
  let comparisons = 0;
  let swaps = 0;

  const snap = (
    extra: Partial<SortState>,
    pseudoLine: number,
    note: string,
  ): AlgoStep<SortState> => ({
    state: { array: [...arr], sortedFlags: [...sortedFlags], ...extra },
    pseudoLine,
    counters: { comparisons, swaps },
    note,
  });

  steps.push(snap({}, 0, "시작"));

  outer: for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      steps.push(
        snap(
          { compare: [j, j + 1] },
          2,
          `비교 a[${j}]=${arr[j]} vs a[${j + 1}]=${arr[j + 1]}`,
        ),
      );

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swappedThisPass = true;
        steps.push(snap({ swap: [j, j + 1] }, 3, `스왑 [${j}] ↔ [${j + 1}]`));
      }
    }
    sortedFlags[n - 1 - i] = true;
    steps.push(snap({}, 4, `a[${n - 1 - i}] 정렬 완료`));

    if (!swappedThisPass) {
      // 조기 종료: 이미 정렬 끝
      for (let k = 0; k < n; k++) sortedFlags[k] = true;
      steps.push(snap({}, 5, "조기 종료 (이미 정렬됨)"));
      break outer;
    }
  }

  // 최종 마감
  for (let k = 0; k < n; k++) sortedFlags[k] = true;
  steps.push(snap({}, 5, "완료"));

  return steps;
}

export const bubbleSpec: SortingAlgorithmSpec = {
  id: "bubble",
  name: "버블 정렬",
  pseudocode,
  generate,
};
