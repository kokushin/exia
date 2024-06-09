import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { scenarioState } from "@/states/scenarioState";

// フェードイン・アウトの再生速度(ms)
const FADE_DURATION = 500;

export const CutIn: React.FC = () => {
  const scenario = useRecoilValue(scenarioState);
  const [isShow, setIsShow] = useState(false);
  const [imageFile, setImageFile] = useState(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (scenario.currentLine?.cutIn?.imageFile) {
      setIsShow(true);
      setImageFile(scenario.currentLine.cutIn.imageFile);
      setIsFullScreen(Boolean(scenario.currentLine.cutIn.isFullScreen));
    } else if (isShow) {
      setIsShow(false);
      const timer = setTimeout(() => {
        setImageFile(undefined);
        setIsFullScreen(false);
        clearTimeout(timer);
      }, FADE_DURATION);
    }
  }, [scenario, isShow]);

  return (
    <div
      className="fixed top-0 left-0 flex justify-center items-center pointer-events-none w-full h-full"
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
