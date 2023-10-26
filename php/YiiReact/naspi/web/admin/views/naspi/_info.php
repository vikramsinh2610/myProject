<?php

use app\models\Naspi;

/**
 * @var Naspi $naspi
 */

?>
<div class="card card-plain h-100">
    <div class="card-header pb-0 p-3">
        <div class="row">
            <div class="col-md-12 d-flex align-items-center">
                <h6 class="mb-0">Naspi </h6>
            </div>
        </div>
    </div>
    <div class="card-body p-3">
        <ul class="list-group">
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">                    
                    <i class="fas fa-calendar text-sm"></i>
                    data:
                </strong>
                <?=Yii::$app->getFormatter()->asDate($naspi->indt)?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">                    
                    <i class="fas fa-hashtag text-sm"></i>
                    ID Pratica:
                </strong>
                <?=$naspi->id?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">                    
                    <i class="fas fa-check text-sm"></i>
                    Stato
                </strong>
                <?= Naspi::getStatusList()[$naspi->status] ?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">                    
                    <i class="fas fa-user text-sm"></i>
                    Op Assegnato
                </strong>
                <?=$naspi->upuser?>
            </li>
        </ul>
    </div>
</div>