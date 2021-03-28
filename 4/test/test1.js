const assert = require('assert')
const testFun = require('../src/routes/testFun');

describe('users auth test', () => {
    it('#1', () => {
        let req = {
            params: {
                name: 'Илон'
            }
        }
        let res = {
            str : null,

            send(str) {
                this.str = str;
            }
        }
        testFun(req, res, null);
        assert.equal(JSON.parse(res.str).id, 0)
    })

    it('#2', () => {
        let req = {
            params: {
                name: 'Сильвестр'
            }
        }
        let res = {
            str : null,

            send(str) {
                this.str = str;
            }
        }
        testFun(req, res, null);

        assert.equal(JSON.parse(res.str).id, 2)
    })

    it('#3', () => {
        let req = {
            params: {
                name: 'Иван'
            }
        }
        let res = {
            str : null,

            send(str) {
                this.str = str;
            }
        }
        testFun(req, res, null);
        assert.equal(JSON.parse(res.str).id, 9)
    })
})