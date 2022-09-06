import "../styles/reset.css";
import "../styles/font.css";
import "../styles/_typography.scss";
import "../styles/_common.scss";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
