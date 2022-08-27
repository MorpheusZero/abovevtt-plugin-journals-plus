chrome.runtime.onInstalled.addListener(() => {

    chrome.tabs.onActivated.addListener(
        ensureIsOnVTTCampaignPage,
    );
});

const ensureIsOnVTTCampaignPage = async () => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const url = tab && tab.url ? tab.url.toLowerCase() : "";
    if (url && url.indexOf("dndbeyond.com") !== -1 && url.indexOf("abovevtt=true") !== -1) {
        console.log("Enabling AboveVTT Plugin - [Journal Plus]");
        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_init: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['journal-plus.js']
          });       
    } else {
        console.log("Disabling AboveVTT Plugin - [Journal Plus]");        
        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_init: false });
    }
};