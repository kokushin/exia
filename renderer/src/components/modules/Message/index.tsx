import { memo, useMemo, useState, useEffect, useCallback } from "react";
import Typewriter from "typewriter-effect";
import { useAtom, useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { scenarioState } from "@/states/scenarioState";
import { navigationState } from "@/states/navigationState";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import { Navigation as NavigationType } from "@/types";

// TODO: 設定オブジェクトに移す
const LOADING_DELAY = 1000; // ローディング後のセリフ表示間隔(ms)
const AUTO_PLAY_DELAY = 2000; // オート再生時のセリフ送りの間隔(ms)
const DISPLAY_LINE_DELAY = 50; // セリフの表示間隔(ms)

export const Message: React.FC = () => {
  const { isLoaded } = useAtomValue(screenState);
  const [scenario, setScenario] = useAtom(scenarioState);
  const [navigation, setNavigation] = useAtom(navigationState);
  const [characterName, setCharacterName] = useState(undefined);
  const [isShowArrowIcon, setIsShowArrowIcon] = useState(false);
  const [isShowText, setIsShowText] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isAutoPlayStarted, setIsAutoPlayStarted] = useState(false);
  const [typewriterInstance, setTypewriterInstance] = useState<any>(null);

  // キャラクター情報を更新する関数
  const updateCharacterInfo = useCallback((nextLine, characters) => {
    if (nextLine.character?.imageFile) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        imageFile: nextLine.character.imageFile,
      };
    }

    if (nextLine.character?.animation) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        animation: nextLine.character.animation,
      };
    }
    return characters;
  }, []);

  // 次のセリフに進む関数
  const handleNextLine = useCallback(() => {
    // ローディング中は処理をスキップ
    if (!isLoaded) return;

    setIsShowArrowIcon(false);

    // テキスト送りが途中の場合は、通常モードならテキストを全文表示
    if (isReading) {
      if (!navigation.isAutoPlay && typewriterInstance) {
        typewriterInstance.stop();
        const textElement = document.querySelector(".Typewriter__wrapper");
        if (textElement) {
          textElement.innerHTML = scenario.currentLine?.text || "";
        }
        setIsReading(false);
        setIsShowArrowIcon(true);
      }
      return;
    }

    const nextLineIndex = scenario.currentLineIndex + 1;

    // シナリオの末尾に到達したら処理をスキップ
    if (nextLineIndex > scenario.lines.length - 1) {
      setNavigation({
        ...navigation,
        isAutoPlay: false, // オート再生を終了
      });
      return;
    }

    const nextLine = scenario.lines[nextLineIndex];
    const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);

    setScenario({
      ...scenario,
      currentLineIndex: nextLineIndex,
      currentLine: nextLine,
      currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
      characters: updatedCharacters,
    });

    setCharacterName(nextLine?.character ? scenario.characters[nextLine.character.index].name : undefined);
  }, [isReading, scenario, navigation, setNavigation, setScenario, updateCharacterInfo]);

  // navigation.isAutoPlayの変更を監視
  useEffect(() => {
    if (navigation.isAutoPlay) {
      setIsAutoPlayStarted(false); // 初回のAutoとして扱う
      if (!isReading) {
        handleNextLine(); // 即座に次の台詞へ
      }
    }
  }, [navigation.isAutoPlay, isReading, handleNextLine]);

  // キャラクター名の初期設定
  useEffect(() => {
    if (scenario.currentCharacterIndex !== -1) {
      setCharacterName(scenario.characters[scenario.currentCharacterIndex].name);
    }
  }, [scenario.currentCharacterIndex, scenario.characters]);

  // ローディング後のセリフ表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowText(true);
    }, LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const memoizedTypewriter = useMemo(
    () => (
      <MemoizedTypewriter
        navigation={navigation}
        text={scenario.currentLine?.text || ""}
        handleNextLine={handleNextLine}
        setIsShowArrowIcon={setIsShowArrowIcon}
        setIsReading={setIsReading}
        isAutoPlayStarted={isAutoPlayStarted}
        setIsAutoPlayStarted={setIsAutoPlayStarted}
        setTypewriterInstance={setTypewriterInstance}
      />
    ),
    [scenario.currentLine?.text, navigation, handleNextLine]
  );

  if (scenario.currentLine === undefined || !isLoaded) {
    return null;
  }

  return (
    <>
      <div className="absolute top-0 left-0 z-10 w-full h-full" onClick={isLoaded ? handleNextLine : undefined} />
      {/* TODO: 定数化する 0=ナレーション, 1=セリフ */}
      {scenario.currentLine.type === 1 ? (
        <div
          className="absolute bottom-0 left-0 w-full h-60"
          style={{ background: "linear-gradient(transparent, #000 100%)" }}
        >
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 md:px-24 flex flex-col justify-center gap-4 text-white w-full max-w-5xl h-full"
            style={{
              textShadow: "1px 1px 0 rgba(0,0,0,.5)",
            }}
          >
            {characterName && (
              <div className="relative">
                <div className="w-[3px] h-[1em] bg-white absolute top-1/2 left-0 -mt-[0.5em]" />
                <div className="pl-3">{characterName}</div>
              </div>
            )}
            <div className="flex leading-relaxed">{isShowText && memoizedTypewriter}&nbsp;</div>
          </div>
          {isShowArrowIcon && !navigation.isAutoPlay && (
            <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-4 right-4 animate-bounce" />
          )}
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 p-4 w-full text-center">
          <div
            className="relative flex flex-col justify-center items-center gap-4 text-white md:text-lg w-full bg-black bg-opacity-80 min-h-24 py-6 px-4 drop-shadow-md"
            style={{
              textShadow: "1px 1px 0 rgba(0,0,0,.5)",
            }}
          >
            {isShowText && <div className={`leading-relaxed`}>{memoizedTypewriter}</div>}
            {isShowArrowIcon && !navigation.isAutoPlay && (
              <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-2 right-2 animate-bounce" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const MemoizedTypewriter = memo(
  ({
    navigation,
    text,
    handleNextLine,
    setIsShowArrowIcon,
    setIsReading,
    isAutoPlayStarted,
    setIsAutoPlayStarted,
    setTypewriterInstance,
  }: {
    navigation: NavigationType;
    text: string;
    handleNextLine: () => void;
    setIsShowArrowIcon: (isShow: boolean) => void;
    setIsReading: (isReading: boolean) => void;
    isAutoPlayStarted: boolean;
    setIsAutoPlayStarted: (isStarted: boolean) => void;
    setTypewriterInstance: (instance: any) => void;
  }) => (
    <Typewriter
      key={text}
      onInit={(typewriter) => {
        setIsReading(true);
        setTypewriterInstance(typewriter);
        typewriter
          .typeString(text)
          .callFunction(() => {
            setIsShowArrowIcon(true);
            setIsReading(false);
            // オート再生が有効な場合のみ待機時間を設ける
            if (navigation.isAutoPlay) {
              setIsAutoPlayStarted(true);
              setTimeout(() => {
                handleNextLine();
              }, AUTO_PLAY_DELAY);
            }
          })
          .start();
      }}
      options={{ delay: DISPLAY_LINE_DELAY }}
    />
  )
);
