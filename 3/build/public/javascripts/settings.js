"use strict";

var settings = {};
$('document').ready(function () {
  init();
});

function init() {
  $.get('/admin/get-settings').done(function (data) {
    settings = JSON.parse(data);
    initInputs();
  });
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
    data: {
      settings: JSON.stringify(settings)
    },
    success: function success() {
      console.log('SUCCESS');
    },
    dataType: 'application/json'
  });
}