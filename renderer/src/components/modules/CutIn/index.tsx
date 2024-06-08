import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { scenarioState } from "@/states/scenarioState";

// フェードイン・アウトの再生速度(ms)
// 変更する場合は tailwind.config.js の値と一致させる
const FADE_DURATION = 400;

export const CutIn: React.FC = () => {
  const scenario = useRecoilValue(scenarioState);
  const [imageFile, setImageFile] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isFadeOut, setIsFadeOut] = useState(false);

  useEffect(() => {
    // フェードイン・アウトの処理
    if (scenario.currentLine?.cutIn?.imageFile) {
      setIsShow(true);
      setImageFile(scenario.currentLine.cutIn.imageFile);
      setIsFullScreen(Boolean(scenario.currentLine.cutIn.isFullScreen));
      setIsFadeOut(false);
    } else if (isShow) {
      setIsFadeOut(true);
      const timer = setTimeout(() => {
        setIsShow(false);
        setImageFile("");
        setIsFullScreen(false);
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [scenario, isShow]);

  if (scenario.currentLine === undefined || !isShow) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 flex justify-center items-center pointer-events-none w-full h-full ${
        isFadeOut ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <img
        src={`./images/cut_ins/${imageFile}`}
        className={`${isFullScreen ? "w-full h-full object-cover" : "w-64 md:w-80 h-auto object-contain bg-white p-2"}`}
      />
    </div>
  );
};
