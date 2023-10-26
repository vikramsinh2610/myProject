<?php

/* @var $this yii\web\View */
/* @var $model app\models\views\Naspi */

/* @var $user app\models\User */

use app\models\views\Naspi;
use yii\helpers\Url;

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Naspi', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="naspi-view">
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
<!--                    <p class="mb-0 font-weight-normal text-sm">-->
<!--                        CEO / Co-Founder-->
<!--                    </p>-->
                </div>
            </div>
            <div class="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                <div class="nav-wrapper position-relative">
                    <a class="btn btn-outline-primary btn-sm" href="<?= Url::to(['naspi/work', 'id' => $model->id]) ?>">
                        <?= \app\models\Naspi::getStatusList()[$model->status] ?>
                    </a>
                    <a class="btn btn-outline-primary btn-sm"
                        href="<?= Url::to(['naspi/receipt', 'id' => $model->id]) ?>">
                        Receipt
                    </a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-xl-6">
                <?= $this->render(
                    '/user/_info.php',
                    [
                        'user' => $user
                    ]
                ) ?>
            </div>

            <div class="col-12 col-xl-6">
                <?= $this->render(
                    '_info.php',
                    [
                        'naspi' => $model
                    ]
                ) ?>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-xl-6">
                <?= $this->render(
                    '_questions.php',
                    [
                        'naspi' => $model
                    ]
                ) ?>
            </div>
            <div class="col-12 col-xl-6">
                <?= $this->render(
                    '_documents.php',
                    [
                        'naspi' => $model
                    ]
                ) ?>
            </div>

        </div>

        <!--
        <div class="row">
            <div class="col-12">
                <?= $this->render(
                    '_messages.php',
                    [
                        'messages' => $messages
                    ]
                ) ?>
            </div>
        </div>
        -->
    </div>
</div>