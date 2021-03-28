let id = -1;
let imageInfo = {};
$('document').ready(() => {
    init();
})

function init() {
    let dirs = window.location.href.split('/');
    let pathEnd = dirs[dirs.length - 1].split('?')[0];
    id = parseInt(pathEnd);
    getImageInfo();
}

function getImageInfo() {
    $.get(`/admin/get-pic/${id}`)
        .done((data) => {
            imageInfo = JSON.parse(data);
            initImage();
            initInputs();
        })
}

function initImage() {
    $('#pic').attr('src', imageInfo.src);
}

function initInputs() {
    $('#name-input').val(imageInfo.name);
    $('#author-input').val(imageInfo.author);
    $('#description-input').val(imageInfo.description);
    $('#start-price-input').val(imageInfo.startPrice);
    $('#min-step-input').val(imageInfo.minStep);
    $('#max-step-input').val(imageInfo.maxStep);
    $('#active-cb').prop('checked', imageInfo.isActive);
}

function save() {
    imageInfo.name = $('#name-input').val();
    imageInfo.author = $('#author-input').val();
    imageInfo.description = $('#description-input').val();
    imageInfo.startPrice = parseInt($('#start-price-input').val());
    imageInfo.minStep = parseInt($('#min-step-input').val());
    imageInfo.maxStep = parseInt($('#max-step-input').val());
    imageInfo.isActive = $('#active-cb').prop('checked');

    $.ajax({
        type: "POST",
        url: `/admin/paintings/${id}`,
        data: {img: JSON.stringify(imageInfo)},
        success: function () {
            console.log('SUCCESS');
        },
        dataType: 'application/json'
    });
}

function changeImg() {
    let fd = new FormData;
    fd.append('img', $('#pic-input').prop('files')[0]);

    $.ajax({
        url: `/admin/loadimage/${id}`,
        data: fd,
        type: 'POST',
        processData: false,
        contentType: false,
        success: (data) => {
            imageInfo.src = data.src;
            initImage();
        }
    })
}

function changeMiniImg() {
    let fd = new FormData;
    fd.append('img', $('#pic-min-input').prop('files')[0]);

    $.ajax({
        url: `/admin/load-mini-image/${id}`,
        data: fd,
        type: 'POST',
        processData: false,
        contentType: false,
        success: (data) => {
            imageInfo.srcSmall = data.srcSmall;
        }
    })
}