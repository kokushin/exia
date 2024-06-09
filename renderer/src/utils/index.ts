import { ScenarioLine } from "@/types";

// 現在フォーカスしているキャラクターのindexを取得
export const getCurrentCharacterIndex = (lines: ScenarioLine[], currentLineIndex: number) => {
  if (lines[currentLineIndex].character === undefined) {
    return -1;
  }
  return lines[currentLineIndex].character.index;
};
