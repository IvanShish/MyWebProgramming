// function showModal() {
//     $('#modalForm').modal('show')
//     $('#ownerWarning').css('visibility', 'hidden')
//     $('#dateBackWarning').css('visibility', 'hidden')
// }

function toBooksList() {
    window.location.href = '/library'
}

// function giveBook(book) {
//     const owner = $('#ownerInput').val()
//     const returnDate = $('#returnDateInput').val()
//     if (owner && returnDate) {
//         book.owner = owner
//         book.returnDate = returnDate
//         book.inStock = false
//         AJAXPut(book, putCallback)
//         $('#modalForm').modal('hide')
//     } else if(!owner) {
//         $('#dateBackWarning').css('visibility', 'hidden')
//         $('#ownerWarning').css('visibility', 'visible')
//     } else if(!returnDate) {
//         $('#ownerWarning').css('visibility', 'hidden')
//         $('#dateBackWarning').css('visibility', 'visible')
//     }
// }
//
// function returnBook(book) {
//     book.owner = ""
//     book.returnDate = ""
//     book.inStock = true
//     AJAXPut(book, putCallback)
// }

function saveBook(book) {
    book.name = $('#nameInput').val()
    book.author = $('#authorInput').val()
    book.year = $('#yearInput').val()
    if (!book.name || !book.author || !book.year) {
        $('#warning').css('display', 'block')
    } else {
        $('#warning').css('display', 'none')
        AJAXPut(book, putCallback)
    }
}

function AJAXPut(book, callback) {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {
            putCallback(book, this.responseText)
        }
    }
    xhttp.open('PUT', `/library/${book.id}`, true)
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