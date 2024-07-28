<div align="center">
  <img src="https://github.com/kokushin/exia/assets/4176300/f339f967-712e-4967-9de9-52962d8d74f6" width="240" alt="©Proxima Beta Pte. Limited ©SHIFT UP CORP.">
  <h1>Exia</h1>
  <b>Next.js and Electron based novel game engine.<br>
Inspired by the UX/UI of “勝利の女神:NIKKE”.</b>
  <br>
  <br>
</div>

## 🚧 重要事項

Exia は現在開発中です。全体の進捗は 20% くらいです。<br>
[@kokushing](https://x.com/kokushing) をフォローして更新をお待ちください！

## 📝 概要

<img src="https://github.com/kokushin/exia/assets/4176300/cbb02a61-1ced-49c8-8d8d-8b099cbf319c" width="640" alt="">

Exia(エクシア)は、Next.js(TypeScript)+Electron ベースのビジュアルノベルゲームエンジンです。<br>
基本的なノベルゲームの機能を搭載し、JSX や CSS を用いて柔軟に UI をスタイリングすることが可能です。<br>
レスポンシブ対応しているため、モバイル向けのアプリケーションとしても出力できます。

将来的には、専用 GUI エディタや ChatGPT など生成 AI との連携機能も提供予定です！

## 🔗 デモ

Google Chrome での閲覧を推奨します。

[exia-demo.vercel.app](https://exia-demo.vercel.app)

## 🛠 主な機能

脳内のイメージで開発しているため細かい要件定義が終わっていません。都度更新していきます。<br>
欲しい機能などありましたら Issue に書き込んでいただくか、X(@kokushing) 宛に DM ください。

- ゲームエディターの機能
  - [x] キャラクターのセリフ表示
  - [x] システムメッセージ表示
  - [x] キャラクター画像の表示
  - [x] キャラクター切り替え
  - [x] カットイン画像表示
  - [x] CG 表示
  - [ ] 選択肢表示/条件分岐(セリフ間ジャンプ)
  - [ ] シナリオ切り替え
  - [ ] スタート画面
  - [ ] エンディング画面
  - [ ] CG ギャラリー画面
  - [ ] オプション画面
  - [ ] シナリオフローチャート画面
  - [ ] サウンド(BGM/SE)出力
  - [ ] アニメーション再生
  - [x] ローディング(画像キャッシュ)
- ゲームプレーヤーの機能
  - [ ] データセーブ
  - [ ] データロード
  - [x] オート再生
  - [ ] スキップ
  - [ ] ログ
  - [ ] コンフィグ
- その他
  - [x] Windows/MacOS 向けアプリケーションコンパイル
  - [ ] 画面録画・書き出し機能
  - [x] VOICEVOX 連携
  - [ ] 多言語対応(英語/中国語)
  - [ ] 専用 GUI エディタ
  - [ ] 処理最適化・リファクタリング
  - [ ] 外部 API 連携(プラグイン)実装

## 🎮 動作確認

現状で動作を確認したいという方は、下記の手順に沿って環境を構築してください。

### 動作環境

- Node.js v20x

### 手順

1. プロジェクトをクローン、または[ダウンロード](https://github.com/kokushin/exia/archive/refs/heads/main.zip)

```bash
git clone https://github.com/kokushin/exia.git
```

2. プロジェクトのディレクトリへ移動

```bash
cd exia
```

3. 必要なモジュールをインストール

```bash
npm install
```

4. 開発用のサーバを起動

```bash
npm run dev
```

5. Electron アプリケーションが起動します。<br>
   終了したい場合は、アプリケーションを閉じるか、Ctrl+C でローカルサーバを閉じてください。

### 画像やシナリオを変更したい場合

より詳細な編集方法は別途ドキュメントを作成しますが、とりあえず差し替えたい人向けの説明です。

#### 背景画像

`renderer/public/images/backgrounds` の bg_01.png を上書きしてください。

#### キャラクター画像

`renderer/public/images/characters` の chara_01.png を上書きしてください。

#### カットイン画像

`renderer/public/images/cut_ins` の cut_01.png を上書きしてください。

#### シナリオ

`renderer/src/scenarios/S_000.json` をエディタで開き、編集して保存してください。

```ts
// 構成と型の参考
// renderer/src/scenarios.json
export const mockScenario: Scenario = {
  id: 1, // シナリオID. 現在機能しません
  backgroundFile: "bg_01.png", // 背景画像のファイル名を指定
  currentLineIndex: 0, // 現在のセリフ位置. 現在機能しません
  characters: [
    // キャラクター情報を配列で格納する
    // 増やした分だけキャラクターが表示される
    {
      index: 0, // キャラクターの番号. 0が一番左端です
      name: "キャラA", // キャラクターの名前
      imageFile: "chara_01.png", // キャラクター画像のファイル名を指定
      isShow: true, // 初期表示フラグ. 現在機能しません
    },
    {
      index: 1,
      name: "キャラB",
      imageFile: "chara_02.png",
      isShow: true,
    },
  ],
  lines: [
    // セリフを配列で格納する
    // 増やした分だけセリフが表示される
    {
      type: 0, // メッセージタイプ. 0=システム 1=キャラクター
      text: "説明テキスト", // セリフの内容. HTMLタグが使えます
    },
    {
      character: {
        index: 0, // キャラクターをフォーカスする場合、対象キャラクターの番号を指定
      },
      type: 0,
      text: "キャラクター移動",
    },
    {
      character: {
        index: 0,
        imageFile: "chara_01.png", // キャラクターの画像を変更する場合、画像のファイル名を指定
      },
      type: 1,
      text: "キャラクターのセリフ1",
    },
    {
      cutInFile: "cut_01.png", // カットインを表示する場合、画像のファイル名を指定
      type: 0,
      text: "カットイン表示",
    },
    {
      character: {
        index: 1,
        imageFile: "chara_02.png",
      },
      type: 1,
      text: 'キャラクターのセリフ2<br>改行<br><span style="font-size:24px">テキストの大きさ変更</span>',
    },
    ...
  ],
};
```

上記の仕様はモックアップ段階であり、今後変更される可能性が高いです。<br>
設計に関してご提案がありましたら、お気軽に改善案をお送りください！

## 🎙 VOICEVOX 連携

仮実装ですが、[VOICEVOX](https://voicevox.hiroshiba.jp/) を使用して音声ファイルを書き出すことができます。

VOICEVOX 本体をダウンロードして、ローカルサーバを起動します。

`renderer/src/constants/index.ts` の CONFIG.VOICEVOX フラグを `true` にします。

```js
export const CONFIG = {
  ...
  VOICEVOX: true,
};
```

`renderer/src/scenarios/S_000.json` の `characters` のオブジェクト内に `speakerId` を設定します。<br>
※ VOICEVOX の speakerId を参照してください

```js
{
  "index": 0,
  "name": "キャラA",
  "imageFile": "chara_01.webp",
  "isShow": true,
  "speakerId": 3 // ずんだもん(ノーマル)
},
```

下記コマンドを実行すると、`public/audios/voices` 配下に wav ファイルを生成します。

```bash
npm run build-voice
```

キャラクターのセリフが設定されている箇所の音声が生成されます。

## 👨‍💻 開発者向けドキュメント

現在準備中です。

## 💭 余談

ゲームエンジン名の「Exia(エクシア)」は SHIFT UP CORP の作品「勝利の女神:NIKKE」に登場するキャラクターです。本ゲームエンジンが NIKKE の UI や演出を参考していることや、エクシア自身がゲーム好きという性格もありこの名前に決めました。

お尻に注目されがちのゲームですが、キャラクターデザイン、シナリオやアニメーションなどクオリティ高いのでぜひ一度プレイしてみてください。

## 🎫 License

Code and documentation copyright 2024 by @kokushing.<br>
Code released under the MIT License.
