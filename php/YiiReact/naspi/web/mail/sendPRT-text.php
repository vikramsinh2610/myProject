<?php

/* @var $this yii\web\View */
/* @var $user User */
/* @var $resetLink string */

use app\models\User;

?>
Ciao <?= $user->name ?>,

Clicca sul seguente link per resettare la password

<?= $resetLink ?>
