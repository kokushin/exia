import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { scenarioState } from "@/states/scenarioState";
import { navigationState } from "@/states/navigationState";
import { CharacterInfo, ScenarioLogEntry } from "@/types";
import { ScenarioLine } from "@/types";

export const useScenarioManager = (isLoaded: boolean) => {
  const [scenario, setScenario] = useAtom(scenarioState);
  const [navigation, setNavigation] = useAtom(navigationState);

  // キャラクター情報を更新する関数
  const updateCharacterInfo = useCallback((nextLine: any, characters: any[]) => {
    if (nextLine.character?.imageFile) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        imageFile: nextLine.character.imageFile,
      };
    }

    if (nextLine.character?.animation) {
      characters[nextLine.character.index] = {
        ...characters[nextLine.character.index],
        animation: nextLine.character.animation,
      };
    }
    return characters;
  }, []);

  // キャラクター情報をログ用に取得
  const getCharacterInfoForLog = useCallback(
    (currentLine: any): CharacterInfo | undefined => {
      if (currentLine?.character && currentLine.character.index !== undefined) {
        const character = scenario.characters[currentLine.character.index];
        if (character) {
          return {
            index: currentLine.character.index,
            name: character.name,
            imageFile: character.imageFile,
          };
        }
      }
      return undefined;
    },
    [scenario.characters]
  );

  // 現在の行をログに追加
  const addCurrentLineToLogs = useCallback((): ScenarioLogEntry[] => {
    // ScenarioLogEntry型として扱うために明示的にキャストする
    const updatedLogs = [...scenario.logs] as ScenarioLogEntry[];
    const currentLine = scenario.currentLine;

    if (currentLine) {
      // 重複チェック
      const isAlreadyLogged = updatedLogs.some((log) => log.text === currentLine.text);

      if (!isAlreadyLogged) {
        // 現在の行に関連するキャラクター情報を取得
        const characterInfo = getCharacterInfoForLog(currentLine);

        // キャラクター情報を含めてログに追加
        updatedLogs.push({
          ...currentLine,
          character: characterInfo,
        } as ScenarioLogEntry);
      }
    }

    return updatedLogs;
  }, [scenario.logs, scenario.currentLine, getCharacterInfoForLog]);

  // 次のセリフに進む
  const goToNextLine = useCallback(() => {
    const nextLineIndex = scenario.currentLineIndex + 1;

    // シナリオの末尾に到達したら処理をスキップ
    if (nextLineIndex > scenario.lines.length - 1) {
      setNavigation((prev) => ({
        ...prev,
        isAutoPlay: false, // オート再生を終了
      }));
      return false;
    }

    const nextLine = scenario.lines[nextLineIndex];
    const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);
    const updatedLogs = addCurrentLineToLogs();

    // シナリオの状態を更新
    setScenario((prevState) => ({
      ...prevState,
      currentLineIndex: nextLineIndex,
      currentLine: nextLine,
      currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
      characters: updatedCharacters,
      logs: updatedLogs,
    }));

    return true;
  }, [scenario, setNavigation, setScenario, updateCharacterInfo, addCurrentLineToLogs]);

  // 現在のキャラクターの名前を取得
  const getCurrentCharacterName = useCallback(() => {
    if (scenario.currentCharacterIndex !== -1 && scenario.characters[scenario.currentCharacterIndex]) {
      return scenario.characters[scenario.currentCharacterIndex].name;
    }
    return undefined;
  }, [scenario.currentCharacterIndex, scenario.characters]);

  // シナリオが終了しているかをチェック
  const isScenarioEnd = useCallback(() => {
    return scenario.currentLineIndex >= scenario.lines.length - 1;
  }, [scenario.currentLineIndex, scenario.lines.length]);

  // 初期のシナリオをログに追加（一度だけ実行される）
  useEffect(() => {
    if (scenario.currentLine && scenario.logs.length === 0 && isLoaded) {
      const characterInfo = getCharacterInfoForLog(scenario.currentLine);

      setScenario((prevState) => ({
        ...prevState,
        logs: [
          {
            ...scenario.currentLine,
            character: characterInfo,
          } as ScenarioLogEntry,
        ],
      }));
    }
  }, [scenario.currentLine, scenario.logs.length, isLoaded, setScenario, getCharacterInfoForLog]);

  return {
    scenario,
    navigation,
    setNavigation,
    updateCharacterInfo,
    goToNextLine,
    getCurrentCharacterName,
    isScenarioEnd,
    addCurrentLineToLogs,
  };
};
