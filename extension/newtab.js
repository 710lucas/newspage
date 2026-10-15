const readLocalStorage = () => {
    const data = localStorage.getItem('localStartPage');
    if (!data) return {};
    try {
        return JSON.parse(data) || {};
    } catch {
        return {};
    }
};

const writeLocalStorage = (data) => {
    localStorage.setItem('localStartPage', JSON.stringify(data, null, 2));
};

const setInnerHtml = (html, id) => {
    document.getElementById(id).innerHTML = html;
};

let defaultSearchEngine = readLocalStorage().searchEngine || 'https://google.com/search?q=';

const bindSearchForm = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = e.target.search.value.trim();
        if (query) document.location = `${defaultSearchEngine}${encodeURIComponent(query)}`;
    });
};

const fetchFeed = async (feedUrl) => {
    return await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
};

const applyBackgroundImage = (imageSource) => {
    if (!imageSource?.trim()) {
        document.body.style.background = 'radial-gradient(circle at top right, rgb(33, 30, 76), rgb(4, 0, 20) 45%)';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        return;
    }
    const safeUrl = imageSource.replace(/["\\\n\r]/g, '');
    document.body.style.background = `url("${safeUrl}") center/cover no-repeat`;
};

// Aplica a opacidade no overlay baseado na luminosidade (Padrão: 95% Luminoso -> 5% Opacidade preta)
const applyLuminosity = (value) => {
    const overlay = document.getElementById('background-overlay');
    if (overlay) {
        const opacity = (100 - value) / 100;
        overlay.style.opacity = opacity;
    }
};

const reload = () => {
    location.reload()
}

const loadFeeds = async () => {
    const feeds = readLocalStorage().rssFeed || [];
    const fetchedFeeds = await Promise.all(feeds.map(async (f) => {
        const response = await fetchFeed(f.url);
        const data = await response.json();
        return { name: f.name, url: f.url, items: data.items };
    }));

    const allItems = fetchedFeeds
        .flatMap(f => f.items.map(item => ({ ...item, name: f.name })))
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const feedsHtml = allItems.map(f => `
        <a class='feed-card' target='_blank' href='${f.link}'>
            <div class='feed-card-text'>
                <h3 class='feed-card-title'>${f.title}</h3>
                <div class='row'>
                    <h3 class='feed-card-name'>${f.name}</h3>
                    <div class='feed-card-date'>${new Date(f.pubDate).toLocaleDateString()}</div>
                </div>
            </div>
            ${f.thumbnail?.trim() ? `<img src='${f.thumbnail}'/>` : ''}
        </a>
    `).join('');

    const pinned = readLocalStorage().pinned || [];

    const pinnedHtml = pinned.map((p, index) => `
        <a href=${p.url} target='_blank' class='pinned-item-card'>
            <img src='${p.favicon}'/>
        </a>
    `).join('')

    setInnerHtml(pinnedHtml, 'main-pinned-container')

    setInnerHtml(feedsHtml, 'feed-container');
};

const loadTime = () => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setInnerHtml(time, 'time-container');
    setTimeout(loadTime, 1000);
};

const openSettingsModal = () => {
    const modal = document.getElementById('modal-container');
    modal.classList.remove('hidden');

    const config = readLocalStorage();
    const feeds = config.rssFeed || [];
    const pinned = config.pinned || [];
    const luminosity = config.luminosity !== undefined ? config.luminosity : 95;

    const rssFeedHtml = feeds.length > 0 
        ? feeds.map((feed, index) => `
            <div class='saved-feed-item'>
                <div class='saved-feed-header'>
                    <strong>${feed.name}</strong>
                    <button type='button' class='btn btn-danger remove-feed-btn' data-feed-index='${index}'>Remove</button>
                </div>
                <p class='saved-feed-meta'>${feed.url}</p>
            </div>
        `).join('')
        : `<h3>You don't have any RSS feeds saved yet.</h3>`;

    const pinnedHtml = pinned.length > 0
        ? pinned.map((pin, index) => `
            <div class='saved-pinned-item'>
                <img src='${pin.favicon}' class='saved-pinned-item-favicon' alt='${pin.url}'/>
                <button type='button' class='btn btn-danger remove-pin-btn' data-pin-index='${index}'>Remove</button>
            </div>
        `).join('') : `<h3>You don't have any pinned websites yet</h3>`

    setInnerHtml(`
        <div class="settings-panel">
            <div class="settings-header">
                <h2 class='settings-title'>Settings</h2>
                <button id='close-modal' type='button' class='btn btn-neutral'>Close</button>
            </div>
            <div class="settings-form-container">
                <form id='submit-search-engine' class='settings-section'>
                    <h3>Search engine</h3>
                    <p>Choose the base URL for your search.</p>
                    <input type="text" placeholder="${defaultSearchEngine}" value="${defaultSearchEngine}"/>
                    <div class='settings-actions'>
                        <button type='submit' class='btn btn-primary'>Save search</button>
                    </div>
                </form>
                
                <!-- Nova Configuração: Slider de Luminosidade -->
                <div class='settings-section'>
                    <h3>Background Luminosity</h3>
                    <p>Adjust the brightness of your background image or gradient.</p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <input id='bg-luminosity-slider' type='range' min='0' max='100' value='${luminosity}' style="flex-grow: 1;"/>
                        <span id='bg-luminosity-value' style="font-weight: bold; width: 4ch; text-align: right; color: #161927;">${luminosity}%</span>
                    </div>
                </div>

                <form id='submit-background-url' class='settings-section'>
                    <h3>Background URL</h3>
                    <p>Paste an image URL to apply to the startpage background.</p>
                    <input id='background-url' type="text" placeholder="https://images.site/wallpaper.jpg" value="${config.backgroundImage || ''}"/>
                    <div class='settings-actions'>
                        <button type='submit' class='btn btn-primary'>Apply URL</button>
                        <button id='clear-background' type='button' class='btn btn-danger'>Remove background</button>
                    </div>
                </form>
                <form id='submit-background-upload' class='settings-section'>
                    <h3>Background upload</h3>
                    <p>Select a local image to save as base64.</p>
                    <input id='background-file' type='file' accept='image/*'/>
                    <div class='settings-actions'>
                        <button type='submit' class='btn btn-primary'>Use uploaded image</button>
                    </div>
                    <div class='background-preview' id='background-preview'></div>
                </form>
                <h3>RSS feeds</h3>
                <p>Manage your feeds and add new sources.</p>
                <div class='saved-feeds'>${rssFeedHtml}</div>
                <form id='submit-rss' class='settings-section'>
                    <label for="rss-url">RSS Feed URL</label>
                    <input id='rss-url' type="text" placeholder="https://news.ycombinator.com/rss"/>
                    <label for="rss-name">RSS Feed Name</label>
                    <input id='rss-name' type="text" placeholder="Hacker News"/>
                    <div class='settings-actions'>
                        <button type='submit' class='btn btn-primary'>Add RSS</button>
                    </div>
                </form> 
                <hr style='width: 100%;'/>
                <h3>Pinned websites</h3>
                <p>Manage your pinned websites.</p>
                <div class='saved-pins'>${pinnedHtml}</div>
                <form id='submit-pinned' class='settings-section'>
                    <label for="pin-url">Pin Url</label>
                    <input id='pin-url' type="text" placeholder="https://github.com/"/>
                    <label for="pin-favicon">Favicon Url for your pin</label>
                    <p>It'll try to fetch automatically, but can fail sometimes</p>
                    <input id='pin-favicon' type="text" placeholder="https://github.com/fluidicon.png"/>
                    <img class='favicon-preview hidden' id='favicon-preview' src=''/>
                    <div class='settings-actions'>
                        <button type='submit' class='btn btn-primary'>Add pinned website</button>
                    </div>
                </form>
            </div>
        </div>
    `, 'modal-container');

    const preview = document.getElementById('background-preview');
    if (config.backgroundImage?.trim()) {
        preview.style.backgroundImage = `url("${config.backgroundImage.replace(/["\\\n\r]/g, '')}")`;
    }

    document.getElementById('close-modal').addEventListener('click', closeModal);

    let uploadedBase64 = '';

    // Event Listener do Slider de Luminosidade
    const luminositySlider = document.getElementById('bg-luminosity-slider');
    const luminosityValueSpan = document.getElementById('bg-luminosity-value');
    if (luminositySlider && luminosityValueSpan) {
        luminositySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            luminosityValueSpan.textContent = `${val}%`;
            
            // Aplica ao overlay imediatamente para feedback visual em tempo real
            applyLuminosity(val);
            
            // Salva a preferência
            const currentConfig = readLocalStorage();
            currentConfig.luminosity = parseInt(val, 10);
            writeLocalStorage(currentConfig);
        });
    }

    document.getElementById('submit-search-engine').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = readLocalStorage();
        config.searchEngine = e.target[0].value.trim();
        writeLocalStorage(config);
        defaultSearchEngine = config.searchEngine;
    });

    document.getElementById('submit-background-url').addEventListener('submit', (e) => {
        e.preventDefault();
        const url = e.target[0].value.trim();
        if (!url) return;
        const config = readLocalStorage();
        config.backgroundImage = url;
        writeLocalStorage(config);
        applyBackgroundImage(url);
        preview.style.backgroundImage = `url("${url.replace(/["\\\n\r]/g, '')}")`;
    });

    document.getElementById('background-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            uploadedBase64 = reader.result;
            preview.style.backgroundImage = `url("${uploadedBase64}")`;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('submit-background-upload').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!uploadedBase64) return;
        const config = readLocalStorage();
        config.backgroundImage = uploadedBase64;
        writeLocalStorage(config);
        applyBackgroundImage(uploadedBase64);
    });

    document.getElementById('clear-background').addEventListener('click', () => {
        const config = readLocalStorage();
        delete config.backgroundImage;
        writeLocalStorage(config);
        applyBackgroundImage('');
        preview.style.backgroundImage = '';
        document.getElementById('background-url').value = '';
        document.getElementById('background-file').value = '';
        uploadedBase64 = '';
    });

    document.getElementById('submit-rss').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = readLocalStorage();
        const feed = { name: e.target[1].value, url: e.target[0].value };
        config.rssFeed = config.rssFeed || [];
        config.rssFeed.push(feed);
        writeLocalStorage(config);
        openSettingsModal();
        loadFeeds();
    });

    document.getElementById('submit-pinned').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = readLocalStorage();
        const pinned = { favicon: e.target[1].value, url: e.target[0].value };
        config.pinned = config.pinned || [];
        config.pinned.push(pinned);
        writeLocalStorage(config);
        openSettingsModal();
        reload()
    });

    document.getElementById('pin-url').addEventListener('change', async (e) => {

        async function getFavicon(targetUrl) {
            const proxy = 'https://corsproxy.io/?';
            
            try {
                const response = await fetch(proxy + encodeURIComponent(targetUrl));
                const finalUrl = response.url.includes('corsproxy.io') 
                ? targetUrl 
                : response.url;

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const link = doc.querySelector('link[rel*="icon"]');
                let faviconUrl;

                if (link && link.getAttribute('href')) {
                    faviconUrl = new URL(link.getAttribute('href'), finalUrl).href;
                } else {
                    faviconUrl = `${new URL(finalUrl).origin}/favicon.ico`;
                }

                return faviconUrl;

            } catch (error) {
                console.error("Erro na busca:", error);
                return null;
            }
        }
        const url = await getFavicon(e.target.value);
        document.getElementById('pin-favicon').value = url;
        let preview = document.getElementById('favicon-preview')
        preview.classList.remove('hidden');
        preview.setAttribute('src', `${url}`)
    });

    document.getElementById('pin-favicon').addEventListener('change', async (e) => {
        let preview = document.getElementById('favicon-preview')
        preview.classList.remove('hidden');
        preview.setAttribute('src', e.target.value)
    });

    document.querySelectorAll('.remove-feed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number(e.currentTarget.dataset.feedIndex);
            const config = readLocalStorage();
            config.rssFeed.splice(index, 1);
            writeLocalStorage(config);
            openSettingsModal();
            loadFeeds();
        });
    });
    document.querySelectorAll('.remove-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number(e.currentTarget.dataset.pinIndex);
            const config = readLocalStorage();
            config.pinned.splice(index, 1);
            writeLocalStorage(config);
            openSettingsModal();
            reload();
        });
    });
};

const closeModal = () => {
    document.getElementById('modal-container').classList.add('hidden');
    setInnerHtml('', 'modal-container');
};

const setup = async () => {
    bindSearchForm('search-form');
    document.getElementById('settings-button').addEventListener('click', openSettingsModal);
    
    const config = readLocalStorage();
    applyBackgroundImage(config.backgroundImage);
    
    // Carrega e aplica a luminosidade salva, ou usa 95 como padrão
    const luminosity = config.luminosity !== undefined ? config.luminosity : 95;
    applyLuminosity(luminosity);

    await loadFeeds();
    loadTime();
};

setup();
