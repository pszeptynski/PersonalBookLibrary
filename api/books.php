<?php

// łączymy się do books.php  AJAXem

$dir = dirname(__FILE__);
include ($dir . '/src/DB.php');
include ($dir . '/src/Book.php');

$conn = DB::connect();
header('Content-Type: application/json');  // wyłączać do sprawdzania var_dump($_POST), bo cuda wyświetla




if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id']) && intval($_GET['id']) > 0) { // to jest id przekazane ajaksem!
        // pobieramy pojedyńczą ksiązkę
        $books = Book::loadFromDB($conn, intval($_GET['id']));
    } else {
        // pobieramy wszystkie książki
        $books = Book::loadFromDB($conn);
    }

    echo json_encode($books); // wypluj wynik (do app.js)
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
//    var_dump($_POST);
    // walidacja, chociaz formularz nie przepuści pustych pól
    if (isset($_POST['title']) &&
            isset($_POST['author']) &&
            $_POST['description'] !== '') {
//        echo 'dane ok'; // żadnych takich czystych tekstów, bo errory będą
        $title = $_POST['title'];
        $author = $_POST['author'];
        $description = $_POST['description'];
        // stworzyć obiekt nowej książki
        $bookToAdd = new Book();
        $bookToAdd->setAuthor($author);
        $bookToAdd->setTitle($title);
        $bookToAdd->setDescription($description);
        if ($bookToAdd->create($conn) == true) {
            $bookToAdd->getId();  // if book added to db, get its id
            echo json_encode([json_encode($bookToAdd)]);
//            echo json_encode($bookToAdd); // return new book object
//            echo json_encode('Book "' . $title . '" by ' . $author . ' has been added to the library.');
        } else {
            // to inaczej jakoś rozwiązać
            echo json_encode('An error has occured.');
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);
    var_dump($put_vars);
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    var_dump($del_vars);
}

    