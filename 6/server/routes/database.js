var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/brokers', ((req, res, next) => {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  res.json({brokers: data.brokers});
}))

router.get('/all', (req, res, next) => {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data.json'), 'utf-8'));
  res.json({state: data});
})

module.exports = router;
