<?php

namespace app\modules\naspi;

use app\api\v1\exceptions\ApiException;
use app\models\Client;
use app\models\Naspi;
use app\models\NaspiCom;
use app\modules\upload\ImageUpload;
use Yii;
use yii\helpers\Url;

/**
 * Default controller NaspiApi
 */
class NaspiService {

    /**
     * Upload document
     *
     * @return object
     * @throws ApiException
     */
    public function upload(): object {

        $directory = \Yii::$app->basePath . "/web/images/naspi/" . \Yii::$app->getUser()->getId();
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $upload_handler = new ImageUpload(
            array(
                'upload_dir' => $directory . '/',
                'param_name' => 'file',
                'inline_file_types' => '/\.(pdf|jpe?g|png)$/i',
                'max_file_size' => 10000000,
                'image_resize' => true
            )
        );

        $response = $upload_handler->get_response();

        $files = $response['file'];

        $file = $files[0];
        // $file = ArrayHelper::toArray($files[0]);

        if (key_exists('error', $file)) {
            Yii::error($file->error);
            throw new ApiException($file->error);
        }

        return $file;
    }

    /**
     * Action to upload file for NASPI form
     *
     * @return string
     * @throws ApiException
     */
    public function create(): string {

        $model = new Naspi();
        $postData = Yii::$app->request->post();
        $user = Yii::$app->user->identity;

        $transaction = Yii::$app->db->beginTransaction();

        try {

            $client = Client::find()->where(['user_id' => $user->id])->one();
            if ($client == null) {
                $client = new Client();
                $client->user_id = $user->id;
            }

            $client->mobile = $postData['phone'];
            // $client->fiscal_code = $postData['fiscal_code'];
            $fiscal_code = '';
            if (empty($postData['home'])) {
                $fiscal_code = $data['cap'];
            } else {
                $fiscal_code = $postData['home']['cap'];
            }
            $client->fiscal_code = $fiscal_code;

            if (!$client->save()) {
                throw new ApiException("There was an error on insert client", 0, $client->getErrors());
            }

            $data = [
                'client_id' => $user->id,
                'address' => !empty($postData['address']) ? $postData['address']['address'] : '',
                'city' => !empty($postData['address']) ? $postData['address']['city'] : '',
                'cap' => !empty($postData['address']) ? $postData['address']['cap'] : '',
                'province' => !empty($postData['address']) ? $postData['address']['province'] : '',
                'marital_status' => !empty($postData['marital_status']) ? $postData['marital_status'] : '',
                'marital_date' => !empty($postData['marital_date']) ? $postData['marital_date'] : '',
                'iban' => !empty($postData['iban']) ? $postData['iban'] : '',
                'last_work_date' => !empty($postData['last_work_date']) ? $postData['last_work_date'] : '',
                'income' => !empty($postData['income']) ? $postData['income'] : '',
                'vat' => !empty($postData['p_iva']) ? $postData['p_iva'] : null,
                'inuser' => (string)$user->username,
                'anf' => !empty($postData['anf']) ? $postData['anf'] : null,
                'more_works' => !empty($postData['more_works']) ? $postData['more_works'] : null,
                'payment_method' => !empty($postData['payment_method']) ? $postData['payment_method'] : null,
                'activity_date' => !empty($postData['activity_date']) ? $postData['activity_date'] : null,
                'activity_name' => !empty($postData['activity_name']) ? $postData['activity_name'] : null,
                'activity_type' => !empty($postData['activity_type']) ? $postData['activity_type'] : null,
                'protocol' => !empty($postData['protocol']) ? $postData['protocol'] : null,
                'protocol_date' => !empty($postData['protocol_date']) ? $postData['protocol_date'] : null
            ];

            if (empty($postData['home'])) {
                $data['home_address'] = $data['address'];
                $data['home_city'] = $data['city'];
                $data['home_cap'] = $data['cap'];
                $data['home_province'] = $data['province'];
            } else {
                $data['home_address'] = $postData['home']['address'];
                $data['home_city'] = $postData['home']['city'];
                $data['home_cap'] = $postData['home']['cap'];
                $data['home_province'] = $postData['home']['province'];
            }

            if (!empty($postData['identity-f']) && !empty($postData['identity-f']['name'])) {
                $data['document_file_front'] = $postData['identity-f']['name'];
            }
            if (!empty($postData['identity-r']) && !empty($postData['identity-r']['name'])) {
                $data['document_file_rear'] = $postData['identity-r']['name'];
            }
            if (!empty($postData['fiscality-f']) && !empty($postData['fiscality-f']['name'])) {
                $data['code_file_front'] = $postData['fiscality-f']['name'];
            }
            if (!empty($postData['fiscality-r']) && !empty($postData['fiscality-r']['name'])) {
                $data['code_file_rear'] = $postData['fiscality-r']['name'];
            }
            if (!empty($postData['last-payment']) && !empty($postData['last-payment']['name'])) {
                $data['pay_file'] = $postData['last-payment']['name'];
            }
            if (!empty($postData['last-contract']) && !empty($postData['last-contract']['name'])) {
                $data['work_file'] = $postData['last-contract']['name'];
            }
            if (!empty($postData['more']) && !empty($postData['more']['name'])) {
                $data['more_file'] = $postData['more']['name'];
            }

            $model->load($data, '');

            if (!$model->save()) {
                throw new ApiException("There was an error on insert document", 0, $model->getErrors());
            }

            $transaction->commit();
        } catch (ApiException $ex) {
            throw $ex;
        } catch (\Exception $ex) {
            $transaction->rollBack();
            throw new ApiException("There was an error", -1, $ex->getMessage());
        }

        //Send mail to Admin
        $missingDocs = [];
        if (empty($model->document_file_front) || $model->document_file_front == "x") {
            $missingDocs[] = 'document_file_front';
        }
        if (
            empty($model->document_file_rear) || $model->document_file_rear == "x"
        ) {
            $missingDocs[] = 'document_file_rear';
        }
        if (
            empty($model->code_file_front) || $model->code_file_front == "x"
        ) {
            $missingDocs[] = 'code_file_front';
        }
        if (
            empty($model->code_file_rear) || $model->code_file_rear == "x"
        ) {
            $missingDocs[] = 'code_file_rear';
        }
        if (empty($model->pay_file) || $model->pay_file == "x") {
            $missingDocs[] = 'pay_file';
        }
        if (empty($model->work_file) || $model->work_file == "x") {
            $missingDocs[] = 'work_file';
        }
        if (empty($model->more_file) || $model->more_file == "x") {
            $missingDocs[] = 'more_file';
        }

        //Send email to client
        $BaseUrl = Url::base(true);
        Yii::$app->mailer->compose(
            ['html' => 'sendNewNaspi-html', 'text' => 'sendNewNaspi-text'],
            [
                'user' => $user,
                'naspi' => $model,
                'url' => $BaseUrl,
                'missingDocs' => $missingDocs
            ]
        )
            ->setFrom(Yii::$app->params['noReplyEmail'])
            ->setTo([$user->email => "$user->surname $user->name"])
            ->setSubject('Nuova pratica Naspi ')
            ->send();

        //Send email to gmail for admin
        $viewUrl = Url::to(['/admin/naspi/view', 'id' => $model->id]);
        Yii::$app->mailer->compose(['html' => 'newNaspi-html', 'text' => 'newNaspi-text'], ['viewUrl' => $viewUrl])
            ->setFrom(Yii::$app->params['noReplyEmail'])
            ->setTo(Yii::$app->params['adminEmail'])
            ->setSubject('Nuova pratica Naspi ')
            ->send();
        return "Successo";
    }

    /**
     * Action to upload file for NASPI form
     *
     * @param $id
     *
     * @return string
     * @throws ApiException
     */
    public
    function update($id): string {
        $model = Naspi::findIdentity($id);

        // $v_naspi = V_Naspi::findIdentity($id);

        $postData = Yii::$app->request->post();

        // if (!empty($postData['agreement_file']) && !empty($postData['agreement_file']['name'])) {
        //     $model->agreement_file = $postData['agreement_file']['name'];
        // }
        // if (!empty($postData['receipt_file']) && !empty($postData['receipt_file']['name'])) {
        //     $model->receipt_file = $postData['receipt_file']['name'];
        // }

        if (!$model->validate()) {
            $errors = $model->errors;
            return json_encode($errors);
        }

        //send mail tu naspi user
        // \Yii::$app->mailer->compose(
        //     ['html' => 'sendReceipt-html', 'text' => 'sendReceipt-text'],
        //     [
        //         'receipt' => $model,
        //         'v_naspi' => $v_naspi
        //         // 'resetLink' => $resetLink
        //     ]
        // )
        //     ->setFrom([\Yii::$app->params['noReplyEmail'] => \Yii::$app->name . ' robot'])
        //     ->setTo($v_naspi['email'])
        //     ->setSubject('Heelo testing ' . \Yii::$app->name)
        //     ->send();

        if (!$model->save()) {
            Yii::error($model->getErrors());
            throw new ApiException("There was an error on update ", 0, $model->getErrors());
        } else {
            return "Successo";
        }
    }

    /**
     * Action set naspi in work in progress
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public
    function work(int $id): string {
        $model = Naspi::findIdentity($id);

        $model->setStatus(Naspi::STATUS_IN_PROGRESS);

        if (!$model->save()) {
            Yii::error($model->getErrors());
            throw new ApiException("There was an error on update status", 0, $model->getErrors());
        } else {
            return "Successo";
        }
    }

    /**
     * Action set naspi ready to sign
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public
    function toSign(int $id): string {
        $model = Naspi::findIdentity($id);

        $model->setStatus(Naspi::STATUS_TO_SIGN);

        if (!$model->save()) {
            Yii::error($model->getErrors());
            throw new ApiException("There was an error on update status", 0, $model->getErrors());
        } else {
            return "Successo";
        }
    }

    /**
     * Action set naspi to wait for receipt
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public
    function waitReceipt(int $id): string {
        $model = Naspi::findIdentity($id);

        $model->setStatus(Naspi::STATUS_WAITING_RECIEPT);

        if (!$model->save()) {
            Yii::error($model->getErrors());
            throw new ApiException("There was an error on update status", 0, $model->getErrors());
        } else {
            return "Successo";
        }
    }

    /**
     * Action set naspi completed
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function completed(int $id): string {
        $model = Naspi::findIdentity($id);

        $model->setStatus(Naspi::STATUS_COMPLETED);

        if (!$model->save()) {
            Yii::error($model->getErrors());
            throw new ApiException("There was an error on update status", 0, $model->getErrors());
        } else {
            return "Successo";
        }
    }

    /**
     * Action get naspi view
     *
     * @param int $id
     *
     * @return array
     * @throws ApiException
     */
    public function view(int $id): object {
        $model = Naspi::findIdentity($id);

        return $model;
    }

    /**
     * Action to add new Naspi.com
     *
     * @param int $id
     *
     * @return string
     * @throws ApiException
     */
    public function addVariation($id): string {
        try {

            $model = new NaspiCom();
            $postData = Yii::$app->request->post();
            $user = Yii::$app->user->identity;

            $model->naspi_id = $id;
            $model->variation = $postData['variation'];
            $model->event = $postData['event'];
            if (!empty($postData['contract']) && !empty($postData['contract']['name'])) {
                $model->contract_file = $postData['contract']['name'];
            }
            if (!empty($postData['more']) && !empty($postData['more']['name'])) {
                $model->more_file = $postData['more']['name'];
            }
            $model->inuser = $user->username;

            if (!$model->save()) {
                Yii::error($model->getErrors());
                throw new ApiException("There was an error on insert NaspiCom", 0, $model->getErrors());
            }

            //Send email to client
            Yii::$app->mailer->compose(
                ['html' => 'sendNewNaspi-html', 'text' => 'sendNewNaspi-text'],
                [
                    'user' => $user,
                    'naspi' => $model,
                    'url' => Url::base(true),
                    'missingDocs' => []
                ]
            )
                ->setFrom(Yii::$app->params['noReplyEmail'])
                ->setTo([$user->email => "$user->surname $user->name"])
                ->setSubject('Nuova pratica Naspi ')
                ->send();

            //Send email to gmail for admin
            $viewUrl = Url::to(['/admin/naspi/view', 'id' => $model->id]);
            Yii::$app->mailer->compose(['html' => 'newNaspi-html', 'text' => 'newNaspi-text'], ['viewUrl' => $viewUrl])
                ->setFrom(Yii::$app->params['noReplyEmail'])
                ->setTo(Yii::$app->params['adminEmail'])
                ->setSubject('Nuova pratica Naspi ')
                ->send();

            return "Successo";
        } catch (ApiException $ex) {
            throw $ex;
        } catch (\Exception $ex) {
            throw new ApiException("There was an error", -1, $ex->getMessage());
        }
    }
}