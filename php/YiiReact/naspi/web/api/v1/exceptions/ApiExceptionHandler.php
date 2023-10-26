<?php

namespace app\api\v1\exceptions;


use yii\base\ErrorHandler;

class ApiExceptionHandler extends ErrorHandler {

    protected function renderException($exception) {

        $data = '';
        if ($exception instanceof ApiException) {
            $data = $exception->getData();
        }

        echo json_encode([
                             'data' => $data,
                             'status' => -1,
                             'error' => [
                                 'code' => $exception->getCode(),
                                 'message' => $exception->getMessage(),
                             ]
                         ]);
    }
}