<div class="card card-plain h-100">
    <div class="card-header pb-0 p-3">
        <div class="row">
            <div class="col-md-8 d-flex align-items-center">
                <h6 class="mb-0">Profilo Utente</h6>
            </div>
            <div class="col-md-4 text-end">
                <a href="javascript:;">
                    <i class="fas fa-user-edit text-secondary text-sm"></i>
                    <span class="sr-only">Profilo</span>
                </a>
            </div>
        </div>
    </div>
    <div class="card-body p-3">
        <ul class="list-group">
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">                    
                    <i class="fas fa-mobile-alt text-sm"></i>
                    Cellulare:
                </strong>
                <?=$user->mobile?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">
                    <i class="fas fa-envelope text-sm"></i>
                    Email:
                </strong>
                <?=$user->email?>
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">
                    <i class="fas fa-map-marker"></i>
                    Indirizzo:
                </strong>
                USA
            </li>
            <li class="list-group-item border-0 ps-0 text-sm">
                <strong class="text-dark">
                    <i class="fas fa-map-marker-alt"></i>
                    Domicilio:
                </strong>
                USA
            </li>
        </ul>
    </div>
</div>
