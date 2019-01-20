chrome.tabs.captureVisibleTab(function(screenshotUrl) {
  document.getElementById('issue').src = screenshotUrl;
});