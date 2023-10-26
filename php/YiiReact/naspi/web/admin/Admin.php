<?php

namespace app\admin;

use Yii;
use yii\filters\AccessControl;

/**
 * account module definition class
 */
class Admin extends \yii\base\Module {

    public $defaultRoute = 'site';

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\admin\controllers';

    /**
     * {@inheritdoc}
     */
    public function init() {
        parent::init();
    }

    /**
     * {@inheritdoc}
     */
    public function behaviors() {
        $this->layout = 'main';
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'actions' => ['login'],
                        'allow' => true,
                        'roles' => ['?']
                    ],
                    [
                        'allow' => true,
                        'roles' => ['@'],
                        'matchCallback' => function ($rule, $action) {
                            return Yii::$app->user->identity->isAdmin();
                        }
                    ],
                ],
            ],
        ];
    }
}
