<?php

namespace app\api\v1\controllers;

use app\api\v1\exceptions\ApiException;
use app\models\forms\ContactForm;
use app\models\forms\LoginForm;
use app\models\Naspi;
use app\models\User;
use app\models\views\UserProfile;
use Yii;

/**
 * Default controller for the `v1` module
 */
class UserController extends BaseController {


    /**
     * Me action.
     *
     * @return bool
     */
    public function actionMe(): array {
        return [
            'user' => UserProfile::findOne(Yii::$app->user->id),
            'naspi' => Naspi::findByUserId(Yii::$app->user->id)
        ];
    }

    /**
     * Login action.
     *
     * @return bool
     * @throws ApiException
     */
    public function actionLogin(): bool {
        if (!Yii::$app->user->isGuest) {
            return true;
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post(), '') && $model->login()) {
            Yii::$app->user->login($model->getUser());
            return true;
        }

        throw new ApiException('Invalid or empty username');

    }

    /**
     * Creates a new User model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     *
     * @return bool
     * @throws ApiException
     */
    public function actionCreate(): bool {
        $model = new User();

        if (!$model->load(Yii::$app->request->post(), '')) {
            throw new ApiException('Invalid or empty form');
        }

        $model->username = $model->email;

        $model->setPassword($model->password);
        $model->generateAuthKey();
        $model->generatePasswordResetToken();

        if (!$model->save()) {
            Yii::error(print_r($model->errors, true));
            throw new ApiException('Invalid form', 0, $model->errors);
        }

        $resetLink = Yii::$app->urlManager->createAbsoluteUrl(
            ['site/reset-password',
                'token' => $model->password_reset_token,
                'username' => $model->username
            ]
        );

        Yii::$app->mailer->compose(
            ['html' => 'sendPRT-html', 'text' => 'sendPRT-text'],
            [
                'user' => $model,
                'resetLink' => $resetLink
            ]
        )
            ->setFrom([Yii::$app->params['noReplyEmail'] => Yii::$app->name . ' robot'])
            ->setTo($model->email)
            ->setSubject('Nuovo account per' . Yii::$app->name)
            ->send();

        return true;

    }

    /**
     * Change status to course
     *
     * @param $username
     *
     * @return bool
     * @throws ApiException
     */
    public function actionRecoverPassword($username): bool {

        if (!isset($username)) {
            throw new ApiException('Invalid or empty username');
        }

        if (filter_var($username, FILTER_VALIDATE_EMAIL)) {
            $user = User::findByEmail($username);
        } else {
            $user = User::findByUsername($username);
        }

        if (!isset($user)) {
            throw new ApiException('Invalid or empty username');
        }

        $user->generatePasswordResetToken();

        if (!$user->save()) {
            throw new ApiException('Invalid or empty username');
        }

        $resetLink = Yii::$app->urlManager->createAbsoluteUrl(
            ['site/reset-password',
                'token' => $user->password_reset_token,
                'username' => $user->username
            ]
        );

        Yii::$app->mailer->compose(
            ['html' => 'sendPRT-html', 'text' => 'sendPRT-text'],
            [
                'user' => $user,
                'resetLink' => $resetLink
            ]
        )
            ->setFrom([Yii::$app->params['noReplyEmail'] => Yii::$app->name . ' robot'])
            ->setTo($user->email)
            ->setSubject('Password reset for ' . Yii::$app->name)
            ->send();

        return true;

    }

    /**
     * Change status to course
     */
    public function actionResetPassword(): bool {

        $token = Yii::$app->request->post('token');
        $password = Yii::$app->request->post('password');
        $password2 = Yii::$app->request->post('password2');

        if (!isset($token)) {
            throw new ApiException('Invalid or empty token');
        }

        $user = User::findByPasswordResetToken($token);

        if (!isset($user)) {
            throw new ApiException('Invalid or empty token');
        }

        if ($password != $password2) {
            throw new ApiException('Passwords cannot be different');
        }

        $user->setPassword($password);
        $user->reset_count += 1;
        $user->last_reset = date('Y-m-d H:i:s');
        $user->removePasswordResetToken();

        if (!$user->save()) {
            throw new ApiException('Password not saved, your token is invalid or expired');
        }

        return true;
    }

    /**
     * Change status to course
     */
    public function actionContact(): bool {
        $model = new ContactForm();
        $load = $model->load(Yii::$app->request->post(), '');
        if (!$load) {
            throw new ApiException('Error on contact');
        }
        // send mail to Admin
        Yii::$app->mailer->compose()
            ->setFrom($model->email)
            ->setTo(([Yii::$app->params['adminEmail'] => Yii::$app->name . ' CS']))
            ->setSubject($model->subject)
            ->setTextBody($model->body)
            ->send();
        return true;
    }

}
