<?php

class Book implements JsonSerializable {

    private $id;
    private $title;
    private $author;
    private $description;

    public function __construct() {
        $this->id = -1;
        $this->title = '';
        $this->author = '';
        $this->description = '';
    }

    function getId() {
        return $this->id;
    }

    function getTitle() {
        return $this->title;
    }

    function getAuthor() {
        return $this->author;
    }

    function getDescription() {
        return $this->description;
    }

    function setTitle($title) {
        $this->title = $title;
    }

    function setAuthor($author) {
        $this->author = $author;
    }

    function setDescription($description) {
        $this->description = $description;
    }

    public function create(mysqli $conn) {
        
    }

    public function update(mysql $conn, $id) {
        
    }

    public static function loadFromDB(mysqli $conn, $id = null) {
        if (!is_null($id)) {
            $result = $conn->query("SELECT * FROM books WHERE id='" . $id . "'");
        } else {
            $result = $conn->query("SELECT * FROM books");
        }
        $booksList = [];
        if ($result && $result->num_rows > 0) {
            foreach ($result as $row) {
                $dbBook = new Book();
                $dbBook->id = $row['id'];
                $dbBook->title = $row['title'];
                $dbBook->author = $row['author'];
                $dbBook->description = $row['description'];
                $booksList[] = json_encode($dbBook);   // klasa Book musi mieć zaimplementowany interface, bo inaczej nie możemy do json_encode przekazać obiektu klasy
            }
        }
        
        return $booksList;
    }

    public static function deleteFromDB(mysqli $conn, $id = null) {
        
    }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'description' => $this->description
        ];
    }

}
