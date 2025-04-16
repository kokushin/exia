import { useState, useCallback, useEffect, useMemo } from "react";
import { TypewriterClass } from "typewriter-effect";
import { MESSAGE_CONFIG } from "@/constants";

export const useMessageDisplay = (navigation: any, text: string, isLoaded: boolean) => {
  const [isShowArrowIcon, setIsShowArrowIcon] = useState(false);
  const [isShowText, setIsShowText] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [typewriterInstance, setTypewriterInstance] = useState<TypewriterClass | null>(null);

  // テキストを全文表示する関数
  const showFullText = useCallback(() => {
    if (!navigation.isAutoPlay && typewriterInstance) {
      typewriterInstance.stop();
      const textElement = document.querySelector(".Typewriter__wrapper");
      if (textElement) {
        textElement.innerHTML = text || "";
      }
      setIsReading(false);
      setIsShowArrowIcon(true);
    }
  }, [navigation.isAutoPlay, typewriterInstance, text]);

  // ローディング後のセリフ表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowText(true);
    }, MESSAGE_CONFIG.LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // 次の行への進行を処理する関数
  const handleNextLine = useCallback(
    (goToNextLineFn: () => boolean) => {
      // ローディング中は処理をスキップ
      if (!isLoaded) return;

      setIsShowArrowIcon(false);

      // テキスト送りが途中の場合は全文表示
      if (isReading) {
        showFullText();
        return;
      }

      // 次の行に進む
      goToNextLineFn();
    },
    [isLoaded, isReading, showFullText]
  );

  return {
    isShowArrowIcon,
    setIsShowArrowIcon,
    isShowText,
    isReading,
    setIsReading,
    typewriterInstance,
    setTypewriterInstance,
    showFullText,
    handleNextLine,
  };
};
