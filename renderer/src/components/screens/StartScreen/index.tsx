import { useSetRecoilState } from "recoil";
import { screenState } from "@/states/screenState";
import { SCREEN } from "@/constants";

export const StartScreen: React.FC = () => {
  const setScreenState = useSetRecoilState(screenState);

  return (
    <>
      <button onClick={() => setScreenState(SCREEN.MAIN_SCREEN)}>Start</button>
    </>
  );
};
