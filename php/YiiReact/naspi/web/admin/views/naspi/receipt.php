<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Naspi */

$this->title = 'Naspi Receipt: ' . $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Naspi', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="naspi-receipt">
    <div class="naspi-form">
        <div class="page-header min-height-300 border-radius-xl"
            style="background-image: url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=80');">
            <span class="mask  bg-gradient-primary  opacity-6"></span>
        </div>
        <div class="card card-body mx-3 mx-md-4 mt-n6">
            <div class="row gx-4 mb-2">
                <div class="col-auto">
                    <div class="avatar avatar-xl position-relative">
                        <img src="/images/demo-profile-image.webp" alt="profile_image"
                            class="w-100 border-radius-lg shadow-sm">
                    </div>
                </div>
                <div class="col-auto my-auto">
                    <div class="h-100">
                        <h5 class="mb-1">
                            <?= $user->surname ?> <?= $user->name ?>
                        </h5>
                        <p class="mb-0 font-weight-normal text-sm">
                            CEO / Co-Founder
                        </p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-xl-4">
                    <?= $this->render(
                        '/user/_info.php',
                        [
                            'user' => $user
                        ]
                    ) ?>
                </div>
                <div class="col-12 col-xl-4">
                    <?= $this->render(
                        '_info.php',
                        [
                            'naspi' => $model
                        ]
                    ) ?>
                </div>
                <div class="col-12 col-xl-4">
                    <?= $this->render(
                        '_questions.php',
                        [
                            'naspi' => $model
                        ]
                    ) ?>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-xl-12 text-center">
                    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
                    <div class="form-group field-naspi_agreement_file has-success">
                        <label class="control-label" for="naspi-agreement_file">Mandato</label>
                        <input type="file" name="agreement_file" required />
                    </div>
                    <div class="form-group field-naspi_receipt_file has-success">
                        <label class="control-label" for="naspi-receipt_file">Ricevuta</label>
                        <input type="file" name="receipt_file" required />
                    </div>
                    <div class="form-group">
                        <?= Html::submitButton('Save', ['class' => 'btn btn-success']) ?>
                    </div>
                    <?php ActiveForm::end(); ?>
                </div>
            </div>

        </div>

    </div>
</div>