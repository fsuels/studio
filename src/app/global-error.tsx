// src/app/global-error.tsx

"use client";

import NextError from "next/error";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // Sentry capture removed

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component.
            Its type definition requires a `statusCode` prop.
            Since the App Router does not expose status codes for errors,
            we simply pass 0 to render a generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
