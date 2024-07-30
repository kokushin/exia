import { atom } from "jotai";
import { Screen } from "@/types";
import { SCREEN } from "@/constants";

export const screenState = atom<Screen>({
  screen: SCREEN.MAIN_SCREEN,
  isLoaded: false,
});
