<?php

// łączymy się do books.php  AJAXem

$dir = dirname(__FILE__);
include ($dir . '/src/DB.php');
include ($dir . '/src/Book.php');

$conn = DB::connect();
header('Content-Type: application/json');




if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id']) && intval($_GET['id']) > 0) {
        // pobieramy pojedyńczą ksiązkę
        $books = Book::loadFromDB($conn, intval($_GET['id']));
    } else {
        // pobieramy wszystkie książki
        $books = Book::loadFromDB($conn);
    }

    echo json_encode($books);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //var_dump($_POST);
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);
    //var_dump($put_vars);
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    //var_dump($del_vars);
}

