import { SCREEN } from "@/constants";
import { TypewriterClass } from "typewriter-effect";

export type Scenario = {
  id: string;
  bgmFile?: string;
  backgroundFile?: string;
  currentLineIndex: number;
  characters?: ScenarioCharacter[];
  lines: ScenarioLine[];
  currentLine?: ScenarioLine;
  currentCharacterIndex?: number;
  logs: ScenarioLogEntry[];
};

export type ScenarioCharacter = {
  index: number;
  name: string;
  imageFile: string;
  animation?: string;
  speakerId?: number;
  isShow: boolean;
};

export type ScenarioCutIn = {
  imageFile: string;
  isFullScreen?: boolean;
};

export type ScenarioChoice = {
  text: string;
  jumpTo: string; // ジャンプ先のID
};

export type ScenarioLine = {
  id?: string; // 特定の行にジャンプするためのID
  character?: {
    index: number;
    name?: string;
    imageFile?: string;
    animation?: string;
    isShow?: boolean;
  };
  cutIn?: ScenarioCutIn;
  imageFile?: string;
  backgroundFile?: string;
  type: number; // 0=ナレーション, 1=セリフ, 2=選択肢
  text: string;
  choices?: ScenarioChoice[]; // 選択肢の配列
  jumpTo?: string; // ジャンプ先の行ID
};

export type Navigation = {
  isAutoPlay: boolean;
  isLogOpen: boolean;
  isSkipModalOpen: boolean; // スキップモーダル表示状態を追加
};

export type Config = {};

export type ScreenType = (typeof SCREEN)[keyof typeof SCREEN];
export type Screen = {
  screen: ScreenType;
  isLoaded: boolean;
};

// レイアウトコンポーネントのProps型定義
export type MessageLayoutProps = {
  characterName?: string;
  children: React.ReactNode;
  showArrowIcon: boolean;
  isAutoPlay: boolean;
};

// Typewriterコンポーネントのprops型定義
export type TypewriterProps = {
  navigation: Navigation;
  text: string;
  setIsShowArrowIcon: (isShow: boolean) => void;
  setIsReading: (isReading: boolean) => void;
  setTypewriterInstance: (instance: TypewriterClass | null) => void;
};

// キャラクター情報の型
export type CharacterInfo = {
  index: number;
  name: string;
  imageFile: string;
};

// ScenarioLogのための型
export type ScenarioLogEntry = ScenarioLine & {
  character?: CharacterInfo;
};
