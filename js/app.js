$(function () {
    // get all the books from db and display them
    $.ajax({
        url: 'api/books.php',
        type: 'GET',
        dataType: 'json'
    }).done(function (result) {
        for (var i = 0; i < result.length; i++) {
            var book = JSON.parse(result[i]);
            var bookDiv = $('<div>').addClass('singleBook').html('<h3 data-id="' + book.id + '">"' + book.title + '"</h3>\
                                                                  <h5 data-id="' + book.id + '">' + book.author + '</h5>\
                                                                  <div class="description"></div>\
                                                                  <button class="delete" data-id="' + book.id + '">Delete from DB</button>\
                                                                  <button class="update" data-id="' + book.id + '">Update</button>\
                                                                  <div id="updateForm" data-id="' + book.id + '"></div><br/>');
            $('#bookList').append(bookDiv);
        }
    }).fail(function () {
        console.log('Error: ' + error.responseText);
    });

    // event on book's title
    $('#bookList').on('click', '.singleBook > h3', function (e) {
        var h3 = $(e.target);
        var bookId = h3.attr('data-id');

        $.ajax({
            url: 'api/books.php',
            type: 'GET',
            data: 'id=' + bookId,
            dataType: 'json'
        }).done(function (result) {
            var book = JSON.parse(result[0]);
            // insert description in its div
            h3.next().next('.description').html('<p>' + book.description + '</p>');
        }).fail(function () {
            console.log('Error: ' + error.responseText);
        });
    });
/*
 * DELETE
 */
    $('#bookList').on('click', '.singleBook > button.delete', function (e) {
        var div = $(e.target);
        var bookId = div.attr('data-id');
        var confirmDelete = confirm('Are you sure you want to delete this book?');
        if (confirmDelete == true) {
            $.ajax({
                url: 'api/books.php',
                type: 'DELETE',
                data: 'id=' + bookId,
                dataType: 'json'
            }).done(function (result) {
//                console.log('From backend: ' + result); // enable for debug
                var removeElement = div.parent();
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
        // get book from db
        $.ajax({
            url: 'api/books.php',
            type: 'GET',
            data: 'id=' + bookId,
            dataType: 'json'
        }).done(function (result) {
//            console.log('From backend: ' + result); // enable for debug
            var book = JSON.parse(result[0]);
            var divUpdateForm = btn.next('div#updateForm');
            //create update form
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
                // send data to back-end
                $.ajax({
                    url: 'api/books.php',
                    type: 'PUT',
                    data: formData,
                    dataType: 'json'
                }).done(function (result) {
//                    console.log('From backend: ' + result); // enable for debug
                    var book = JSON.parse(result);
                    // remove the update form
                    divUpdateForm.empty(); // empty() to keep event listeners
                    // refresh displayed book
                    var bookDiv = btn.parent();
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

        }).fail(function (error) {
            console.log('Error: ' + error.responseText);
        });


    });
/*
 * Form to add a new book
 */
    // event listener on submit button
    $('form').submit(function (e) {
        e.preventDefault();
        var formData = $(e.target).serialize();

        $.ajax({
            url: 'api/books.php',
            type: 'POST',
            data: formData,
            dataType: 'json'
        }).done(function (result) {
//            console.log('From backend: ' + result); // enable for debug
            $('#bookAdded').html('The book has been added to the library.');
            var book = JSON.parse(result);
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

        }).fail(function (error) {
            console.log('Error: ' + error.responseText);
        });
    });

});
