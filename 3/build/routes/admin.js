"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var fs = require('fs');

var multer = require('multer');

router.use(multer({
  dest: 'build/public/images/'
}).single('img'));
router.get('/paintings', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../views/paintings.html'));
});
router.get('/get-pics', function (req, res, next) {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).images));
});
router.get('/paintings/:id', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../views/form.html'));
});
router.get('/get-pic/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  res.send(JSON.stringify(data.images[id]));
});
router.post('/loadimage/:id', function (req, res, next) {
  var id = req.params.id;
  var fileName = req.file.filename + '.jpg';
  fs.renameSync(path.resolve(__dirname + "/../public/images/".concat(req.file.filename)), path.resolve(__dirname + "/../public/images/".concat(fileName)));
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id].src = "/images/".concat(fileName);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));
  res.send({
    src: data.images[id].src
  });
});
router.post('/load-mini-image/:id', function (req, res, next) {
  var id = req.params.id;
  var fileName = req.file.filename + 'small.jpg';
  fs.renameSync(path.resolve(__dirname + "/../public/images/".concat(req.file.filename)), path.resolve(__dirname + "/../public/images/".concat(fileName)));
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id].srcSmall = "/images/".concat(fileName);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));
  res.send({
    srcSmall: data.images[id].srcSmall
  });
});
router.post('/paintings/:id', function (req, res, next) {
  //Если нажата кнопка "Сохранить"
  var id = req.params.id;
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id] = JSON.parse(req.body.img);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));
  res.sendStatus(200);
});
router.get('/participants', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../views/participants.html'));
});
router.get('/get-participants', function (req, res, next) {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).participants));
});
router.post('/save-participants', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.participants = JSON.parse(req.body.participants);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));
  res.sendStatus(200);
});
router.get('/settings', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../views/settings.html'));
});
router.get('/get-settings', function (req, res, next) {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).settings));
});
router.post('/save-settings', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.settings = JSON.parse(req.body.settings);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));
  res.sendStatus(200);
});
module.exports = router;