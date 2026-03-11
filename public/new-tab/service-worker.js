// AUTO-GENERATED — do not edit directly.
// Source: scripts/generate-service-worker.ts
// Shared constants: src/app/new-tab/new-tab-constants.ts

const pageHtml = "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" href=\"data:,\" />\n    <meta name=\"color-scheme\" content=\"light dark\" />\n    <style type=\"text/css\" media=\"screen\">\n      body {\n        background-color: white;\n        color: black;\n      }\n      @media (prefers-color-scheme: dark) {\n        body {\n          background-color: black;\n          color: white;\n        }\n      }\n    </style>\n    <title>New Tab</title>\n  </head>\n\n  <body id=\"vimium-new-tab-page\">\n    <!--\n      In Chrome, empirically we must put some content in the body to avoid the browser delaying the\n      rendering of the page and the painting of the page's background color. The delay can be up to\n      1 second and makes the page appear sluggish, as if it's not yet loaded. This delay appears to\n      be a Chrome rendering pipeline optimization for the typical website.\n\n      For this, we use transparent blank 1x1 GIF. Some text would also suffice.\n    -->\n    <img\n      src=\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\"\n    />\n  </body>\n\n  <script>\n    async function registerServiceWorker() {\n      try {\n        await navigator.serviceWorker.register(\"./service-worker.js\");\n      } catch (error) {\n        console.error(\"Service worker registration failed with error\", error);\n      }\n    }\n    registerServiceWorker();\n  </script>\n</html>\n";

self.addEventListener('fetch', (event) => {
  // We could serve index.html from the cache using `await caches.match(request)`. However, this
  // takes remarkably long in Chrome as of 2025-08-09, such that there is a 1 second delay before
  // the page is shown and ready for keyboard input. This is not the case with Firefox: the cached
  // page is found and returned instantly. As a workaround, we just return the hardcoded contents of
  // index.html without checking the cache.
  const url = new URL(event.request.url);
  if (url.pathname === '/new-tab/index.html' || url.pathname === '/new-tab/' || url.pathname === '/new-tab') {
    event.respondWith(
      new Response(pageHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }),
    );
    return;
  }
  // Otherwise, let the browser handle the fetch request.
});
