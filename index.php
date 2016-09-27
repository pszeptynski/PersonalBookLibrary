<html>
    <head>
        <title>Public Library</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
        <script type="text/JavaScript" src="./js/app.js"></script>
    </head>
    <body>
        <!--<form method="POST" action="#" >-->
        <form method="POST" action="api/books.php">
            <fieldset style=" width: 100%">
                <legend>Add a new book to the library:</legend>
                <label>Title:</label>
                <input type="text" name="title" id="title" placeholder="Przygody młota Thora" required><br>
                <label>Author:</label>
                <input type="text" name="author" id="author" placeholder="Odyniec syn Odyna" required><br>
                <label>Description:</label>
                <!--<input type="text" name="description" id="description" required><br>-->
                <textarea rows="3" cols="30" name="description" id="description" placeholder="Kolejna część sagi." required></textarea>
                <input type="submit" value="Submit" id="submitBtn">
            </fieldset>
        </form>
        <div id="bookAdded">
            <!-- info czy dodanie książki się udało -->
        </div>
        <div id="bookList">
            <!-- tu będą ksiązki z bazy przesłąne AJAXem -->
        </div>

    </body>


</html>
