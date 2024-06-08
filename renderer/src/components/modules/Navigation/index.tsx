import { useRecoilState } from "recoil";
import { navigationState } from "@/states/navigationState";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export const Navigation: React.FC = () => {
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const items = [
    { label: "SAVE", action: undefined },
    { label: "LOAD", action: undefined },
    { label: "AUTO", action: () => handleAutoPlay() },
    { label: "SKIP", action: undefined },
    { label: "LOG", action: undefined },
    { label: "CONFIG", action: undefined },
  ];

  const handleAutoPlay = () => {
    setNavigation({
      ...navigation,
      isAutoPlay: !navigation.isAutoPlay,
    });
  };

  return (
    <nav className="fixed top-0 right-0 z-20 flex items-center gap-4 text-white text-sm p-4">
      {items.map((item, i) => (
        <button
          onClick={item.action}
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
