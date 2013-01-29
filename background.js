chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf('www.askmrrobot.com') > -1 || tab.url.indexOf('www.icy-veins.com') > -1) {
    chrome.pageAction.show(tabId);
  }
});
