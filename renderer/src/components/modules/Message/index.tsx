import { useMemo, useState, FC, useEffect } from "react";
import { useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { MESSAGE_TYPE } from "@/constants";
import { DialogueLayout, NarrationLayout } from "./layouts";
import { MessageTypewriter } from "./MessageTypewriter";
import { useScenarioManager } from "./hooks/useScenarioManager";
import { useMessageDisplay } from "./hooks/useMessageDisplay";
import { useAutoPlay } from "./hooks/useAutoPlay";
import { Choice } from "../Choice";

export const Message: FC = () => {
  const { isLoaded } = useAtomValue(screenState);
  const [characterName, setCharacterName] = useState<string | undefined>(undefined);

  // シナリオ管理フックを使用
  const { scenario, navigation, goToNextLine, getCurrentCharacterName, isShowingChoices, handleChoiceSelect } =
    useScenarioManager(isLoaded);

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

  // スペースキーでのメッセージ送り機能
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // スペースキーが押された場合で、かつAutoPlayでなく、選択肢表示中でもない場合にメッセージを進める
      if (e.code === 'Space' && !navigation.isAutoPlay && !isShowingChoices && isLoaded) {
        e.preventDefault(); // デフォルトのスクロール動作を防止
        handleNextLine(goToNextLine);
      }
    };

    // キーボードイベントのリスナーを追加
    window.addEventListener('keydown', handleKeyDown);

    // コンポーネントのアンマウント時にリスナーを削除
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigation.isAutoPlay, isShowingChoices, isLoaded, handleNextLine, goToNextLine]);

  // 現在のキャラクター名を更新
  useMemo(() => {
    const name = getCurrentCharacterName();
    if (name !== characterName) {
      setCharacterName(name);
    }
  }, [scenario.currentCharacterIndex, scenario.characters, getCurrentCharacterName, characterName]);

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
      {/* クリックイベント領域 - 選択肢表示中は無効化 */}
      {!isShowingChoices && (
        <div
          className="absolute top-0 left-0 z-40 w-full h-full"
          onClick={() => isLoaded && handleNextLine(goToNextLine)}
        />
      )}

      {/* メッセージウィンドウ */}
      <div className={`relative z-30`}>
        <MessageLayout characterName={characterName} showArrowIcon={isShowArrowIcon} isAutoPlay={navigation.isAutoPlay}>
          {isShowText && memoizedTypewriter}
        </MessageLayout>
      </div>

      {/* 選択肢表示 */}
      {isShowingChoices && scenario.currentLine?.choices && (
        <Choice choices={scenario.currentLine.choices} onSelect={handleChoiceSelect} />
      )}
    </>
  );
};
