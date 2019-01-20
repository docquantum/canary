function sendReport() {
  try {
    console.log("radio: " + document.querySelector('input[name="emojiRadio"]:checked').value);
  } catch (e) {
    console.log("radio not selected");
  }
  console.log("whatWasWrong: " + document.getElementById('whatWasWrong').value);
  console.log("howToFix: " + document.getElementById('howToFix').value);
  const client = stitch.Stitch.initializeDefaultAppClient('canaryapi-uwhnp');
  const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('canary');
  const chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
  client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
  mongodb.collection("reports")
    .insertOne({
      imageURL: "test.com/test.jpg",
      emoji: document.querySelector('input[name="emojiRadio"]:checked').value,
      whatWasWrong: document.getElementById('whatWasWrong').value,
      howToFix: document.getElementById('howToFix').value,
      pageURL: "test.com",
      browserVer: chromeVersion,
      osVer: window.navigator.userAgent
    })
  )
};

document.getElementById("submitButton").addEventListener("click", sendReport);
