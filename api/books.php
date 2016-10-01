<?php

// main back-end entry point, the server part in client/server relationship

$dir = dirname(__FILE__);
include ($dir . '/src/DB.php');
include ($dir . '/src/Book.php');

$conn = DB::connect();
header('Content-Type: application/json');

/*
 * Implementation of REST API using four HTTP methods
 */

/*
 * GET
 */
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id']) && intval($_GET['id']) > 0) {
        // get single book
        $books = Book::loadFromDB($conn, intval($_GET['id']));
    } else {
        // get all books
        $books = Book::loadFromDB($conn);
    }

    echo json_encode($books); // return to front-end (app.js)
    
/*
 * POST
 */
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // validate input
    if (isset($_POST['title']) &&
            isset($_POST['author']) &&
            $_POST['description'] !== '') {
        $title = $_POST['title'];
        $author = $_POST['author'];
        $description = $_POST['description'];
        // create a new Book object
        $bookToAdd = new Book();
        $bookToAdd->setAuthor($author);
        $bookToAdd->setTitle($title);
        $bookToAdd->setDescription($description);
        if ($bookToAdd->create($conn) == true) {
            $bookToAdd->getId();  // if book has been added to db, get its id
            echo json_encode([json_encode($bookToAdd)]);  // return to front-end
        } else {
            echo json_encode('An error has occured.');
        }
    }
    
/*
 * PUT
 */
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);
//    echo print_r($put_vars); // enable to debug
    $id = $put_vars['id'];
    $title = $put_vars['title'];
    $author = $put_vars['author'];
    $description = $put_vars['description'];
    if (Book::update($conn, $id, $title, $author, $description) == true) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }

/*
 * DELETE
 */
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
//    echo json_encode($del_vars['id']); // enable to debug
    if (isset($del_vars['id']) && intval($del_vars['id']) > 0) {
        if (Book::deleteFromDB($conn, $del_vars['id']) == true) {
            echo json_encode(true);
        } else {
            echo json_encode(false);
        }
    }
}

