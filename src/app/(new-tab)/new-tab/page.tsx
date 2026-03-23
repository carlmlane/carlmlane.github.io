import { TRANSPARENT_GIF } from './new-tab-constants';
import RegisterServiceWorker from './register-service-worker';

const NewTabPage = () => (
  <>
    <RegisterServiceWorker />
    {/*
      In Chrome, empirically we must put some content in the body to avoid the browser delaying the
      rendering of the page and the painting of the page's background color. The delay can be up to
      1 second and makes the page appear sluggish, as if it's not yet loaded. This delay appears to
      be a Chrome rendering pipeline optimization for the typical website.

      For this, we use transparent blank 1x1 GIF. Some text would also suffice.
    */}
    {/* biome-ignore lint/performance/noImgElement: data URI image doesn't benefit from next/image optimization */}
    <img src={TRANSPARENT_GIF} alt="" />
  </>
);

export default NewTabPage;
