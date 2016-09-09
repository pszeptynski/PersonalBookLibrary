// nie działa, poprawić plik, porównać

$(function () {
    // pobieramy całą listę books  z bazy i dodajemy na stronę

    $.ajax({
        url: 'api/books.php', // bez data, bo chcemy all books
        type: 'GET',
        dataType: 'json'
    }).done(function (result) {
//        console.log(result);
        for (var i = 0; i < result.length; i++) {
            var book = JSON.parse(result[i]);
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id"' + book.title + '</h3>'); // dokonczyc wyswietlanie
            $('#bookList').append(bookDiv);
        }

    }).fail(function () {
        console.log('Error');
    });





    $('#bookList').on('click', $('singleBook').find('h3'), function () {
        console.log('klik');
        var h3 = $(e.target);
        var bookID = h3.attr('data-id');
        console.log(bookID);

        $.ajax({
        url: 'api/books.php', // bez data, bo chcemy all books
        type: 'GET',
        data: 'id=' + bookID,
        dataType: 'json'
    }).done(function (result) {
//        console.log(result);

    }).fail(function () {
        console.log('Error');
    });



    });



});