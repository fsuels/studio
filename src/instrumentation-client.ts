// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/browser';

let hasInit = false;

export function initSentry() {
  if (hasInit) return;
  Sentry.init({
    dsn: 'https://7b10ad6837786c85f4b58112ee8fd516@o4509409853440000.ingest.us.sentry.io/4509409855340544',
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
  hasInit = true;
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
