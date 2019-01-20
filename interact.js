function sendReport() {
  console.log("radio" + document.querySelector('input[name="emojiRadio"]:checked').value);
  console.log("whatWasWrong" + document.getElementById('whatWasWrong').select());
  console.log("howToFix" + document.getElementById('howToFix').select());
  const client = stitch.Stitch.initializeDefaultAppClient('canaryapi-uwhnp');
  const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('canary');
  const chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
  mongodb.collection("reports")
    .insertOne({
      imageURL: "test.com/test.jpg",
      emoji: document.querySelector('input[name="emojiRadio"]:checked').value,
      whatWasWrong: document.getElementById('whatWasWrong').select(),
      howToFix: document.getElementById('howToFix').select(),
      pageURL: "test.com",
      browserVer: chromeVersion,
      osVer: window.navigator.userAgent
    });
};

document.getElementById("submitButton").addEventListener("click", sendReport);
