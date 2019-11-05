var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
var AWS = require("aws-sdk");
var fs = require('fs-extra');
var multer  = require('multer');
const db = require("../models");
var FileReader = require('filereader');
var path = require("path");
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
  console.log("Email id",req.params.id)
  console.log("Name",req.params.name)
  console.log("Event id",req.params.eventid)
  const user = {
    emailID: req.params.id,
    Name: req.params.name,
    eventID: req.params.eventid
  };
  console.log(user);
  
  html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Test</title>
  
      <!-- jQuery -->
      <script src="https://code.jquery.com/jquery.js"></script>
      
    </head>
  
    <body>
      <main>
      <div><h1>Welcome ${req.params.name}, record a video</h1></div>
      <div><p>Event id ${req.params.eventid}</p></div>
      <div><p>Email id ${req.params.id}</p></div>
        <div id="camera-view-1" style="display: inline;">
          <!-- Displays what the webcam is seeing -->
          <video id="videoCapture" autoplay></video>
          <!-- start recording button -->
          <p><button id="btnStart">Record</button></p>
          <!-- stop recording button -->
          <p><button id="btnStop">Stop</button></p>
        </div>
  
        <div id="camera-view-2" style="display: none;">
          <!-- Displays the captured recording -->
          <video id="videoDisplay" controls></video>
          <!-- will eventually send to database - still working on it -->
          <p><button id="btnSave">Save</button></p>
          <!-- do over (starts recording process again) -->
          <p><button id="btnRedo">Redo</button></p>
        </div>
  
        <div id="testBlob">
          <video id="blobDisplay" controls></video>
        </div>
        <!-- <form>
          <input type="file" name="videoFile">
        </form> -->
      </main>
  
      <script src="/js/webcam.js" type="text/javascript"></script>
    </body>
  </html>
  `
 res.send(html);
  });
  
router.get('/:id/:name/js/webcam.js', function(req, res) {
res.send(path.join(__dirname, "../public/js/webcam.js"))
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
  fs.writeFileSync(path.join(__dirname, '/routesUploads/videotest.webm'), req.files[0].buffer);
//  console.log(req.file)
  uploadToS3(req.file)
  

  res.send("woot woot")
});
//Path to download from s3
router.get('/downloadaws/:videoName', function(req, res, next) {
  downloadaws(req.params.videoName);
let file = require("./routesDownloads/video.mp4")
res.send(file)
});

router.get('/downloadvid', function(req, res, next) {
  
let file = require("./routesUploads/blobby.mp4")
console.log(file)
res.send(file)
});

//Path to make new bucket
router.get('/newbucket', function(req, res, next) {
  makeANewBucket()

res.send("hopefully it downloaded")
});


function uploadToS3(file) {
  
  
  photoBucket.upload({
          ACL: 'public-read', 
          Body:fs.createReadStream("./routes/routesUploads/videotest.webm"), 
          // file upload by below name
          Key: 'test.mp4',
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
  var s3 = new AWS.S3();
s3.getObject(
  { Bucket: "event-booth-bucket", Key: "bobsBurgers.png" },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      // do something with data.Body
    // console.log(data)
      console.log(data.Body)
      fs.writeFile('./routes/routesDownloads/video.mp4', data.Body, function(err){
        if(err)
          console.log(err.code, "-", err.message);
    
        return null;   
      }); 
    }
  }
);
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
