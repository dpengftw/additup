chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sumColumn",
    title: "Add It Up",
    contexts: ["selection"] 
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sumColumn") {
    // Inject the script logic into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});
