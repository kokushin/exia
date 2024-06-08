import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { scenarioState } from "@/states/scenarioState";
import { mockScenario } from "@/mocks/scenario";
import { Message } from "@/components/modules/Message";
import { Background } from "@/components/modules/Background";
import { CutIn } from "@/components/modules/CutIn";
import { Character } from "@/components/modules/Character";
import { Navigation } from "@/components/modules/Navigation";

export const MainScreen: React.FC = () => {
  // const [screen, setScreen] = useRecoilState(screenState);
  const [scenario, setScenario] = useRecoilState(scenarioState);

  const getCurrentCharacterIndex = (lines: any, currentLineIndex: number) => {
    if (lines[currentLineIndex].character === undefined) {
      return -1;
    }
    return lines[currentLineIndex].character.index;
  };

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
      <Background />
      <Character />
      <CutIn />
      <Message />
      <Navigation />
    </>
  );
};
