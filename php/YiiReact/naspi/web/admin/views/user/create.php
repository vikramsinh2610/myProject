<?php


/* @var $this yii\web\View */
/* @var $model app\models\User */
/* @var $error string Error Message */

$this->title = Yii::t('app', 'Create User');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Users'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-create card">

    <?= ($error ? "<div class='alert alert-error'>$error</div>" : '') ?>

    <div class="card-body">
        <?= $this->render('_form', [
            'model' => $model,
        ]) ?>
    </div>

</div>
