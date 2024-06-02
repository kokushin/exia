import { useSetRecoilState } from "recoil";
import { screenState } from "@/states/screenState";
import { SCREEN } from "@/constants";

export const EndingScreen: React.FC = () => {
  const setScreenState = useSetRecoilState(screenState);

  return (
    <>
      <button onClick={() => setScreenState(SCREEN.START_SCREEN)}>Back</button>
    </>
  );
};
