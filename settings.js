(() => {
  const removeAllStorageButton = document.getElementById("btnRemoveAllStorage");
  removeAllStorageButton.addEventListener("click", () => {
    chrome.storage.sync.clear();
  });
})();