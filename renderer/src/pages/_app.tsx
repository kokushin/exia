import "tailwindcss/tailwind.css";
import "@/styles/common.css";
import { CONFIG } from "@/constants";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>{CONFIG.TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
