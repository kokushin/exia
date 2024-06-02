import React, { useEffect, useMemo, useState } from "react";
import { ScenarioLine } from "@/types";
import Typewriter from "typewriter-effect";
import { useRecoilState } from "recoil";
import { scenarioState } from "@/states/scenarioState";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";

const MemoizedTypewriter = React.memo(
  ({ text, setIsShowArrowIcon }: { text: string; setIsShowArrowIcon: (isShow: boolean) => void }) => (
    <Typewriter
      key={text}
      onInit={(typewriter) => {
        typewriter
          .callFunction(() => {
            setIsShowArrowIcon(false);
          })
          .typeString(text)
          .start()
          .callFunction(() => {
            setIsShowArrowIcon(true);
          });
      }}
      options={{ delay: 50 }}
    />
  )
);

export const Message: React.FC = () => {
  const [scenario, setScenario] = useRecoilState(scenarioState);
  const [currentLine, setCurrentLine] = useState<ScenarioLine>();
  const [isShowArrowIcon, setIsShowArrowIcon] = useState(false);

  const handleNextLine = () => {
    if (scenario.currentLineIndex + 1 > scenario.lines.length - 1) {
      return;
    }
    const line = scenario.lines[scenario.currentLineIndex + 1];
    const newCharacters = [...scenario.characters];

    // セリフにキャラクター画像が指定されている場合、上書きする
    if (line?.character && line?.character?.imageFile) {
      newCharacters[line.character.index] = {
        ...newCharacters[line.character.index],
        imageFile: line.character.imageFile,
      };
    }

    // セリフにアニメーションが指定されている場合、上書きする
    if (line?.character && line?.character?.animation) {
      newCharacters[line.character.index] = {
        ...newCharacters[line.character.index],
        animation: line.character.animation,
      };
    }

    setScenario({
      ...scenario,
      currentLineIndex: scenario.currentLineIndex + 1,
      currentCharacterIndex: line?.character !== undefined ? line.character.index : -1,
      characters: newCharacters,
    });
  };

  useEffect(() => {
    if (!scenario.isFetched) {
      return;
    }
    const line = scenario.lines[scenario.currentLineIndex];

    if (line?.character) {
      setCurrentLine({
        ...line,
        character: {
          ...line.character,
          name: scenario.characters[line.character.index].name,
        },
      });
    } else {
      setCurrentLine(line);
    }
  }, [scenario]);

  const memoizedTypewriter = useMemo(
    () => <MemoizedTypewriter text={currentLine?.text || ""} setIsShowArrowIcon={setIsShowArrowIcon} />,
    [currentLine?.text]
  );

  if (!currentLine) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-10 w-full h-full" onClick={handleNextLine} />
      {/* TODO: 定数化する 0=ナレーション, 1=セリフ */}
      {currentLine.type === 1 ? (
        <div
          className="fixed bottom-0 left-0 w-full h-80"
          style={{ background: "linear-gradient(transparent, #000 100%)" }}
        >
          <div
            className="absolute top-40 left-0 px-6 md:px-24 flex flex-col gap-4 text-white w-full"
            style={{
              textShadow: "1px 1px 0 rgba(0,0,0,.5)",
            }}
          >
            <div className="relative">
              <div className="w-[3px] h-[1em] bg-white absolute top-1/2 left-0 -mt-[0.5em]" />
              <div className="pl-3">{currentLine.character.name}</div>
            </div>
            <div className={`leading-relaxed`}>{memoizedTypewriter}</div>
          </div>
          {isShowArrowIcon && (
            <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-4 right-4 animate-bounce" />
          )}
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 p-4 w-full text-center">
          <div
            className="relative flex flex-col justify-center items-center gap-4 text-white md:text-lg w-full bg-black bg-opacity-80 min-h-24 py-6 px-4 drop-shadow-md"
            style={{
              textShadow: "1px 1px 0 rgba(0,0,0,.5)",
            }}
          >
            <div className={`leading-relaxed`}>{memoizedTypewriter}</div>
            {isShowArrowIcon && (
              <ChevronDoubleDownIcon className="size-4 text-white absolute bottom-2 right-2 animate-bounce" />
            )}
          </div>
        </div>
      )}
    </>
  );
};
