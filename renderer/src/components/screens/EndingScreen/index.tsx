import { useAtom } from "jotai";
import { screenState } from "@/states/screenState";
import { SCREEN } from "@/constants";

export const EndingScreen: React.FC = () => {
  const [screen, setScreen] = useAtom(screenState);

  return (
    <>
      <button
        onClick={() =>
          setScreen({
            ...screen,
            screen: SCREEN.START_SCREEN,
          })
        }
      >
        Back
      </button>
    </>
  );
};
