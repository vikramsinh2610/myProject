<?php

use app\models\views\Naspi;
use yii\grid\ActionColumn;
use yii\grid\GridView;
use yii\helpers\Url;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\models\searchs\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Lista pratiche';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-index card">

    <div class="p-0 position-relative mt-n4 mx-3 z-index-2">
        <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
            <h6 class="text-white text-capitalize ps-3">Lista pratiche</h6>
        </div>
    </div>

    <div class="card-body px-0 pb-2">
        <div class="table-responsive p-0">

            <?php Pjax::begin(); ?>

            <?= GridView::widget([
                                     'dataProvider' => $dataProvider,
                                     'filterModel' => $searchModel,
                                     'tableOptions' => ['class' => 'table table-striped'],
                                     'columns' => [

                                         'id',
                                         'name',
                                         'surname',
                                         [
                                            'attribute' => 'status',
                                            'format' => 'raw',
                                            'filter' => \app\models\Naspi::getStatusList(),
                                            'value' => function ($data) {
                                                $online = \app\models\Naspi::getStatusList();
                                                return $online[$data->status];
                                            }
                                        ],
                                         'note',
                                         'indt',
                                         'inuser',
                                         'updt',
                                         'upuser',
                                         [
                                             'class' => ActionColumn::className(),
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
