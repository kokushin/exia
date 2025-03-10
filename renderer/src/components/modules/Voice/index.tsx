import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { scenarioState } from "@/states/scenarioState";
import { CONFIG } from "@/constants";

export const Voice: React.FC = () => {
  const scenario = useAtomValue(scenarioState);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (
      !CONFIG.VOICEVOX ||
      !scenario.currentLine ||
      scenario.currentLine.character === undefined ||
      scenario.currentLine.type !== 1
    ) {
      return;
    }

    const audioSrc = `./audios/voices/${scenario.id}_${scenario.currentLineIndex}.wav`;

    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch((error) => {
        console.warn("Failed to play audio:", error);
      });
    }
  }, [scenario.currentLine, scenario.currentLineIndex, scenario.id]);

  return <audio ref={audioRef} className="hidden" />;
};
