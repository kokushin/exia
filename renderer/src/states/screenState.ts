import { atom } from "jotai";
import { SCREEN } from "@/constants";

export type ScreenType = (typeof SCREEN)[keyof typeof SCREEN];

export const screenState = atom<ScreenType>(SCREEN.MAIN_SCREEN);
