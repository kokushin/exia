export type Scenario = {
  id: string;
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
  speakerId?: number;
  isShow: boolean;
};

export type ScenarioCutIn = {
  imageFile: string;
  isFullScreen?: boolean;
};

export type ScenarioLine = {
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
  type: number;
  text: string;
};
