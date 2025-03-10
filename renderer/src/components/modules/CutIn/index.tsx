import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { scenarioState } from "@/states/scenarioState";

// フェードイン・アウトの再生速度(ms)
const FADE_DURATION = 500;

export const CutIn: React.FC = () => {
  const scenario = useAtomValue(scenarioState);
  const [isShow, setIsShow] = useState(false);
  const [imageFile, setImageFile] = useState(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const currentCutIn = scenario.currentLine?.cutIn;
    if (currentCutIn?.imageFile) {
      setIsShow(true);
      setImageFile(currentCutIn.imageFile);
      setIsFullScreen(Boolean(currentCutIn.isFullScreen));
    } else if (isShow) {
      setIsShow(false);
      timer = setTimeout(() => {
        setImageFile(undefined);
        setIsFullScreen(false);
      }, FADE_DURATION);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [scenario.currentLine?.cutIn]);

  return (
    <div
      className="absolute top-0 left-0 flex justify-center items-center pointer-events-none w-full h-full"
      style={{ opacity: isShow ? 1 : 0, transition: `opacity ${FADE_DURATION}ms ease` }}
    >
      {imageFile && (
        <img
          src={`./images/cut_ins/${imageFile}`}
          className={`${
            isFullScreen ? "w-full h-full object-cover" : "w-64 md:w-80 h-auto object-contain bg-white p-2"
          }`}
        />
      )}
    </div>
  );
};
