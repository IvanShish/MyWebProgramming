var express = require('express');
var router = express.Router();
let fs = require('fs')
let path = require('path')

router.get('/adm_state', ((req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));
    res.render('adm_state', {title: 'Администратор', script: '/javascripts/adm_state.js', data: data})
}))

router.post('/adm_state/refresh_buyer', (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));
    data.images = JSON.parse(req.body.images)
    fs.writeFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), JSON.stringify(data, null, 2));

    res.sendStatus(200);
})

module.exports = router;