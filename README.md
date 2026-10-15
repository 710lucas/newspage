# RSS-startpage

A lightweight, simple, and highly customizable browser startpage focused on minimalism and productivity. This project is hosted directly on GitHub Pages, allowing you to keep track of your favorite RSS feeds while providing a clean search interface.

**Live Demo:** [710lucas.github.io/RSS-startpage](https://710lucas.github.io/RSS-startpage/)

## Features

* **Dashboard:** A clean UI featuring a clock, a search bar, and your news feed.
* **Pinned Sites:** Manage and access your favorite websites quickly with a built-in bookmarks/pinned section.
* **RSS Integration:** Add and manage multiple RSS feeds to stay updated directly from your new tab.
* **Customizable Backgrounds:** Set your wallpaper via URL or upload a local image (saved as base64).
* **Custom Search Engine:** Choose your preferred search provider (Google, DuckDuckGo, etc.).
* **No Backend Required:** Runs entirely in the browser. Use it via the live link or open the index.html file locally.

## Screenshots

### Main Interface
<img src='screenshots/Screenshot 2026-04-11 at 09-40-12 Startpage.png'/>

### Settings & Configuration
<img src='screenshots/Screenshot 2026-04-06 at 20-33-26 Startpage.png'/>

## Installation and Usage

### Option 1: Live Version
Access the hosted version at: `https://710lucas.github.io/RSS-startpage/`

### Option 2: Local Usage
1. Clone the repository:
   `git clone https://github.com/710lucas/RSS-startpage.git`
2. Open `index.html` in any modern web browser.

### Option 3: Browser Extension (new tab page)
Makes the startpage open on every new tab.
1. Download `rss-startpage-extension.zip` from the [latest release](https://github.com/710lucas/newspage/releases/latest) and unzip it.
2. **Chrome / Edge / Brave:** open `chrome://extensions`, enable *Developer mode*, click *Load unpacked* and select the unzipped folder.
3. **Firefox:** open `about:debugging#/runtime/this-firefox`, click *Load Temporary Add-on* and select `manifest.json` (it stays loaded until the browser restarts).

The extension keeps its own settings, separate from the hosted version. See [`extension/README.md`](extension/README.md) for details.

## Customization

Click the gear icon in the top-right corner to open the Settings menu:
* **Search Engine:** Update the base URL (e.g., `https://duckduckgo.com/?q=`).
* **Background:** Paste a direct image link or upload a file from your computer.
* **RSS Feeds:** Add the XML/RSS links of the websites you follow.
