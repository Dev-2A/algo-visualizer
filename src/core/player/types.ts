import type { ComponentType } from "react";

/** 알고리즘 카테고리. 경로탐색은 v0.2.0에서 추가. */
export type AlgoCategory = "sorting" | "pathfinding";

/**
 * 단일 스텝(상태 스냅샷). 플레이어는 S(도메인 페이로드)의 내용을 알지 못하며,
 * 오직 해당 모듈의 draw 함수만 이를 해석한다.
 */
export interface AlgoStep<S = unknown> {
  /** 도메인별 상태 스냅샷 (정렬: 배열+하이라이트, 경로탐색: 격자+프론티어 등) */
  state: S;
  /** 하이라이트할 의사코드 라인 인덱스. -1이면 없음. */
  pseudoLine: number;
  /** 이 스텝 시점의 카운터 값 (key는 module.counters의 key와 매칭) */
  counters: Record<string, number>;
  /** 선택: 현재 동작 설명 (UI 표시용) */
  note?: string;
}

/** 카운터 정의 (라벨/순서는 모듈에 중앙화, 값은 스텝마다) */
export interface CounterDef {
  key: string;
  label: string;
}

/** 캔버스 draw에 전달되는 해석된 색상 팔레트 (Canvas는 CSS 변수를 직접 못 읽으므로 주입) */
export interface VizPalette {
  default: string;
  compare: string;
  swap: string;
  pivot: string;
  sorted: string;
  foreground: string;
  mutedForeground: string;
  surface: string;
  border: string;
  primary: string;
}

/** draw 함수에 전달되는 파라미터 */
export interface DrawParams<S = unknown> {
  /** 현재 스텝 */
  step: AlgoStep<S>;
  /** 직전 스텝 (전환 보간용). 없으면 null */
  prevStep: AlgoStep<S> | null;
  /** 0..1 스텝 전환 보간 계수 (스왑 슬라이드 등 트위닝에 사용) */
  progress: number;
  /** 논리 픽셀 기준 캔버스 크기 (DPR 보정은 CanvasStage가 처리) */
  width: number;
  height: number;
  /** 해석된 색상 팔레트 (현재 테마 기준) */
  palette: VizPalette;
}

/** 입력 에디터 컴포넌트 props */
export interface EditorProps<I = unknown> {
  value: I;
  onChange: (next: I) => void;
  disabled?: boolean;
}

/**
 * 알고리즘 모듈. 정렬/경로탐색이 동일 인터페이스를 구현한다.
 * v0.2.0에서 경로탐색 모듈을 추가할 때 플레이어/Shell은 수정하지 않는다.
 */
export interface AlgoModule<I = unknown, S = unknown> {
  id: string;
  name: string;
  category: AlgoCategory;
  /** 의사코드 라인 (pseudoLine이 이 배열의 인덱스를 가리킴) */
  pseudocode: string[];
  /** 표시할 카운터 정의 */
  counters: CounterDef[];
  /** 기본 입력 */
  defaultInput: I;
  /** 입력 → 스텝 배열 (결정적이어야 함: 같은 입력 → 같은 스텝) */
  generate: (input: I) => AlgoStep<S>[];
  /** 캔버스에 현재 스텝을 그림 */
  draw: (ctx: CanvasRenderingContext2D, params: DrawParams<S>) => void;
  /** 선택: 입력 편집 UI (정렬 에디터는 Step 11에서 추가) */
  Editor?: ComponentType<EditorProps<I>>;
}
