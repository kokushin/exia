import { useState, useEffect, useMemo, useRef } from "react";
import { CONFIG } from "@/constants";
import { useAtom, useAtomValue } from "jotai";
import { screenState } from "@/states/screenState";
import { scenarioState } from "@/states/scenarioState";

const FADE_DURATION = 1000; // フェードアウトの再生速度(ms)
const LOADING_DELAY = 500; // 読み込み完了後の遅延(ms)

export const Loading: React.FC = () => {
  const [screen, setScreen] = useAtom(screenState);
  const [loadedAssets, setLoadedAssets] = useState(0);
  const loadedAssetsRef = useRef(new Set<string>()); // 既にロードされたアセットを追跡
  
  const scenario = useAtomValue(scenarioState);

  // アセットリストの生成をメモ化
  const allAssets = useMemo(() => {
    if (!scenario.isFetched) return [];

    const assets: string[] = [];

    // 背景画像のパスをキャッシュ
    if (scenario.backgroundFile) {
      assets.push(`./images/backgrounds/${scenario.backgroundFile}`);
    }

    // キャラクター画像のパスをキャッシュ
    scenario.characters?.forEach((character) => {
      assets.push(`./images/characters/${character.imageFile}`);
    });

    // CG画像のパスと音声ファイルをキャッシュ
    scenario.lines.forEach((line, index) => {
      if (line.character?.imageFile) {
        assets.push(`./images/characters/${line.character.imageFile}`);
      }
      if (line.cutIn?.imageFile) {
        assets.push(`./images/cut_ins/${line.cutIn.imageFile}`);
      }
      if (CONFIG.VOICEVOX && line.character && line.text && line.type === 1) {
        assets.push(`./audios/voices/${scenario.id}_${index}.wav`);
      }
    });

    // 重複を排除
    return [...new Set(assets)];
  }, [scenario]);

  // アセットの総数をメモ化
  const totalAssets = useMemo(() => allAssets.length, [allAssets]);

  // アセットのキャッシュ処理を最適化
  const cacheAsset = useRef(async (src: string) => {
    // 既にロード済みのアセットは処理しない
    if (loadedAssetsRef.current.has(src)) return;
    
    try {
      if (src.endsWith(".wav")) {
        const audio = new Audio();
        await new Promise<void>((resolve, reject) => {
          audio.onloadeddata = () => {
            if (!loadedAssetsRef.current.has(src)) {
              loadedAssetsRef.current.add(src);
              setLoadedAssets(prev => prev + 1);
            }
            resolve();
          };
          audio.onerror = () => {
            console.warn(`File not found: ${src}`);
            if (!loadedAssetsRef.current.has(src)) {
              loadedAssetsRef.current.add(src);
              setLoadedAssets(prev => prev + 1);
            }
            resolve();
          };
          audio.src = src;
        });
      } else {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            if (!loadedAssetsRef.current.has(src)) {
              loadedAssetsRef.current.add(src);
              setLoadedAssets(prev => prev + 1);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            if (!loadedAssetsRef.current.has(src)) {
              loadedAssetsRef.current.add(src);
              setLoadedAssets(prev => prev + 1);
            }
            resolve();
          };
          img.src = src;
        });
      }
    } catch (error) {
      console.error(`Failed to cache asset: ${src}`, error);
      // エラーが発生しても、ロード完了としてカウント
      if (!loadedAssetsRef.current.has(src)) {
        loadedAssetsRef.current.add(src);
        setLoadedAssets(prev => prev + 1);
      }
    }
  }).current;

  useEffect(() => {
    if (!scenario.isFetched || allAssets.length === 0) return;

    // 初期化
    setLoadedAssets(0);
    loadedAssetsRef.current = new Set();
    
    let mounted = true;
    let loadingTimer: NodeJS.Timeout | undefined;

    const loadAssets = async () => {
      try {
        // 並列ロードを行うが、各アセットは一度だけカウント
        await Promise.all(allAssets.map(cacheAsset));

        // すべてのアセットがロードされたことを確認
        if (mounted && loadedAssetsRef.current.size >= totalAssets) {
          loadingTimer = setTimeout(() => {
            setScreen((prev) => ({
              ...prev,
              isLoaded: true,
            }));
          }, LOADING_DELAY);
        }
      } catch (error) {
        console.error("Failed to load assets:", error);
      }
    };

    loadAssets();

    return () => {
      mounted = false;
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, [allAssets, totalAssets, scenario.isFetched, setScreen]);

  // 正確な進捗率計算のために、ロード完了したアセットと全アセット数を比較
  const progress = totalAssets > 0 ? Math.min(Math.round((loadedAssets / totalAssets) * 100), 100) : 0;

  return (
    <div
      className={`flex justify-center items-center absolute top-0 left-0 z-50 w-full h-full bg-black ${
        screen.isLoaded ? "pointer-events-none" : ""
      }`}
      style={{ opacity: screen.isLoaded ? 0 : 1, transition: `opacity ${FADE_DURATION}ms ease` }}
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
