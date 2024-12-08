<?php
/** @var $book ?Book */

use App\Model\Book;

?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="book[name]" value="<?= $book ? $book->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="book[author]" value="<?= $book ? $book->getAuthor() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="book[description]"><?= $book ? $book->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="number_of_pages">Number of Pages</label>
    <input type="number" id="number_of_pages" name="book[number_of_pages]" value="<?= $book ? $book->getNumberOfPages() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
