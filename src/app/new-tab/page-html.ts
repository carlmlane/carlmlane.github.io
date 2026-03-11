import {
  NEW_TAB_BODY_ID,
  NEW_TAB_COLOR_SCHEME,
  NEW_TAB_FAVICON,
  NEW_TAB_THEME,
  NEW_TAB_TITLE,
  TRANSPARENT_GIF,
} from './new-tab-constants';

export const buildNewTabHtml = (): string => `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="${NEW_TAB_FAVICON}" />
    <meta name="color-scheme" content="${NEW_TAB_COLOR_SCHEME}" />
    <style type="text/css" media="screen">
      body {
        background-color: ${NEW_TAB_THEME.light.backgroundColor};
        color: ${NEW_TAB_THEME.light.color};
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: ${NEW_TAB_THEME.dark.backgroundColor};
          color: ${NEW_TAB_THEME.dark.color};
        }
      }
    </style>
    <title>${NEW_TAB_TITLE}</title>
  </head>

  <body id="${NEW_TAB_BODY_ID}">
    <!--
      In Chrome, empirically we must put some content in the body to avoid the browser delaying the
      rendering of the page and the painting of the page's background color. The delay can be up to
      1 second and makes the page appear sluggish, as if it's not yet loaded. This delay appears to
      be a Chrome rendering pipeline optimization for the typical website.

      For this, we use transparent blank 1x1 GIF. Some text would also suffice.
    -->
    <img
      src="${TRANSPARENT_GIF}"
    />
  </body>

  <script>
    async function registerServiceWorker() {
      try {
        await navigator.serviceWorker.register("./service-worker.js");
      } catch (error) {
        console.error("Service worker registration failed with error", error);
      }
    }
    registerServiceWorker();
  </script>
</html>
`;
