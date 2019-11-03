var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');


//Setting up our PORT
var PORT = process.env.PORT || 8080;


// Requiring our models for syncing
var db = require("./models");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(logger('dev'));
app.use(cookieParser());

// Static directory
app.use(express.static("public"));


app.use('/', indexRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
  });
});


module.exports = app;
