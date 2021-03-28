let express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('homepage', { title: 'Library entrance' });
});

module.exports = router;