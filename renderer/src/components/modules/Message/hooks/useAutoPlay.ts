import { useEffect } from "react";
import { MESSAGE_CONFIG } from "@/constants";

export const useAutoPlay = (
  isAutoPlay: boolean,
  isReading: boolean,
  handleNextLine: (goToNextLineFn: () => boolean) => void,
  goToNextLine: () => boolean
) => {
  // オート再生の制御
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isAutoPlay && !isReading) {
      timer = setTimeout(() => {
        handleNextLine(goToNextLine);
      }, MESSAGE_CONFIG.AUTO_PLAY_DELAY);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isAutoPlay, isReading, handleNextLine, goToNextLine]);
};
