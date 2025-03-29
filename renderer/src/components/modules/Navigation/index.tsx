import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { navigationState } from "@/states/navigationState";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

type NavigationItem = {
  label: string;
  action?: () => void;
};

export const Navigation: React.FC = () => {
  const [navigation, setNavigation] = useAtom(navigationState);

  const handleAutoPlay = useCallback(() => {
    setNavigation({
      ...navigation,
      isAutoPlay: !navigation.isAutoPlay,
    });
  }, [navigation, setNavigation]);

  // ナビゲーションアイテムをメモ化
  const items = useMemo<NavigationItem[]>(
    () => [
      { label: "SAVE" },
      { label: "LOAD" },
      { label: "AUTO", action: handleAutoPlay },
      { label: "SKIP" },
      { label: "LOG" },
      { label: "CONFIG" },
    ],
    [handleAutoPlay]
  );

  return (
    <nav className="absolute top-0 right-0 z-20 flex items-center gap-4 text-white text-sm p-4">
      {items.map((item, i) => (
        <button
          onClick={() => {
            if (item.action) {
              item.action();
            } else {
              window.alert("まだ未実装です😭");
            }
          }}
          key={i}
          className="relative"
          style={{
            textShadow: "1px 1px 0 rgba(0,0,0,.5)",
          }}
        >
          {item.label === "AUTO" && navigation.isAutoPlay && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ArrowPathIcon className="size-4 text-white animate-spin" />
            </span>
          )}
          <span className={item.label === "AUTO" && navigation.isAutoPlay ? "opacity-30" : ""}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
