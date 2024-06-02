import { atom } from "recoil";
import { SCREEN } from "@/constants";

export type ScreenType = (typeof SCREEN)[keyof typeof SCREEN];

export const screenState = atom<ScreenType>({
  key: "screenState",
  default: SCREEN.MAIN_SCREEN,
});
