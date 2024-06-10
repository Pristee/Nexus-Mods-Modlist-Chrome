self.addEventListener('message', (event) => {
    if (event.data === 'data-fetched') {
        self.browserAction.setPopup({ popup: "popup.html" });
        self.postMessage('data-fetched');
    }
});
