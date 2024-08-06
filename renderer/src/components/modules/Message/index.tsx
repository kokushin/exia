import { memo, useMemo, useState, useEffect } from "react";
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

  const handleNextLine = () => {
    setIsShowArrowIcon(false);
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
    const characters = [...scenario.characters];

    // セリフにキャラクター画像が指定されている場合、上書きする
    if (nextLine.character && nextLine.character?.imageFile) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        imageFile: nextLine.character.imageFile,
      };
    }

    // セリフにアニメーションが指定されている場合、上書きする
    if (nextLine.character && nextLine.character?.animation) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        animation: nextLine.character.animation,
      };
    }

    setScenario({
      ...scenario,
      currentLineIndex: nextLineIndex,
      currentLine: nextLine,
      currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
      characters: characters,
    });

    setCharacterName(nextLine?.character ? scenario.characters[nextLine.character.index].name : undefined);
  };

  useEffect(() => {
    // 自動再生が有効になった場合は現在のセリフをスキップする
    if (!navigation.isAutoPlay) {
      return;
    }
    handleNextLine();
  }, [navigation.isAutoPlay]);

  useEffect(() => {
    // キャラ名が存在する場合は初期値をセットする
    if (scenario.currentCharacterIndex === -1) {
      return;
    }
    setCharacterName(scenario.characters[scenario.currentCharacterIndex].name);
  }, [scenario]);

  useEffect(() => {
    // ローディング後のセリフ表示を遅延する
    const timer = setTimeout(() => {
      setIsShowText(true);
      clearTimeout(timer);
    }, LOADING_DELAY);
  }, []);

  const memoizedTypewriter = useMemo(
    () => (
      <MemoizedTypewriter
        navigation={navigation}
        text={scenario.currentLine?.text || ""}
        handleNextLine={handleNextLine}
        setIsShowArrowIcon={setIsShowArrowIcon}
      />
    ),
    [scenario.currentLine?.text]
  );

  if (scenario.currentLine === undefined || !isLoaded) {
    return null;
  }

  return (
    <>
      <div className="absolute top-0 left-0 z-10 w-full h-full" onClick={handleNextLine} />
      {/* TODO: 定数化する 0=ナレーション, 1=セリフ */}
      {scenario.currentLine.type === 1 ? (
        <div
          className="absolute bottom-0 left-0 w-full h-80"
          style={{ background: "linear-gradient(transparent, #000 100%)" }}
        >
          <div
            className="absolute top-40 left-1/2 -translate-x-1/2 px-6 md:px-24 flex flex-col gap-4 text-white w-full max-w-6xl"
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
            {isShowText && <div className={`leading-relaxed`}>{memoizedTypewriter}</div>}
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
  }: {
    navigation: NavigationType;
    text: string;
    handleNextLine: () => void;
    setIsShowArrowIcon: (isShow: boolean) => void;
  }) => (
    <Typewriter
      key={text}
      onInit={(typewriter) => {
        typewriter
          .typeString(text)
          .start()
          .callFunction(() => {
            setIsShowArrowIcon(true);
            // オート再生が有効だった場合、セリフ送りを行う
            if (navigation.isAutoPlay) {
              const timer = setTimeout(() => {
                handleNextLine();
                clearTimeout(timer);
              }, AUTO_PLAY_DELAY);
            }
          });
      }}
      options={{ delay: DISPLAY_LINE_DELAY }}
    />
  )
);
