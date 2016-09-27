$(function () {
    //pobieramy cala liste books z bazy i dodajemy na strone
    $.ajax({
        url: 'api/books.php', //bez data bo chcemy all books
        type: 'GET',
        dataType: 'json'
    }).done(function (result) {
//        console.log('From backend: ' + result); //debug, here you get array of JSON objects taken from DB via books.php
        for (var i = 0; i < result.length; i++) {
            var book = JSON.parse(result[i]);  // every book is a JSON object stored in result array, so we get it and convert to JS object
//            console.log('Parsed JSON: ' + book) //debug
//            console.log(book) //debug
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">' + book.title + '</h3>\
                                                                  <div class="description"></div>\
                                                                  <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                                                  <button class="update" data-id="' + book.id + '">Update</button>');
            $('#bookList').append(bookDiv);
        }
    }).fail(function () {
        console.log('Error');
    });

    //zakładamy event na kliknięcie na tytule, który rozwinie opis ksiązki
    $('#bookList').on('click', $('.singleBook').find('h3'), function (e) {
        //jquery events on ajax load elements
//        console.log(e.target.tagName);
//        console.log(e.target.className);

        if (e.target.tagName === 'H3') {
            var h3 = $(e.target);
            var bookId = h3.attr('data-id');

            $.ajax({
                url: 'api/books.php',
                type: 'GET',
                data: 'id=' + bookId, // tutaj już z data, bo potrzebujemy książkę o konkretnym id
                dataType: 'json'
            }).done(function (result) {
//            console.log('From backend: ' + result); //debug, result is an array with one JSON object (a book from DB)
                var book = JSON.parse(result[0]);
//            console.log(book); //debug, single book as an object, parsed result
                h3.next('.description').html(book.description);  // wstaw opis książki do diva za elementem h3 z tytułem
            }).fail(function () {
                console.log('Error');
            });
        }

        if (e.target.className === 'delete') {

            var div = $(e.target);
            var bookId = div.attr('data-id');

            $.ajax({
                url: 'api/books.php',
                type: 'DELETE',
                data: 'id=' + bookId,
                dataType: 'json'
            }).done(function (result) {
                console.log('From backend: ' + result);
                var removeElement = div.parent();
                console.log(removeElement);
                removeElement.remove();
            }).fail(function (error) {
                console.log('Error: ' + error.responseText);
            });
        }

        if (e.target.className === 'update') {

            var div = $(e.target);
            var bookId = div.attr('data-id');

            $.ajax({
                url: 'api/books.php',
                type: 'PUT',
                data: 'id=' + bookId,
                dataType: 'json'
            }).done(function (result) {
                console.log('From backend: ' + result);
                // Tutaj wymyślec jak obrabiac ten update
                // nowy formularz gdzieś poniżej otworzyć, czy wrzucać na góre
                // ale wtedy bez senus przewijanie z końca
                // 
//                var removeElement = div.parent();
//                console.log(removeElement);
//                removeElement.remove();
            }).fail(function (error) {
                console.log('Error: ' + error.responseText);
            });
        }


    });

    // event na kliknięcie na przycisku submit
//    $('#submitBtn').on('click', function (e) {
    // event na formularzu, co daje szanse, żeby html wstępnie walidował wypełnienie pól
    $('form').submit(function (e) {
        e.preventDefault(); // zablokuj domyślny submit
//        var formData = $('form').serialize(); // weź wszystkie pola z formularza i serializuj
        // wersja druga
        var formData = $(e.target).serialize();
        console.log('Form data: ' + formData); //debug
        $.ajax({
            url: 'api/books.php',
            type: 'POST',
            data: formData,
            dataType: 'json'
        }).done(function (result) {
            console.log('From backend: ' + result);
            // tutaj info o dodaniu lub nie, ksiązki w divie #bookAdded
            $('#bookAdded').html('The book has been added to the library.');
            var book = JSON.parse(result);
            console.log(book); // debug, parsed json object
//            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">' + book.title + '</h3><div class="description"></div>');
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">' + book.title + '</h3>\
                                                      <div class="description"></div>\
                                                      <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                                      <button class="update" data-id="' + book.id + '">Update</button>');

            $('#bookList').append(bookDiv);
            // clear the input form for anotother book
            $('input:not([type="submit"])').val('');
            $('textarea#description').val('');


//            window.setTimeout(function(){location.reload()},3000);
//            $('#bookList').load(document.URL +  ' #bookList');
//            $("#bookList").replaceWith($('#bookList', $(html)));
        }).fail(function (error) {
            console.log('Error: ' + error.responseText);
        });


    });



});