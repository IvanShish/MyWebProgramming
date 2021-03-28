var express = require('express');
var router = express.Router();
let fs = require('fs')
let path = require('path')

router.get('/auth/:name', testFun)

function testFun(req, res, next) {
  let name = req.params.name
  let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));
  let filtered = data.participants.filter((p) => p.name === name)

  if (filtered.length > 0) {
    res.send(JSON.stringify(filtered[0]));
  } else {
    res.send('false');
  }
}

router.get('/page/:id', ((req, res, next) => {
  const id = req.params.id
  let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));
  if (id < data.participants.length) {
    res.render('user_page', {title: data.participants[id].name, script: '/javascripts/user_page.js', participant: data.participants[id], date: data.settings.datetime})
  } else {
    res.sendStatus(404);
  }
}))

router.get('/purch/:id', ((req, res, next) => {
  const id = parseInt(req.params.id)
  let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));

  let purch = data.images.filter((pic) => pic.lastOwnerId === id)

  if (id < data.participants.length) {
    res.render('user_purch', {title: data.participants[id].name, script: '/javascripts/user_purch.js', purch: purch, id: id})
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;
