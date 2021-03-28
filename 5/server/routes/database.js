var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

/* brokers */
router.get('/brokers', function(req, res, next) {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  res.json({brokers: data.brokers});
});

router.post('/brokers', ((req, res, next) => {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  data.brokers = req.body.brokers;
  fs.writeFileSync(path.resolve(__dirname, '../data.json'), JSON.stringify(data, null, 2));
  res.json({status: 200});
}))

/*stocks*/

router.get('/stocks', (req, res, next) => {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  res.json({stocks: data.stocks});
});

router.post('/stocks', ((req, res, next) => {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  data.stocks = req.body.stocks;
  fs.writeFileSync(path.resolve(__dirname, '../data.json'), JSON.stringify(data, null, 2));
  res.json({status: 200});
}))

/*settings*/
router.get('/settings', (req, res, next) => {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  res.json({settings: data.settings});
});

router.post('/settings', ((req, res, next) => {
  const data =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  data.settings = req.body.settings;
  fs.writeFileSync(path.resolve(__dirname, '../data.json'), JSON.stringify(data, null, 2));
  res.json({status: 200});
}))

module.exports = router;
