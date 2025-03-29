import { useAtomValue } from "jotai";
import { useMemo, useEffect, useState } from "react";
import { scenarioState } from "@/states/scenarioState";

// 画像の高さ
const IMAGE_HEIGHT_RATIO = 1;

export const Character: React.FC = () => {
  const { characters, currentCharacterIndex } = useAtomValue(scenarioState);
  const [imageWidth, setImageWidth] = useState(400);
  const [windowHeight, setWindowHeight] = useState(0);

  // ウィンドウサイズの変更を監視
  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight);
      // 画像の高さから幅を計算（アスペクト比を維持）
      // TODO: 実際の画像のアスペクト比に合わせて調整が必要
      const aspectRatio = 1 / 2; // 幅:高さ = 1:2
      const calculatedHeight = window.innerHeight * IMAGE_HEIGHT_RATIO;
      const calculatedWidth = calculatedHeight * aspectRatio;
      setImageWidth(calculatedWidth);
    };

    // 初期化時と画面サイズ変更時に実行
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // 表示するキャラクターをフィルタリング
  const visibleCharacters = useMemo(() => {
    return characters.filter((character) => character.isShow);
  }, [characters]);

  // translateXの計算をメモ化（動的な幅を使用）
  const translateX = useMemo(() => {
    if (currentCharacterIndex === -1) {
      return 0;
    }
    const totalWidth = imageWidth * visibleCharacters.length;
    const flexboxCenter = totalWidth / 2;
    const targetBoxCenter = imageWidth * currentCharacterIndex + imageWidth / 2;
    return flexboxCenter - targetBoxCenter;
  }, [currentCharacterIndex, visibleCharacters.length, imageWidth]);

  return (
    <div
      className="flex justify-center transition-transform duration-500 pointer-events-none"
      style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
    >
      {visibleCharacters.map((character, i) => (
        <div
          className="relative flex flex-col justify-end items-center min-h-[100svh] transition-transform duration-500"
          style={{
            minWidth: imageWidth,
            maxWidth: imageWidth,
            transform: `scale(${i === currentCharacterIndex ? 1.1 : 1})`,
          }}
          key={i}
        >
          <img
            src={`./images/characters/${character.imageFile}`}
            className={`object-contain object-bottom ${character.animation ? character.animation : ""}`}
            style={{
              height: `${windowHeight * IMAGE_HEIGHT_RATIO}px`,
              width: "auto",
              maxWidth: "100%",
            }}
          />
        </div>
      ))}
    </div>
  );
};
