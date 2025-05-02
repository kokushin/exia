import { atom } from "jotai";

// スキップアクション用のタイプ定義
type SkipAction = {
  // シナリオを選択肢までスキップする関数
  skipToNextChoice: () => void;
};

// 初期値（関数は空の実装）
const initialSkipAction: SkipAction = {
  skipToNextChoice: () => {
    console.warn("skipToNextChoice function is not yet implemented");
  },
};

// スキップアクションのためのatom
export const skipActionState = atom<SkipAction>(initialSkipAction);
