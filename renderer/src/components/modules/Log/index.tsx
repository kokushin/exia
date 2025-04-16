import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { navigationState } from "@/states/navigationState";
import { scenarioState } from "@/states/scenarioState";
import { ScenarioLine, ScenarioCharacter } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { MESSAGE_TYPE } from "@/constants";

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
      const isAlreadyLogged = logs.some((log) => log.text === currentLine.text);

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

  // 装飾的な区切り線要素
  const Divider = () => (
    <div className="flex items-center justify-center w-full my-6">
      <div className="h-px w-full max-w-lg relative backlog-divider-line">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`h-1 w-1 rounded-full backlog-divider-dot ${i === 3 ? "h-1.5 w-1.5" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // セリフの場合はキャラクター名とアイコンを表示
  const renderDialogue = (log: ScenarioLine, index: number) => {
    if (!log.character || log.character.index === undefined) return null;

    // キャラクター情報を取得
    const characterInfo = log.character;

    return (
      <div key={index} className="flex items-start gap-3 mb-6 px-4">
        <div className="flex-shrink-0">
          {characterInfo.imageFile && (
            <div className="w-12 h-12 overflow-hidden rounded-full bg-gray-800 border-2 backlog-character-icon">
              <img
                src={`/images/characters/${characterInfo.imageFile}`}
                alt={characterInfo.name || "キャラクター"}
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
        </div>
        <div className="flex-grow">
          {characterInfo.name && <div className="font-bold mb-2 backlog-character-name">{characterInfo.name}</div>}
          <div
            className="rounded-lg p-4 text-gray-100 leading-relaxed shadow-lg backlog-message backdrop-blur-sm"
            dangerouslySetInnerHTML={{ __html: log.text }}
          />
        </div>
      </div>
    );
  };

  // ナレーションの場合はシンプルに表示
  const renderNarration = (log: ScenarioLine, index: number) => {
    return (
      <div
        key={index}
        className="italic text-center my-6 px-8 mx-auto max-w-2xl backlog-narration"
        dangerouslySetInnerHTML={{ __html: log.text }}
      />
    );
  };

  return (
    <>
      {navigation.isLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          {/* ヘッダー部分 */}
          <div className="relative w-full flex justify-center items-center py-4">
            <div className="relative">
              <div className="h-px w-64 absolute -bottom-2 left-1/2 transform -translate-x-1/2 backlog-header-decoration" />
              <h2 className="text-2xl font-bold text-white px-10 py-2 relative">
                バックログ
                <div className="absolute left-0 right-0 bottom-0 h-0.5 backlog-header-divider" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 backlog-diamond" />
              </h2>
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors w-10 h-10 rounded-lg border border-gray-700/50 flex items-center justify-center hover:bg-gray-800/50"
              aria-label="閉じる"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          {/* スクロール可能なログ本文 */}
          <div
            className="flex-1 overflow-y-auto px-4 py-6 text-white backlog-scrollbar"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
            }}
          >
            <div className="container mx-auto max-w-4xl">
              {allLogs.length === 0 ? (
                <div className="text-center text-gray-400 py-12">表示するログがありません</div>
              ) : (
                <div className="space-y-2">
                  {allLogs.map((log, index, arr) => {
                    // 前のログと現在のログのタイプが違う場合は区切り線を追加
                    const prevLog = index > 0 ? arr[index - 1] : null;
                    const showDivider = prevLog && prevLog.type !== log.type;

                    return (
                      <div key={index}>
                        {showDivider && <Divider />}
                        {log.type === MESSAGE_TYPE.DIALOGUE ? renderDialogue(log, index) : renderNarration(log, index)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* フッター部分 - 説明テキストなど */}
          <div className="p-4 border-t backlog-footer">
            <div className="container mx-auto max-w-4xl text-center text-gray-300/70 text-sm">
              今までの会話ログを確認できます
            </div>
          </div>
        </div>
      )}
    </>
  );
};
