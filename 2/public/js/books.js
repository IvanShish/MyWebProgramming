function updateTable(books) {
    const table = document.getElementById('books_table')

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let html =
        "<thead>" +
        "<tr>" +
        '<th scope="col">Название книги' +
        '<th scope="col">Автор</th>' +
        '<th scope="col">Год публикации</th>' +
        '<th scope="col">В наличии?</th>' +
        '<th scope="col">Возврат просрочен?</th>' +
        '<th scope="col"></th>' +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    for(let book of books) {
        if (book.isActive) {
            html +=
                `<tr id="book${book.id}">` +
                // `<th scope="col">${book.name}</th>` +
                `<td>${book.name}</td>` +
                `<td>${book.author}</td>` +
                `<td>${book.year}</td>` +
                `<td>${book.inStock ? "Да" : "Нет"}</td>` +
                `<td>${+(Date.parse(book.returnDate)) <= +new Date ? "Да" : "Нет"}</td>` +
                '<td>' +
                '<div class="btn-group">' +
                `<button class="editBookButton" type="button" onclick="editBook(${book.id})">Изменить данные</button>` +
                `<button class="deleteBookButton" type="button" onclick="deleteBook(${book.id})">Удалить</button>`;

            if (book.id >= 0 && book.owner) {
                html += `<button class='returnToLibraryButton' type="button" style="display: block" onclick="returnBook(${JSON.stringify(book)})"}>Вернуть в библиотеку</button>` +
                    `<button class='giveBookButton' type="button" style="display: none" onclick="showModal(${JSON.stringify(book)})">Выдать книгу</button>`;
            }
            else {
                html += `<button class='returnToLibraryButton' type="button" style="display: none" onclick="returnBook(${JSON.stringify(book)})"}>Вернуть в библиотеку</button>` +
                    `<button class='giveBookButton' type="button" style="display: block" onclick="showModal(${JSON.stringify(book)})">Выдать книгу</button>`;
            }
            html +=  '</div>' +
                '</td>' +
                '</tr>'
        }
    }

    html +=  "</tbody>"
    table.innerHTML = html
}

function showAllBooks() {
    window.location.reload();
    AJAXGet(0, getCallback)
}

function showAvailableBooks() {
    AJAXGet(1, getCallback)
}

function showExpiredBooks() {
    AJAXGet(2, getCallback)
}

function editBook(bookID) {
    window.location.href = '/library/' + bookID
}

function addBook() {
    window.location.href = '/library/-1'
}

function deleteBook(bookID) {
    AJAXDel(bookID, deleteCallback)
}

function getCallback(res) {
    try {
        const response = JSON.parse(res)
        if (!response.error) {
            updateTable(response.books)
        }
    } catch (e) {
        console.log('Ошибка: ' + e)
    }
}

function deleteCallback(id, res) {
    try {
        const response = JSON.parse(res)
        if (!response.error) {
            const tr = document.getElementById('book' + id)
            tr.parentElement.removeChild(tr)
        }
    } catch (e) {
        console.log('Ошибка: ' + e)
    }
}

function AJAXGet(value, callback) {
    const xhttp = new XMLHttpRequest()  //асинхронный запрос
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {    //4 - обработка запроса завершена, 200 - успешная обработка запроса
            callback(this.responseText)     //responseText - ответ от сервера
        }
    }
    xhttp.open('GET', `/library/sorted/${value}`, true)
    xhttp.send()    //отправка настроенного запроса
}

function AJAXDel(id, callback) {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {
            callback(id, this.responseText)
        }
    }
    xhttp.open('DELETE', `/library/${id}`, true)
    xhttp.send()
}

function showModal(book) {
    $('#modalForm').modal('show')
    $('#ownerWarning').css('visibility', 'hidden')
    $('#dateBackWarning').css('visibility', 'hidden')
    AJAXPut(book, getCallback)
    const id = document.querySelector(".idOfBook");
    id.id = book.id;
    // id.innerHTML = book.id;
    AJAXGet(0, getCallback)
}

function giveBook(data) {
    const id = document.querySelector(".idOfBook");
    const value = parseInt(id.id);
    const owner = $('#ownerInput').val()
    const returnDate = $('#returnDateInput').val()

    let book;
    for(let bookk of data) {
        if (bookk.id === value) {
            book = bookk;
            break;
        }
    }

    if (owner && returnDate) {
        book.owner = owner
        book.returnDate = returnDate
        book.inStock = false
        AJAXPut(book, putCallback)
        $('#modalForm').modal('hide')
    } else if(!owner) {
        $('#dateBackWarning').css('visibility', 'hidden')
        $('#ownerWarning').css('visibility', 'visible')
    } else if(!returnDate) {
        $('#ownerWarning').css('visibility', 'hidden')
        $('#dateBackWarning').css('visibility', 'visible')
    }
    window.location.reload();
    AJAXGet(0, getCallback)
}

function returnBook(book) {
    console.log(book);
    book.owner = ""
    book.returnDate = ""
    book.inStock = true
    AJAXPut(book, putCallback)
    AJAXGet(0, getCallback)
    window.location.reload();
}

function AJAXPut(book, callback) {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {
            putCallback(book, this.responseText)
        }
    }
    xhttp.open('PUT', `/library`, true)
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhttp.send(`book=${JSON.stringify(book)}`)
}

function putCallback(book, res) {
    try {
        let response;
        if (res) {
            response = JSON.parse(res)
        }
        else response = "";
        if (!response.error) {
            $('#nameInput').val(book.name)
            $('#authorInput').val(book.author)
            $('#yearInput').val(book.year)
            if (book.owner) {
                $('#owner').html('Текущий обладатель книги: ' + book.owner).css('display', 'block')
                $('#returnDate').html('Дата возврата: ' + book.returnDate).css('display', 'block')
                $('.returnToLibraryButton').css('display', 'block')
                $('.giveBookButton').css('display', 'none')
                // $('.saveBookButton').attr('disabled', true);
            } else {
                $('#owner').css('display', 'none')
                $('#returnDate').css('display', 'none')
                $('.returnToLibraryButton').css('display', 'none')
                $('.giveBookButton').css('display', 'block')
                // $('.saveBookButton').attr('disabled', false);
            }
        }
    } catch (e) {
        console.log('Ошибка: ' + e)
    }
}