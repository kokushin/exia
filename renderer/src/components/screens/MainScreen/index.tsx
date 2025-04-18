import { useEffect } from "react";
import { useAtom } from "jotai";
import { scenarioState } from "@/states/scenarioState";
import { getCurrentCharacterIndex } from "@/utils";
import type { Scenario } from "@/types";
import { Message } from "@/components/modules/Message";
import { Background } from "@/components/modules/Background";
import { CutIn } from "@/components/modules/CutIn";
import { Character } from "@/components/modules/Character";
import { Navigation } from "@/components/modules/Navigation";
import { Loading } from "@/components/modules/Loading";
import { Voice } from "@/components/modules/Voice";
import { Log } from "@/components/modules/Log";

export const MainScreen: React.FC = () => {
  const [scenario, setScenario] = useAtom(scenarioState);

  // シナリオデータを動的にインポート
  useEffect(() => {
    const loadScenario = async () => {
      try {
        const mockScenarioData = await import("@/scenarios/S_000.json");
        const mockScenario = {
          ...mockScenarioData.default,
          logs: [], // logsプロパティを追加
        } as Scenario;
        if (!scenario.isFetched) {
          setScenario({
            ...scenario,
            id: mockScenario.id,
            backgroundFile: mockScenario.backgroundFile,
            lines: mockScenario.lines,
            characters: mockScenario.characters,
            currentCharacterIndex: getCurrentCharacterIndex(mockScenario.lines, mockScenario.currentLineIndex),
            currentLineIndex: mockScenario.currentLineIndex,
            currentLine: mockScenario.lines[mockScenario.currentLineIndex],
            isFetched: true,
          });
        }
      } catch (error) {
        console.error("Failed to load scenario:", error);
      }
    };
    loadScenario();
  }, [scenario.isFetched, setScenario]);

  return (
    <>
      <Voice />
      <Background />
      <Character />
      <CutIn />
      <Message />
      <Navigation />
      <Log />
      <Loading />
    </>
  );
};
