import { Html, Head, Main, NextScript } from "next/document";
import { CONFIG } from "@/constants";

export default function Document() {
  return (
    <Html lang={CONFIG.LANGUAGE}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
