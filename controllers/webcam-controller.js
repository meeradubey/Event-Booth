var db = require("../models");

function createPageObject(obj) {
  return {
    isProductsPage: true,
    ...obj
  }
}

module.exports = {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                  html routes                              //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  html: {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /products                                          //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    list: function (req, res) {
      db.product.findAll({
        where: {
          userId: req.user.id
        }
      }).then(function (products) {
        res.render("products/list", createPageObject({ products, list: true }));
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /products/view/:productId                          //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    view: function (req, res) {
      db.product.findOne({
        where: {
          id: req.params.productId,
          userId: req.user.id
        },
        include: [{
          model: db.store,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (product) {
        res.render("products/view", createPageObject(product.get({plain: true})));
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /products/create                                   //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    create: function (req, res) {
      res.render("products/create", createPageObject({}));
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /products/edit/:productId                          //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    edit: function (req, res) {
      db.product.findOne({
        where: {
          id: req.params.productId,
          userId: req.user.id
        }
      }).then(function (product) {
        res.render("products/update", createPageObject(product.get({plain: true})));
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
    // GET: /api/products                                      //
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
      db.product.findAll({
        where: {
          userId: req.user.id
        },
        include: [{
          model: db.store,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (products) {
        res.json(products);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // GET: /api/products/:productId                           //
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
      db.product.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [{
          model: db.store,
          where: {
            userId: req.user.id
          },
          required: false
        }]
      }).then(function (product) {
        res.json(product);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // POST: /api/products                                     //
    // req.body: {                                             //
    //    id - integer (required)                              //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    // }                                                       //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    create: function (req, res) {
      db.product.create({...req.body, userId: req.user.id}).then(function (results) {
        res.json(results);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    // PUT: /api/products                                      //
    // req.body: {                                             //
    //    id - integer (required)                              //
    //    name - string                                        //
    //    description - string                                 //
    //    createdAt - date                                     //
    //    updatedAt - date                                     //
    // }                                                       //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    update: function (req, res) {
      db.product.update(
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
    // DELETE: /api/products/:productId                        //
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    delete: function (req, res) {
      db.product.destroy({
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