<?php

namespace app\api\v1;

use app\api\v1\exceptions\ApiExceptionHandler;
use Yii;
use yii\base\Module;

/**
 * v1 module definition class
 */
class Api extends Module {

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\api\v1\controllers';

    /**
     * @var integer
     */
    private $timer;

    /**
     * @inheritdoc
     */
    public function init() {
        parent::init();

        Yii::$app->request->parsers = ['application/json' => 'yii\web\JsonParser'];

        /** @var ApiExceptionHandler $handler */
        $handler = new ApiExceptionHandler();
        Yii::$app->set('errorHandler', $handler);
        $handler->register();
    }

}