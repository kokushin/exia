import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

// シナリオファイルのパス
const SCENARIO_PATH = "/Users/kokushing/Repository/exia/renderer/src/scenarios/S_000.json";

// デバッグ用
console.log("SCENARIO_PATH:", SCENARIO_PATH);
const DEFAULT_SCENARIO = {
  id: "S_000",
  backgroundFile: "bg_01.webp",
  currentLineIndex: 0,
  characters: [
    {
      index: 0,
      name: "キャラA",
      imageFile: "chara_01.webp",
      isShow: true,
      speakerId: 3,
    },
    {
      index: 1,
      name: "キャラB",
      imageFile: "chara_02.webp",
      isShow: true,
      speakerId: 2,
    },
  ],
  lines: [
    {
      type: 0,
      text: "説明テキスト",
    },
    {
      character: {
        index: 0,
      },
      type: 0,
      text: "キャラクター移動",
    },
    {
      character: {
        index: 0,
        imageFile: "chara_01.webp",
      },
      type: 1,
      text: "キャラクターのセリフ1",
    },
    {
      cutIn: {
        imageFile: "cut_01.webp",
      },
      type: 0,
      text: "カットイン表示",
    },
    {
      type: 0,
      text: "カットイン非表示",
    },
    {
      cutIn: {
        imageFile: "cg_01.webp",
        isFullScreen: true,
      },
      type: 0,
      text: "CG表示",
    },
    {
      cutIn: {
        imageFile: "cg_01.webp",
        isFullScreen: true,
      },
      character: {
        index: 1,
      },
      type: 1,
      text: "CG中のキャラクターのセリフ",
    },
    {
      character: {
        index: 1,
      },
      type: 0,
      text: "CG非表示",
    },
    {
      character: {
        index: 1,
        imageFile: "chara_02.webp",
      },
      type: 1,
      text: 'キャラクターのセリフ2<br>改行<br><span style="font-size:24px">テキストの大きさ変更</span>',
    },
    {
      character: {
        index: 0,
        name: "キャラA(真の姿)",
        imageFile: "chara_01.webp",
      },
      type: 1,
      text: "キャラクターのセリフ3",
    },
    {
      type: 0,
      text: "デバッグ終了",
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      console.log("Attempting to read file from:", SCENARIO_PATH);
      const data = await fs.readFile(SCENARIO_PATH, "utf-8");
      console.log("Successfully read file");
      const parsedData = JSON.parse(data);
      console.log("Parsed data:", parsedData);
      res.status(200).json(parsedData);
    } catch (error) {
      console.error("Error details:", error);
      // ファイルが存在しない場合はデフォルトのシナリオを返す
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log("File not found, creating default scenario");
        try {
          // ディレクトリが存在することを確認
          const dir = path.dirname(SCENARIO_PATH);
          await fs.mkdir(dir, { recursive: true });

          // ファイルを作成
          await fs.writeFile(SCENARIO_PATH, JSON.stringify(DEFAULT_SCENARIO, null, 2));
          console.log("Default scenario created at:", SCENARIO_PATH);

          // 作成したファイルを読み込んで確認
          const data = await fs.readFile(SCENARIO_PATH, "utf-8");
          const parsedData = JSON.parse(data);
          console.log("Verified created file:", parsedData);

          res.status(200).json(DEFAULT_SCENARIO);
        } catch (createError) {
          console.error("Failed to create scenario file:", createError);
          res.status(500).json({ error: "Failed to create scenario file", details: createError });
        }
      } else {
        console.error("Failed to read scenario:", error);
        res.status(500).json({ error: "Failed to read scenario", details: error });
      }
    }
  } else if (req.method === "POST") {
    try {
      // ディレクトリが存在することを確認
      const dir = path.dirname(SCENARIO_PATH);
      await fs.mkdir(dir, { recursive: true });

      // ファイルを保存
      const content = JSON.stringify(req.body, null, 2);
      await fs.writeFile(SCENARIO_PATH, content);
      console.log("Scenario saved successfully");

      // 保存したファイルを読み込んで確認
      const savedData = await fs.readFile(SCENARIO_PATH, "utf-8");
      const parsedData = JSON.parse(savedData);
      console.log("Verified saved file:", parsedData);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to save scenario:", error);
      res.status(500).json({ error: "Failed to save scenario", details: error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
