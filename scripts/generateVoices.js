// VOICEVOXと連携してシナリオデータから音声ファイルを生成する
// ローカル環境でVOICEVOXを起動しておくこと
// https://voicevox.hiroshiba.jp/

const axios = require("axios");
const fs = require("fs");
const path = require("path");
// TODO: すべてのjsonファイルを読み込むように修正
const mockScenario = require("../renderer/src/scenarios/S_000.json");

// voicevox APIのエンドポイント
const VOICEVOX_API_ENDPOINT = "http://127.0.0.1:50021";

// キャラクターインデックスとスピーカーIDのマッピングを作成
const speakerMap = {};
mockScenario.characters.forEach((character) => {
  speakerMap[character.index] = character.speakerId;
});

// 出力ディレクトリの定義
const outputDir = path.resolve(__dirname, "../renderer/public/audios/voices");

// クリーンアップ処理: 出力ディレクトリ内の既存のwavファイルを削除
function cleanupOutputDir() {
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    files.forEach((file) => {
      if (file.endsWith(".wav")) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// 非同期処理のための関数を定義
async function generateVoice(line, index) {
  if (line.character && line.text && line.type === 1) {
    const speakerId = speakerMap[line.character.index];
    const text = line.text.replace(/<[^>]+>/g, ""); // HTMLタグを削除

    try {
      // URLパラメータとして音声合成用のクエリを生成
      const queryResponse = await axios.post(
        `${VOICEVOX_API_ENDPOINT}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const audioQuery = queryResponse.data;

      // 音声データを生成
      const synthesisResponse = await axios.post(
        `${VOICEVOX_API_ENDPOINT}/synthesis?speaker=${speakerId}`,
        audioQuery,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioData = synthesisResponse.data;

      // wavファイルとして保存
      const fileName = `${mockScenario.id}_${index}.wav`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(audioData));

      console.log(`Created: ${fileName}`);
    } catch (error) {
      if (error.response) {
        console.error(`Error processing line ${index}:`, error.response.data);
      } else {
        console.error(`Error processing line ${index}:`, error.message);
      }
    }
  }
}

// クリーンアップ処理の実行
cleanupOutputDir();

// lines配列内のオブジェクトにcharacterプロパティが存在し、typeが1である場合、そのオブジェクト内のtextの内容をもとに音声データを生成
mockScenario.lines.forEach((line, index) => {
  if (line.character && line.text && line.type === 1) {
    generateVoice(line, index);
  }
});
