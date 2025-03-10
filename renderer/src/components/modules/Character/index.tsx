import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { scenarioState } from "@/states/scenarioState";

// TODO: 任意の数値を設定できるようにする
const IMAGE_WIDTH = 400;

export const Character: React.FC = () => {
  const { characters, currentCharacterIndex } = useAtomValue(scenarioState);

  // 表示するキャラクターをフィルタリング
  const visibleCharacters = useMemo(() => {
    return characters.filter((character) => character.isShow);
  }, [characters]);

  // translateXの計算をメモ化
  const translateX = useMemo(() => {
    if (currentCharacterIndex === -1) {
      return 0;
    }
    const totalWidth = IMAGE_WIDTH * visibleCharacters.length;
    const flexboxCenter = totalWidth / 2;
    const targetBoxCenter = IMAGE_WIDTH * currentCharacterIndex + IMAGE_WIDTH / 2;
    return flexboxCenter - targetBoxCenter;
  }, [currentCharacterIndex, visibleCharacters.length]);

  return (
    <div
      className="flex justify-center transition-transform duration-500 pointer-events-none"
      style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
    >
      {visibleCharacters.map((character, i) => (
        <div
          className="relative flex flex-col justify-end min-h-[100svh] transition-transform duration-500"
          style={{
            minWidth: IMAGE_WIDTH,
            maxWidth: IMAGE_WIDTH,
            transform: `scale(${i === currentCharacterIndex ? 1.1 : 1})`,
          }}
          key={i}
        >
          <img
            src={`./images/characters/${character.imageFile}`}
            className={`object-contain mt-24 ${character.animation ? character.animation : ""}`}
          />
        </div>
      ))}
    </div>
  );
};
