<div class="card card-plain h-100">
    <div class="card-header pb-0 p-3">
        <div class="row">
            <div class="col-md-8 d-flex align-items-center">
                <h6 class="mb-0">Documenti</h6>
            </div>
        </div>
    </div>
    <div class="card-body p-3">
        <ul class="list-group">
            <li class="list-group-item border-0 ps-0 pt-0 text-sm">
                <strong class="text-dark">Documento:</strong>
                <a href="<?=$naspi->document_file_front?>">
                    <i class="fas fa-id-card"></i>
                    fronte
                </a>
                <a href="<?=$naspi->document_file_rear?>">
                    <i class="fas fa-id-card"></i>
                    retro
                </a>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Tessera Sanitaria:</strong>
                <a href="<?=$naspi->code_file_front?>">
                    <i class="far fa-id-card"></i>
                    fronte
                </a>
                <a href="<?=$naspi->code_file_rear?>">
                    <i class="far fa-id-card"></i>
                    retro
                </a>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Ultima busta paga:</strong>
                <?=$naspi->pay_file?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">interruzione contratto:</strong>
                <?=$naspi->work_file?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">Altri documenti:</strong>
                <?=$naspi->more_file?>
            </li>
        </ul>
    </div>
</div>