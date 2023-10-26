<?php

namespace app\admin\controllers;

use app\models\searchs\UserSearch;
use app\models\User;
use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

/**
 * UserController implements the CRUD actions for User model.
 */
class UserController extends Controller {

    public $enableCsrfValidation = false;

    /**
     * Lists all User models.
     *
     * @return mixed
     */
    public function actionIndex() {
        $searchModel = new UserSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render(
            'index',
            [
                'searchModel' => $searchModel,
                'dataProvider' => $dataProvider,
            ]
        );
    }

    /**
     * Displays a single User model.
     *
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id) {
        return $this->render(
            'view',
            [
                'model' => $this->findModel($id),
            ]
        );
    }

    /**
     * Finds the User model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     *
     * @param integer $id
     *
     * @return User the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id) {
        if (($model = User::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException(Yii::t('app', 'The requested page does not exist.'));
    }

    /**
     * Creates a new User model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     *
     * @return mixed
     */
    public function actionCreate() {
        $model = new User();

        if ($model->load(Yii::$app->request->post())) {

            if ($model->clear_password == "") {
                $model->clear_password = Yii::$app->security->generateRandomString(6);
            }

            $model->setPassword($model->clear_password);
            $model->generateAuthKey();

            if (!$model->save()) {
                return $this->render(
                    'create',
                    [
                        'model' => $model,
                        'error' => $model->getErrors()
                    ]
                );
            }

            Yii::$app->mailer->compose(
                ['html' => 'sendPassword-html', 'text' => 'sendPassword-text'],
                [
                    'user' => $model
                ]
            )
                ->setFrom([Yii::$app->params['noReplyEmail'] => Yii::$app->name . ' robot'])
                ->setTo($model->email)
                ->setSubject('Nuovo account per gestionale ')
                ->send();

            return $this->redirect(['index', 'sort' => '-id']);
        }

        return $this->render(
            'create',
            [
                'model' => $model,
                'error' => ''
            ]
        );
    }

    /**
     * Updates an existing User model.
     * If update is successful, the browser will be redirected to the 'view' page.
     *
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id) {
        $model = $this->findModel($id);

        $model->load(Yii::$app->request->post());
        if ($model->load(Yii::$app->request->post())) {

            if ($model->clear_password != "") {
                $model->setPassword($model->clear_password);
                $model->generateAuthKey();
            }

            if ($model->save()) {
                return $this->redirect(['index', 'sort' => '-id']);
            }
        }

        return $this->render(
            'update',
            [
                'model' => $model,
            ]
        );
    }

    /**
     * Enable an existing Location model.
     *
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionEnable($id) {
        $model = $this->findModel($id);
        $model->changeStatus($model::STATUS_ENABLED);
        return $this->redirect(['index']);
    }

    /**
     * Disable an existing Location model.
     *
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDisable($id) {
        $model = $this->findModel($id);
        $model->changeStatus($model::STATUS_DISABLED);
        return $this->redirect(['index']);
    }

    /**
     * Deletes an existing Type model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     *
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id) {
        $model = $this->findModel($id);
        $model->changeStatus($model::STATUS_DELETED);
        return $this->redirect(['index']);
    }
}
