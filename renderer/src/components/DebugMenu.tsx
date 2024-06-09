import { useRecoilState } from "recoil";
import { scenarioState } from "@/states/scenarioState";
import { navigationState } from "@/states/navigationState";
import mockScenario from "@/scenarios/S_000.json";

export const DebugMenu: React.FC = () => {
  const [scenario, setScenario] = useRecoilState(scenarioState);
  const [navigation, setNavigation] = useRecoilState(navigationState);

  return (
    <ul className="absolute top-1 left-1 z-20 flex flex-col gap-2 bg-black bg-opacity-80 text-white text-xs p-2">
      <li>scenarioId: {scenario.id}</li>
      <li>
        currentLineIndex: {scenario.currentLineIndex} / {scenario.lines.length - 1}
      </li>
      <li>
        <button
          onClick={() => {
            setScenario({
              ...scenario,
              ...mockScenario,
              currentCharacterIndex: -1,
              currentLineIndex: 0,
              currentLine: scenario.lines[0],
            });
            setNavigation({
              ...navigation,
              isAutoPlay: false,
            });
          }}
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
