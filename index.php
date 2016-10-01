<html>
    <head>
        <title>Public Library</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
        <script type="text/JavaScript" src="./js/app.js"></script>
    </head>
    <body>
        <form method="POST" action="api/books.php">
            <fieldset style=" width: 100%">
                <legend>Add a new book to the library:</legend>
                <label>Title:</label>
                <input type="text" name="title" id="title" placeholder="The Catcher in the Rye" required><br>
                <label>Author:</label>
                <input type="text" name="author" id="author" placeholder="J.D. Salinger" required><br>
                <label>Description:</label>
                <textarea rows="4" cols="40" name="description" id="description" placeholder="Depiction of adolescent alienation and loss of innocence in the protagonist Holden Caulfield." required></textarea>
                <input type="submit" value="Submit" id="submitBtn">
            </fieldset>
        </form>
        <div id="bookAdded">
            <!-- info about book addition to db -->
        </div>
        <div id="bookList">
            <!-- All books got from db appear here -->
        </div>

    </body>


</html>
