// Capture image
chrome.tabs.captureVisibleTab(function(screenshotBase64) {
  document.getElementById('issue').src = screenshotBase64;
  var height = window.innerHeight / 1.75;
  var width = window.innerWidth / 1.5;
  var image = document.getElementById('issue');
  console.log(image.width);
  image.setAttribute("width",  width);
  image.setAttribute("height", height);
});
