<?php

use app\models\User;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $user User */
/* @var $resetLink string */

?>
<div>

    <p>Hi <?= Html::encode($user->name) ?>,</p>

    <p>Clicca sul seguente link per resettare la password</p>

    <p><?= Html::a(Html::encode($resetLink), $resetLink) ?></p>

</div>
