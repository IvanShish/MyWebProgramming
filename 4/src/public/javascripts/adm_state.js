$('document').ready(() => {
    socket = io.connect('http://localhost:3030')

    socket.on('aucBeginning', (time) => {
        $('#info').val($('#info').val() + time + '\tАукцион начался\n')
    })

    socket.on('pause', (data) => {
        $('#info').val($('#info').val() + data.time + `\tПауза на ознакомление с лотом ${data.image.name}\n`)
    })

    socket.on('betBeginning', (data) => {
        $('#info').val($('#info').val() + data.time + `\tНачались торги за лот ${data.image.name}\n`)
    })

    socket.on('betMade', (data) => {
        $('#info').val($('#info').val() + data.time + `\tУчастник ${data.lastOwner} сделал ставку ${data.bet}\n`)
    })

    socket.on('betEnded', (data) => {
        if (data.lastBet) {
            $('#info').val($('#info').val() + data.time + `\tЛот ${data.lotName} был куплен участником ${data.winner} за ${data.lastBet}\n`)
        } else {
            $('#info').val($('#info').val() + data.time + `\tЛот ${data.lotName} не был куплен\n`)
        }
        //change html
        $(`#tr${data.lotId} .lastBet`).html(`${data.lastBet ? data.lastBet : '-'}`)
        $(`#tr${data.lotId} .lastOwner`).html(`${data.winner ? data.winner : '-'}`)
    })

    socket.on('finish', (data) => {
        $('#info').val($('#info').val() + data.time + `\tАукцион окончен\n`)
    })
})

function refresh_buyer(dataImg) {
    for (const img of dataImg) {
        img.lastBet = "";
        img.lastOwnerId = -1;
    }
    $.ajax({
        type: "POST",
        url: '/admin/adm_state/refresh_buyer',
        data: {images: JSON.stringify(dataImg)},
        success: function () {
            console.log('SUCCESS');
        },
        dataType: 'application/json'
    });
    window.location.reload();
}