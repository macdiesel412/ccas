var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var orders = require('./routes/orders')
var mongoose = require('mongoose');
var config = require('config');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(orders);

// I have set the application to only trust non internet wide addressable ranges. We can modify this to accept only
// the subnets available on your local network since this is an internal only application.
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.get('db.connection_string'), options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'message':err.message, 'error':err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'message':err.message})
});


module.exports = app;
