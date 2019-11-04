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

    const $blobDisplay = document.querySelector("#blobDisplay");


    //connect the media stream to the videoCapture
      $videoCapture.srcObject = mediaStreamObj;

    $videoCapture.onloadedmetadata = function(ev) {
      //show in the video element what is being captured by the webcam without sound
      $videoCapture.muted = true;
      $videoCapture.play();
    };

    const mediaRecorder = new MediaRecorder(mediaStreamObj, {mimeType: "video/webm; codecs=vp9"});

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
      console.log("chunks:" + chunks);
      console.log(new Blob(chunks, { type: "video/mp4;" }));
      const newMessage = {
        video_blob_id: mediaStreamObj.id,
      };
  
      console.log("newMessage: ", newMessage);
  
      $.post("/api/messages", newMessage, messageSent);
//Lawrence's additions
    
     // console.log( new Blob(chunks, { type: "video/mp4;" }))
      var blobData = new Blob(chunks, { type: "video/webm" });
      console.log("Lawrence's blob" + blobData)
    
      var fd = new FormData();
      
      //var file = new File([blobData], "blobbyFile")
      fd.append('blobby.webm', blobData);
      
      //Testing stuff
      // $.get("/downloadvid", function(data){
      //   const testBlob = data;
      //   const videoURL = window.URL.createObjectURL(testBlob);
      //   $blobDisplay.src = videoURL;
      // });
      
      
      fetch('/uploadaws',
      {
        method: 'post',
        body: fd
      })
    .then(function(response) {
      console.log('done');
      return response;
    })
    .catch(function(err){ 
      console.log(err);
    });
//End of Lawrence's addidtons
    });
    $redo.addEventListener("click", ev => {
      $cameraView.style.display = "inline";
      $cameraPlay.style.display = "none";
      console.log(mediaRecorder.state);
    });
    mediaRecorder.ondataavailable = function(ev) {
      if (event.data.size > 0) {
        chunks.push(ev.data);
      }
    };
    mediaRecorder.onstop = ev => {
      $cameraView.style.display = "none";
      console.log(ev.data);
      console.log(chunks);
      const blob = new Blob(chunks, { type: "video/mp4;" });
      const videoURL = window.URL.createObjectURL(blob);
      console.log("Video url", videoURL)
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