<<<<<<< HEAD
import * as Sentry from '@sentry/nextjs';
=======
--- a/src/instrumentation.ts
+++ b/src/instrumentation.ts
@@ -1,3 +1,3 @@
- import * as Sentry from '@sentry/react';
+ // import * as Sentry from '@sentry/react';
>>>>>>> 9ce587d (removing sentry)

 export async function register() {
-  if (process.env.NEXT_RUNTIME === 'nodejs') {
-    await import('../sentry.server.config');
-  }
-
-  if (process.env.NEXT_RUNTIME === 'edge') {
-    await import('../sentry.edge.config');
-  }
+  // No-op: Sentry instrumentation has been removed
 }

-export const onRequestError = Sentry.captureRequestError;
+export const onRequestError = () => {
+  // No-op error handler (Sentry removed)
+};
