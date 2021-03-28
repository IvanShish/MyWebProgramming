"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var fs = require('fs');

var multer = require('multer');

router.use(multer({
  dest: 'build/public/images/'
}).single('img'));
/* GET users listing. */

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;