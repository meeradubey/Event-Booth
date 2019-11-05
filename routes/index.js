var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
var AWS = require("aws-sdk");
var fs = require('fs-extra');
var multer  = require('multer');
const db = require("../models");
var FileReader = require('filereader');
var path = require("path");
var fluent_ffmpeg = require("fluent-ffmpeg");
const concat = require('concat');

AWS.config.update({
  accessKeyId: "AKIAWY2KH2UONZBNL332",
  secretAccessKey: "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",
  // region:process.env.AWS_region  
});
const s3 = new AWS.S3({   signatureVersion: 'v4',  })
var photoBucket = new AWS.S3({
  params: {
      Bucket: 'event-booth-bucket'
  }
})

var user ={}
var keyArr =[]


// const BUCKET_NAME = 'llamarushstestbucket';
// const IAM_USER_KEY = 'AKIAWY2KH2UONZBNL332';
// const IAM_USER_SECRET = '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';


//Lawrence's routers
/* GET home page. */


//Path to send email
router.get('/sendemail', function(req, res, next) {
sendemail();
res.send("woot")
});

//Path to recieve email
router.get('/:id/:name/:eventid', function(req, res) {
  

  module.exports = user;
  
  html = `<!DOCTYPE html>

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link href=“https://fonts.googleapis.com/css?family=Libre+Baskerville%7COpen+Sans&display=swap” rel=“stylesheet” />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Webcam</title>
    <script
  src="https://code.jquery.com/jquery-3.4.1.js"
  integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
  crossorigin="anonymous"></script>
  </head>
  
  <body>
    <main>
  
      <nav class=“navbar” id=“create-navbar” style="height: 80px;">
        <a class=“navbar-brand” style="font-family: Libre Baskerville, serif;padding-left: 100px;padding-top: 15px;font-size:
          35px;padding-top: 11px;"><b>Event Booth</b></a>
        <form class=“form-inline”></form>
        <a class=“nav” href=“/”
          style="padding-right: 9px; padding-left: 841px; padding-left: 1230px; font-size: 18px;color:black;">Home</a>
        <a class=“nav” href=“#” style="padding-right: 100px; padding-left: 4px;font-size: 18px;color:black;">Login</a>
        </form>
      </nav>
  
  
  
      <div class="card"
        style="width: 100%; padding-left: 200px; padding-right: 200px; margin: 0 auto; background-color: #F2F0EF;">
        <div class="card-body">
        <div><h1>Welcome ${req.params.name}, record a video</h1></div>
          <h5 class="card-title" ; style="text-align: center;">Record Your Message Now</h5>
          <div id="test" style="display: none" text-align=center;>Recording in Progress</div>
          <p class="card-text"></p>
          <div id="camera-view-1" style="display: inline;" width="200px;">
            <!-- Displays what the webcam is seeing -->
            <video id="videoCapture" autoplay="" style="
                width: 1000px;
                height: 520px;
                "></video>
  
            <div class="container" id="Recording-Buttons" style="padding-top: 20px;text-align: center;">
              <!-- start recording button -->
              <button id="btnStart" style="background-color:#FFC300;">Record</button>
              <!-- stop recording button -->
              <button id="btnStop" style="background-color:#FFC300;">Stop</button>
            </div>
  
  
          </div>
  
          <div id="camera-view-2" style="display: none;">
            <!-- Displays the captured recording -->
            <video id="videoDisplay" style="
            width: 1000px;
            height: 520px;
            " controls></video>
            <!-- will eventually send to database - still working on it -->
            <div class="container" id="Save-Buttons" style="padding-top: 20px;text-align: center;">
              <button id="btnSave" style="background-color:#FFC300;">Save</button>
              <!-- do over (starts recording process again) -->
              <button id="btnRedo" style="background-color:#FFC300;">Redo</button>
            </div>
          </div>
        </div>
      </div>
  
      <div id = "reqId" style="display:none;">${req.params.id}</div>
      <div id = "reqName" style="display:none;">${req.params.name}</div>
      <div id = "reqEventId" style="display:none;">${req.params.eventid}</div>
    </main>
  
    <script src="/js/webcam.js" type="text/javascript"></script>
   
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
      integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
      crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous"></script>
  </body>
  
  </html>
  `
 res.send(html);
  });
  
router.get('/:id/:name/js/webcam.js', function(req, res) {
res.send(path.join(__dirname, "../public/js/webcam.js"))
})

function shareUser(user) {
  console.log(user);
  console.log("call post function to amazon server, sending video and user object if we wanted");
}
//Get user data from front end
router.post('/getUserStuff', function(req, res){
console.log("Req:", req.body.user.id)
user = {
  emailID: req.body.user.id,
  Name: req.body.user.name,
  eventID: req.body.user.eventId
};
})

//Multer, set up destination for file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `./routes/routesUploads/`;
      fs.mkdirsSync(path);
      cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})
var upload = multer();
var type = upload.single('blobby.webm');

//Path to updload to s3

router.post('/uploadaws', upload.any(),  function(req, res) {
  console.log(req.files[0]);
  //console.log(user)
  fs.writeFileSync(path.join(__dirname, '/routesUploads/videotest.webm'), req.files[0].buffer);
//  console.log(req.file)
  uploadToS3(req.file)
  

  res.send("woot woot")
});
//Path to get keys
router.get('/getvidsrcs', function(req, res, next) {
  const urls = keyArr.map(x => "https://event-booth-bucket.s3-us-west-2.amazonaws.com/" + x);  
  console.log(urls)
res.send(urls)
});

router.get('/downloadvid', function(req, res, next) {
  
let file = require("./routesUploads/blobby.webm")
console.log(file)
res.send(file)
});



//Path to make new bucket
router.get('/newbucket', function(req, res, next) {
  makeANewBucket()

res.send("hopefully it downloaded")
});


function uploadToS3(file) {
  keyArr.push(`${user.emailID}${user.Name}${user.eventID}.webm`)
  console.log(keyArr)
  photoBucket.upload({
          ACL: 'public-read', 
          Body:fs.createReadStream("./routes/routesUploads/videotest.webm"), 
          // file upload by below name
          Key: `${user.emailID}${user.Name}${user.eventID}.webm`,
          ContentType: 'application/octet-stream' // force download if it's accessed as a top location
  },(err, response)=>{
      console.log(err, response)
  });
}

async function sendemail(){
let emailData = await db.email_invite.findAll({})
    
 emailData = JSON.parse(JSON.stringify(emailData));
    
for( let i = 0; i < emailData.length; i++){
console.log(emailData[i].invite_email)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  
  to: emailData[i].invite_email,
  from: 'l.rush7@gmail.com',
  subject: 'here is the link',
  // text: `localhost:3000/${emailData[i].invite_name}/${emailData[i].event_id}`,
  html: `http://localhost:8080/${emailData[i].id}/${emailData[i].invite_name}/${emailData[i].event_id}`,
};
sgMail.send(msg);
}
}

function downloadaws(){
  //console.log(keyArr)
  let filePathArr = [];
  const videoCompilation = [];
  for (var i = 0; i < keyArr.length; i++){
    let filePath = `./routes/routesDownloads/${keyArr[i]}`
    filePathArr.push(filePath)
    console.log(filePath)
  var s3 = new AWS.S3();
s3.getObject(
  { Bucket: "event-booth-bucket", Key: `${keyArr[i]}` },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      // do something with data.Body
    // console.log(data)
      console.log(data.Body)
      let newVid = data.Body;
      videoCompilation.push(newVid);

      fs.appendFile(filePath, data.Body, function(err){
        if(err)

          console.log(err.code, "-", err.message);
    
        return null;   
      }); 
    }
  }
)}
 
    let outputFIle = `./routes/routesDownloads/comp.webm`
    
concat(filePathArr, outputFIle)
// console.log("video compilation: ", videoCompilation);
// convertBuffer(videoCompilation);

// function convertBuffer(data) {
//   let buffer = Buffer.from(data);
//   let arraybuffer = Uint8Array.from(buffer).buffer;
//   console.log("arraybuffer", arraybuffer);
 }


function makeANewBucket (){
  var params = {
    Bucket: "event-booth-bucket-2", 
    CreateBucketConfiguration: {
    LocationConstraint: "eu-west-1"
   }
 };
 s3.createBucket(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response      
 });
}


module.exports = router;
