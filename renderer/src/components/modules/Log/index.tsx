import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { navigationState } from "@/states/navigationState";
import { scenarioState } from "@/states/scenarioState";
import { ScenarioLine, ScenarioCharacter } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/solid";

// メッセージの種類
const MESSAGE_TYPE = {
  NARRATION: 0,
  DIALOGUE: 1,
} as const;

export const Log: React.FC = () => {
  const [navigation, setNavigation] = useAtom(navigationState);
  const [scenario] = useAtom(scenarioState);

  const handleClose = useCallback(() => {
    setNavigation({
      ...navigation,
      isLogOpen: false,
    });
  }, [navigation, setNavigation]);

  // 表示するログ一覧を作成（保存されたログ＋現在表示中のセリフ）
  const allLogs = useMemo(() => {
    const logs = [...scenario.logs]; // 保存されたログ
    
    // 現在表示中のセリフが既にログに含まれていないか確認
    const currentLine = scenario.currentLine;
    if (currentLine) {
      const isAlreadyLogged = logs.some(log => log.text === currentLine.text);
      
      if (!isAlreadyLogged) {
        // 現在の行に関連するキャラクター情報を取得
        let characterInfo = undefined;
        if (currentLine.character && currentLine.character.index !== undefined) {
          const character = scenario.characters[currentLine.character.index];
          if (character) {
            characterInfo = {
              index: currentLine.character.index,
              name: character.name,
              imageFile: character.imageFile,
            };
          }
        }
        
        // 現在表示中のセリフをログに追加
        logs.push({
          ...currentLine,
          character: characterInfo,
        });
      }
    }
    
    return logs;
  }, [scenario.logs, scenario.currentLine, scenario.characters]);

  // セリフの場合はキャラクター名とアイコンを表示
  const renderDialogue = (log: ScenarioLine, index: number) => {
    if (!log.character || log.character.index === undefined) return null;

    // キャラクター情報を取得
    const characterInfo = log.character;

    return (
      <div key={index} className="flex items-start gap-3 mb-4">
        {characterInfo.imageFile && (
          <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-gray-800">
            <img
              src={`/images/characters/${characterInfo.imageFile}`}
              alt={characterInfo.name || "キャラクター"}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
        <div className="flex-grow">
          {characterInfo.name && <div className="text-sm font-bold mb-1">{characterInfo.name}</div>}
          <div className="bg-gray-800 bg-opacity-70 rounded-lg p-3 text-sm">{log.text}</div>
        </div>
      </div>
    );
  };

  // ナレーションの場合はシンプルに表示
  const renderNarration = (log: ScenarioLine, index: number) => {
    return (
      <div key={index} className="italic text-center text-gray-300 my-4 px-4">
        {log.text}
      </div>
    );
  };

  return (
    <>
      {navigation.isLogOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">ログ</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-white" style={{ maxHeight: "calc(80vh - 60px)" }}>
              {allLogs.length === 0 ? (
                <div className="text-center text-gray-400 py-8">表示するログがありません</div>
              ) : (
                <div className="space-y-2">
                  {allLogs.map((log, index) =>
                    log.type === MESSAGE_TYPE.DIALOGUE ? renderDialogue(log, index) : renderNarration(log, index)
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
