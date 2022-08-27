(() => {
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

    // Setup Journal Modal

    // Save Journal Entry Edits
    const saveButtonHandler = async (event) => {
        // Get Journal Entry ID
        const id = event.target.attributes["data-id"].nodeValue;

        let currentEntryItems = await chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
        if (!currentEntryItems) {
            currentEntryItems = {};
        } else {
            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
        }

        currentEntryItems[id] = document.getElementById("avtt-plugin-jp-modal-container--content-entry-value").value;

        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });

        const modal = document.getElementById("avtt-plugin-jp-modal-container");
        modal.innerHTML = "";
        modal.style = "display: none;"

    };

    // Setup a wrapper to place our modal content into.
    const modalContainerElement = document.createElement("div");
    modalContainerElement.id = "avtt-plugin-jp-modal-container";
    modalContainerElement.style = "display:none;"
    document.getElementsByTagName("body")[0].append(modalContainerElement);

    const showModal = (journalEntryID, journalEntryText) => {
        const modal = document.getElementById("avtt-plugin-jp-modal-container");
        const html = `
        <div class="avtt-plugin-jp-modal-container--content" style="background-color: white; border: 3px solid black; border-radius: 8px; padding: 10px;">
            <h3>${journalEntryID}</h3>
            <textarea id="avtt-plugin-jp-modal-container--content-entry-value" width="100%">${journalEntryText}</textarea>
            <button id="btn-avtt-plugin-jp-save-entry" data-id="${journalEntryID}" class="avtt-plugin-jp-edit-journal-entry--save" style="background-color: forestgreen!important; width: 100%; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">SAVE</button>
        </div>
        `;
        modal.innerHTML = html;
        modal.style="display: inline-block; position: fixed; transform: translate(0%, -4%); top: 50px; bottom: 0px; left: 0px; right: 0px; margin: auto; height: 740px; width: 700px; z-index: 70001;"

        document.getElementById("btn-avtt-plugin-jp-save-entry").addEventListener("click", saveButtonHandler);
    }

    // Additional Event Listeners
    const editButtonHandler = async (event) => {
        // Get Journal Entry ID
        const id = event.target.attributes["data-id"].nodeValue;

        let currentEntryItems = await chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
        if (!currentEntryItems) {
            currentEntryItems = {};
        } else {
            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
        }

        const journalEntryText = currentEntryItems[id];

        showModal(id, journalEntryText);

    };

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
                    <button data-id="${id}" class="avtt-plugin-jp-edit-journal-entry" style="background-color: darkorange!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">EDIT</button>
                    <button data-id="${id}" style="background-color: red!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">DEL</button>
                </span>
            </div>
        `;

        // FIXME: I am overwriting the event listeners here. I need to inject/append a new item instead of overwriting the previous ones every time.
        entriesWrapper.innerHTML += newEntryDivHTML;

        // Update event listener for new item
        const newEditButton = document.querySelector(`[data-id="${id}"]`);
        newEditButton.addEventListener("click", editButtonHandler);

        let currentEntryItems = await chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
        if (!currentEntryItems) {
            currentEntryItems = {};
        } else {
            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
        }
        currentEntryItems[id] = "This is an entry";
        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });
    });
})();