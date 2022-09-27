import "../styles/reset.css";
import "../styles/font.css";
import "../styles/_typography.scss";
import "../styles/_common.scss";
import type { AppProps } from "next/app";
import AppLayout from "../components/layouts/AppLayout";

// window 객체의 kakao에 접근 가능 -> windon interface 정의
declare global {
  interface Window {
    Kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default MyApp;
