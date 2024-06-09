import { useRecoilValue } from "recoil";
import { scenarioState } from "@/states/scenarioState";

export const Background: React.FC = () => {
  const scenario = useRecoilValue(scenarioState);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(./images/backgrounds/${scenario.backgroundFile})` }}
    />
  );
};
