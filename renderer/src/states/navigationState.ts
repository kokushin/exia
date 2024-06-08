import { atom } from "recoil";
import { Navigation } from "@/types";

export const navigationState = atom<Navigation>({
  key: "navigationState",
  default: {
    isAutoPlay: false,
  },
});
