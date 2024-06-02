import { atom } from "recoil";
import { Scenario, ScenarioLine } from "@/types";

export const scenarioState = atom<
  Scenario & {
    currentCharacterIndex: number;
    logs: ScenarioLine[];
    isFetched: boolean;
  }
>({
  key: "scenarioState",
  default: {
    id: 1,
    backgroundFile: "bg_01.png",
    characters: [],
    lines: [],
    currentCharacterIndex: -1,
    currentLineIndex: 0,
    logs: [],
    isFetched: false,
  },
});
