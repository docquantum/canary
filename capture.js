// Capture image
chrome.tabs.captureVisibleTab(function(screenshotBase64) {
  document.getElementById('issue').src = screenshotBase64;
  var height = window.innerHeight / 2;
  var width = window.innerWidth - 30;
  var image = document.getElementById('issue');
  console.log(image.width);
  console.log("aisidnf");
  image.setAttribute("width",  500);
  image.setAttribute("height", 400);
});
