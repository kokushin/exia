import { useRecoilState } from "recoil";
import { scenarioState } from "@/states/scenarioState";
import { mockScenario } from "@/mocks/scenario";

export const DebugMenu: React.FC = () => {
  const [scenario, setScenario] = useRecoilState(scenarioState);

  return (
    <ul className="fixed top-1 left-1 z-20 flex flex-col gap-2 bg-black bg-opacity-80 text-white text-xs p-2">
      <li>currentLineIndex: {scenario.currentLineIndex}</li>
      <li>
        <button
          onClick={() =>
            setScenario({
              ...scenario,
              ...mockScenario,
              currentCharacterIndex: -1,
              currentLineIndex: 0,
              currentLine: scenario.lines[0],
            })
          }
        >
          Reset
        </button>
      </li>
      <li>---</li>
      <li>currentCharacterIndex: {scenario.currentCharacterIndex}</li>
      {mockScenario.characters
        .filter((character) => character.isShow)
        .map((character, i) => (
          <li key={i}>
            <button
              onClick={() =>
                setScenario({
                  ...scenario,
                  currentCharacterIndex: i,
                })
              }
            >
              Set: {character.name}
            </button>
          </li>
        ))}
    </ul>
  );
};
