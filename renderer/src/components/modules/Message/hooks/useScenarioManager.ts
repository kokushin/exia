import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { scenarioState } from "@/states/scenarioState";
import { navigationState } from "@/states/navigationState";
import { CharacterInfo, ScenarioChoice, ScenarioLogEntry } from "@/types";

export const useScenarioManager = (isLoaded: boolean) => {
  const [scenario, setScenario] = useAtom(scenarioState);
  const [navigation, setNavigation] = useAtom(navigationState);
  const [isShowingChoices, setIsShowingChoices] = useState(false);

  // キャラクター情報を更新する関数
  const updateCharacterInfo = useCallback((nextLine: any, characters: any[]) => {
    if (!nextLine.character || nextLine.character.index === undefined) {
      return characters;
    }

    // 新しいキャラクターオブジェクトを作成
    const updatedCharacter = { ...characters[nextLine.character.index] };

    // 名前が指定されている場合は更新
    if (nextLine.character?.name) {
      updatedCharacter.name = nextLine.character.name;
    }

    // 画像ファイルが指定されている場合は更新
    if (nextLine.character?.imageFile) {
      updatedCharacter.imageFile = nextLine.character.imageFile;
    }

    // アニメーションが指定されている場合は更新
    if (nextLine.character?.animation) {
      updatedCharacter.animation = nextLine.character.animation;
    }

    // 更新されたキャラクター情報で配列を更新
    const newCharacters = [...characters];
    newCharacters[nextLine.character.index] = updatedCharacter;
    return newCharacters;
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

  // 特定のIDを持つ行のインデックスを見つける
  const findLineIndexById = useCallback(
    (id: string): number => {
      const index = scenario.lines.findIndex((line) => line.id === id);
      return index !== -1 ? index : scenario.currentLineIndex + 1;
    },
    [scenario.lines, scenario.currentLineIndex]
  );

  // 次の選択肢のインデックスを見つける
  const findNextChoiceIndex = useCallback((): number => {
    let index = scenario.currentLineIndex + 1;
    while (index < scenario.lines.length) {
      if (scenario.lines[index].type === 2) {
        return index;
      }
      index++;
    }
    return scenario.lines.length - 1; // 選択肢が見つからない場合は最後の行を返す
  }, [scenario.lines, scenario.currentLineIndex]);

  // シナリオをスキップする関数
  const skipToNextChoice = useCallback(() => {
    // 現在の行をログに追加
    let updatedLogs = addCurrentLineToLogs();

    // 次の選択肢、または最後の行のインデックスを取得
    const targetIndex = findNextChoiceIndex();
    const nextLine = scenario.lines[targetIndex];
    const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);

    // スキップされる範囲のセリフをすべてログに追加
    for (let i = scenario.currentLineIndex + 1; i < targetIndex; i++) {
      const skippedLine = scenario.lines[i];
      // 重複チェック
      const isAlreadyLogged = updatedLogs.some((log) => log.text === skippedLine.text);

      if (!isAlreadyLogged) {
        // キャラクター情報を取得してログに追加
        const characterInfo = getCharacterInfoForLog(skippedLine);
        updatedLogs.push({
          ...skippedLine,
          character: characterInfo,
        } as ScenarioLogEntry);
      }
    }

    // 選択肢に到達したら表示する
    if (nextLine.type === 2) {
      setIsShowingChoices(true);
    }

    // シナリオの状態を更新
    setScenario((prevState) => ({
      ...prevState,
      currentLineIndex: targetIndex,
      currentLine: nextLine,
      currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
      characters: updatedCharacters,
      logs: updatedLogs, // スキップしたセリフを含む更新されたログ
    }));

    // オート再生は停止
    setNavigation((prev) => ({
      ...prev,
      isAutoPlay: false,
    }));

    return nextLine;
  }, [
    findNextChoiceIndex,
    scenario.lines,
    scenario.characters,
    scenario.currentLineIndex,
    updateCharacterInfo,
    setScenario,
    setNavigation,
    addCurrentLineToLogs,
    getCharacterInfoForLog,
  ]);

  // 選択肢が選ばれたときの処理
  const handleChoiceSelect = useCallback(
    (choice: ScenarioChoice) => {
      const targetIndex = findLineIndexById(choice.jumpTo);

      // 選択肢を非表示にする
      setIsShowingChoices(false);

      // 現在の行をログに追加
      const updatedLogs = addCurrentLineToLogs();

      // 選択結果をログに追加
      updatedLogs.push({
        type: 0,
        text: `選択: ${choice.text}`,
      } as ScenarioLogEntry);

      // シナリオの状態を更新してジャンプさせる
      const nextLine = scenario.lines[targetIndex];
      const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);

      setScenario((prevState) => ({
        ...prevState,
        currentLineIndex: targetIndex,
        currentLine: nextLine,
        currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
        characters: updatedCharacters,
        logs: updatedLogs,
      }));
    },
    [scenario.lines, scenario.characters, findLineIndexById, updateCharacterInfo, addCurrentLineToLogs, setScenario]
  );

  // 次のセリフに進む
  const goToNextLine = useCallback(() => {
    // 選択肢表示中は、選択されるまで次には進まない
    if (isShowingChoices) {
      return false;
    }

    // 現在の行がジャンプ命令を持っている場合
    if (scenario.currentLine?.jumpTo) {
      const targetIndex = findLineIndexById(scenario.currentLine.jumpTo);
      const nextLine = scenario.lines[targetIndex];
      const updatedCharacters = updateCharacterInfo(nextLine, [...scenario.characters]);
      const updatedLogs = addCurrentLineToLogs();

      setScenario((prevState) => ({
        ...prevState,
        currentLineIndex: targetIndex,
        currentLine: nextLine,
        currentCharacterIndex: nextLine.character !== undefined ? nextLine.character.index : -1,
        characters: updatedCharacters,
        logs: updatedLogs,
      }));

      return true;
    }

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

    // 次が選択肢の場合
    if (nextLine.type === 2) {
      setIsShowingChoices(true);
    } else {
      setIsShowingChoices(false);
    }

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
  }, [
    scenario,
    setNavigation,
    setScenario,
    updateCharacterInfo,
    addCurrentLineToLogs,
    isShowingChoices,
    findLineIndexById,
  ]);

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
    isShowingChoices,
    handleChoiceSelect,
    skipToNextChoice,
  };
};
