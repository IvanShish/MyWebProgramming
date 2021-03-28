$('document').ready(() => {
    init();
})

function init() {
    $.get('get-pics')
        .done((data) => {
            addPicturesToDoc(JSON.parse(data));
        })
}

function addPicturesToDoc(pictures) {
    let i = 0;
    for (let pic of pictures) {
        $('.slider').append(`<div class="${i}">`);
        $(`.${i}`).append(`<img data-lazy="${pic.srcSmall}" class="small_picture" onclick="window.location.href = 'paintings/${pic.id}'">`);
        i++;
    }
    $(".slider").slick({
        lazyLoad: "ondemand",
        centerMode: true,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1
    });
}