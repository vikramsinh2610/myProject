<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "user".
 *
 * @property int         $id
 * @property string      $username
 * @property string      $name
 * @property string      $surname
 * @property string      $password
 * @property string      $email
 * @property string      $mobile
 * @property int|null    $group
 * @property int         $status
 * @property string      $auth_key
 * @property string|null $last_reset
 * @property int|null    $reset_count
 * @property string|null $password_reset_token
 * @property string      $indt
 * @property string|null $updt
 */
class User extends ActiveRecord implements IdentityInterface {

    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 0;
    const STATUS_DELETED = -1;

    const GROUP_EDITOR = 0;
    const GROUP_ADMIN = 1;

    public $clear_password;
    public $mobile;

    /**
     * {@inheritdoc}
     */
    public static function tableName(): string {
        return '{{%user}}';
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentity($id) {
        return self::find()->where(['id' => $id])->one();
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentityByAccessToken($token, $type = null) {
        return self::find()->where(['access_token' => $token])->one();
    }

    /**
     * Finds user by username
     *
     * @param string $username
     *
     * @return null|self
     */
    public static function findByUsername(string $username): ?User {
        return self::find()->where(['username' => $username])->one();
    }

    /**
     * Finds user by email
     *
     * @param string $email
     *
     * @return null|self
     */
    public static function findByEmail(string $email): ?User {
        return self::find()->where(['email' => $email])->one();
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     *
     * @return null|self
     */
    public static function findByPasswordResetToken(string $token): ?User {

        if (!self::isValidPRT($token)) {
            return null;
        }

        return static::findOne(
            [
                'password_reset_token' => $token
            ]
        );
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     *
     * @return static|null
     */
    public static function isValidPRT(string $token) {
        if (empty($token)) {
            return false;
        }

        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        $parts = explode('_', $token);
        $timestamp = (int)end($parts);

        return $timestamp + $expire >= time();

    }

    /**
     * {@inheritdoc}
     */
    public static function getStatusList() {

        return [
            self::STATUS_ENABLED => Yii::t('app', 'Enabled'),
            self::STATUS_DISABLED => Yii::t('app', 'Disabled'),
            self::STATUS_DELETED => Yii::t('app', 'Deleted'),
        ];
    }

    /**
     * {@inheritdoc}
     */
    public static function getGroupList() {

        return [
            self::GROUP_ADMIN => Yii::t('app', 'Admin'),
            self::GROUP_EDITOR => Yii::t('app', 'Editor'),
        ];
    }


    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['username', 'name', 'surname', 'password', 'email', 'auth_key'], 'required'],
            [['group', 'status', 'reset_count'], 'integer'],
            [['last_reset', 'indt', 'updt'], 'safe'],
            [['username', 'name', 'surname', 'email'], 'string', 'max' => 50],
            [['password'], 'string', 'max' => 64],
            [['auth_key'], 'string', 'max' => 65],
            [['password_reset_token'], 'string', 'max' => 45],
            [['email', 'username'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'username' => 'Username',
            'name' => 'Name',
            'surname' => 'Surname',
            'password' => 'Password',
            'email' => 'Email',
            'group' => 'Group',
            'status' => 'Status',
            'auth_key' => 'Auth Key',
            'last_reset' => 'Last Reset',
            'reset_count' => 'Reset Count',
            'password_reset_token' => 'Password Reset Token',
            'indt' => 'Indt',
            'updt' => 'Updt',
        ];
    }

    /**
     * Check if user is Admin
     *
     * @param int $status
     *
     * @return boolean
     */
    public function isAdmin() {
        return $this->group == self::GROUP_ADMIN;
    }

    /**
     * Set status
     *
     * @param int $status
     *
     * @return boolean
     */
    public function changeStatus($status) {
        $this->status = $status;
        return $this->save();
    }

    /**
     * {@inheritdoc}
     */
    public function getId() {
        return $this->id;
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthKey() {
        return $this->auth_key;
    }

    /**
     * Set new password
     */
    public function setPassword(string $password) {
        $this->password = md5($password);
    }

    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey() {

        $this->auth_key = Yii::$app->security->generateRandomString();

    }

    /**
     * Generates new password reset token
     */
    public function generatePasswordResetToken() {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Removes password reset token
     */
    public function removePasswordResetToken() {
        $this->password_reset_token = null;
    }

    /**
     * {@inheritdoc}
     */
    public function validateAuthKey($authKey): ?bool {
        return $this->auth_key === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     *
     * @return bool if password provided is valid for current user
     */
    public function validatePassword(string $password): bool {
        return $this->password === md5($password);
    }
}
