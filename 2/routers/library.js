let express = require('express');
let router = express.Router();
const fs = require('fs')
let initialState = []
const emptyBook = {
    "id": -1,
    "isActive": true,
    "name": "",
    "author": "",
    "year": "",
    "inStock": true,
    "owner": "",
    "returnDate": ""
}
//define the home page route
router.get('/', function(req, res, next) {  //get initial state
    if (initialState.length === 0) {
        const str = fs.readFileSync('initialState.json', 'utf8')
        initialState = JSON.parse(str)
    }
    res.render('library', { title: 'Home library', scriptSrc: '../js/books.js', data: initialState });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    if (id >= 0) {  //if edit a book
        res.render('bookActions', { title: initialState[id].name, scriptSrc: '../js/bookActions.js', book: initialState[id] });
    } else {    //if need to add a book
        res.render('bookActions', { title: "Добавление книги", scriptSrc: '../js/bookActions.js', book: emptyBook });
    }
})

router.delete('/:id', (req, res, next) => { //delete
    const id = req.params.id
    initialState[id].isActive = false
    res.send(JSON.stringify({
        status: 200
    }))
})

router.put('/:id', (req, res, next) => {    //refresh data (initialState)
    const id = req.params.id
    const book = JSON.parse(req.body.book)
    if (id >= 0) {  //edited book
        initialState[id] = book
        res.json({book: book})
    } else {    //added book
        book.id = initialState.length
        initialState.push(book)
        res.json({book: book})
    }
})

router.post('/', (req, res, next) => {  //add
    const book = JSON.parse(req.body.book)
    book.id = initialState.length
    initialState.push(book)
    res.json({book: book})
})

router.get('/sorted/:value', (req, res, next) => {  //filter
    const v = parseInt(req.params.value)
    let sortedData = []
    switch (v) {
        case 0:
            sortedData = initialState
            break
        case 1:
            sortedData = initialState.filter((book) => book.inStock)
            break
        case 2:
            sortedData = initialState.filter((book) => book.returnDate && +(Date.parse(book.returnDate)) <= +new Date())
            break;
    }
    res.json({ books: sortedData })
})

module.exports = router;
