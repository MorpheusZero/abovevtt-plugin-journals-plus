/**
 * Contains various reusable & common functions that we can use throughout the plugin.
 */
(() => {

    /**
     * Returns a random COLOR + ANIMAL to use as a default journal entry name for fun.
     */
    const getRandomJournalEntryName = () => {
        const newJournalEntryDefaultNames = {
            COLOR: [
                "Red",
                "Blue",
                "Green",
                "White",
                "Black",
                "Purple",
                "Yellow",
                "Brown",
                "Orange",
                "Pink"
            ],
            ANIMAL: [
                "Bear",
                "Cat",
                "Dire Wolf",
                "Penguin",
                "Moose",
                "Cow",
                "Skeleton",
                "Beetle",
                "Dolphin",
                "Shark",
                "Whale",
                "Beaver",
                "Eagle",
                "Owl",
                "Giraffe",
                "Pig",
                "Gorilla",
                "Dragon",
                "Wyvern",
                "Fish",
                "Owlbear",
                "Flail Snail",
                "Mind Flayer",
                "Rat",
                "Rust Monster",
                "Mimic"
            ]
        };
        const color = newJournalEntryDefaultNames.COLOR[Math.floor(Math.random()*newJournalEntryDefaultNames.COLOR.length)];
        const animal = newJournalEntryDefaultNames.ANIMAL[Math.floor(Math.random()*newJournalEntryDefaultNames.ANIMAL.length)];
        return color + " " + animal;
    }

    /**
     * Generate a random number as an ID and return it as a string.
     */
    const generateRandomID = () => {
        return Date.now().toString() + Math.floor(Math.random() * 9895100).toString();
    }

    /**
     * Initialize the plugin by overriding the original journals classes and injecting our content instead.
     */
    const initPlugin = () => {

        console.info("AboveVTT Plugin - Journals Plus - https://www.github.com/MorpheusZero/abovevtt-plugin-journals-plus");

        const journalPanelNode = document.getElementById("journal-panel");

        // Set Header Info
        const titleText = "AVTT - Journals Plus v1.0";                    
        const descriptionText = "This journal allows you to keep detailed notes of various lore, history, or other things you want to remember about your campaign or session. Each entry is character specific so you can safely switch characters and have separate entries.";
        const explanationText = "Please note that currently in its alpha stage, the journal entries are stored in your browsers localStorage. If you clear your cookies or storage in your browser, you will lose all of your entries!";
        journalPanelNode.getElementsByClassName("sidebar-panel-header-title")[0].textContent = titleText;                    
        journalPanelNode.getElementsByClassName("sidebar-panel-header-subtitle")[0].textContent = descriptionText;   
        journalPanelNode.getElementsByClassName("sidebar-panel-header-explanation")[0].textContent = explanationText;

        // Remove the warning panel.
        journalPanelNode.getElementsByClassName("panel-warning")[0].remove();
        
        // Set Body Info
        const bodyBaseHTML = `
        <div class="avtt-plugin-jp-action-group">
            <button id="btn-avtt-plugin-jp-add-entry" style="background-color: forestgreen!important; padding: 4px!important; color: whitesmoke!important; width: 100%!important;">
                Add Entry
            </button>
        </div>
        
        <!--// Inject the Entries Here //-->
        <div id="avtt-plugin-jp-entries-wrapper" style="display:block;"></div>
        `;
        journalPanelNode.getElementsByClassName("sidebar-panel-body")[0].style = "display: inline-block;";
        journalPanelNode.getElementsByClassName("sidebar-panel-body")[0].innerHTML = bodyBaseHTML;

        // Setup a wrapper to place our modal content into.
        const modalContainerElement = document.createElement("div");
        modalContainerElement.id = "avtt-plugin-jp-modal-container";
        modalContainerElement.style = "display:none;"
        document.getElementsByTagName("body")[0].append(modalContainerElement);     
        
        // Add New Entry Button
        let addEntryButton = document.getElementById("btn-avtt-plugin-jp-add-entry");
        addEntryButton.addEventListener("click", () => {   
            const id = window.AVTTPJP_GLOBALS.generateRandomID();
            
            let currentEntryItems = chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
            if (!currentEntryItems || Object.keys(currentEntryItems).length === 0) {
                currentEntryItems = {};
            } else {
                currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
            }
            console.log(currentEntryItems);
            currentEntryItems[id] = "Type here...";
            chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });
    
            reloadJournalEntriesList();
        });

    }

    /**
     * Hides the modal and removes the previous content from it so the next time we need it its fresh.
     */
    const hideModal = () => {
        const modal = document.getElementById("avtt-plugin-jp-modal-container");
        modal.innerHTML = "";
        modal.style = "display: none;"
    }

    /**
     * Shows a new modal with the specified properties.
     */
    const showModal = (journalEntryID, journalEntryText) => {
        const modal = document.getElementById("avtt-plugin-jp-modal-container");
        const html = `
        <div class="avtt-plugin-jp-modal-container--content" style="background-color: white; border: 3px solid black; border-radius: 8px; padding: 10px;">
            <h3>${journalEntryID}</h3>
            <textarea id="avtt-plugin-jp-modal-container--content-entry-value" width="100%">${journalEntryText}</textarea>
            <button id="btn-avtt-plugin-jp-save-entry" data-id="${journalEntryID}" class="avtt-plugin-jp-edit-journal-entry--save" style="background-color: forestgreen!important; width: 100%; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important; margin-bottom: 4px;">SAVE</button>
            <button id="btn-avtt-plugin-jp-cancel-entry" class="avtt-plugin-jp-edit-journal-entry--save" style="background-color: red!important; width: 100%; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">CANCEL</button>
        </div>
        `;
        modal.innerHTML = html;
        modal.style="display: inline-block; position: fixed; transform: translate(0%, -4%); top: 50px; bottom: 0px; left: 0px; right: 0px; margin: auto; height: 740px; width: 700px; z-index: 70001;"

        document.getElementById("btn-avtt-plugin-jp-save-entry").addEventListener("click", (event) => {
            const id = event.target.attributes["data-id"].nodeValue;

            let currentEntryItems = await chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
            if (!currentEntryItems) {
                currentEntryItems = {};
            } else {
                currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
            }

            currentEntryItems[id] = document.getElementById("avtt-plugin-jp-modal-container--content-entry-value").value;

            chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });

            hideModal();
        });
        document.getElementById("btn-avtt-plugin-jp-cancel-entry").addEventListener("click", () => {
            hideModal();
        });        
    }

    // Reload All Journal Entries & Rebuild List View.
    const reloadJournalEntriesList = () => {
        // Load All Current DB Items
        let currentEntryItems = chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
        if (!currentEntryItems) {
            currentEntryItems = {};
        } else {
            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
        }        

        const entriesWrapper = document.getElementById("avtt-plugin-jp-entries-wrapper")
        entriesWrapper.innerHTML = "";

        // Create a blank entry to add to the wrapper list
        if (Object.keys(currentEntryItems).length > 0) {
            Object.keys(currentEntryItems).forEach((id) => {
                const newEntryDivHTML = `
                    <div data-block="${id}" class="avtt-plugin-jp-entry-info" style="width: 100%;border: 1px solid black;padding: 5px;margin-top: 5px;">
                        <h3 class="avtt-plugin-jp-entry-info--title-${id}" style="display:inline-block;">
                            ${getRandomJournalEntryName()}
                        </h3>
                        <span style="float:right">
                            <button data-id="${id}" class="avtt-plugin-jp-edit-journal-entry" style="background-color: darkorange!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">EDIT</button>
                            <button data-id="${id}" class="avtt-plugin-jp-delete-journal-entry" style="background-color: red!important; padding: 2px!important; color:whitesmoke!important; font-weight:bold!important;">DEL</button>
                        </span>
                    </div>
                `;

                entriesWrapper.innerHTML += newEntryDivHTML;
            });

            // Update event listener for all items
            const allEditButtons = document.querySelectorAll(".avtt-plugin-jp-edit-journal-entry");
            allEditButtons.forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    const id = event.target.attributes["data-id"].nodeValue;

                    let currentEntryItems = chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
                    if (!currentEntryItems) {
                        currentEntryItems = {};
                    } else {
                        currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
                    }
            
                    const journalEntryText = currentEntryItems[id];
            
                    showModal(id, journalEntryText);
                });
            });
            const allDeleteButtons = document.querySelectorAll(".avtt-plugin-jp-delete-journal-entry");
            allDeleteButtons.forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    if (window.confirm("This will delete your journal entry. This cannot be undone. Are you sure?")) {
                        const id = event.target.attributes["data-id"].nodeValue;
            
                        let currentEntryItems = chrome.storage.sync.get(['abovevtt_plugins_journal_plus_entries']);
                        if (!currentEntryItems) {
                            currentEntryItems = {};
                        } else {
                            currentEntryItems = currentEntryItems.abovevtt_plugins_journal_plus_entries
                        }
            
                        delete currentEntryItems[id];
                        chrome.storage.sync.set({ abovevtt_plugins_journal_plus_entries: currentEntryItems });
            
                        // Finally remove this entry from the DOM.
                        const blockToRemove = document.querySelector(`[data-block="${id}"]`);
                        blockToRemove.remove();
                    }
                });
            });
        }
    }    


    window.AVTTPJP_GLOBALS = {
        getRandomJournalEntryName,
        generateRandomID,
        initPlugin,
        hideModal,
        showModal,
        reloadJournalEntriesList
    };
})();