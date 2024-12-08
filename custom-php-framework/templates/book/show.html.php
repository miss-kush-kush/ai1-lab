<?php

/** @var \App\Model\Book $book */
/** @var \App\Service\Router $router */

$title = "{$book->getName()} ({$book->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $book->getName() ?></h1>
    <article>
        <p><strong>Author:</strong> <?= $book->getAuthor(); ?></p>
        <p><strong>Description:</strong></p>
        <p><?= $book->getDescription(); ?></p>
        <p><strong>Number of Pages:</strong> <?= $book->getNumberOfPages(); ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('book-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('book-edit', ['id'=> $book->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
