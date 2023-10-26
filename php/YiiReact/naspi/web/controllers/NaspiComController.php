<?php

namespace app\controllers;

class NaspiComController extends BaseNaspiController {

    /**
     * Displays new form page
     *
     * @return string
     */
    public function actionVariazioneDomanda(int $id): string {
        return parent::actionNuovaDomanda();
    }

}
