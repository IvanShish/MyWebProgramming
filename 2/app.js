const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let path = require('path');
let indexRouter = require('./routers/index');
let libraryRouter = require('./routers/library');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded( {extended: true} )); //for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/library', libraryRouter);
//данное приложение теперь сможет обрабатывать запросы, адресованные ресурсам / и /library
module.exports = app;

app.listen(3000);