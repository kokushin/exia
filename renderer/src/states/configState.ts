import { atom } from "jotai";
import { Config } from "@/types";

export const configState = atom<Config>({
  isLoaded: false, // キャッシュデータの読み込みが完了したかどうか
});
