import { useAtomValue } from "jotai";
import { scenarioState } from "@/states/scenarioState";

// TODO: 任意の数値を設定できるようにする
const IMAGE_WIDTH = 400;

export const Character: React.FC = () => {
  const { characters, currentCharacterIndex } = useAtomValue(scenarioState);

  const translateX = () => {
    if (currentCharacterIndex === -1) {
      return 0;
    }
    const totalWidth = IMAGE_WIDTH * characters.filter((character) => character.isShow).length;
    const flexboxCenter = totalWidth / 2;
    const targetBoxCenter = IMAGE_WIDTH * currentCharacterIndex + IMAGE_WIDTH / 2;
    const translationX = flexboxCenter - targetBoxCenter;
    return translationX;
  };

  return (
    <div
      className="flex justify-center transition-transform duration-500 pointer-events-none"
      style={{ transform: `translate3d(${translateX()}px, 0, 0)` }}
    >
      {characters.map(
        (character, i) =>
          character.isShow && (
            <div
              className="relative flex flex-col justify-end min-h-screen transition-transform duration-500"
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
          )
      )}
    </div>
  );
};
