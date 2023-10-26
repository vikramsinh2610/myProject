<?php
/**
 * @var Naspi $naspi
 */

use app\models\Naspi;
use app\modules\naspi\NaspiConstants;

?>
<div class="card card-plain h-100">
    <div class="card-header pb-0 p-3">
        <div class="row">
            <div class="col-md-8 d-flex align-items-center">
                <h6 class="mb-0">Informazioni pratica</h6>
            </div>
        </div>
    </div>
    <div class="card-body p-3">
        <ul class="list-group">
            <li class="list-group-item border-0 ps-0 pt-0 text-sm">
                <strong class="text-dark">Stato Civile:</strong>
                <?= NaspiConstants::MARITAL_STATUS[$naspi->marital_status] ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Data:</strong>
                <?= Yii::$app->getFormatter()->asDate($naspi->marital_date) ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Iban:</strong>
                <?= $naspi->iban ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Data fine lavoro:</strong>
                <?= Yii::$app->getFormatter()->asDate($naspi->last_work_date) ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Reddito annuo atteso:</strong>
                <?= $naspi->income ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">info:</strong>
                <?= $naspi->info ?>
            </li>
        </ul>
    </div>
</div>