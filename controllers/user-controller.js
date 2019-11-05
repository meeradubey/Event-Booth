var db = require("../models");

module.exports = {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                  html routes                              //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  html: {
    logout: function (req, res) {
      req.logout();
      res.redirect("/login");
    },
    home: function(req, res) {
      // If the user already has an account send them to the members page
      if (req.user) {
          return res.render("index", { email: req.user.email, isHomePage: true });
      }
      res.redirect("/login");
    },
    login: function(req, res) {
      // If the user already has an account send them to the members page
      if (req.user) {
        return res.redirect("/");
      }
      res.render("user/login", { isLoggedOut: true, isLoginPage: true })
    },
    signup: function(req, res) {
      // If the user already has an account send them to the members page
      if (req.user) {
        return res.redirect("/");
      }
      res.render("user/signup", { isLoggedOut: true, isSignUpPage: true })
    }
  },
  api: {

    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    login: function (req, res) {
      res.json(req.user);
    },
    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    signup: function (req, res) {
      db.user.create({
        email: req.body.email,
        password: req.body.password
      })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
    }
  }
}