import { Scenario } from "@/types";

export const mockScenario: Scenario = {
  id: 1,
  backgroundFile: "bg_01.png",
  currentLineIndex: 0,
  characters: [
    {
      index: 0,
      name: "キャラA",
      imageFile: "chara_01.png",
      isShow: true,
    },
    {
      index: 0,
      name: "キャラB",
      imageFile: "chara_02.png",
      isShow: true,
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
        imageFile: "chara_01.png",
      },
      type: 1,
      text: "キャラクターのセリフ1",
    },
    {
      character: {
        index: 1,
        imageFile: "chara_02.png",
      },
      type: 1,
      text: 'キャラクターのセリフ2<br>改行<br><span style="font-size:24px">テキストの大きさ変更</span>',
    },
    {
      character: {
        index: 0,
        imageFile: "chara_01.png",
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
