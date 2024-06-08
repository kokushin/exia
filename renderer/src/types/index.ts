export type Scenario = {
  id: number;
  bgmFile?: string;
  backgroundFile?: string;
  currentLineIndex: number;
  characters?: ScenarioCharacter[];
  lines: ScenarioLine[];
};

export type ScenarioCharacter = {
  index: number;
  name: string;
  imageFile: string;
  animation?: string;
  isShow: boolean;
};

export type ScenarioLine = {
  character?: {
    index: number;
    name?: string;
    imageFile?: string;
    animation?: string;
    isShow?: boolean;
  };
  cutInFile?: string;
  imageFile?: string;
  backgroundFile?: string;
  type: number; // TODO: 定数化する 0=ナレーション, 1=セリフ
  text: string;
};
