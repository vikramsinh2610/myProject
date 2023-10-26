<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Naspi */

$this->title = 'Create Naspi';
$this->params['breadcrumbs'][] = ['label' => 'Naspi', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="naspi-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
