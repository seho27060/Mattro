// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from "next/document";
// NextScript가 _app.tsx를 송출한다

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            src="https://developers.kakao.com/sdk/js/kakao.min.js"
            defer
          />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
