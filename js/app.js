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
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">"' + book.title + '"</h3>\
                                                                  <h5 data-id="' + book.id + '">' + book.author + '</h5>\
                                                                  <div class="description"></div>\
                                                                  <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                                                  <button class="update" data-id="' + book.id + '">Update</button>\
                                                                  <div id="updateForm" data-id="' + book.id + '"></div><br/>');
            $('#bookList').append(bookDiv);
        }
    }).fail(function () {
        console.log('Error');
    });

    //zakładamy event na kliknięcie na tytule, który rozwinie opis ksiązki
//    $('#bookList').on('click', $('.singleBook').find('h3'), function (e) {
    $('#bookList').on('click', '.singleBook > h3', function (e) {
        //jquery events on ajax load elements
        console.log(e.target);
        console.log(e.target.tagName);
        console.log(e.target.className);

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
            h3.next().next('.description').html(book.description);  // wstaw opis książki do diva za elementem h3 z tytułem
        }).fail(function () {
            console.log('Error');
        });
    });
/*
 * DELETE
 */
    $('#bookList').on('click', '.singleBook > button.delete', function (e) {

        var div = $(e.target);
        var bookId = div.attr('data-id');
        console.log(div);
        var confirmDelete = confirm('Are you sure you want to delete this book?');
        if (confirmDelete == true) {
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

    });
/*
 * UPDATE
 */
    $('#bookList').on('click', '.singleBook > button.update', function (e) {

        var btn = $(e.target);
        var bookId = btn.attr('data-id');
        console.log(btn);
        // wczytaj książkę z bazy (cały obiekt)
        $.ajax({
            url: 'api/books.php',
            type: 'GET',
            data: 'id=' + bookId,
            dataType: 'json'
        }).done(function (result) {
//            console.log('From backend: ' + result); //debug, result is an array with one JSON object (a book from DB)
            var book = JSON.parse(result[0]);
//            console.log(book); //debug, single book as an object, parsed result
            var divUpdateForm = btn.next('div#updateForm');
            console.log(divUpdateForm);
            divUpdateForm.html('<br/><form>\
                                    <input type="hidden" name="id" value="' + bookId + '">\
                                    <label>Title:</label>\
                                    <input type="text" name="title" id="updTitle"><br/>\
                                    <label>Author:</label>\
                                    <input type="text" name="author" id="updAuthor"><br/>\
                                    <label>Description:</label>\
                                    <textarea rows="4" cols="40" name="description" id="updDescription"<br/> \
                                    <input type="submit" value="Confirm">\
                                    </form>');

            divUpdateForm.append(divUpdateForm);
            // get form fields
            var form = divUpdateForm.find('form');
            var title = form.find('input#updTitle');
            var author = form.find('input#updAuthor');
            var description = form.find('textarea#updDescription');
            // insert data to update into form
            title.val(book.title);
            author.val(book.author);
            description.val(book.description);
            // set event listener on submit 
            form.submit(function (ev) {
                ev.preventDefault();
                var formData = $(ev.target).serialize();
                console.log('Form data: ' + formData); //debug
                // send data to back-end
                $.ajax({
                    url: 'api/books.php',
                    type: 'PUT',
                    data: formData,
                    dataType: 'json'
                }).done(function (result) {
                    console.log('From backend: ' + result);
                    var book = JSON.parse(result);
                    // remove the update form
                    divUpdateForm.empty(); // empty() to keep event listeners
                    // remove book div
                    var bookDiv = btn.parent();
                    bookDiv.empty();
                    bookDiv.html("asdfsdfsf");
                    bookDiv.html('<h3 data-id="' + book.id + '">"' + book.title + '"</h3>\
                                  <h5 data-id="' + book.id + '">' + book.author + '</h5>\
                                  <div class="description"></div>\
                                  <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                  <button class="update" data-id="' + book.id + '">Update</button>\
                                  <div id="updateForm" data-id="' + book.id + '"></div><br/>');

                }).fail(function (error) {
                    console.log('Error: ' + error.responseText);
                });
            });



        }).fail(function () {
            console.log('Error');
        });


    });
/*
 * Form to add a new book
 */
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
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">"' + book.title + '"</h3>\
                                                                  <h5 data-id="' + book.id + '">' + book.author + '</h5>\
                                                                  <div class="description"></div>\
                                                                  <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                                                  <button class="update" data-id="' + book.id + '">Update</button>\
                                                                  <div id="updateForm" data-id="' + book.id + '"></div><br/>');
            $('#bookList').append(bookDiv);
            // clear the input form for another book
            $('input:not([type="submit"])').val('');
            $('textarea#description').val('');


//            window.setTimeout(function(){location.reload()},3000);
        }).fail(function (error) {
            console.log('Error: ' + error.responseText);
        });


    });



});