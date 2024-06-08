chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'data-fetched') {
        chrome.action.setPopup({ popup: "popup.html" });
        chrome.runtime.sendMessage('data-fetched');
    }
});
