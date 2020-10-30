// _app.js 의 위에 있는 부분
import React from 'react';
import Document, { NextScript, Html, Head, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
// 제일 상위에있는 태그들을 수정할 수 있다.

export default class MyDocument extends Document {
  static async alProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    
    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App { ...props } />),
      })
      const initialProps = await Document.alProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } catch (err) {
      console.error(err);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </body>
      </Html>
    );
  }
}