let interval;
let socket;
let timeoutLength;
let curImage;

$('document').ready(()=> {
    init()
})

function init() {
    let sdate = $('#date').html()
    if (new Date() < new Date(sdate)) {
        setTimer(sdate)
    }

    socket = io.connect('http://localhost:3030')

    socket.on('aucBeginning', (time) => {
        $('#info').val($('#info').val() + time + '\tАукцион начался\n')
    })

    socket.on('pause', (data) => {
        $('#info').val($('#info').val() + data.time + `\tПауза на ознакомление с лотом\n`)
        secondsTimer(data.pause)
        $('#cur-event').html('Пауза на ознакомление с лотом')

        $('#lot-info').css('display', 'block')
        $('#img-name').html(`Название: "${data.image.name}"`)
        $('#img').attr('src', `/public${data.image.src}`)
        $('#img-author').html(`Автор: ${data.image.author}`)
        $('#img-describe').html(`Описание: ${data.image.description}`)
        // $('#img-start-price').html(`Начальная цена: ${data.image.startPrice}`)
        $('#img-start-price').html(`Начальная цена: ${data.image.startPrice}, мин. шаг: ${data.image.minStep}, макс. шаг: ${data.image.maxStep}`)
        $('#img-cur-price').html('Текущая ставка: -')
        $('#img-cur-owner').html('Текущий покупатель: -')
    })

    socket.on('betBeginning', (data) => {
        curImage = data.image
        $('#info').val($('#info').val() + data.time + `\tНачались торги за лот "${curImage.name}"\n`)
        $('#bet-info').css('display', 'block')
        $('#cur-event').html('Принимаются ставки')
        timeoutLength = data.timeout
        secondsTimer(timeoutLength)

        $('#spin').spinner('value', curImage.startPrice).spinner('option', 'min', curImage.startPrice).spinner('option', 'step', curImage.minStep).spinner('option', 'max', parseInt($('#money').html()))
    })

    socket.on('betMade', (data) => {
        $('#info').val($('#info').val() + data.time + `\tУчастник ${data.lastOwner} сделал ставку ${data.bet}\n`)
        secondsTimer(timeoutLength)

        $('#spin').spinner('value', data.bet + curImage.minStep).spinner('option', 'min', data.bet + curImage.minStep).spinner('option', 'max', parseInt($('#money').html()))
        $('#img-cur-price').html(`Текущая ставка: ${data.bet}`)
        $('#img-cur-owner').html(`Текущий покупатель: ${data.lastOwner}`)
    })

    socket.on('problem', (data) => {
        $('#info').val($('#info').val() + data.time + '\t' + data.msg + '\n')
    })

    socket.on('betEntry', (data) => {
        curImage = data.image
        timeoutLength = data.timeout
        $('#cur-event').html('Принимаются ставки')
        secondsTimer(data.seconds)

        $('#lot-info').css('display', 'block')
        $('#img-name').html(`Название: "${curImage.name}"`)
        $('#img').attr('src', `/public${curImage.src}`)
        $('#img-author').html(`Автор: ${curImage.author}`)
        $('#img-describe').html(`Описание: ${curImage.description}`)
        // $('#img-start-price').html(`Начальная цена: ${curImage.startPrice}`)
        $('#img-start-price').html(`Начальная цена: ${curImage.startPrice}, мин. шаг: ${curImage.minStep}, макс. шаг: ${curImage.maxStep}`)
        $('#bet-info').css('display', 'block')
        $('#img-cur-price').html(`Текущая ставка: ${data.image.lastBet ? data.image.lastBet : '-'}`)
        $('#img-cur-owner').html(`Текущий покупатель: ${data.lastOwner ? data.lastOwner: '-'}`)
        $('#spin').spinner('value', curImage.lastBet + curImage.minStep).spinner('option', 'min', curImage.lastBet + curImage.minStep).spinner('option', 'step', curImage.minStep).spinner('option', 'max', parseInt($('#money').html()))
    })

    socket.on('betEnded', (data) => {
        if (data.lastBet) {
            $('#info').val($('#info').val() + data.time + `\tЛот "${data.lotName}" был куплен участником ${data.winner} за ${data.lastBet}\n`)
            if (data.winnerId === parseInt($('#id').html())) {
                $('#balance').html('Баланс: ' + (parseInt($('#balance').html().slice(8)) - data.lastBet))
            }
        } else {
            $('#info').val($('#info').val() + data.time + `\tЛот "${data.lotName}" не был куплен\n`)
        }
        //очистить все
        $('#bet-info').css('display', 'none')
        $('#lot-info').css('display', 'none')
    })

    socket.on('finish', (data) => {
        $('#info').val($('#info').val() + data.time + `\tАукцион окончен\n`)
        $('#cur-event').html('Аукцион окончен')
    })

    $('#spin').spinner()
}

function makeBet() {
    socket.json.emit('bet', {id: parseInt($('#id').html()), bet: $('#spin').spinner('value')})
}

function secondsTimer(seconds) {
    setHtmlTimer(seconds)

    clearInterval(interval)
    interval = setInterval(() => {
        decSec()
    }, 1000)
}

function setTimer(datetime) {
    let dif = Math.floor((new Date(datetime) - new Date())/1000)
    setHtmlTimer(dif)

    interval = setInterval(() => {
        decSec()
    }, 1000)
}

function setHtmlTimer(seconds) {
    $('#days').html(Math.floor(seconds / (3600 * 24)))
    $('#hours').html(Math.floor((seconds%(3600 * 24))/3600))
    $('#minutes').html(Math.floor(seconds%(3600)/60))
    $('#seconds').html(seconds%60)
}

function decSec() {
    const secs = parseInt($('#seconds').html())
    if (secs === 0) {
        decMin()
    } else {
        $('#seconds').html('' + (secs - 1))
    }
}

function decMin() {
    const min = parseInt($('#minutes').html())
    if (min === 0) {
        decHour()
    } else {
        $('#minutes').html('' + (min - 1))
        $('#seconds').html('59')
    }
}

function decHour() {
    const h = parseInt($('#hours').html())
    if (h === 0) {
        decDay()
    } else {
        $('#hours').html('' + (h - 1))
        $('#minutes').html('59')
        $('#seconds').html('59')
    }
}

function decDay() {
    const d = parseInt($('#days').html())
    if (d > 0) {
        $('#days').html('' + (d - 1))
        $('#hours').html('23')
        $('#minutes').html('59')
        $('#seconds').html('59')
    } else {
        clearInterval(interval)
    }
}