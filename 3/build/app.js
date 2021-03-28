"use strict";

var express = require('express'); // var path = require('path');
// var cookieParser = require('cookie-parser');
// var lessMiddleware = require('less-middleware');


var indexRouter = require('./routes/index');

var adminRouter = require('./routes/admin');

var app = express(); // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
})); // app.use(cookieParser());
// app.use(lessMiddleware(path.join(__dirname, 'public')));

app.use(express["static"](__dirname + '/public'));
app.use('/', indexRouter);
app.use('/admin', adminRouter);
module.exports = app;