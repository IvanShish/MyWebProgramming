var express = require('express');
var router = express.Router();

/* GET game listing. */
router.get('/lvl1/:name', function(req, res, next) {
  res.render('game', { title: 'Game lvl1', scriptSrc: '../js/game.js', userName: req.params.name });
});

router.get('/lvl2/:name/:points', function(req, res, next) {
  res.render('game_level2', { title: 'Game lvl2', scriptSrc: '../js/game_level2.js', userName: req.params.name, points: req.params.points });
});

router.get('/end_game/:name/:points', function(req, res, next) {
  res.render('end_game', { title: 'Game over', scriptSrc: '../js/end_game.js', userName: req.params.name, points: req.params.points });
});
//
// router.get('/:name', (req, res, next) => {
//   const name = req.params.name
//   if (name) {
//     res.render('bookActions', { title: initialState[id].name, scriptSrc: '../js/bookActions.js', book: initialState[id] });
//   }
//   else {
//     res.render('bookActions', { title: "Добавление книги", scriptSrc: '../js/bookActions.js', book: emptyBook });
//   }
// })

module.exports = router;
