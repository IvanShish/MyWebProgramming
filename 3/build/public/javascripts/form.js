"use strict";

var id = -1;
var imageInfo = {};
$('document').ready(function () {
  init();
});

function init() {
  var dirs = window.location.href.split('/');
  var pathEnd = dirs[dirs.length - 1].split('?')[0];
  id = parseInt(pathEnd);
  getImageInfo();
}

function getImageInfo() {
  $.get("/admin/get-pic/".concat(id)).done(function (data) {
    imageInfo = JSON.parse(data);
    initImage();
    initInputs();
  });
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
    url: "/admin/paintings/".concat(id),
    data: {
      img: JSON.stringify(imageInfo)
    },
    success: function success() {
      console.log('SUCCESS');
    },
    dataType: 'application/json'
  });
}

function changeImg() {
  var fd = new FormData();
  fd.append('img', $('#pic-input').prop('files')[0]);
  $.ajax({
    url: "/admin/loadimage/".concat(id),
    data: fd,
    type: 'POST',
    processData: false,
    contentType: false,
    success: function success(data) {
      imageInfo.src = data.src;
      initImage();
    }
  });
}

function changeMiniImg() {
  var fd = new FormData();
  fd.append('img', $('#pic-min-input').prop('files')[0]);
  $.ajax({
    url: "/admin/load-mini-image/".concat(id),
    data: fd,
    type: 'POST',
    processData: false,
    contentType: false,
    success: function success(data) {
      imageInfo.srcSmall = data.srcSmall;
    }
  });
}