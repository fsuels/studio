// scripts/find-missing-i18n.js
/* eslint-env browser, node */
// This script is intended to be imported in development mode in a client-side entry point (e.g., RootLayout or ClientProviders)
// to attach a missingKey handler to the i18n instance.

// Ensure this runs only on the client-side and in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Dynamically import i18n instance to avoid issues if this script is somehow processed during SSR build
  import('@/lib/i18n')
    .then((i18nModule) => {
      const i18nInstance = i18nModule.default;
      if (i18nInstance) {
        const missingKeys = new Set();

        i18nInstance.on('missingKey', (lngs, namespace, key, res) => {
          missingKeys.add(`${namespace}:${key}`);
        });

        // @ts-ignore
        window.__printMissing = () => {
          if (missingKeys.size > 0) {
            console.log('Missing i18n Keys:', [...missingKeys]);
          } else {
            console.log('No missing i18n keys detected during this session.');
          }
        };
        console.log(
          '[find-missing-i18n] Attached missingKey handler and __printMissing() function to window.',
        );
      } else {
        console.error('[find-missing-i18n] Failed to get i18n instance.');
      }
    })
    .catch((error) => {
      console.error(
        '[find-missing-i18n] Error importing i18n instance:',
        error,
      );
    });
}

export {};
