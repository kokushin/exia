import { useEffect } from "react";
import { useAtom } from "jotai";
import { scenarioState } from "@/states/scenarioState";
// import { mockScenario } from "@/mocks/scenario";
import mockScenario from "@/scenarios/S_000.json";
import { getCurrentCharacterIndex } from "@/utils";
import { Message } from "@/components/modules/Message";
import { Background } from "@/components/modules/Background";
import { CutIn } from "@/components/modules/CutIn";
import { Character } from "@/components/modules/Character";
import { Navigation } from "@/components/modules/Navigation";
import { Loading } from "@/components/modules/Loading";
import { Voice } from "@/components/modules/Voice";

export const MainScreen: React.FC = () => {
  const [scenario, setScenario] = useAtom(scenarioState);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Voice />
      <Background />
      <Character />
      <CutIn />
      <Message />
      <Navigation />
      <Loading />
    </>
  );
};
