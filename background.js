//We need to add the URL, browser version, and OS version; these should be doable using
//chrome.browserAction.onClicked.addListener(function(){
//stuff (getPlatformInfo?)
//});
//Update background.js
// Connect to db
var osVer;
chrome.browserAction.onClicked.addListener(function(){
  chrome.runtime.getPlatformInfo((platform) => osVer = platform.os);
}
