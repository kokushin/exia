import { useState, useEffect } from "react";
// TODO: isFetched が true になったら scenario を参照するように修正
import mockScenario from "@/scenarios/S_000.json";
// TODO: configStateに移す
import { CONFIG } from "@/constants";
import { useAtom } from "jotai";
import { configState } from "@/states/configState";

const FADE_DURATION = 1000; // フェードアウトの再生速度(ms)
const LOADING_DELAY = 500; // 読み込み完了後の遅延(ms)

export const Loading: React.FC = () => {
  const [config, setConfig] = useAtom(configState);
  const [loadedAssets, setLoadedAssets] = useState(0);

  useEffect(() => {
    const cacheAssets = async () => {
      const allAssets: string[] = [];

      // 背景画像のパスをキャッシュ
      allAssets.push(`./images/backgrounds/${mockScenario.backgroundFile}`);

      // キャラクター画像のパスをキャッシュ
      mockScenario.characters.forEach((character) => {
        allAssets.push(`./images/characters/${character.imageFile}`);
      });

      // CG画像のパスと音声ファイルをキャッシュ
      mockScenario.lines.forEach((line, index) => {
        if (line.character && line.character.imageFile) {
          allAssets.push(`./images/characters/${line.character.imageFile}`);
        }
        if (line.cutIn && line.cutIn.imageFile) {
          allAssets.push(`./images/cut_ins/${line.cutIn.imageFile}`);
        }
        if (CONFIG.VOICEVOX && line.character && line.text && line.type === 1) {
          allAssets.push(`./audios/voices/${mockScenario.id}_${index}.wav`);
        }
      });

      const promises = allAssets.map((src) => cacheAsset(src, setLoadedAssets));
      await Promise.all(promises);

      const timer = setTimeout(() => {
        setConfig({
          ...config,
          isLoaded: true,
        });
        clearTimeout(timer);
      }, LOADING_DELAY);
    };

    cacheAssets();
  }, [mockScenario]);

  const totalAssets = getTotalAssetsCount(mockScenario, CONFIG);
  const progress = Math.round((loadedAssets / totalAssets) * 100);

  return (
    <div
      className={`flex justify-center items-center absolute top-0 left-0 z-50 w-full h-full bg-black ${
        config.isLoaded ? "pointer-events-none" : ""
      }`}
      style={{ opacity: config.isLoaded ? 0 : 1, transition: `opacity ${FADE_DURATION}ms ease` }}
    >
      <div className="relative w-8 h-8 animate-loading-spin">
        <div className="absolute top-0 left-0 w-4 h-4 rotate-45 before:content-[''] before:w-4 before:h-[2px] before:bg-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:w-[2px] after:h-4 after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 animate-loading-effect-odd" />
        <div className="absolute top-0 left-4 w-4 h-4 rotate-45 before:content-[''] before:w-4 before:h-[2px] before:bg-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:w-[2px] after:h-4 after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 animate-loading-effect-even" />
        <div className="absolute top-4 left-0 w-4 h-4 rotate-45 before:content-[''] before:w-4 before:h-[2px] before:bg-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:w-[2px] after:h-4 after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 animate-loading-effect-even" />
        <div className="absolute top-4 left-4 w-4 h-4 rotate-45 before:content-[''] before:w-4 before:h-[2px] before:bg-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:w-[2px] after:h-4 after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 animate-loading-effect-odd" />
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-4 w-full px-8 max-w-[320px]">
        <div className="relative w-full h-[2px] bg-white bg-opacity-10 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <div>Loading...</div>
          <div>{progress}%</div>
        </div>
      </div>
    </div>
  );
};

const cacheAsset = (src: string, setLoadedAssets: React.Dispatch<React.SetStateAction<number>>) => {
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
};

const getTotalAssetsCount = (mockScenario, CONFIG) => {
  return (
    1 + // 背景画像
    mockScenario.characters.length + // キャラクター画像
    mockScenario.lines.filter((line) => line.character?.imageFile).length + // キャラクター画像
    mockScenario.lines.filter((line) => line.cutIn?.imageFile).length + // カットイン画像
    (CONFIG.VOICEVOX ? mockScenario.lines.filter((line) => line.character && line.text && line.type === 1).length : 0) // 音声ファイル
  );
};
