//Store Video IDs
const videoIDs = [];

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

    //add listeners for saving video/audio
    const $start = document.querySelector("#btnStart");
    const $stop = document.querySelector("#btnStop");
    const $save = document.querySelector("#btnSave");
    const $redo = document.querySelector("#btnRedo");
    const $videoDisplay = document.querySelector("#videoDisplay");
    const $videoCapture = document.querySelector("#videoCapture");
    const $cameraView = document.querySelector("#camera-view-1");
    const $cameraPlay = document.querySelector("#camera-view-2");


    //connect the media stream to the videoCapture
      $videoCapture.srcObject = mediaStreamObj;

    $videoCapture.onloadedmetadata = function(ev) {
      //show in the video element what is being captured by the webcam without sound
      $videoCapture.muted = true;
      $videoCapture.play();
    };

    const mediaRecorder = new MediaRecorder(mediaStreamObj);

    //Store the media stream video chunks (resets every time so only one video is stored locally)
    const chunks = [];
    let toSave = false;

    $start.addEventListener("click", ev => {
      chunks.length = 0;
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    });
    $stop.addEventListener("click", ev => {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    });
    $save.addEventListener("click", ev => {
      // const videoID = { id: mediaStreamObj.id};
      // chunks.push(videoID);
      console.log(chunks);
      console.log(new Blob(chunks, { type: "video/mp4;" }));
      const newMessage = {
        video_blob_id: mediaStreamObj.id,
      };
  
      console.log("newMessage: ", newMessage);
  
      $.post("/api/messages", newMessage, messageSent);
    });
    $redo.addEventListener("click", ev => {
      $cameraView.style.display = "inline";
      $cameraPlay.style.display = "none";
      console.log(mediaRecorder.state);
    });
    mediaRecorder.ondataavailable = function(ev) {
      chunks.push(ev.data);
    };
    mediaRecorder.onstop = ev => {
      $cameraView.style.display = "none";
      const blob = new Blob(chunks, { type: "video/mp4;" });
      const videoURL = window.URL.createObjectURL(blob);
      $cameraPlay.style.display = "inline";
      $videoDisplay.src = videoURL;
    };
  })
  .catch(function(err) {
    console.log(err.name, err.message);
  });

  function messageSent() {
    alert("WASSUP");
  }