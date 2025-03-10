import { useEffect, useState } from "react";
import type { Scenario, ScenarioCharacter, ScenarioLine } from "@/types";

const ScenarioEditor: React.FC = () => {
  const [editingScenario, setEditingScenario] = useState<Scenario>({
    id: "",
    currentLineIndex: 0,
    lines: [],
  });

  useEffect(() => {
    // 初期データの読み込み
    const loadScenario = async () => {
      try {
        const response = await fetch("/api/scenario");
        const data = await response.json();
        setEditingScenario(data);
      } catch (error) {
        alert("シナリオの読み込みに失敗しました");
      }
    };
    loadScenario();
  }, []);

  const handleSave = async () => {
    try {
      // シナリオを保存
      const response = await fetch("/api/scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingScenario),
      });

      if (!response.ok) {
        throw new Error("Failed to save scenario");
      }

      // 保存が完了したらメッセージを表示
      alert("保存しました。メインアプリケーションを更新します。");
    } catch (error) {
      alert("シナリオの保存に失敗しました");
    }
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingScenario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCharacterChange = (index: number, field: keyof ScenarioCharacter, value: any) => {
    setEditingScenario((prev) => ({
      ...prev,
      characters: prev.characters?.map((char, i) => (i === index ? { ...char, [field]: value } : char)) || [],
    }));
  };

  const handleLineChange = (index: number, field: keyof ScenarioLine, value: any) => {
    setEditingScenario((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    }));
  };

  const addNewLine = () => {
    setEditingScenario((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          type: 0, // ナレーション
          text: "",
        },
      ],
    }));
  };

  const addNewCharacter = () => {
    const newIndex = editingScenario.characters?.length || 0;
    setEditingScenario((prev) => ({
      ...prev,
      characters: [
        ...(prev.characters || []),
        {
          index: newIndex,
          name: "",
          imageFile: "",
          isShow: false,
        },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">シナリオエディター</h1>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            保存
          </button>
        </div>

        {/* 基本情報 */}
        <section className="mb-8 bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">シナリオID</label>
              <input
                type="text"
                name="id"
                value={editingScenario.id}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">BGMファイル</label>
              <input
                type="text"
                name="bgmFile"
                value={editingScenario.bgmFile || ""}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">背景ファイル</label>
              <input
                type="text"
                name="backgroundFile"
                value={editingScenario.backgroundFile || ""}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
          </div>
        </section>

        {/* キャラクター一覧 */}
        <section className="mb-8 bg-gray-800 p-4 rounded">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">キャラクター一覧</h2>
            <button onClick={addNewCharacter} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded">
              追加
            </button>
          </div>
          <div className="space-y-4">
            {editingScenario.characters?.map((char, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">名前</label>
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => handleCharacterChange(index, "name", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">画像ファイル</label>
                    <input
                      type="text"
                      value={char.imageFile}
                      onChange={(e) => handleCharacterChange(index, "imageFile", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 rounded"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={char.isShow}
                      onChange={(e) => handleCharacterChange(index, "isShow", e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm">表示</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* シナリオライン */}
        <section className="bg-gray-800 p-4 rounded">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">シナリオライン</h2>
            <button onClick={addNewLine} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded">
              追加
            </button>
          </div>
          <div className="space-y-4">
            {editingScenario.lines.map((line, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">タイプ</label>
                    <select
                      value={line.type}
                      onChange={(e) => handleLineChange(index, "type", parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-600 rounded"
                    >
                      <option value={0}>ナレーション</option>
                      <option value={1}>セリフ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">テキスト</label>
                    <textarea
                      value={line.text}
                      onChange={(e) => handleLineChange(index, "text", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 rounded"
                      rows={3}
                    />
                  </div>
                  {line.type === 1 && (
                    <div>
                      <label className="block text-sm mb-1">キャラクター</label>
                      <select
                        value={line.character?.index || 0}
                        onChange={(e) =>
                          handleLineChange(index, "character", {
                            ...line.character,
                            index: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-600 rounded"
                      >
                        <option value="">選択してください</option>
                        {editingScenario.characters?.map((char) => (
                          <option key={char.index} value={char.index}>
                            {char.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScenarioEditor;
