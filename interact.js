function sendReport() {
  try {
    console.log("radio: " + document.querySelector('input[name="emojiRadio"]:checked').value);
  } catch (e) {
    console.log("Emoji not selected");
    document.getElementById('errorText').innerHTML = "Please select an emoji"
    return;
  }
  if(document.getElementById('whatWasWrong').value == undefined){
    console.log("No issue text");
    document.getElementById('errorText').innerHTML = "Please tell us what was wrong"
    return;
  } else if(document.getElementById('howToFix').value == undefined){
    console.log("No impovement text");
    document.getElementById('errorText').innerHTML = "Please suggest us an improvement"
    return;
  }
  // Testing
  console.log("whatWasWrong: " + document.getElementById('whatWasWrong').value);
  console.log("howToFix: " + document.getElementById('howToFix').value);
  // get client for api calls to mongodb
  const client = stitch.Stitch.initializeDefaultAppClient('canaryapi-uwhnp');
  // select database
  const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('canary');
  // get chrome version
  const chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
  // login as anon and post data to server
  client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
    mongodb.collection("reports")
    .insertOne({
      imageURL: "test.com/test.jpg",
      emoji: document.querySelector('input[name="emojiRadio"]:checked').value,
      whatWasWrong: document.getElementById('whatWasWrong').value,
      howToFix: document.getElementById('howToFix').value,
      pageURL: "test.com",
      browserVer: chromeVersion,
      osVer: window.navigator.userAgent,
      date: date();
    })
  );
  document.getElementById("submitButton").disabled = true;
};

document.getElementById("submitButton").addEventListener("click", sendReport);
