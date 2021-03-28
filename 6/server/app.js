var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var database = require('./routes/database');
const cors = require('cors');

var app = express();

const corsOperations = {
  credentials: true,
  origin: true,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept',
}

app.use(cors(corsOperations));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/db', database);

module.exports = app;

