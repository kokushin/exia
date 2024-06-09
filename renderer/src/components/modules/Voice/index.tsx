import { useRecoilValue } from "recoil";
import { scenarioState } from "@/states/scenarioState";
import { CONFIG } from "@/constants";

export const Voice: React.FC = () => {
  const scenario = useRecoilValue(scenarioState);

  if (
    !CONFIG.VOICEVOX ||
    !scenario.currentLine ||
    scenario.currentLine.character === undefined ||
    scenario.currentLine.type !== 1
  ) {
    return null;
  }

  return <audio src={`./audios/voices/${scenario.id}_${scenario.currentLineIndex}.wav`} autoPlay className="hidden" />;
};
