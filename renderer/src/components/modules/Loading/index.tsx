import { useState, useEffect } from "react";
import { mockScenario } from "@/mocks/scenario";

// TODO: mockScenario は親コンポーネントから受け取るように修正

const FADE_DURATION = 1000; // フェードアウトの再生速度(ms)
const LOADING_DELAY = 500; // 読み込み完了後の遅延(ms)

export const Loading: React.FC = () => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cacheImages = async () => {
      const allImages: string[] = [];

      // 背景画像のパスをキャッシュ
      allImages.push(`./images/backgrounds/${mockScenario.backgroundFile}`);

      // キャラクター画像のパスをキャッシュ
      mockScenario.characters.forEach((character) => {
        allImages.push(`./images/characters/${character.imageFile}`);
      });

      // CG画像のパスをキャッシュ
      mockScenario.lines.forEach((line) => {
        if (line.character && line.character.imageFile) {
          allImages.push(`./images/characters/${line.character.imageFile}`);
        }
        if (line.cutIn && line.cutIn.imageFile) {
          allImages.push(`./images/cut_ins/${line.cutIn.imageFile}`);
        }
      });

      const promises = allImages.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setLoadedImages((prev) => prev + 1);
            resolve();
          };
          img.onerror = reject;
        });
      });

      await Promise.all(promises);

      const timer = setTimeout(() => {
        setIsLoaded(true);
        clearTimeout(timer);
      }, LOADING_DELAY);
    };

    cacheImages();
  }, [mockScenario]);

  const totalImages =
    mockScenario.characters.length +
    mockScenario.lines.filter((line) => line.character?.imageFile || line.cutIn?.imageFile).length +
    1;
  const progress = Math.round((loadedImages / totalImages) * 100);

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
