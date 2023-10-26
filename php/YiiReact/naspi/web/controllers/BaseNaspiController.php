<?php

namespace app\controllers;

use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;

class BaseNaspiController extends Controller {
    /**
     * {@inheritdoc}
     */
    public function behaviors() {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ]
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays register page.
     *
     * @return Response|string
     */
    public function actionIndex() {
        $this->layout = 'react-main';
        return $this->renderContent('');
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionNuovaDomanda() {
        $this->layout = 'react-main';
        return $this->renderContent('');
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionVisualizzaDomanda($id) {
        $this->layout = 'react-main';
        return $this->renderContent('');
    }

    /**
     * Displays Receipt.
     *
     * @return string
     */
    public function actionReceipt($id) {
        $this->layout = 'react-main';
        return $this->renderContent('');
    }
}
