import { memo, useMemo, useState, useEffect, useCallback, FC } from "react";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import { useAtom, useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { scenarioState } from "@/states/scenarioState";
import { navigationState } from "@/states/navigationState";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import { Navigation as NavigationType } from "@/types";

// メッセージ表示に関する定数
const MESSAGE_CONFIG = {
  LOADING_DELAY: 1000, // ローディング後のセリフ表示間隔(ms)
  AUTO_PLAY_DELAY: 2000, // オート再生時のセリフ送りの間隔(ms)
  DISPLAY_LINE_DELAY: 50, // セリフの表示間隔(ms)
} as const;

// メッセージの種類
const MESSAGE_TYPE = {
  NARRATION: 0,
  DIALOGUE: 1,
} as const;

// コンポーネントのProps型定義
type MessageLayoutProps = {
  characterName?: string;
  children: React.ReactNode;
  showArrowIcon: boolean;
  isAutoPlay: boolean;
};

// セリフ表示レイアウト
const DialogueLayout: FC<MessageLayoutProps> = ({ characterName, children, showArrowIcon, isAutoPlay }) => (
  <div
    className="absolute bottom-0 left-0 w-full h-60"
    style={{ background: "linear-gradient(transparent, #000 100%)" }}
  >
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 md:px-24 pt-24 flex flex-col gap-4 text-white w-full max-w-5xl h-full"
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
      <div className="flex leading-relaxed">{children}&nbsp;</div>
    </div>
    {showArrowIcon && !isAutoPlay && (
      <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-4 right-4 animate-bounce" />
    )}
  </div>
);

// ナレーション表示レイアウト
const NarrationLayout: FC<MessageLayoutProps> = ({ children, showArrowIcon, isAutoPlay }) => (
  <div className="absolute bottom-0 left-0 p-4 w-full text-center">
    <div
      className="relative flex flex-col justify-center items-center gap-4 text-white md:text-lg w-full bg-black bg-opacity-80 min-h-24 py-6 px-4 drop-shadow-md"
      style={{
        textShadow: "1px 1px 0 rgba(0,0,0,.5)",
      }}
    >
      <div className="leading-relaxed">{children}</div>
      {showArrowIcon && !isAutoPlay && (
        <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-2 right-2 animate-bounce" />
      )}
    </div>
  </div>
);

export const Message: FC = () => {
  const { isLoaded } = useAtomValue(screenState);
  const [scenario, setScenario] = useAtom(scenarioState);
  const [navigation, setNavigation] = useAtom(navigationState);
  const [characterName, setCharacterName] = useState(undefined);
  const [isShowArrowIcon, setIsShowArrowIcon] = useState(false);
  const [isShowText, setIsShowText] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isAutoPlayStarted, setIsAutoPlayStarted] = useState(false);
  const [typewriterInstance, setTypewriterInstance] = useState<TypewriterClass | null>(null);

  // キャラクター情報を更新する関数
  const updateCharacterInfo = useCallback((nextLine: any, characters: any[]) => {
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

  // テキストを全文表示する関数
  const showFullText = useCallback(() => {
    if (!navigation.isAutoPlay && typewriterInstance) {
      typewriterInstance.stop();
      const textElement = document.querySelector(".Typewriter__wrapper");
      if (textElement) {
        textElement.innerHTML = scenario.currentLine?.text || "";
      }
      setIsReading(false);
      setIsShowArrowIcon(true);
    }
  }, [navigation.isAutoPlay, typewriterInstance, scenario.currentLine?.text]);

  // 次のセリフに進む関数
  const handleNextLine = useCallback(() => {
    // ローディング中は処理をスキップ
    if (!isLoaded) return;

    setIsShowArrowIcon(false);

    // テキスト送りが途中の場合は全文表示
    if (isReading) {
      showFullText();
      return;
    }

    // 次の行のインデックスを計算
    const nextLineIndex = scenario.currentLineIndex + 1;

    // シナリオの末尾に到達したら処理をスキップ
    if (nextLineIndex > scenario.lines.length - 1) {
      setNavigation({
        ...navigation,
        isAutoPlay: false, // オート再生を終了
      });
      return;
    }

    // 現在のラインをログに追加してから次のラインに進む
    const nextLine = scenario.lines[nextLineIndex];
    const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);

    // 現在表示中のメッセージをログに追加
    const updatedLogs = [...scenario.logs];
    const currentLine = scenario.currentLine;

    if (currentLine) {
      // 重複チェック
      const isAlreadyLogged = updatedLogs.some((log) => log.text === currentLine.text);

      if (!isAlreadyLogged) {
        // 現在の行に関連するキャラクター情報を取得
        let characterInfo = undefined;
        if (currentLine.character && currentLine.character.index !== undefined) {
          const character = scenario.characters[currentLine.character.index];
          if (character) {
            characterInfo = {
              index: currentLine.character.index,
              name: character.name,
              imageFile: character.imageFile,
            };
          }
        }

        // キャラクター情報を含めてログに追加
        updatedLogs.push({
          ...currentLine,
          character: characterInfo,
        });
      }
    }

    // シナリオの状態を更新（ログの更新と次の行への進行を同時に行う）
    setScenario((prevState) => ({
      ...prevState,
      currentLineIndex: nextLineIndex,
      currentLine: nextLine,
      currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
      characters: updatedCharacters,
      logs: updatedLogs,
    }));

    setCharacterName(nextLine?.character ? scenario.characters[nextLine.character.index].name : undefined);
  }, [isReading, scenario, navigation, setNavigation, setScenario, updateCharacterInfo, showFullText, isLoaded]);

  // 初期のシナリオをログに追加（一度だけ実行される）
  useEffect(() => {
    if (scenario.currentLine && scenario.logs.length === 0 && isLoaded) {
      // 最初のメッセージを表示したときにログに追加
      const characterInfo =
        scenario.currentLine.character && scenario.currentLine.character.index !== undefined
          ? {
              index: scenario.currentLine.character.index,
              name: scenario.characters[scenario.currentLine.character.index].name,
              imageFile: scenario.characters[scenario.currentLine.character.index].imageFile,
            }
          : undefined;

      setScenario((prevState) => ({
        ...prevState,
        logs: [
          {
            ...scenario.currentLine,
            character: characterInfo,
          },
        ],
      }));
    }
  }, [scenario.currentLine, scenario.logs.length, isLoaded, setScenario, scenario.characters]);

  // オート再生の制御
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (navigation.isAutoPlay && !isReading) {
      timer = setTimeout(() => {
        handleNextLine();
      }, MESSAGE_CONFIG.AUTO_PLAY_DELAY);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
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
    }, MESSAGE_CONFIG.LOADING_DELAY);
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

  // メッセージ表示コンポーネントの選択
  const MessageLayout = scenario.currentLine?.type === MESSAGE_TYPE.DIALOGUE ? DialogueLayout : NarrationLayout;

  return scenario.currentLine === undefined || !isLoaded ? null : (
    <>
      <div className="absolute top-0 left-0 z-10 w-full h-full" onClick={isLoaded ? handleNextLine : undefined} />
      <MessageLayout characterName={characterName} showArrowIcon={isShowArrowIcon} isAutoPlay={navigation.isAutoPlay}>
        {isShowText && memoizedTypewriter}
      </MessageLayout>
    </>
  );
};

// Typewriterコンポーネントのprops型定義
type TypewriterProps = {
  navigation: NavigationType;
  text: string;
  handleNextLine: () => void;
  setIsShowArrowIcon: (isShow: boolean) => void;
  setIsReading: (isReading: boolean) => void;
  isAutoPlayStarted: boolean;
  setIsAutoPlayStarted: (isStarted: boolean) => void;
  setTypewriterInstance: (instance: TypewriterClass | null) => void;
};

const MemoizedTypewriter = memo<TypewriterProps>(
  ({
    navigation,
    text,
    handleNextLine,
    setIsShowArrowIcon,
    setIsReading,
    isAutoPlayStarted,
    setIsAutoPlayStarted,
    setTypewriterInstance,
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
          })
          .start();
      }}
      options={{ delay: MESSAGE_CONFIG.DISPLAY_LINE_DELAY }}
    />
  )
);
