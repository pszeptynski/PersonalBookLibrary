$(function () {
    //pobieramy cala liste books z bazy i dodajemy na strone
    $.ajax({
        url: 'api/books.php', //bez data bo chcemy all books
        type: 'GET',
        dataType: 'json'
    }).done(function (result) {
        for (var i = 0; i < result.length; i++) {
            var book = JSON.parse(result[i]);
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">' + book.title + '</h3><div class="description"></div>');
            $('#bookList').append(bookDiv);
        }
    }).fail(function () {
        console.log('Error');
    });

    //zakładamy event na kliknięcie na tytule, który rozwinie opis ksiązki
    $('#bookList').on('click', $('.singleBook').find('h3'), function (e) {
        //jquery events on ajax load elements
        var h3 = $(e.target);
        var bookId = h3.attr('data-id');

        $.ajax({
            url: 'api/books.php',
            type: 'GET',
            data: 'id=' + bookId, // tutaj już z data, bo potrzebujemy książkę o konkretnym id
            dataType: 'json'
        }).done(function (result) {
            var book = JSON.parse(result[0]);
            h3.next('.description').html(book.description);  // wstaw opis książki do diva za elementem h3 z tytułem
        }).fail(function () {
            console.log('Error');
        });
    });
    
    // event na kliknięcie na przycisku submit
    $('#submitBtn').on('click', function (e) {
        e.preventDefault(); // zablokuj domyślny submit
        
        var formData = $('form').serialize(); // wszystkie pola formularza i serializuj
        console.log(formData);
        $.ajax({
            url: 'api/books.php',
            type: 'POST',
            data: formData,
            dataType: 'json'
        }).done(function (result) {
            console.log(result);
            // tutaj info o dodaniu lub nie, ksiązki w divie #bookAdded
//            $('#bookAdded').html('The book has been added to library.');
            $('#bookAdded').html(result);
        }).fail(function (error) {
            console.log('Error: ' + error);
        });
        
        
    });
    
    
    
});