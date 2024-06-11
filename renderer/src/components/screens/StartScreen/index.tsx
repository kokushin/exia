import { useSetAtom } from "jotai";
import { screenState } from "@/states/screenState";
import { SCREEN } from "@/constants";

export const StartScreen: React.FC = () => {
  const setScreenState = useSetAtom(screenState);

  return (
    <>
      <button onClick={() => setScreenState(SCREEN.MAIN_SCREEN)}>Start</button>
    </>
  );
};
