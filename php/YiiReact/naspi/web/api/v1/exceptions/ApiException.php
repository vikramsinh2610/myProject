<?php

namespace app\api\v1\exceptions;

use Exception;

class ApiException extends Exception {

    /**
     * @var mixed details of errors
     */
    private $data;

    /**
     * Constructor.
     *
     * @param string    $message  error message
     * @param integer   $code     error code
     * @param mixed     $data     error data
     * @param Exception $previous The previous exception used for the exception chaining.
     */
    public function __construct($message = null, $code = 0, $data = [], Exception $previous = null) {
        parent::__construct($message, $code, $previous);
        $this->data = $data;
    }

    /**
     * @return mixed
     */
    public function getData() {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data) {
        $this->data = $data;
    }

}