import { FC } from "react";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import { MessageLayoutProps } from "@/types";

// セリフ表示レイアウト
export const DialogueLayout: FC<MessageLayoutProps> = ({ characterName, children, showArrowIcon, isAutoPlay }) => (
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
export const NarrationLayout: FC<MessageLayoutProps> = ({ children, showArrowIcon, isAutoPlay }) => (
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
