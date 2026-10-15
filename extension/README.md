# Extension

Loads the startpage as the browser's new tab page.

`newtab.html` / `newtab.js` are a copy of the root `index.html`, with the inline script moved
to a separate file and the `onclick` attributes replaced by `addEventListener` (Manifest V3
blocks inline scripts and handlers). If you change `index.html`, port the change here too.

## Install

**Chrome / Edge / Brave:** open `chrome://extensions`, enable *Developer mode*, click
*Load unpacked* and select this `extension` folder.

**Firefox:** open `about:debugging#/runtime/this-firefox`, click *Load Temporary Add-on* and
select `manifest.json` (temporary until restart; permanent install needs a signed add-on).

Settings are stored in the extension's own `localStorage`, so they start empty and are
separate from the GitHub Pages version.
