import type { AlgoModule, CounterDef } from "@/core/player/types";
import type { SortingAlgorithmSpec, SortState } from "./types";
import { drawSorting } from "./draw";
import { bubbleSpec } from "./algorithms/bubble";

/** 기본 입력: 10개, 적당히 흐트러진 1..10 */
const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 10];

const SORTING_COUNTERS: CounterDef[] = [
  { key: "comparisons", label: "비교", accent: "compare" },
  { key: "swaps", label: "스왑", accent: "swap" },
];

/** 명세 + 공유 draw + 공통 카운터를 합쳐 AlgoModule을 생산 */
export function createSortingModule(
  spec: SortingAlgorithmSpec,
): AlgoModule<number[], SortState> {
  return {
    id: spec.id,
    name: spec.name,
    category: "sorting",
    pseudocode: spec.pseudocode,
    counters: SORTING_COUNTERS,
    defaultInput: DEFAULT_INPUT,
    generate: spec.generate,
    draw: drawSorting,
  };
}

export const bubbleSort = createSortingModule(bubbleSpec);

/** Step 12 알고리즘 선택기에서 사용. 정렬 추가될 때마다 여기에 push. */
export const allSortingModules = [bubbleSort];
