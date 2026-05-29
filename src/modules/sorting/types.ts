import { AlgoStep } from "src/core/player/types";

/** 정렬 도메인의 스텝 페이로드 */
export interface SortState {
  /** 현재 시점의 배열 스냅샷 */
  array: number[];
  /** 비교 중인 두 인덱스 */
  compare?: [number, number];
  /** 스왑 직후 (이 두 인덱스는 보간 트윈으로 자리 바꿈) */
  swap?: [number, number];
  /** 피벗 인덱스 (퀵 정렬용; 다른 알고리즘은 미사용) */
  pivot?: number;
  /** 정렬 완료된 인덱스 플래그 (array.length와 동일 길이) */
  sortedFlags: boolean[];
}

/** 알고리즘별 명세. 공유 draw/카운터는 createSortingModule에서 합성 */
export interface SortingAlgorithmSpec {
  id: string;
  name: string;
  pseudocode: string[];
  generate: (input: number[]) => AlgoStep<SortState>[];
}
