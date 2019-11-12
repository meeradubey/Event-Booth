// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads index.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/vids", function(req, res) {
    console.log("cat")
    res.sendFile(path.join(__dirname, "../public/showVids.html"));
  });
  // emails route loads emails.html
  app.get("/emails", function(req, res) {
    console.log("cat")
    res.sendFile(path.join(__dirname, "../public/emails.html"));
  });

  // webcam route loads webcam.h:tml
  app.get("/webcam/:email_id/:name/:event_id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/webcam.html"));
  });

    // event route loads event.html
    app.get("/event", function(req, res) {
      console.log("cat")
      res.sendFile(path.join(__dirname, "../public/event.html"));
    });

};
