import { atom } from "jotai";
import { Navigation } from "@/types";

export const navigationState = atom<Navigation>({
  isAutoPlay: false,
  isLogOpen: false,
  isSkipModalOpen: false,
});
