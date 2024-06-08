import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { scenarioState } from "@/states/scenarioState";

// フェードイン・アウトの再生速度(ms)
// 変更する場合は tailwind.config.js の値と一致させる
const FADE_DURATION = 400;

export const CutIn: React.FC = () => {
  const scenario = useRecoilValue(scenarioState);
  const [imageFile, setImageFile] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isFadeOut, setIsFadeOut] = useState(false);

  useEffect(() => {
    // フェードイン・アウトの処理
    if (scenario.currentLine?.cutInFile) {
      setIsShow(true);
      setImageFile(scenario.currentLine.cutInFile);
      setIsFadeOut(false);
    } else if (isShow) {
      setIsFadeOut(true);
      const timer = setTimeout(() => {
        setIsShow(false);
        setImageFile("");
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [scenario, isShow]);

  if (scenario.currentLine === undefined || !isShow) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center pointer-events-none w-full h-full">
      <div className={`border-8 border-white ${isFadeOut ? "animate-fadeOut" : "animate-fadeIn"}`}>
        <img src={`./images/cut_ins/${imageFile}`} className="w-64 h-auto object-contain" />
      </div>
    </div>
  );
};
