// Minimal Pages Router _document to satisfy direct /_document requests
// This avoids runtime errors when a custom server or probes request /_document.
// App Router remains the primary router under src/app.

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

