(function() {
    function isModPage() {
        return window.location.pathname.includes('/mods/');
    }

    let addButton = document.createElement('button');
    addButton.innerText = 'ADD TO MODLIST';
    addButton.style.backgroundColor = 'var(--theme-primary)';
    addButton.style.color = 'white';
    addButton.style.fontSize = '12px';
    addButton.style.border = 'none';
    addButton.style.height = '34.1833px';
    addButton.style.fontFamily = 'Roboto, sans-serif';
    addButton.style.fontWeight = '450';
    addButton.style.marginRight = '8px';
    addButton.style.marginLeft = '8px';

    let removeButton = document.createElement('button');
    removeButton.innerText = 'REMOVE FROM MODLIST';
    removeButton.style.backgroundColor = 'var(--theme-primary)';
    removeButton.style.color = 'white';
    removeButton.style.fontSize = '12px';
    removeButton.style.border = 'none';
    removeButton.style.height = '34.1833px';
    removeButton.style.fontFamily = 'Roboto, sans-serif';
    removeButton.style.fontWeight = '450';
    removeButton.style.marginRight = '8px';
    removeButton.style.display = 'none';

    let downloadButton = document.createElement('button');
    downloadButton.innerText = 'DOWNLOAD MODLIST';
    downloadButton.style.backgroundColor = 'var(--theme-primary)';
    downloadButton.style.color = 'white';
    downloadButton.style.fontSize = '12px';
    downloadButton.style.border = 'none';
    downloadButton.style.height = '34.1833px';
    downloadButton.style.fontFamily = 'Roboto, sans-serif';
    downloadButton.style.fontWeight = '450';

    async function scrapeModData() {
        let titreElement = document.querySelector('meta[property="og:title"]');
        let titre = titreElement ? titreElement.getAttribute('content').trim() : '';

        let urlElement = document.querySelector('meta[property="og:url"]');
        let url = urlElement ? urlElement.getAttribute('content').trim() : '';

        let categorieElement = document.querySelector('a[href*="/mods/categories/"]');
        let categorie = categorieElement ? categorieElement.innerText.trim() : '';

        let modData = {
            categorie: categorie,
            nom_du_mod: titre,
            url_du_mod: url
        };

        return modData;
    }

    async function checkIfModInList() {
        let modData = await scrapeModData();
        chrome.storage.local.get('modList', function(data) {
            let modList = data.modList || [];
            if (modList.some(mod => mod.url_du_mod === modData.url_du_mod)) {
                removeButton.style.display = 'inline-block';
            }
        });
    }

    function checkDownloadButton() {
        chrome.storage.local.get('modList', function(data) {
            let modList = data.modList || [];
            if (modList.length > 0) {
                downloadButton.style.display = 'inline-block';
            }
        });
    }

    addButton.addEventListener('click', async function() {
        let modData = await scrapeModData();
        chrome.storage.local.get('modList', function(data) {
            let modList = data.modList || [];
            if (!modList.some(mod => mod.url_du_mod === modData.url_du_mod)) {
                modList.push(modData);
                chrome.storage.local.set({ modList: modList });
                removeButton.style.display = 'inline-block';
                checkDownloadButton();
            }
        });
    });

    removeButton.addEventListener('click', async function() {
        let modData = await scrapeModData();
        chrome.storage.local.get('modList', function(data) {
            let modList = data.modList || [];
            modList = modList.filter(mod => mod.url_du_mod !== modData.url_du_mod);
            chrome.storage.local.set({ modList: modList });
            removeButton.style.display = 'none';
            checkDownloadButton();
        });
    });

    downloadButton.addEventListener('click', function() {
        chrome.storage.local.get('modList', function(data) {
            let modList = data.modList || [];
            let csvContent = modList.map(mod => `${mod.categorie},${mod.nom_du_mod},${mod.url_du_mod}`).join('\n') + '\n';

            let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = 'Modlist.csv';
            a.click();
            URL.revokeObjectURL(url);
        });
    });

    function injectButtons() {
        let actionManual = document.getElementById('action-manual');
        let modActions = document.querySelector('ul.modactions');
        if (actionManual) {
            actionManual.parentNode.insertBefore(addButton, actionManual.nextSibling);
            actionManual.parentNode.insertBefore(removeButton, addButton.nextSibling);
            actionManual.parentNode.insertBefore(downloadButton, removeButton.nextSibling);
        }
    }

    if (isModPage()) {
        injectButtons();
        checkIfModInList();
        checkDownloadButton();
    }
})();
