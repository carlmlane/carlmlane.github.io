import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildNewTabHtml } from '../src/app/new-tab/page-html';

const serviceWorkerContent = `// AUTO-GENERATED — do not edit directly.
// Source: scripts/generate-service-worker.ts
// Shared constants: src/app/new-tab/new-tab-constants.ts

const pageHtml = ${JSON.stringify(buildNewTabHtml())};

self.addEventListener('fetch', (event) => {
  // We could serve index.html from the cache using \`await caches.match(request)\`. However, this
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
`;

const scriptDir = import.meta.dirname ?? new URL('.', import.meta.url).pathname;
const outPath = resolve(scriptDir, '..', 'public', 'new-tab', 'service-worker.js');
writeFileSync(outPath, serviceWorkerContent);
console.log(`Generated ${outPath}`);
