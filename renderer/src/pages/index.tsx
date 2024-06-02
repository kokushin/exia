import React from "react";
import { useRecoilValue } from "recoil";
import { screenState } from "@/states/screenState";
import { SCREEN } from "@/constants";
import { Layout } from "@/components/Layout";
import { DebugMenu } from "@/components/DebugMenu";
import { StartScreen } from "@/components/screens/StartScreen";
import { MainScreen } from "@/components/screens/MainScreen";
import { EndingScreen } from "@/components/screens/EndingScreen";

const IndexPage = () => {
  const screen = useRecoilValue(screenState);

  return (
    <Layout>
      {screen === SCREEN.START_SCREEN && <StartScreen />}
      {screen === SCREEN.MAIN_SCREEN && <MainScreen />}
      {screen === SCREEN.ENDING_SCREEN && <EndingScreen />}
      <DebugMenu />
    </Layout>
  );
};

export default IndexPage;
