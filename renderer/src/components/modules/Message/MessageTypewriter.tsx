import { memo } from "react";
import Typewriter from "typewriter-effect";
import { TypewriterProps } from "@/types";
import { MESSAGE_CONFIG } from "@/constants";

export const MessageTypewriter = memo<TypewriterProps>(
  ({ text, setIsShowArrowIcon, setIsReading, setTypewriterInstance }) => (
    <Typewriter
      key={text}
      onInit={(typewriter) => {
        setIsReading(true);
        setTypewriterInstance(typewriter);
        typewriter
          .typeString(text)
          .callFunction(() => {
            setIsShowArrowIcon(true);
            setIsReading(false);
          })
          .start();
      }}
      options={{ delay: MESSAGE_CONFIG.DISPLAY_LINE_DELAY }}
    />
  )
);
