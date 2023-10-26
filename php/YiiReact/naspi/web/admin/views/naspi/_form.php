<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Naspi */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="naspi-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'id')->textInput() ?>

    <?= $form->field($model, 'client_id')->textInput() ?>

    <?= $form->field($model, 'status')->textInput() ?>

    <?= $form->field($model, 'home_address')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'home_city')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'home_cap')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'home_province')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'marital_status')->textInput() ?>

    <?= $form->field($model, 'marital_date')->textInput() ?>

    <?= $form->field($model, 'iban')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'last_work_date')->textInput() ?>

    <?= $form->field($model, 'vat')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'income')->textInput() ?>

    <?= $form->field($model, 'info')->textarea(['rows' => 6]) ?>

    <?= $form->field($model, 'document_file_front')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'document_file_rear')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'code_file_front')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'code_file_rear')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'pay_file')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'work_file')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'more_file')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'indt')->textInput() ?>

    <?= $form->field($model, 'inuser')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'updt')->textInput() ?>

    <?= $form->field($model, 'upuser')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?= Html::submitButton('Save', ['class' => 'btn btn-success']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
