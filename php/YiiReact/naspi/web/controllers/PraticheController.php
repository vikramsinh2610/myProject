<?php

namespace app\controllers;

use yii\web\Controller;

class PraticheController extends Controller {


    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionNaspi() {
        $this->view->title = 'Naspi';
        return $this->render('naspi');
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionNaspiAnticipata() {
        $this->view->title = 'Naspi Anticipata';
        return $this->render('naspi-anticipata');
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionDsAgricola() {
        $this->view->title = 'DS Agricola';
        return $this->render('ds-agricola');
    }

}
