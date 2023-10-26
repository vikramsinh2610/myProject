<?php

namespace app\api\v1\controllers;

use app\api\v1\exceptions\ApiException;
use app\modules\naspi\NaspiService;

/**
 * Default controller for the `v1` module
 */
class NaspiController extends BaseController {

    /**
     * @var NaspiService
     */
    private $naspiService;

    public function init() {
        parent::init();
        $this->naspiService = new NaspiService();
    }

    /**
     * Displays homepage.
     *
     * @return array
     */
    public function actionIndex(): array {
        sleep(2);
        return [];
    }

    /**
     * Upload document
     *
     * @return object
     * @throws ApiException
     */
    public function actionUpload(): object {
        return $this->naspiService->upload();
    }

    /**
     * Action to upload file for NASPI form
     *
     * @return string
     * @throws ApiException
     */
    public function actionCreate(): string {
        return $this->naspiService->create();
    }

    /**
     * Action to upload file for NASPI form
     *
     * @return string
     * @throws ApiException
     */
    public function actionAddVariation($id): string {
        return $this->naspiService->addVariation($id);
    }

    /**
     * Action to upload file for NASPI form
     *
     * @param $id
     *
     * @return string
     * @throws ApiException
     */
    public function actionUpdate($id): string {
        return $this->naspiService->update($id);
    }

    /**
     * Action set naspi in work in progress
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function actionWork(int $id): string {
        return $this->naspiService->work($id);
    }

    /**
     * Action set naspi ready to sign
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function actionToSign(int $id): string {
        return $this->naspiService->toSign($id);
    }

    /**
     * Action set naspi to wait for receipt
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function actionWaitReceipt(int $id): string {
        return $this->naspiService->waitReceipt($id);
    }

    /**
     * Action set naspi completed
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function actionCompleted(int $id): string {
        return $this->naspiService->completed($id);
    }

    /**
     * Action get naspi
     *
     * @param int $id
     *
     * @return array
     * @throws ApiException
     */
    public function actionView(int $id): object {
        return $this->naspiService->view($id);
    }
}