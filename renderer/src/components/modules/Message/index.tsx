import { useMemo, useState, FC } from "react";
import { useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { MESSAGE_TYPE } from "@/constants";
import { DialogueLayout, NarrationLayout } from "./layouts";
import { MessageTypewriter } from "./MessageTypewriter";
import { useScenarioManager } from "./hooks/useScenarioManager";
import { useMessageDisplay } from "./hooks/useMessageDisplay";
import { useAutoPlay } from "./hooks/useAutoPlay";

export const Message: FC = () => {
  const { isLoaded } = useAtomValue(screenState);
  const [characterName, setCharacterName] = useState<string | undefined>(undefined);

  // シナリオ管理フックを使用
  const { scenario, navigation, goToNextLine, getCurrentCharacterName } = useScenarioManager(isLoaded);

  // メッセージ表示管理フックを使用
  const {
    isShowArrowIcon,
    setIsShowArrowIcon,
    isShowText,
    isReading,
    setIsReading,
    setTypewriterInstance,
    handleNextLine,
  } = useMessageDisplay(navigation, scenario.currentLine?.text || "", isLoaded);

  // オートプレイ管理フックを使用
  useAutoPlay(navigation.isAutoPlay, isReading, handleNextLine, goToNextLine);

  // 現在のキャラクター名を更新
  useMemo(() => {
    const name = getCurrentCharacterName();
    if (name !== characterName) {
      setCharacterName(name);
    }
  }, [scenario.currentCharacterIndex, scenario.characters, getCurrentCharacterName]);

  // タイプライターコンポーネントのメモ化
  const memoizedTypewriter = useMemo(
    () => (
      <MessageTypewriter
        navigation={navigation}
        text={scenario.currentLine?.text || ""}
        setIsShowArrowIcon={setIsShowArrowIcon}
        setIsReading={setIsReading}
        setTypewriterInstance={setTypewriterInstance}
      />
    ),
    [scenario.currentLine?.text, navigation, setIsShowArrowIcon, setIsReading, setTypewriterInstance]
  );

  // メッセージ表示コンポーネントの選択
  const MessageLayout = scenario.currentLine?.type === MESSAGE_TYPE.DIALOGUE ? DialogueLayout : NarrationLayout;

  // メッセージがない場合や画面読込中は何も表示しない
  if (scenario.currentLine === undefined || !isLoaded) return null;

  return (
    <>
      <div
        className="absolute top-0 left-0 z-10 w-full h-full"
        onClick={() => isLoaded && handleNextLine(goToNextLine)}
      />
      <MessageLayout characterName={characterName} showArrowIcon={isShowArrowIcon} isAutoPlay={navigation.isAutoPlay}>
        {isShowText && memoizedTypewriter}
      </MessageLayout>
    </>
  );
};
