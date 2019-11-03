var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
var AWS = require("aws-sdk");
var fs = require('fs');
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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Path to send email
router.get('/sendemail', function(req, res, next) {
sendemail();
res.send("woot")
});

//Path to updload
router.get('/uploadaws', function(req, res, next) {
  uploadToS3()
  res.send("woot woot")
});

router.get('/downloadaws', function(req, res, next) {
  downloadaws();

res.send("hopefully it downloaded")
});
router.get('/newbucket', function(req, res, next) {
  makeANewBucket()

res.send("hopefully it downloaded")
});


function uploadToS3(file) {
  
  
  photoBucket.upload({
          ACL: 'public-read', 
          Body: fs.createReadStream('./public/imgs/image.png'), 
          // file upload by below name
          Key: 'aws_test.jpg',
          ContentType: 'application/octet-stream' // force download if it's accessed as a top location
  },(err, response)=>{
      console.log(err, response)
  });
}

function sendemail(){
  let emailArray = ["heatherlatin@gmail.com", "meeradubey97@gmail.com", "carlamanosa@yahoo.com","l.rush7@gmail.com"]


for( let i = 0; i < emailArray.length; i++){
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  
  to: emailArray[i],
  from: 'l.rush7@gmail.com',
  subject: 'I yam what I yam',
  text: 'And i dont beet myself up about it',
  html: '<strong>because I dont carrot bout it</strong>',
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
