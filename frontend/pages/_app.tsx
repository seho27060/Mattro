import "../styles/reset.css";
import "../styles/font.css";
import "../styles/_typography.scss";
import "../styles/_common.scss";
import type { AppProps } from "next/app";
import AppLayout from "../components/layouts/AppLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default MyApp;
