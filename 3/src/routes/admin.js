var express = require('express');
var router = express.Router();
let path = require('path');
let fs = require('fs');
let multer = require('multer');

router.use(multer({dest:'build/public/images/'}).single('img'))

router.get('/paintings', (req, res, next) => {
  res.sendFile(path.resolve(__dirname + '/../views/paintings.html'));
})

router.get('/get-pics', (req, res, next) => {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).images));
})

router.get('/paintings/:id', (req, res, next) => {
  res.sendFile(path.resolve(__dirname + '/../views/form.html'));
})

router.get('/get-pic/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  res.send(JSON.stringify(data.images[id]));
})

router.post('/loadimage/:id', (req, res, next) => {
  const id = req.params.id;
  const fileName = req.file.filename + '.jpg';
  fs.renameSync(path.resolve(__dirname + `/../public/images/${req.file.filename}`), path.resolve(__dirname + `/../public/images/${fileName}`));

  const data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id].src = `/images/${fileName}`;
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));

  res.send({src : data.images[id].src});
})

router.post('/load-mini-image/:id', (req, res, next) => {
  const id = req.params.id;
  const fileName = req.file.filename + 'small.jpg';
  fs.renameSync(path.resolve(__dirname + `/../public/images/${req.file.filename}`), path.resolve(__dirname + `/../public/images/${fileName}`));

  const data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id].srcSmall = `/images/${fileName}`;
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));

  res.send({srcSmall: data.images[id].srcSmall});
})

router.post('/paintings/:id', (req, res, next) => {  //Если нажата кнопка "Сохранить"
  const id = req.params.id;
  const data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.images[id] = JSON.parse(req.body.img);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));

  res.sendStatus(200);
})

router.get('/participants', (req, res, next) => {
  res.sendFile(path.resolve(__dirname + '/../views/participants.html'));
})

router.get('/get-participants', (req, res, next) => {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).participants));
})

router.post('/save-participants', (req, res, next) => {
  let data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.participants = JSON.parse(req.body.participants)
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));

  res.sendStatus(200);
})

router.get('/settings', (req, res, next) => {
  res.sendFile(path.resolve(__dirname + '/../views/settings.html'));
})

router.get('/get-settings', (req, res, next) => {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8')).settings));
})

router.post('/save-settings', (req, res, next) => {
  let data = JSON.parse(fs.readFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', 'utf-8'));
  data.settings = JSON.parse(req.body.settings);
  fs.writeFileSync('C:/Users/Ivan/PhpstormProjects/Auction/data.json', JSON.stringify(data, null, 2));

  res.sendStatus(200);
})

module.exports = router;
