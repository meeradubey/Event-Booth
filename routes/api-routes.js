// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  
// *********************************************************************************
// ~~~~~~~~~~~~~~~~~~~~~~~~~ Recipient Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// *********************************************************************************


// GET route for getting all of the recipients
  app.get("/api/recipients", function(req, res) {
    db.email_invite.findAll({}).then(results => {
      res.json(results);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  // POST route for saving a new recipient
  app.post("/api/recipients", function(req, res) {
    const { id, createdAt, updatedAt, ...body } = req.body;
    db.email_invite.create(body).then(results => {
      res.json(results);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  // DELETE route for deleting recipients. We can get the id of the recipient to be deleted from
  // req.params.id
  app.delete("/api/recipients/:id", function(req, res) {
    db.email_invite.destroy({
      where: {
        id: req.params.id
      }
    }).then(results => {
      res.json(results);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });


// *********************************************************************************
// ~~~~~~~~~~~~~~~~~~~~~~~~~ Message Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// *********************************************************************************


    // GET route for getting all of the messages
    app.get("/api/messages", function(req, res) {
      db.message_blob.findAll({}).then(results => {
        res.json(results);
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    });
  
    // POST route for saving a new recipient
    app.post("/api/messages", function(req, res) {
      const { id, contentType, contentData, cache, createdAt, updatedAt, ...body } = req.body;
      db.message_blob.create(body).then(results => {
        res.json(results);
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    });
  
    // DELETE route for deleting messages. We can get the id of the recipient to be deleted from
    // req.params.id
    app.delete("/api/messages/:id", function(req, res) {
      db.message_blob.destroy({
        where: {
          id: req.params.id
        }
      }).then(results => {
        res.json(results);
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    });

};
