import React from "react";
import GitHubButton from "react-github-btn";
import { useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { SCREEN, CONFIG } from "@/constants";
import { Layout } from "@/components/Layout";
import { DebugMenu } from "@/components/DebugMenu";
import { StartScreen } from "@/components/screens/StartScreen";
import { MainScreen } from "@/components/screens/MainScreen";
import { EndingScreen } from "@/components/screens/EndingScreen";

const IndexPage = () => {
  const { screen } = useAtomValue(screenState);

  return (
    <>
      <Layout>
        {screen === SCREEN.START_SCREEN && <StartScreen />}
        {screen === SCREEN.MAIN_SCREEN && <MainScreen />}
        {screen === SCREEN.ENDING_SCREEN && <EndingScreen />}
        {CONFIG.DEBUG && <DebugMenu />}
      </Layout>

      <div className="fixed top-2 left-2 z-50">
        <GitHubButton
          href="https://github.com/kokushin/exia"
          data-color-scheme="no-preference: light; light: light; dark: dark;"
          data-size="large"
          aria-label="View on GitHub"
        >
          View on GitHub
        </GitHubButton>
      </div>
    </>
  );
};

export default IndexPage;
