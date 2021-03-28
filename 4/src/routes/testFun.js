const fs = require('fs');
const path = require('path');

function testFun(req, res, next) {
    let name = req.params.name
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../node_modules/my_auction_lab3/data.json'), 'utf-8'));
    let filtered = data.participants.filter((p) => p.name === name)
    console.log(filtered)
    if (filtered.length > 0) {
        res.send(JSON.stringify(filtered[0]));
    } else {
        res.send('false');
    }
}

module.exports = testFun