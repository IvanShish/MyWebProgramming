let participants;

$('document').ready(() => [
    init()
])

function init() {
    $.get('get-participants')
        .done((data) => {
            participants = JSON.parse(data)
            createTable();
        })
}

function createTable() {
    const table = $('#ptable');
    for (let i = 0; i < participants.length; i++) {
        table.append(`<tr><td><input class="form-input" type="text" value="${participants[i].name}", required></td><td><input class="form-input" type="number" value="${participants[i].money}", required></td><td><div class="delete-button-container" onclick="deleteParticipant(this)"><div class="delete-cube-button">Удалить</div></div></td></tr>`);
    }
}

function deleteParticipant(participant) {
    participant.parentElement.parentElement.remove()
}

function addParticipant() {
    $('#ptable').append('<tr><td><input class="form-input name-input" type="text", required></td><td><input class="form-input money-input" type="number", required></td><td><div class="delete-button-container" onclick="deleteParticipant(this)"><div class="delete-cube-button">Удалить</div></div></td></tr>')
}

function save() {
    const resArr = [];

    $('table tr').each((index, tr) => {
        if (index > 0) {
            resArr.push({
                name : tr.children[0].children[0].value,
                money: tr.children[1].children[0].value
            })
        }
    })

    $.ajax({
        type: "POST",
        url: '/admin/save-participants',
        data: {participants: JSON.stringify(resArr)},
        success: function () {
            console.log('SUCCESS');
        },
        dataType: 'application/json'
    });
}