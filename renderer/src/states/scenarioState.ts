import { atom } from "recoil";
import { Scenario, ScenarioLine } from "@/types";

export const scenarioState = atom<
  Scenario & {
    currentCharacterIndex: number;
    currentLine: ScenarioLine | undefined;
    logs: ScenarioLine[];
    isFetched: boolean;
  }
>({
  key: "scenarioState",
  default: {
    id: "",
    backgroundFile: "bg_01.webp",
    characters: [],
    lines: [],
    currentCharacterIndex: -1,
    currentLineIndex: 0,
    currentLine: undefined,
    logs: [],
    isFetched: false,
  },
});
