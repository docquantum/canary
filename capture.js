chrome.tabs.captureVisibleTab(function(screenshotUrl) {
  document.getElementById('issue').src = screenshotUrl;
  // var height = window.innerHeight - 30;
  // var width = window.innerWidth - 30;
  var image = document.getElementById('issue');
  console.log(image.width);
  console.log("aisidnf");
  image.setAttribute("width",  500);
  image.setAttribute("height", 500);
});