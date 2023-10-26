<?php

namespace app\api\v1\controllers;

use Yii;
use yii\filters\ContentNegotiator;
use yii\filters\Cors;
use yii\rest\Controller;
use yii\web\Response;


class BaseController extends Controller {

    public function init() {
        parent::init();
    }

    public function behaviors() {
        return array_merge(
            parent::behaviors(),
            [
                [
                    'class' => ContentNegotiator::className(),
                    'formats' => [
                        'application/json' => Response::FORMAT_JSON,
                    ],
                ],
                'corsFilter' => [
                    'class' => Cors::className(),
                    'cors' => [
                        // restrict access to
                        'Origin' => ['http://localhost'],
                        // Allow only headers 'X-Wsse'
                        'Access-Control-Request-Headers' => ['Content-Type'],
                    ]
                ],
            ]
        );
    }

    public function afterAction($action, $result) {

        Yii::$app->response->format = Response::FORMAT_JSON;
        return [
            'data' => $result,
            'status' => 1
        ];

    }

    /**
     * @inheritdoc
     */
    protected function verbs() {

        return [
            'index' => ['GET', 'POST'],
            'view' => ['GET'],
            'create' => ['POST'],
            'update' => ['POST']
        ];

    }

}
