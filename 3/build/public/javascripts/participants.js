"use strict";

var participants;
$('document').ready(function () {
  return [init()];
});

function init() {
  $.get('get-participants').done(function (data) {
    participants = JSON.parse(data);
    createTable();
  });
}

function createTable() {
  var table = $('#ptable');

  for (var i = 0; i < participants.length; i++) {
    table.append("<tr><td><input class=\"form-input\" type=\"text\" value=\"".concat(participants[i].name, "\", required></td><td><input class=\"form-input\" type=\"number\" value=\"").concat(participants[i].money, "\", required></td><td><div class=\"delete-button-container\" onclick=\"deleteParticipant(this)\"><div class=\"delete-cube-button\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</div></div></td></tr>"));
  }
}

function deleteParticipant(participant) {
  participant.parentElement.parentElement.remove();
}

function addParticipant() {
  $('#ptable').append('<tr><td><input class="form-input name-input" type="text", required></td><td><input class="form-input money-input" type="number", required></td><td><div class="delete-button-container" onclick="deleteParticipant(this)"><div class="delete-cube-button">Удалить</div></div></td></tr>');
}

function save() {
  var resArr = [];
  $('table tr').each(function (index, tr) {
    if (index > 0) {
      resArr.push({
        name: tr.children[0].children[0].value,
        money: tr.children[1].children[0].value
      });
    }
  });
  $.ajax({
    type: "POST",
    url: '/admin/save-participants',
    data: {
      participants: JSON.stringify(resArr)
    },
    success: function success() {
      console.log('SUCCESS');
    },
    dataType: 'application/json'
  });
}