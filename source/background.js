/**
 This file is part of FragMrRobot.
 
 FragMrRobot is distributed under The Q Public License Version (QPL-1.0).
 
 You should have received a copy of the License along with this file.
 If not, see http://opensource.org/licenses/QPL-1.0
*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf('www.askmrrobot.com') > -1 || tab.url.indexOf('www.icy-veins.com') > -1) {
    chrome.pageAction.show(tabId);
  }
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
   var thisVersion = chrome.runtime.getManifest().version;

   if(details.reason == "install")
   {
        console.log("This is a first install!");

      // chrome.tabs.create({ url: "popup.html" });
   }
   else if(details.reason == "update")
   {
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");

      // too much, do not disturb user
      // chrome.tabs.create({ url: "popup.html" });
  
      /* not working at all

      chrome.notifications.getPermissionLevel(function(level) {
         if(level == "granted") {
            console.log("Notifications are enabled");

            var notificationId = "";
            var options = {
              type: "basic",
              iconUrl: "http://www.google.com/favicon.ico",
              title: "FragMrRobot updated",
              message: "Updated from " + details.previousVersion + " to " + thisVersion + "!",
              buttons: [{ title: "More Info" }]
            }
            var callback = function(newNotificationId) {
               notificationId = newNotificationId;
            };

            chrome.notifications.create(notificationId, options, callback);
         } else {
            console.log("Notifications are not enabled");
         }
      });
      */
    }
});
