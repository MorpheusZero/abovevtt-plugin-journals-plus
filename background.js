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
            function: () => {
                setTimeout(() => {
                    const journalPanelNode = document.getElementById("journal-panel");

                    // Set Header Info
                    const titleText = "AVTT - Journal Plus";                    
                    const descriptionText = "This journal allows you to keep detailed notes of various lore, history, or other things you want to remember about your campaign or session.";
                    const explanationText = "Please note that currently in its alpha stage, the journal entries are stored in your browsers localStorage. If you clear your cookies or storage in your browser, you will lose all of your entries!";
                    journalPanelNode.getElementsByClassName("sidebar-panel-header-title")[0].textContent = titleText;                    
                    journalPanelNode.getElementsByClassName("sidebar-panel-header-subtitle")[0].textContent = descriptionText;   
                    journalPanelNode.getElementsByClassName("sidebar-panel-header-explanation")[0].textContent = explanationText;
                    journalPanelNode.getElementsByClassName("panel-warning")[0].textContent = "";
                    
                    // Set Body Info
                    const bodyBaseHTML = `
                    <div class="avtt-plugin-jp-action-group">
                        <button id="btn-avtt-plugin-jp-add-entry" style="background-color: forestgreen!important; padding: 4px!important; color: whitesmoke!important; width: 100%!important;">
                            Add Entry
                        </button>
                    </div>
                    
                    <div id="avtt-plugin-jp-entries-wrapper" style="display:block;"></div>
                    `;
                    journalPanelNode.getElementsByClassName("sidebar-panel-body")[0].style = "display: inline-block;";
                    journalPanelNode.getElementsByClassName("sidebar-panel-body")[0].innerHTML = bodyBaseHTML;

                    // Additional Event Listeners
                    window.editButtonHandler = (id) => {

                        alert("EDIT WIP " + id);

                    };

                    window.globalThis = {
                        testDylan: "test"
                    }

                    // Update Add Entry Button Handler
                    let addEntryButton = document.getElementById("btn-avtt-plugin-jp-add-entry");
                    addEntryButton.addEventListener("click", async () => {
                        const entriesWrapper = document.getElementById("avtt-plugin-jp-entries-wrapper")

                        // Create a blank entry to add to the wrapper list
                        const id = Date.now();
                        const newEntryDivHTML = `
                            <div class="avtt-plugin-jp-entry-info" style="width: 100%;border: 1px solid black;padding: 5px;margin-top: 5px;">
                                <h3 class="avtt-plugin-jp-entry-info--title-${id}" style="display:inline-block;">
                                    New Entry
                                </h3>
                                <span style="float:right">
                                    <button onclick="editButtonHandler(${id})" style="background-color: darkorange!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">EDIT</button>
                                    <button data-id="${id}" style="background-color: red!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">DEL</button>
                                </span>
                            </div>
                        `;

                        entriesWrapper.innerHTML += newEntryDivHTML;

                        let currentEntryItems = await chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
                        if (!currentEntryItems) {
                            currentEntryItems = {};
                        } else {
                            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
                        }
                        currentEntryItems[id] = "This is an entry";
                        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });
                    });
                });
            },
          });        
    } else {
        console.log("Disabling AboveVTT Plugin - [Journal Plus]");        
        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_init: false });
    }
};