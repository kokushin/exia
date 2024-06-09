import { useState, useEffect } from "react";
import mockScenario from "@/scenarios/S_000.json";

// TODO: mockScenario は親コンポーネントから受け取るように修正

const FADE_DURATION = 1000; // フェードアウトの再生速度(ms)
const LOADING_DELAY = 500; // 読み込み完了後の遅延(ms)

export const Loading: React.FC = () => {
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cacheAssets = async () => {
      const allAssets: string[] = [];

      // 背景画像のパスをキャッシュ
      allAssets.push(`./images/backgrounds/${mockScenario.backgroundFile}`);

      // キャラクター画像のパスをキャッシュ
      mockScenario.characters.forEach((character) => {
        allAssets.push(`./images/characters/${character.imageFile}`);
      });

      // CG画像のパスとwavファイルをキャッシュ
      mockScenario.lines.forEach((line, index) => {
        if (line.character && line.character.imageFile) {
          allAssets.push(`./images/characters/${line.character.imageFile}`);
        }
        if (line.cutIn && line.cutIn.imageFile) {
          allAssets.push(`./images/cut_ins/${line.cutIn.imageFile}`);
        }
        if (line.character && line.text && line.type === 1) {
          allAssets.push(`./audios/voices/${mockScenario.id}_${index}.wav`);
        }
      });

      const promises = allAssets.map((src) => {
        return new Promise<void>((resolve) => {
          if (src.endsWith(".wav")) {
            const audio = new Audio();
            audio.src = src;
            audio.onloadeddata = () => {
              setLoadedAssets((prev) => prev + 1);
              resolve();
            };
            audio.onerror = () => {
              // wavファイルが見つからない場合はスキップ
              console.warn(`File not found: ${src}`);
              resolve();
            };
          } else {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setLoadedAssets((prev) => prev + 1);
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${src}`);
              resolve();
            };
          }
        });
      });

      await Promise.all(promises);

      const timer = setTimeout(() => {
        setIsLoaded(true);
        clearTimeout(timer);
      }, LOADING_DELAY);
    };

    cacheAssets();
  }, [mockScenario]);

  const totalAssets =
    1 + // 背景画像
    mockScenario.characters.length + // キャラクター画像
    mockScenario.lines.filter((line) => line.character?.imageFile).length + // キャラクター画像
    mockScenario.lines.filter((line) => line.cutIn?.imageFile).length + // カットイン画像
    mockScenario.lines.filter((line) => line.character && line.text && line.type === 1).length; // wavファイル

  const progress = Math.round((loadedAssets / totalAssets) * 100);

  return (
    <div
      className={`absolute top-0 left-0 z-50 w-full h-full bg-black ${isLoaded ? "pointer-events-none" : ""}`}
      style={{ opacity: isLoaded ? 0 : 1, transition: `opacity ${FADE_DURATION}ms ease` }}
    >
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-4 w-full px-8 max-w-[320px]">
        <div className="relative w-full h-[2px] bg-white bg-opacity-10">
          <div className={`absolute top-0 left-0 h-full bg-white`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <div>Loading...</div>
          <div>{progress}%</div>
        </div>
      </div>
    </div>
  );
};
