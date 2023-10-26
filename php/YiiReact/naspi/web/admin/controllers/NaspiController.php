<?php

namespace app\admin\controllers;

use app\models\Message;
use app\models\Naspi;
use app\models\searchs\NaspiSearch;
use app\models\User;
use app\models\views\Naspi as V_Naspi;
use app\modules\naspi\NaspiService;
use app\modules\upload\ImageUpload;
use yii\filters\VerbFilter;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\HttpException;
use yii\web\NotFoundHttpException;

class NaspiController extends Controller {

    /**
     * @var NaspiService
     */
    private $naspiService;

    public function init() {
        parent::init();
        $this->naspiService = new NaspiService();
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
     * @inheritDoc
     */
    public function behaviors() {
        return array_merge(
            parent::behaviors(),
            [
                'verbs' => [
                    'class' => VerbFilter::className(),
                    'actions' => [
                        'delete' => ['POST'],
                    ],
                ],
            ]
        );
    }

    /**
     * Lists all Naspi models.
     *
     * @return string
     */
    public function actionIndex() {
        $searchModel = new NaspiSearch();
        $dataProvider = $searchModel->search($this->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Naspi model.
     *
     * @param int $id ID
     *
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id) {
        $model = $this->findModel($id);

        if ($model == null) {
            throw new NotFoundHttpException("Pratica con ID:$id non trovata");
        }

        $user = User::findIdentity($model->client_id);
        $messages = Message::findByNaspi($id);

        return $this->render('view', [
            'model' => $model,
            'user' => $user,
            'messages' => $messages
        ]);
    }

    /**
     * Creates a new Naspi model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     *
     * @return string|\yii\web\Response
     */
    public function actionCreate() {
        $model = new Naspi();
        if ($this->request->isPost) {
            if ($model->load($this->request->post()) && $model->save()) {
                return $this->redirect(['view', 'id' => $model->id]);
            }
        } else {
            $model->loadDefaultValues();
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing Naspi model.
     * If update is successful, the browser will be redirected to the 'view' page.
     *
     * @param int $id ID
     *
     * @return string|\yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id) {
        $this->layout = 'react-main';
        return $this->renderContent('');
    }

    /**
     * Updates an existing Naspi model.
     * If update is successful, the browser will be redirected to the 'view' page.
     *
     * @param int $id ID
     *
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionWork(int $id): string {
        $model = $this->findModel($id);
        return $this->render('update', [
            'model' => $model,
        ]);
    }


    /**
     * Receipt naspi data.
     *
     * @param int $id ID
     *
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionReceipt(int $id): string {
        $BaseUrl = Url::base(true);

        $model = $this->findModel($id);
        $user = User::findIdentity($model->client_id);
        $messages = Message::findByNaspi($id);
        if ($this->request->isPost) {
            $model->load(\Yii::$app->request->post());
            $v_naspi = V_Naspi::findIdentity($model->id);

            $directory = \Yii::$app->basePath . "/web/images/naspi/" . \Yii::$app->getUser()->getId();
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $upload_handler_agreement_file = new ImageUpload(
                array(
                    'upload_dir' => $directory,
                    'param_name' => 'agreement_file',
                    'inline_file_types' => '/\.(pdf|jpe?g|png)$/i',
                    'max_file_size' => 5000000,
                )
            );

            $response_agreement_file = $upload_handler_agreement_file->get_response();
            $files_agreement_file = $response_agreement_file['agreement_file'];
            $file_agreement_file = $files_agreement_file[0];
            $model->agreement_file = $file_agreement_file->name;

            $upload_handler_receipt_file = new ImageUpload(
                array(
                    'upload_dir' => $directory,
                    'param_name' => 'receipt_file',
                    'inline_file_types' => '/\.(pdf|jpe?g|png)$/i',
                    'max_file_size' => 5000000,
                )
            );

            $response_receipt_file = $upload_handler_receipt_file->get_response();
            $files_receipt_file = $response_receipt_file['receipt_file'];
            $file_receipt_file = $files_receipt_file[0];
            $model->receipt_file = $file_receipt_file->name;

            $model->save();
            $receipt_url = $BaseUrl . '/files/' . $model->receipt_file;

            \Yii::$app->mailer->compose(
                ['html' => 'sendReceipt-html', 'text' => 'sendReceipt-text'],
                [
                    'receipt' => $model,
                    'naspi' => $v_naspi,
                    'url' => $receipt_url
                ]
            )
                ->setFrom([\Yii::$app->params['noReplyEmail'] => \Yii::$app->name . ' robot'])
                ->setTo($v_naspi['email'])
                ->setSubject('Nuova ricevuta Naspi  ' . \Yii::$app->name)
                ->send();

            return $this->render('view', [
                'model' => $model,
                'user' => $user,
                'messages' => $messages
            ]);
        } else {
            return $this->render('receipt', ['model' => $model, 'user' => $user]);
        }
    }

    /**
     * Deletes an existing Naspi model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     *
     * @param int $id ID
     *
     * @return \yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     * @throws HttpException if the model cannot be updated
     */
    public function actionDelete($id) {
        if ($this->findModel($id)->setStatus(Naspi::STATUS_COMPLETED)->save()) {
            return $this->redirect(['index']);
        } else {
            throw new HttpException("There was an error during update naspi");
        }
    }

    /**
     * Finds the Naspi model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     *
     * @param int $id ID
     *
     * @return Naspi the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id) {
        if (($model = Naspi::findOne(['id' => $id])) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}