let settings = {};

$('document').ready(() => {
    init();
})

function init() {
    $.get('/admin/get-settings')
        .done((data) => {
            settings = JSON.parse(data);
            initInputs();
        })
}

function initInputs() {
    $('#datetime-input').val(settings.datetime);
    $('#timeout-input').val(settings.timeout);
    $('#pause-input').val(settings.pause);
}

function save() {
    settings.datetime = $('#datetime-input').val();
    settings.timeout = $('#timeout-input').val();
    settings.pause = $('#pause-input').val();

    $.ajax({
        type: "POST",
        url: '/admin/save-settings',
        data: {settings: JSON.stringify(settings)},
        success: function () {
            console.log('SUCCESS');
        },
        dataType: 'application/json'
    });
}