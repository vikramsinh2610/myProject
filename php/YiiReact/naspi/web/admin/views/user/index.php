<?php

use yii\grid\ActionColumn;
use yii\grid\GridView;
use yii\helpers\Html;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\models\searchs\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Lista utenti';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-index card">

    <div class="p-0 position-relative mt-n4 mx-3 z-index-2">
        <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
            <h6 class="text-white text-capitalize ps-3">Lista utenti</h6>
        </div>
<!--        <div class="pull-right">
            <div class="btn-group">
                <?= Html::a(Yii::t('app', 'Create User'), ['create'], ['class' => 'btn btn-success btn-sm']
                ) ?>            </div>
        </div>
-->
    </div>

    <div class="card-body px-0 pb-2">
        <div class="table-responsive p-0">

            <?php Pjax::begin(); ?>

            <?= GridView::widget([
                                     'dataProvider' => $dataProvider,
                                     'filterModel' => $searchModel,
                                     'tableOptions' => ['class' => 'table table-striped'],
                                     'columns' => [
                                         ['class' => 'yii\grid\SerialColumn'],

                                         [
                                             'attribute' => 'id',
                                             'headerOptions' => ['style' => 'width:70px'],
                                         ],
                                         'username',
                                         'email:email',
                                         [
                                             'attribute' => 'group',
                                             'headerOptions' => ['style' => 'width:70px'],
                                             'filter' => \app\models\User::getGroupList(),
                                             'value' => function ($data) {
                                                 return \app\models\User::getGroupList()[$data->group];
                                             }
                                         ],
                                         [
                                             'attribute' => 'status',
                                             'headerOptions' => ['style' => 'width:70px'],
                                             'format' => 'raw',
                                             'filter' => \app\models\User::getStatusList(),
                                             'value' => function ($data) {
                                                 return \app\models\User::getStatusList()[$data->status];
                                             }
                                         ],
//                'reset_count',
                                         'indt',
                                         'updt',

                                         [
                                             'class' => ActionColumn::className(),
                                             'headerOptions' => ['style' => 'min-width:135px'],
                                             'buttonOptions' => [
                                                 'class' => 'btn btn-sm btn-outline-info mb-0'
                                             ]
                                         ],
                                     ],
                                 ]); ?>

            <?php Pjax::end(); ?>

        </div>

    </div>

</div>
