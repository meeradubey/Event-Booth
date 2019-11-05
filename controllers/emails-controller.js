var db = require("../models");

function createPageObject(obj) {
  return {
    isStoresPage: true,
    ...obj
  }
}

module.exports = {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                  html routes                              //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  html: {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /stores                                            //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    list: function (req, res) {
      db.store.findAll({
        where: {
          userId: req.user.id
        }
      }).then(function (stores) {
        res.render("stores/list", createPageObject({ stores, list: true }));
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /stores/view/:storeId                              //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    view: function (req, res) {
      db.store.findOne({
        where: {
          id: req.params.storeId,
          userId: req.user.id
        },
        include: [{
          model: db.product,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (store) {
        res.render("stores/view", createPageObject(store.get({plain: true})));
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /stores/create                                     //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    create: function (req, res) {
      res.render("stores/create", createPageObject({}));
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /stores/edit/:storeId                              //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    edit: function (req, res) {
      db.store.findOne({
        where: {
          id: req.params.storeId,
          userId: req.user.id
        }
      }).then(function (store) {
        res.render("stores/update", createPageObject(store.get({plain: true})));
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  },
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                   api routes                              //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  api: {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /api/stores                                     //
    // response: [{                                            //
    //    id - integer                                         //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    //    stores - [store]                                     //
    // }]                                                      //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    read: function (req, res) {
      db.store.findAll({
        where: {
          userId: req.user.id
        },
        include: [{
          model: db.product,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (stores) {
        res.json(stores);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /api/stores/:storeId                           //
    // response: {                                             //
    //    id - integer                                         //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    //    stores - [store]                                     //
    // }                                                       //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    readById: function (req, res) {
      db.store.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [{
          model: db.product,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (store) {
        res.json(store);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // POST: /api/stores                                     //
    // req.body: {                                             //
    //    id - integer (required)                              //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    // }                                                       //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    create: function (req, res) {
      db.store.create({...req.body, userId: req.user.id}).then(function (results) {
        res.json(results);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // PUT: /api/stores                                      //
    // req.body: {                                             //
    //    id - integer (required)                              //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    // }                                                       //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    update: function (req, res) {
      db.store.update(
        req.body,
        {
          where: {
            id: req.body.id,
            userId: req.user.id
          }
        }
      ).then(function (results) {
        res.json(results);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // DELETE: /api/stores/:storeId                         //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    delete: function (req, res) {
      db.store.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      }).then(function (results) {
        res.json(results);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  }
}