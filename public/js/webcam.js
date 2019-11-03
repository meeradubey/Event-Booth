//Store Video IDs
const videoIDs = [];

//binding querySelectors to $ and $$
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//set recording constraints
const constraintObj = {
  audio: true,
  video: {
    //grabs the front camera instead of the back camera if opened on a mobile device
    facingMode: "user",
    //setting min and ideal resolution
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 }
  }
};

//handle older browsers that might implement getUserMedia in some weird way
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = function(constraintObj) {
    let getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraintObj, resolve, reject);
    });
  };
} else {
  navigator.mediaDevices
    .enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        console.log(device.kind.toUpperCase(), device.label);
      });
    })
    .catch(err => {
      console.log(err.name, err.message);
    });
}

//MAIN FUNCTION!!!!
navigator.mediaDevices
  .getUserMedia(constraintObj)
  .then(function(mediaStreamObj) {
    //connect the media stream to the videoCapture
    const $videoCapture = $("#videoCapture");
    if ("srcObject" in $videoCapture) {
      $videoCapture.srcObject = mediaStreamObj;
    } else {
      //old version
      $videoCapture.src = window.URL.createObjectURL(mediaStreamObj);
    }

    $videoCapture.onloadedmetadata = function(ev) {
      //show in the video element what is being captured by the webcam without sound
      $videoCapture.muted = true;
      $videoCapture.play();
    };

    //add listeners for saving video/audio
    const $start = $("#btnStart");
    const $stop = $("#btnStop");
    const $save = $("#btnSave");
    const $redo = $("#btnRedo");
    const $videoDisplay = $("#videoDisplay");
    const mediaRecorder = new MediaRecorder(mediaStreamObj);

    //Store the media stream video chunks (resets every time so only one video is stored locally)
    const chunks = [];

    $start.addEventListener("click", ev => {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    });
    $stop.addEventListener("click", ev => {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    });
    $save.addEventListener("click", ev => {
      alert("Save Button Pressed");
      console.log(mediaRecorder.state, mediaStreamObj.id, mediaStreamObj);
    });
    $redo.addEventListener("click", ev => {
      $("#camera-view-1").style.display = "inline";
      $("#camera-view-2").style.display = "none";
      console.log(mediaRecorder.state);
    });
    mediaRecorder.ondataavailable = function(ev) {
      chunks.push(ev.data);
    };
    mediaRecorder.onstop = ev => {
      $("#camera-view-1").style.display = "none";
      const blob = new Blob(chunks, { type: "video/mp4;" });
      chunks.length = 0;
      const videoURL = window.URL.createObjectURL(blob);
      $("#camera-view-2").style.display = "inline";
      $videoDisplay.src = videoURL;
      console.log(blob);
      console.log(blob.id);
      console.log(videoURL);
      console.log(blob.type);
    };
  })
  .catch(function(err) {
    console.log(err.name, err.message);
  });