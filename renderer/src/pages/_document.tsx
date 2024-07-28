import { Html, Head, Main, NextScript } from "next/document";
import { CONFIG } from "@/constants";

export default function Document() {
  return (
    <Html lang={CONFIG.LANGUAGE}>
      <Head />
      <body className="bg-neutral-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
